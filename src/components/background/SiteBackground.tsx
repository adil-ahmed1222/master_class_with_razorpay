import { AuroraLayer } from "@/components/ui/aurora-background";

/**
 * Site-wide fixed background — Aceternity-style aurora (docs/AURORA-BACKGROUND.md).
 * Replaces the previous neural-network canvas + static gradient stack.
 */
export function SiteBackground() {
  return (
    <div className="absolute inset-0 min-h-screen overflow-hidden bg-bg" aria-hidden>
      <AuroraLayer showRadialGradient />
    </div>
  );
}
