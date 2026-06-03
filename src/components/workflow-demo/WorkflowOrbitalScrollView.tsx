"use client";

import { useMemo, useRef, useState } from "react";
import { ScrollStory, useStoryProgress } from "@/components/motion";
import { useIsLgUp } from "@/components/motion/use-media-query";
import { Caption, Eyebrow, Body, Card } from "@/components/ui";
import { RadialOrbitalTimeline } from "@/components/workflow-demo/RadialOrbitalTimeline";
import { OrbitalActiveDetailPanel } from "@/components/workflow-demo/OrbitalActiveDetailPanel";
import { WorkflowDemoHeader } from "@/components/workflow-demo/WorkflowDemoHeader";
import {
  agentTimelineData,
  buildWorkflowTimelineData,
} from "@/components/workflow-demo/workflow-timeline-data";
import {
  scrollProgressToActiveIndex,
  WORKFLOW_ORBIT_STAGE_COUNT,
} from "@/components/workflow-demo/workflow-scroll-progress";
import { cn } from "@/lib/utils";

const N = agentTimelineData.length;
/** More scroll per beat so orbit centering and card open/close are easy to follow. */
const STAGE_VH = 115;
const STAGE_VH_MOBILE = 100;

const WORKFLOW_ORBIT_STICKY =
  "sticky top-[var(--nav-h)] z-10 flex h-[calc(100dvh-var(--nav-h))] max-h-[calc(100dvh-var(--nav-h))] flex-col overflow-hidden bg-transparent";

function OrbitalReducedList() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6 px-4 py-8">
      <Eyebrow tone="accent" withRule>
        Agent pipeline
      </Eyebrow>
      <Body size="lg" className="text-text-2">
        Each node in the orbit, in order.
      </Body>
      {agentTimelineData.map((item, i) => (
        <Card key={item.id} padding="md" className="border-white/10">
          <p className="font-sans text-overline uppercase text-text-2">
            {`Step ${i + 1} of ${N}`}
          </p>
          <p className="mt-2 font-display text-h3 text-text">{item.title}</p>
          <Body size="lg" className="mt-2 text-text-2">
            {item.content}
          </Body>
        </Card>
      ))}
    </div>
  );
}

function OrbitalStepRail({ activeIndex }: { activeIndex: number | null }) {
  return (
    <div
      className="flex shrink-0 items-center justify-center gap-1.5 py-1 lg:hidden"
      role="presentation"
      aria-hidden
    >
      {agentTimelineData.map((node, i) => (
        <span
          key={node.id}
          className={cn(
            "h-1.5 rounded-pill transition-all duration-300",
            activeIndex === i
              ? "w-6 bg-primary"
              : activeIndex === null
                ? "w-1.5 bg-white/15"
                : "w-1.5 bg-white/25",
          )}
        />
      ))}
    </div>
  );
}

function scrollHint(activeIndex: number | null): string {
  if (activeIndex === null) {
    return "Scroll down to open the first node";
  }
  if (activeIndex < N - 1) {
    return "Scroll down for the next node · scroll up to go back";
  }
  return "Scroll down to continue to the next section · scroll up to review nodes";
}

function OrbitalScrollExperience() {
  const isLgUp = useIsLgUp();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const activeIndexRef = useRef<number | null>(null);
  const timelineData = useMemo(() => buildWorkflowTimelineData(), []);

  const reduced = useStoryProgress((p) => {
    const next = scrollProgressToActiveIndex(p, activeIndexRef.current);
    if (next !== activeIndexRef.current) {
      activeIndexRef.current = next;
      setActiveIndex(next);
    }
  });

  if (reduced) {
    return <OrbitalReducedList />;
  }

  const activeItem =
    activeIndex != null ? timelineData[activeIndex] : undefined;

  return (
    <div className="flex h-full min-h-0 flex-col px-3 py-3 pb-20 sm:px-4 sm:py-4 lg:px-6 lg:py-5 lg:pb-5">
      <WorkflowDemoHeader
        variant="pinned"
        className="relative z-10 mx-auto w-full max-w-2xl shrink-0 pb-2 sm:pb-3 lg:pb-4"
      />

      <OrbitalStepRail activeIndex={activeIndex} />

      <div
        className={cn(
          "flex min-h-0 flex-1 flex-col",
          isLgUp ? "items-center justify-center" : "gap-2 sm:gap-3",
        )}
      >
        <RadialOrbitalTimeline
          timelineData={timelineData}
          activeIndex={activeIndex}
          scrollControlled
          hideFloatingCards={!isLgUp}
          className={cn(
            "w-full shrink-0",
            isLgUp
              ? "h-full min-h-[min(52vh,480px)] max-h-full"
              : "max-h-[min(38dvh,240px)] min-h-[180px] flex-1 sm:max-h-[min(42dvh,280px)]",
          )}
        />

        {!isLgUp ? (
          <OrbitalActiveDetailPanel
            activeItem={activeItem}
            activeIndex={activeIndex}
            timelineData={timelineData}
            className="shrink-0"
          />
        ) : null}
      </div>

      <Caption
        as="p"
        className="mt-2 shrink-0 text-center text-[0.8125rem] leading-snug text-text-2 sm:mt-3 sm:text-caption"
      >
        {scrollHint(activeIndex)}
      </Caption>
    </div>
  );
}

export function WorkflowOrbitalScrollView() {
  const isLgUp = useIsLgUp();

  return (
    <div
      id="workflow-orbital"
      className="relative -mx-4 w-[calc(100%+2rem)] scroll-mt-[var(--nav-h)] sm:-mx-0 sm:w-full"
    >
      <ScrollStory
        stageCount={WORKFLOW_ORBIT_STAGE_COUNT}
        stageVh={isLgUp ? STAGE_VH : STAGE_VH_MOBILE}
        scrubSeconds={2.25}
        scrollStoryTrack="workflow"
        trackId="workflow-demo-track"
        skipEntryFade
        pin
        stickyClassName={WORKFLOW_ORBIT_STICKY}
      >
        <OrbitalScrollExperience />
      </ScrollStory>
    </div>
  );
}
