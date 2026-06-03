"use client";

import type { CSSProperties, ReactNode } from "react";
import { usePrefersReducedMotion } from "@/components/motion/use-prefers-reduced-motion";
import { cn } from "@/lib/utils";

const auroraColorVars = {
  "--white": "#ffffff",
  "--black": "#000000",
  "--transparent": "transparent",
  "--blue-500": "#3b82f6",
  "--indigo-300": "#a5b4fc",
  "--blue-300": "#93c5fd",
  "--violet-200": "#ddd6fe",
  "--blue-400": "#60a5fa",
} as CSSProperties;

type AuroraLayerProps = {
  showRadialGradient?: boolean;
  className?: string;
};

/**
 * Animated aurora beams (Aceternity UI). Fixed full-viewport layer for site background.
 * @see docs/AURORA-BACKGROUND.md
 */
export function AuroraLayer({ showRadialGradient = true, className }: AuroraLayerProps) {
  const reducedMotion = usePrefersReducedMotion();

  return (
    <div
      style={auroraColorVars}
      className={cn(
        `pointer-events-none absolute -inset-[10px] opacity-50 will-change-transform
        [--white-gradient:repeating-linear-gradient(100deg,var(--white)_0%,var(--white)_7%,var(--transparent)_10%,var(--transparent)_12%,var(--white)_16%)]
        [--dark-gradient:repeating-linear-gradient(100deg,var(--black)_0%,var(--black)_7%,var(--transparent)_10%,var(--transparent)_12%,var(--black)_16%)]
        [--aurora:repeating-linear-gradient(100deg,var(--blue-500)_10%,var(--indigo-300)_15%,var(--blue-300)_20%,var(--violet-200)_25%,var(--blue-400)_30%)]
        [background-image:var(--dark-gradient),var(--aurora)]
        [background-size:300%,_200%]
        [background-position:50%_50%,50%_50%]
        blur-[10px] filter
        after:pointer-events-none after:absolute after:inset-0
        after:content-[''] after:[background-image:var(--dark-gradient),var(--aurora)]
        after:[background-size:200%,_100%]
        after:[background-attachment:fixed] after:mix-blend-difference`,
        reducedMotion ? "after:animate-none" : "after:animate-aurora",
        showRadialGradient &&
          "[mask-image:radial-gradient(ellipse_at_100%_0%,black_10%,var(--transparent)_70%)]",
        className,
      )}
      aria-hidden
    />
  );
}

type AuroraBackgroundProps = React.HTMLAttributes<HTMLDivElement> & {
  children?: ReactNode;
  showRadialGradient?: boolean;
};

/** Full-section wrapper with aurora behind children (demo / optional use). */
export function AuroraBackground({
  className,
  children,
  showRadialGradient = true,
  ...props
}: AuroraBackgroundProps) {
  return (
    <div
      className={cn(
        "relative flex min-h-[100svh] w-full flex-col items-center justify-center bg-bg text-text",
        className,
      )}
      {...props}
    >
      <div className="absolute inset-0 overflow-hidden">
        <AuroraLayer showRadialGradient={showRadialGradient} />
      </div>
      {children ? <div className="relative z-10">{children}</div> : null}
    </div>
  );
}
