"use client";

import { ArrowRight, Link, Zap } from "lucide-react";
import { Badge, Button, Card, Body, Caption } from "@/components/ui";
import { cn } from "@/lib/utils";
import type { TimelineItem, TimelineStatus } from "@/components/workflow-demo/RadialOrbitalTimeline";

function statusLabel(status: TimelineStatus): string {
  switch (status) {
    case "completed":
      return "COMPLETE";
    case "in-progress":
      return "IN PROGRESS";
    default:
      return "PENDING";
  }
}

function statusBadgeClass(status: TimelineStatus): string {
  switch (status) {
    case "completed":
      return "border-white/30 bg-white/10 text-text";
    case "in-progress":
      return "border-accent/40 bg-accent/15 text-accent";
    default:
      return "border-white/20 bg-white/5 text-text-2";
  }
}

type OrbitalNodeDetailCardProps = {
  item: TimelineItem;
  timelineData: TimelineItem[];
  scrollControlled?: boolean;
  onSelectRelated?: (id: number) => void;
  className?: string;
  showConnector?: boolean;
};

export function OrbitalNodeDetailCard({
  item,
  timelineData,
  scrollControlled = false,
  onSelectRelated,
  className,
  showConnector = false,
}: OrbitalNodeDetailCardProps) {
  return (
    <Card
      padding="sm"
      className={cn(
        "w-full border-white/30 bg-bg/90 shadow-xl shadow-white/10 backdrop-blur-lg",
        className,
      )}
    >
      {showConnector ? (
        <div
          className="absolute -top-3 left-1/2 hidden h-3 w-px -translate-x-1/2 bg-white/50 lg:block"
          aria-hidden
        />
      ) : null}
      <div className="mb-2 flex items-center justify-between gap-2">
        <Badge className={cn("px-2 text-xs", statusBadgeClass(item.status))}>
          {statusLabel(item.status)}
        </Badge>
        <Caption className="font-mono text-text-2">{item.date}</Caption>
      </div>
      <p className="font-display text-sm font-semibold text-text sm:text-base">{item.title}</p>
      <Body size="lg" className="mt-2 text-xs leading-relaxed text-text-2 sm:text-sm">
        {item.content}
      </Body>

      <div className="mt-4 border-t border-white/10 pt-3">
        <div className="mb-1 flex items-center justify-between font-sans text-caption text-text-2">
          <span className="flex items-center gap-1">
            <Zap size={10} aria-hidden />
            Energy Level
          </span>
          <span className="font-mono text-text">{item.energy}%</span>
        </div>
        <div className="h-1 overflow-hidden rounded-pill bg-white/10">
          <div
            className="h-full rounded-pill bg-gradient-to-r from-primary to-accent transition-[width] duration-300 ease-out-expo"
            style={{ width: `${item.energy}%` }}
          />
        </div>
      </div>

      {item.relatedIds.length > 0 ? (
        <div className="mt-4 border-t border-white/10 pt-3">
          <div className="mb-2 flex items-center gap-1 font-sans text-overline uppercase text-text-2">
            <Link size={10} aria-hidden />
            Connected Nodes
          </div>
          <div className="flex flex-wrap gap-1">
            {item.relatedIds.map((relatedId) => {
              const relatedItem = timelineData.find((i) => i.id === relatedId);
              return scrollControlled || !onSelectRelated ? (
                <span
                  key={relatedId}
                  className="inline-flex items-center rounded-pill border border-white/15 px-2 py-0.5 font-sans text-caption text-text-2"
                >
                  {relatedItem?.title}
                </span>
              ) : (
                <Button
                  key={relatedId}
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-6 gap-1 rounded-none border border-white/20 px-2 py-0 text-caption text-text-2 hover:bg-white/10 hover:text-text"
                  onClick={() => onSelectRelated(relatedId)}
                >
                  {relatedItem?.title}
                  <ArrowRight size={8} aria-hidden />
                </Button>
              );
            })}
          </div>
        </div>
      ) : null}
    </Card>
  );
}
