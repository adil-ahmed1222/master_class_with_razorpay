import { Eyebrow, Body, Caption, EventPrice } from "@/components/ui";
import { CountdownTimer, LiveSeatCounter } from "@/components/ui";
import { EventMeta } from "@/components/sections/EventMeta";
import { event } from "@/content/event";
import { registrationBenefits, whyAttend } from "@/content/registration";

type RegistrationValueColumnProps = {
  /** When false, heading is provided by HeroRegistrationSection header. */
  showHeader?: boolean;
};

/**
 * Registration value rail — urgency + benefits inside the unified registration frame.
 */
export function RegistrationValueColumn({ showHeader = true }: RegistrationValueColumnProps) {
  return (
    <div className="flex flex-col gap-8 lg:gap-10">
      {showHeader ? (
        <div className="flex flex-col gap-4">
          <Eyebrow tone="accent" withRule>
            Why attend
          </Eyebrow>
          <Body size="lg" className="max-w-lg text-text-2">
            {whyAttend.body}
          </Body>
        </div>
      ) : null}

      <EventMeta />

      <div className="flex flex-col gap-3 border-t border-white/8 pt-8">
        <Caption as="p" className="text-overline uppercase tracking-[0.16em]">
          Doors open in
        </Caption>
        <CountdownTimer
          target={event.startsAt}
          ariaLabel={event.schedule.countdownAriaLabel}
        />
        <LiveSeatCounter className="max-w-sm" />
        <p className="font-sans text-caption text-text-2">
          <span className="inline-flex flex-wrap items-baseline gap-x-2 gap-y-1">
            <span>{`${event.schedule.durationLabel} · ${event.mode} ·`}</span>
            <EventPrice size="sm" />
          </span>
        </p>
      </div>

      <div className="flex flex-col gap-4 border-t border-white/8 pt-8">
        <Eyebrow tone="muted">What you get</Eyebrow>
        <ul className="flex flex-col gap-3">
          {registrationBenefits.map((item) => (
            <li key={item} className="flex items-start gap-3 font-sans text-body text-text">
              <span aria-hidden className="mt-0.5 shrink-0 text-success">
                ✓
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
