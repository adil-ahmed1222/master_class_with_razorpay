import { clamp } from "@/lib/utils";
import { cn } from "@/lib/utils";

/**
 * SeatCounter — honest scarcity indicator (04-conversion: real/config-driven,
 * never random). Presentational only; receives real numbers as props.
 * Accessible: role=progressbar with value + text label; meaning is in the text,
 * not color alone (11-accessibility).
 */

type SeatCounterProps = {
  remaining: number;
  total: number;
  /** Fraction at/below which the urgency tone kicks in. */
  lowThreshold?: number;
  /** Optional "Next seat in" countdown label, e.g. "03h 59m 59s". */
  nextSeatLabel?: string;
  /** When true, show the fully-allocated message instead of a countdown. */
  isFull?: boolean;
  className?: string;
};

export function SeatCounter({
  remaining,
  total,
  lowThreshold = 0.2,
  nextSeatLabel,
  isFull = false,
  className,
}: SeatCounterProps) {
  const safeTotal = Math.max(1, total);
  const safeRemaining = clamp(remaining, 0, safeTotal);
  const remainingFraction = safeRemaining / safeTotal;
  const filledPct = (safeRemaining / safeTotal) * 100;
  const isLow = remainingFraction <= lowThreshold;

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <div className="flex items-baseline justify-between gap-4">
        <span className="font-sans text-caption uppercase tracking-[0.12em] text-text-2">
          Seats remaining
        </span>
        <span
          className={cn(
            "font-display text-body-lg font-semibold tabular-nums",
            isLow ? "text-accent" : "text-text",
          )}
        >
          {safeRemaining}
          <span className="text-text-2/60"> / {safeTotal}</span>
        </span>
      </div>
      <div
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={safeTotal}
        aria-valuenow={safeRemaining}
        aria-valuetext={`${safeRemaining} of ${safeTotal} seats remaining${isLow ? " — almost full" : ""}`}
        className="h-1.5 w-full overflow-hidden rounded-pill bg-white/8"
      >
        <div
          className={cn(
            "h-full rounded-pill transition-[width] duration-[var(--duration-reveal)] ease-out-expo",
            isLow ? "bg-accent" : "bg-primary",
          )}
          style={{ width: `${filledPct}%` }}
        />
      </div>
      <div className="flex items-baseline justify-between gap-4">
        {isLow ? (
          <p className="font-sans text-caption text-accent">Filling fast — reserve now.</p>
        ) : (
          <span aria-hidden />
        )}
        {isFull ? (
          <p className="font-sans text-caption text-text-2">All seats allocated</p>
        ) : nextSeatLabel ? (
          <p className="font-sans text-caption text-text-2">
            Next seat in:{" "}
            <span className="tabular-nums text-text">{nextSeatLabel}</span>
          </p>
        ) : null}
      </div>
    </div>
  );
}
