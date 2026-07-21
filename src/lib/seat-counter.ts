import { event } from "@/content/event";
import { pad2 } from "@/lib/countdown";

/**
 * Seat-counter logic for the time-driven scarcity system (04-conversion).
 *
 * One seat is released every {@link INTERVAL_MINUTES} minutes, measured from a
 * *persisted per-browser start time* (localStorage key
 * {@link SEAT_COUNTER_START_KEY}). The count is always derived from the clock —
 * never stored or incremented by a timer — so refreshing the page recomputes
 * the same value instead of resetting it, and the counter starts at
 * {@link INITIAL_REMAINING} the first time a visitor loads the page.
 *
 * These are pure/deterministic helpers — no React, no timers — so they are
 * testable and safe to import anywhere. The ticking hook (`useSeatCounter`)
 * consumes them on the client.
 */

/** Total capacity. Single source of truth lives in `content/event`. */
export const TOTAL_SEATS = event.seatsTotal; // 500

/** Remaining seats at the persisted start time, before any release. */
export const INITIAL_REMAINING = event.seatsRemaining; // 236

/**
 * Minutes between each seat release. This is the ONLY knob to flip between
 * testing and production:
 *
 *   const INTERVAL_MINUTES = 1;   // Testing (1 seat / minute)
 *   const INTERVAL_MINUTES = 240; // Production (1 seat / 4 hours)
 */
export const INTERVAL_MINUTES = 240; // 4 hours — set to 1 for fast testing

/** localStorage key holding the per-browser start timestamp (epoch ms). */
export const SEAT_COUNTER_START_KEY = "seat-counter-start";

const MS_PER_SECOND = 1000;
const MS_PER_MINUTE = 60 * MS_PER_SECOND;
const INTERVAL_MS = INTERVAL_MINUTES * MS_PER_MINUTE;

export interface NextSeatCountdown {
  /** Milliseconds until the next seat is released (0 when full). */
  totalMs: number;
  hours: number;
  minutes: number;
  seconds: number;
  /** Preformatted label — "HHh MMm SSs", or "All seats allocated" when full. */
  label: string;
}

/** Label shown once every seat has been released. */
export const ALL_ALLOCATED_LABEL = "All seats allocated";

export interface SeatState {
  /** Seats currently remaining, clamped to [INITIAL_REMAINING, TOTAL_SEATS]. */
  remainingSeats: number;
  /** Fill percentage 0–100, i.e. `(remainingSeats / TOTAL_SEATS) * 100`. */
  progress: number;
  /** Countdown to the next seat release. */
  nextSeatCountdown: NextSeatCountdown;
  /** True once every seat has been released (remainingSeats === TOTAL_SEATS). */
  isFull: boolean;
}

const FULL_COUNTDOWN: NextSeatCountdown = {
  totalMs: 0,
  hours: 0,
  minutes: 0,
  seconds: 0,
  label: ALL_ALLOCATED_LABEL,
};

function formatCountdown(remainingMs: number): NextSeatCountdown {
  const totalSeconds = Math.floor(remainingMs / MS_PER_SECOND);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const label = `${pad2(hours)}h ${pad2(minutes)}m ${pad2(seconds)}s`;
  return { totalMs: remainingMs, hours, minutes, seconds, label };
}

/**
 * Compute the seat state from a persisted start time.
 *
 * @param startTime - Epoch ms when this browser first opened the page.
 * @param now       - Current epoch ms. Defaults to `Date.now()`.
 */
export function calculateSeatState(
  startTime: number,
  now: number = Date.now(),
): SeatState {
  // Guard against clock skew / a start time in the future.
  const elapsedMs = Math.max(0, now - startTime);

  const minutesPassed = Math.floor(elapsedMs / MS_PER_MINUTE);
  const seatIncrease = Math.floor(minutesPassed / INTERVAL_MINUTES);
  const remainingSeats = Math.min(INITIAL_REMAINING + seatIncrease, TOTAL_SEATS);
  const isFull = remainingSeats >= TOTAL_SEATS;
  const progress = (remainingSeats / TOTAL_SEATS) * 100;

  const nextSeatCountdown = isFull
    ? FULL_COUNTDOWN
    : formatCountdown(INTERVAL_MS - (elapsedMs % INTERVAL_MS));

  return { remainingSeats, progress, nextSeatCountdown, isFull };
}

/**
 * Read the persisted start time, creating it on the first visit. Never
 * overwrites an existing value (so refreshes don't reset the counter). SSR-safe:
 * returns `now` without touching storage when `window` is unavailable.
 *
 * @param now - Current epoch ms. Defaults to `Date.now()`.
 */
export function getSeatCounterStartTime(now: number = Date.now()): number {
  if (typeof window === "undefined") return now;

  const stored = window.localStorage.getItem(SEAT_COUNTER_START_KEY);
  if (stored !== null) {
    const parsed = Number(stored);
    if (Number.isFinite(parsed)) return parsed;
  }

  window.localStorage.setItem(SEAT_COUNTER_START_KEY, String(now));
  return now;
}

/**
 * Clear the persisted start time so the counter restarts from
 * {@link INITIAL_REMAINING} on the next read. Handy for testing.
 */
export function resetSeatCounter(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(SEAT_COUNTER_START_KEY);
}

/**
 * Deterministic seed state (elapsed time = 0 → {@link INITIAL_REMAINING}). The
 * hook renders this on the server and during hydration so markup matches, then
 * swaps to the live localStorage-based value in an effect after mount — avoiding
 * any hydration mismatch.
 */
export const INITIAL_SEAT_STATE: SeatState = calculateSeatState(0, 0);
