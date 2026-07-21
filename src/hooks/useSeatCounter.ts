"use client";

import { useEffect, useState } from "react";
import {
  calculateSeatState,
  getSeatCounterStartTime,
  INITIAL_SEAT_STATE,
  type SeatState,
} from "@/lib/seat-counter";

/**
 * useSeatCounter — live, time-driven seat count (04-conversion).
 *
 * The count is derived purely from `Date.now()` and a per-browser start time
 * persisted in localStorage, so it starts at the initial value on first visit
 * and survives refreshes/restarts/tabs. The interval only *re-reads the clock*;
 * it never increments the count and never reads previous React state.
 *
 * SSR-safe: starts from the deterministic {@link INITIAL_SEAT_STATE} on the
 * server and first client render (no hydration mismatch), then recalculates
 * from the persisted start time immediately after mount.
 */

const REFRESH_INTERVAL_MS = 1_000;

export function useSeatCounter(): SeatState {
  const [state, setState] = useState<SeatState>(INITIAL_SEAT_STATE);

  useEffect(() => {
    const startTime = getSeatCounterStartTime();

    // Always recompute from the current clock — never from prior state.
    const recalculate = () => setState(calculateSeatState(startTime, Date.now()));

    recalculate(); // sync right after mount
    const id = window.setInterval(recalculate, REFRESH_INTERVAL_MS);
    return () => window.clearInterval(id);
  }, []);

  return state;
}

export { resetSeatCounter } from "@/lib/seat-counter";
