/**
 * Registration conversion content (Section 6).
 * Concise benefits only — no marketing fluff (04-conversion, 08-copywriting).
 */

export const registrationBenefits = [
  "Build a Q&A Chatbot",
  "Build an AI Content Creator Assistant",
  "Build an AI Resume Reviewer",
  "Build a Voice News Intelligence Briefing",
  "Understand AI Workflows",
  "Learn Agentic AI Fundamentals",
  "Certificate of completion after the masterclass",
  "Free career roadmap for your next step",
  "Beginner Friendly",
  "Live Q&A Included",
] as const;

export const whyAttend = {
  eyebrow: "Reserve your seat",
  title: "Six hours. Four production agents.",
  body: "Reserve your seat for two live days of building — three hours each Saturday and Sunday. Leave with four working AI agents, your certificate, and a free career roadmap — no coding required.",
} as const;

/** Compact ticket lines above the form (Issue 6). */
export const ticketSummary = {
  label: "Your ticket",
  lines: [
    "Saturday 18 & Sunday 19 July 2026",
    "2:00 PM – 5:00 PM IST each day",
    "Live Online",
    "Certificate of completion",
    "Free career roadmap",
    "Limited seats",
  ],
} as const;

/** Bridge before registration — learning → believing → action (Issue 4). */
export const conversionBridge = {
  recap: ["AI Agents", "AI Workflows", "AI Companies"] as const,
  headline: "Now build your first AI Employee.",
} as const;

export const formMicrocopy = {
  helper: "We'll send your live access link to this email.",
  submitPrefix: "Reserve My Seat for",
  pending: "Reserving your seat…",
  successTitle: "You're in.",
  successBody:
    "Check your email for your live access link. Your certificate and career roadmap arrive after you complete both days. See you Saturday 18 July, 2:00 PM IST.",
  errorBody: "Something went wrong. Your details are still here — try again in a moment.",
} as const;

/** Final CTA urgency — emotional close, not a second form (Issue 5). */
export const finalCta = {
  eyebrow: "Last opportunity",
  urgency:
    "Seats are limited for this two-day live build. When the countdown ends, doors close.",
  ctaLabelPrefix: "Reserve My Seat for",
} as const;

/** FAQ transition intro (Issue 8). */
export const faqIntro = {
  eyebrow: "Still have questions?",
  title: "Everything you need to know before joining.",
  description: "Straight answers — no filler.",
} as const;
