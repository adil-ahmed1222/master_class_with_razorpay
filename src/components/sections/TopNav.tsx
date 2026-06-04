"use client";

import { useEffect, useState } from "react";
import { BrandWordmark, Button, EventPrice } from "@/components/ui";
import { event } from "@/content/event";
import { scrollToRegister } from "@/lib/scroll-to-register";
import { cn } from "@/lib/utils";

/**
 * TopNav — minimal, wordmark-first (02-brand). One job: keep the CTA reachable
 * (04-conversion). Transparent over the hero; gains a hairline + blur after scroll.
 * Not a mega-menu — there is no navigation to distract from registering.
 */

function reserve() {
  scrollToRegister("topnav");
}

export function TopNav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
        scrolled
          ? "border-b border-white/8 bg-bg/70 backdrop-blur-md"
          : "border-b border-transparent",
      )}
    >
      <nav className="mx-auto flex h-16 max-w-content items-center justify-between px-4 sm:px-6">
        <BrandWordmark linkToTop priority />

        <div className="flex items-center gap-4">
          <span className="hidden font-sans text-caption text-text-2 sm:inline">
            <span className="inline-flex flex-wrap items-center justify-end gap-x-2 gap-y-1">
              <span>{event.mode}</span>
              <span aria-hidden>·</span>
              <EventPrice size="sm" />
            </span>
          </span>
          <Button size="sm" onClick={reserve}>
            {event.cta.primary}
          </Button>
        </div>
      </nav>
    </header>
  );
}
