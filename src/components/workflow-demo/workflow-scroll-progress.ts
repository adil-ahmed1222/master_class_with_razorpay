import { agentTimelineData } from "@/components/workflow-demo/workflow-timeline-data";

const N = agentTimelineData.length;

/** Intro beat + one scroll step per node (N + 1 segments). */
export const WORKFLOW_ORBIT_STAGE_COUNT = N + 1;

/** How far into the next segment before advancing (larger = longer hold per node). */
const ADVANCE_MARGIN = 0.58;
/** How far back you must scroll before retreating to the previous node. */
const RETREAT_MARGIN = 0.58;

/**
 * Map scroll progress (0..1) to active node index with hysteresis so each node
 * stays active through the middle of its scroll segment and only advances or
 * retreats one step at a time — orbit/card transitions stay readable.
 *
 * `null` = intro only (orbit visible, no expanded node).
 * `0..N-1` = that node active with the same open/close transition as click.
 */
export function scrollProgressToActiveIndex(
  progress: number,
  previous: number | null = null,
): number | null {
  const segments = WORKFLOW_ORBIT_STAGE_COUNT;
  const p = Math.min(1 - 1e-9, Math.max(0, progress));
  const raw = p * segments;
  const prevSeg = previous === null ? 0 : previous + 1;

  let nextSeg = prevSeg;

  if (raw >= prevSeg + ADVANCE_MARGIN && prevSeg < segments - 1) {
    nextSeg = prevSeg + 1;
  } else if (raw < prevSeg - (1 - RETREAT_MARGIN) && prevSeg > 0) {
    nextSeg = prevSeg - 1;
  }

  if (nextSeg <= 0) {
    return null;
  }

  return Math.min(N - 1, nextSeg - 1);
}
