"use client";

import { agentTimelineData } from "@/components/workflow-demo/workflow-timeline-data";
import { OrbitalNodeDetailCard } from "@/components/workflow-demo/OrbitalNodeDetailCard";
import { Body, Caption } from "@/components/ui";
import { cn } from "@/lib/utils";
import type { TimelineItem } from "@/components/workflow-demo/RadialOrbitalTimeline";

const N = agentTimelineData.length;

type OrbitalActiveDetailPanelProps = {
  activeItem: TimelineItem | null | undefined;
  activeIndex: number | null;
  timelineData: TimelineItem[];
  className?: string;
};

export function OrbitalActiveDetailPanel({
  activeItem,
  activeIndex,
  timelineData,
  className,
}: OrbitalActiveDetailPanelProps) {
  return (
    <div
      className={cn(
        "flex w-full min-h-[9.5rem] flex-col justify-end px-1 sm:min-h-[10.5rem]",
        className,
      )}
      aria-live="polite"
      aria-atomic="true"
    >
      {activeItem ? (
        <>
          <Caption className="mb-2 font-sans text-overline uppercase text-text-2">
            {activeIndex != null ? `Step ${activeIndex + 1} of ${N}` : ""}
          </Caption>
          <OrbitalNodeDetailCard
            item={activeItem}
            timelineData={timelineData}
            scrollControlled
          />
        </>
      ) : (
        <div className="rounded-lg border border-white/10 bg-surface/80 px-4 py-5 text-center">
          <Caption className="font-sans text-overline uppercase text-text-2">
            Agent pipeline
          </Caption>
          <Body size="lg" className="mt-2 text-pretty text-sm text-text-2">
            Scroll to walk through each node — Input, Planner, Retriever, Tools, Memory, and
            Output.
          </Body>
        </div>
      )}
    </div>
  );
}
