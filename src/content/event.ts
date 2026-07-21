/**
 * Event facts — THE single source of truth (01-project).
 * Never duplicate date/time/price elsewhere; import from here.
 * All times are IST (Asia/Kolkata, UTC+05:30).
 */

export const event = {
  brand: "NeuralVarsity",
  series: "Agentic AI Masterclass",
  title: "Build Your First AI Employee",
  titleTagline: "Which works 24/7",
  subtitle:
    "Learn how to build AI Agents that automate real business tasks without writing code.",
  heroSubheadline:
    "Discover how to create AI Agents that generate leads, automate communication, and perform real business tasks without coding.",

  // Day 1: Saturday 25 July 2026, 7:00 PM IST. Countdown targets first session.
  startsAt: new Date("2026-07-25T19:00:00+05:30"),
  // Day 2: Sunday 26 July 2026, 10:00 PM IST (end of second session).
  endsAt: new Date("2026-07-26T22:00:00+05:30"),
  timezone: "Asia/Kolkata",
  timezoneLabel: "IST",

  durationHours: 6,
  sessionHoursPerDay: 3,
  mode: "Live Online Masterclass",

  compareAtPriceInINR: 4999,
  priceInINR: 111,

  schedule: {
    heroEyebrow: "Live Online Masterclass · 25–26 Jul 2026",
    datePill: "Sat 25 & Sun 26 Jul 2026",
    timePill: "7:00 PM – 10:00 PM IST · Sat & Sun",
    footerDate: "Saturday 25 & Sunday 26 July 2026",
    footerTime: "7:00 PM – 10:00 PM IST · Saturday & Sunday",
    durationLabel: "6 hours · 2 live sessions",
    finalCtaPriceSuffix: "· two live sessions · 3 hours each day",
    countdownAriaLabel:
      "Time remaining until the masterclass begins on Saturday 25 July 2026 at 7:00 PM IST",
  },

  // Seats remaining is config-driven, never random (04-conversion).
  // Wire to real inventory in a later phase; this is the controlled fallback.
  seatsTotal: 500,
  seatsRemaining: 236,

  cta: {
    primary: "Reserve My Seat",
    /** Pair with <EventPrice /> in buttons (e.g. "Reserve My Seat for"). */
    primaryWithPrice: "Reserve My Seat for",
    secondary: "Watch Demo",
  },
} as const;

export type EventData = typeof event;
