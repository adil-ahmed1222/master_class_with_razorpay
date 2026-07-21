"use client";

import { SeatCounter } from "@/components/ui/SeatCounter";
import { useSeatCounter } from "@/hooks/useSeatCounter";
import { TOTAL_SEATS } from "@/lib/seat-counter";

/**
 * LiveSeatCounter — client wrapper that binds the time-driven seat state
 * ({@link useSeatCounter}) to the presentational {@link SeatCounter}. Drop this
 * in anywhere the scarcity indicator should tick on its own; no props required.
 */

type LiveSeatCounterProps = {
  /** Show the "Next seat in HHh MMm SSs" countdown. Defaults to false. */
  showNextSeat?: boolean;
  className?: string;
};

export function LiveSeatCounter({
  showNextSeat = false,
  className,
}: LiveSeatCounterProps) {
  const { remainingSeats, nextSeatCountdown, isFull } = useSeatCounter();

  return (
    <SeatCounter
      remaining={remainingSeats}
      total={TOTAL_SEATS}
      className={className}
      isFull={showNextSeat && isFull}
      nextSeatLabel={
        showNextSeat && !isFull ? nextSeatCountdown.label : undefined
      }
    />
  );
}
