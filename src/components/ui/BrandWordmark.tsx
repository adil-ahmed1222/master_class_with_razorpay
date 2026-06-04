"use client";

import Image from "next/image";
import { event } from "@/content/event";
import { cn } from "@/lib/utils";

/** Crest lockup in /public/brand-logos (filename includes spaces). */
export const BRAND_LOGO_SRC = "/brand-logos/NV LOGO UPDATED.png";

const wordmarkFocus =
  "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary";

const logoSizes = {
  nav: "size-9",
  footer: "size-10 sm:size-11",
} as const;

type BrandWordmarkProps = {
  className?: string;
  /** Slightly larger crest in the footer column. */
  variant?: keyof typeof logoSizes;
  /** When true, wraps the lockup in a link to #top (TopNav). */
  linkToTop?: boolean;
  /** Prioritize logo LCP in the fixed header. */
  priority?: boolean;
};

/**
 * NeuralVarsity lockup — crest + Poppins Bold wordmark (no trailing accent dot).
 */
export function BrandWordmark({
  className,
  variant = "nav",
  linkToTop = false,
  priority = false,
}: BrandWordmarkProps) {
  const lockup = (
    <>
      <Image
        src={BRAND_LOGO_SRC}
        alt=""
        width={44}
        height={44}
        className={cn("shrink-0 object-contain", logoSizes[variant])}
        priority={priority}
        aria-hidden
      />
      <span className="font-brand text-body-lg font-bold tracking-tight text-text">
        {event.brand}
      </span>
    </>
  );

  const layoutClass = cn("inline-flex items-center gap-2.5", className);

  if (linkToTop) {
    return (
      <a href="#top" className={cn(layoutClass, wordmarkFocus)}>
        {lockup}
      </a>
    );
  }

  return <span className={layoutClass}>{lockup}</span>;
}
