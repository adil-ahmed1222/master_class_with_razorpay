"use client";

import {
  useState,
  useEffect,
  useRef,
  useSyncExternalStore,
  useLayoutEffect,
  type ComponentType,
  type MouseEvent,
} from "react";
import { usePrefersReducedMotion } from "@/components/motion/use-prefers-reduced-motion";
import { useIsLgUp } from "@/components/motion/use-media-query";
import { OrbitalNodeDetailCard } from "@/components/workflow-demo/OrbitalNodeDetailCard";
import { cn } from "@/lib/utils";

export type TimelineStatus = "completed" | "in-progress" | "pending";

export type TimelineItem = {
  id: number;
  title: string;
  date: string;
  content: string;
  category: string;
  icon: ComponentType<{ size?: number; className?: string }>;
  relatedIds: number[];
  status: TimelineStatus;
  energy: number;
};

type RadialOrbitalTimelineProps = {
  timelineData: TimelineItem[];
  className?: string;
  /**
   * Scroll-driven: `null` = orbit only (intro); `0..n-1` = that node active.
   * Same open/close transition as click; scrolling up reverses the sequence.
   */
  activeIndex?: number | null;
  scrollControlled?: boolean;
  /** On small screens, detail cards render in a dock below the orbit instead. */
  hideFloatingCards?: boolean;
};

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

function rotationForIndex(index: number, total: number): number {
  const targetAngle = (index / total) * 360;
  return Number((270 - targetAngle).toFixed(3));
}

function expandedMapForId(
  id: number | null,
  data: TimelineItem[],
): Record<number, boolean> {
  const map: Record<number, boolean> = {};
  if (id === null) return map;
  data.forEach((item) => {
    map[item.id] = item.id === id;
  });
  return map;
}

function pulseMapForId(
  id: number | null,
  data: TimelineItem[],
): Record<number, boolean> {
  if (id === null) return {};
  const item = data.find((i) => i.id === id);
  if (!item) return {};
  const pulses: Record<number, boolean> = {};
  item.relatedIds.forEach((relId) => {
    pulses[relId] = true;
  });
  return pulses;
}

/** Fit orbit inside container width with room for node chrome. */
function orbitRadiusFromWidth(width: number): number {
  const padding = 40;
  const nodePad = 24;
  return Math.min(200, Math.max(88, (width - padding) / 2 - nodePad));
}

export function RadialOrbitalTimeline({
  timelineData,
  className,
  activeIndex = null,
  scrollControlled = false,
  hideFloatingCards = false,
}: RadialOrbitalTimelineProps) {
  const reducedMotion = usePrefersReducedMotion();
  const isLgUp = useIsLgUp();
  const isMounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  const [expandedItems, setExpandedItems] = useState<Record<number, boolean>>({});
  const [rotationAngle, setRotationAngle] = useState(0);
  const [manualAutoRotate, setManualAutoRotate] = useState(true);
  const [pulseEffect, setPulseEffect] = useState<Record<number, boolean>>({});
  const [activeNodeId, setActiveNodeId] = useState<number | null>(null);
  const [orbitRadius, setOrbitRadius] = useState(200);
  const containerRef = useRef<HTMLDivElement>(null);
  const orbitRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<Record<number, HTMLDivElement | null>>({});

  const scrollActiveId =
    scrollControlled && activeIndex != null
      ? (timelineData[activeIndex]?.id ?? null)
      : null;

  const displayActiveId = scrollControlled ? scrollActiveId : activeNodeId;
  const displayExpanded = scrollControlled
    ? expandedMapForId(scrollActiveId, timelineData)
    : expandedItems;
  const displayPulse = scrollControlled
    ? pulseMapForId(scrollActiveId, timelineData)
    : pulseEffect;
  const displayRotation =
    scrollControlled && activeIndex != null
      ? rotationForIndex(activeIndex, timelineData.length)
      : rotationAngle;

  const autoRotate =
    manualAutoRotate &&
    !reducedMotion &&
    (scrollControlled ? activeIndex === null : activeNodeId === null);

  const showFloatingCards = !hideFloatingCards;

  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const update = () => {
      setOrbitRadius(orbitRadiusFromWidth(el.clientWidth));
    };

    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [isMounted]);

  const getRelatedItems = (itemId: number): number[] => {
    const currentItem = timelineData.find((item) => item.id === itemId);
    return currentItem ? currentItem.relatedIds : [];
  };

  const centerViewOnNode = (nodeId: number) => {
    const nodeIndex = timelineData.findIndex((item) => item.id === nodeId);
    if (nodeIndex < 0) return;
    setRotationAngle(rotationForIndex(nodeIndex, timelineData.length));
  };

  const activateNode = (id: number) => {
    setExpandedItems(expandedMapForId(id, timelineData));
    setActiveNodeId(id);
    setManualAutoRotate(false);
    setPulseEffect(pulseMapForId(id, timelineData));
    centerViewOnNode(id);
  };

  const handleContainerClick = (e: MouseEvent<HTMLDivElement>) => {
    if (scrollControlled) return;
    if (e.target === containerRef.current || e.target === orbitRef.current) {
      setExpandedItems({});
      setActiveNodeId(null);
      setPulseEffect({});
      if (!reducedMotion) setManualAutoRotate(true);
    }
  };

  const toggleItem = (id: number) => {
    if (scrollControlled) return;

    const wasOpen = expandedItems[id];
    if (wasOpen) {
      setExpandedItems({});
      setActiveNodeId(null);
      setPulseEffect({});
      if (!reducedMotion) setManualAutoRotate(true);
      return;
    }

    activateNode(id);
  };

  useEffect(() => {
    if (!isMounted || !autoRotate) {
      return;
    }

    const rotationTimer = setInterval(() => {
      setRotationAngle((prev) => {
        const newAngle = (prev + 0.3) % 360;
        return Number(newAngle.toFixed(3));
      });
    }, 50);

    return () => clearInterval(rotationTimer);
  }, [autoRotate, isMounted]);

  const roundStyle = (value: number, decimals = 3) => Number(value.toFixed(decimals));

  const calculateNodePosition = (index: number, total: number) => {
    const angle = ((index / total) * 360 + displayRotation) % 360;
    const radius = orbitRadius;
    const radian = (angle * Math.PI) / 180;

    const x = roundStyle(radius * Math.cos(radian));
    const y = roundStyle(radius * Math.sin(radian));

    const zIndex = Math.round(100 + 50 * Math.cos(radian));
    const opacity = roundStyle(Math.max(0.4, Math.min(1, 0.4 + 0.6 * ((1 + Math.sin(radian)) / 2))));

    return { x, y, zIndex, opacity };
  };

  const isRelatedToActive = (itemId: number): boolean => {
    if (!displayActiveId) return false;
    return getRelatedItems(displayActiveId).includes(itemId);
  };

  const activeItem =
    displayActiveId != null
      ? timelineData.find((i) => i.id === displayActiveId)
      : null;

  const ringSize = Math.min(384, Math.max(208, orbitRadius * 2 + 48));

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative flex w-full flex-col items-center justify-center",
        scrollControlled ? "overflow-hidden" : "overflow-hidden",
        !scrollControlled && "min-h-[min(80svh,720px)] rounded-lg border border-white/8 bg-bg/40",
        className,
      )}
      onClick={handleContainerClick}
      role="presentation"
    >
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {activeItem ? `${activeItem.title}. ${activeItem.content}` : ""}
      </div>

      <div
        className={cn(
          "relative flex w-full max-w-4xl items-center justify-center",
          scrollControlled
            ? "h-full min-h-0 py-2 sm:py-4 lg:py-10"
            : "h-full min-h-[inherit] py-10",
        )}
      >
        <div
          ref={orbitRef}
          className="absolute inset-0 flex items-center justify-center"
          style={{ perspective: "1000px" }}
        >
          <div
            className={cn(
              "absolute z-10 flex items-center justify-center rounded-full bg-gradient-to-br from-primary via-primary/80 to-accent animate-[nv-core-breathe_7s_ease-in-out_infinite]",
              isLgUp ? "size-16" : "size-12 sm:size-14",
            )}
            aria-hidden
          >
            {!reducedMotion ? (
              <>
                <div
                  className={cn(
                    "absolute rounded-full border border-white/20 opacity-70 animate-ping",
                    isLgUp ? "size-20" : "size-14 sm:size-16",
                  )}
                />
                <div
                  className={cn(
                    "absolute rounded-full border border-white/10 opacity-50 animate-ping",
                    isLgUp ? "size-24" : "size-[4.25rem] sm:size-20",
                  )}
                  style={{ animationDelay: "0.5s" }}
                />
              </>
            ) : null}
            <div
              className={cn(
                "rounded-full bg-white/80 backdrop-blur-md",
                isLgUp ? "size-8" : "size-6 sm:size-7",
              )}
            />
          </div>

          <div
            className="absolute rounded-full border border-white/10"
            style={{ width: ringSize, height: ringSize }}
            aria-hidden
          />

          {isMounted &&
            timelineData.map((item, index) => {
              const position = calculateNodePosition(index, timelineData.length);
              const isExpanded = displayExpanded[item.id];
              const isRelated = isRelatedToActive(item.id);
              const isPulsing = displayPulse[item.id];
              const isActiveNode = displayActiveId === item.id;
              const Icon = item.icon;
              const showLabel = isLgUp || isExpanded || isActiveNode;

              return (
                <div
                  key={item.id}
                  ref={(el) => {
                    nodeRefs.current[item.id] = el;
                  }}
                  className={cn(
                    "absolute transition-all",
                    scrollControlled ? "duration-[1200ms] ease-out-expo" : "duration-700",
                    scrollControlled ? "pointer-events-none" : "cursor-pointer",
                  )}
                  style={{
                    transform: `translate(${position.x}px, ${position.y}px)`,
                    zIndex: isExpanded ? 200 : position.zIndex,
                    opacity: isExpanded ? 1 : position.opacity,
                  }}
                  onClick={
                    scrollControlled
                      ? undefined
                      : (e) => {
                          e.stopPropagation();
                          toggleItem(item.id);
                        }
                  }
                  onKeyDown={
                    scrollControlled
                      ? undefined
                      : (e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            e.stopPropagation();
                            toggleItem(item.id);
                          }
                        }
                  }
                  role={scrollControlled ? undefined : "button"}
                  tabIndex={scrollControlled ? undefined : 0}
                  aria-expanded={scrollControlled ? undefined : isExpanded}
                  aria-label={
                    scrollControlled
                      ? undefined
                      : `${item.title}, ${statusLabel(item.status)}`
                  }
                >
                  <div
                    aria-hidden
                    className={cn(
                      "absolute -inset-1 rounded-full",
                      isPulsing && "animate-pulse duration-1000",
                    )}
                    style={{
                      background:
                        "radial-gradient(circle, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 70%)",
                      width: `${item.energy * 0.4 + (isLgUp ? 40 : 32)}px`,
                      height: `${item.energy * 0.4 + (isLgUp ? 40 : 32)}px`,
                      left: `-${(item.energy * 0.4 + (isLgUp ? 40 : 32) - (isLgUp ? 40 : 32)) / 2}px`,
                      top: `-${(item.energy * 0.4 + (isLgUp ? 40 : 32) - (isLgUp ? 40 : 32)) / 2}px`,
                    }}
                  />

                  <div
                    className={cn(
                      "flex items-center justify-center rounded-full border-2 transition-all",
                      isLgUp ? "size-10" : "size-8 sm:size-9",
                      scrollControlled ? "duration-[600ms]" : "duration-300",
                      isExpanded
                        ? isLgUp
                          ? "scale-150 border-white bg-white text-bg shadow-lg shadow-white/30"
                          : "scale-125 border-white bg-white text-bg shadow-lg shadow-white/30"
                        : isRelated
                          ? "border-white bg-white/50 text-bg animate-pulse"
                          : "border-white/40 bg-bg text-text",
                    )}
                  >
                    <Icon size={isLgUp ? 16 : 14} />
                  </div>

                  {showLabel ? (
                    <div
                      className={cn(
                        "absolute left-1/2 -translate-x-1/2 font-sans font-semibold tracking-wider transition-all",
                        isLgUp
                          ? "top-12 max-w-none whitespace-nowrap text-xs"
                          : "top-9 max-w-[4.75rem] truncate text-center text-[0.625rem] sm:max-w-[5.5rem] sm:text-[0.6875rem]",
                        scrollControlled ? "duration-[600ms]" : "duration-300",
                        isExpanded || isActiveNode ? "scale-110 text-text" : "text-text-2",
                      )}
                    >
                      {item.title}
                    </div>
                  ) : null}

                  {showFloatingCards && isExpanded ? (
                    <OrbitalNodeDetailCard
                      item={item}
                      timelineData={timelineData}
                      scrollControlled={scrollControlled}
                      onSelectRelated={scrollControlled ? undefined : toggleItem}
                      showConnector
                      className="absolute top-20 left-1/2 z-[200] w-[min(16rem,calc(100vw-2.5rem))] -translate-x-1/2 overflow-visible sm:w-64"
                    />
                  ) : null}
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}
