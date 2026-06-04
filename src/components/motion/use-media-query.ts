"use client";

import { useSyncExternalStore } from "react";

function subscribe(query: string, onChange: () => void) {
  const mq = window.matchMedia(query);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

/**
 * SSR-safe matchMedia hook. Server snapshot should match the mobile-first default.
 */
export function useMediaQuery(query: string, serverSnapshot = false): boolean {
  return useSyncExternalStore(
    (onChange) => subscribe(query, onChange),
    () => window.matchMedia(query).matches,
    () => serverSnapshot,
  );
}

/** Tailwind `lg` breakpoint — 1024px. */
export function useIsLgUp(): boolean {
  return useMediaQuery("(min-width: 1024px)", false);
}

/** Touch-first devices — used to tighten scroll-scrub (avoids “stuck” crossfades). */
export function useIsCoarsePointer(): boolean {
  return useMediaQuery("(pointer: coarse)", true);
}
