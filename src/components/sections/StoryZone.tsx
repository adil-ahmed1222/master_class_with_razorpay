"use client";

import type { ReactNode } from "react";

/**
 * StoryZone — hero + narrative sections (2–5).
 * Site-wide aurora background mounts in layout; no local atmosphere.
 */
export function StoryZone({ children }: { children: ReactNode }) {
  return (
    <div data-story-zone className="relative">
      <div className="relative z-10">{children}</div>
    </div>
  );
}
