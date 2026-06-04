"use client";

import { type ReactNode } from "react";
import { ReactLenis, useLenis } from "lenis/react";
import { gsap, ScrollTrigger } from "@/components/motion/gsap";
import { useIsomorphicLayoutEffect } from "@/components/motion/use-isomorphic-layout-effect";
import { usePrefersReducedMotion } from "@/components/motion/use-prefers-reduced-motion";
import { useIsClient } from "@/components/motion/use-is-client";
import { registerLenis } from "@/lib/lenis-instance";

/**
 * LenisProvider — Lenis is the SINGLE smooth-scroll authority (06-motion).
 * It drives GSAP's ticker (one RAF loop, no competing smooth-scroll), and every
 * Lenis scroll triggers ScrollTrigger.update() so scrubbed timelines stay in sync.
 *
 * Reduced motion / SSR: render native scroll (no Lenis) — the page stays fully
 * usable, and scrubbed storytelling is disabled elsewhere.
 */

function LenisGsapBridge() {
  // Keep ScrollTrigger in lockstep with Lenis on every scroll.
  const lenis = useLenis(() => {
    ScrollTrigger.update();
  });

  // Single RAF: GSAP's ticker advances Lenis (autoRaf is disabled below).
  useIsomorphicLayoutEffect(() => {
    if (!lenis) return;
    registerLenis(lenis);
    const raf = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(raf);
    return () => {
      gsap.ticker.remove(raf);
      registerLenis(null);
    };
  }, [lenis]);

  // Recompute trigger positions once fonts settle (avoids drift, 06-motion).
  useIsomorphicLayoutEffect(() => {
    if (typeof document === "undefined" || !("fonts" in document)) return;
    let cancelled = false;
    document.fonts.ready.then(() => {
      if (!cancelled) ScrollTrigger.refresh();
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return null;
}

export function LenisProvider({ children }: { children: ReactNode }) {
  const reduced = usePrefersReducedMotion();
  const isClient = useIsClient();

  // SSR + first paint + reduced-motion → native scroll.
  if (!isClient || reduced) {
    return <>{children}</>;
  }

  return (
    <ReactLenis
      root
      options={{
        autoRaf: false,
        lerp: 0.1,
        smoothWheel: true,
        wheelMultiplier: 1,
        // Keep touch scroll and ScrollTrigger scrub aligned on phones.
        syncTouch: true,
        touchMultiplier: 1.25,
      }}
    >
      <LenisGsapBridge />
      {children}
    </ReactLenis>
  );
}
