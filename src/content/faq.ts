/**
 * FAQ — real objections only (04-conversion). Each answer leads with reassurance.
 */

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export const faq: readonly FaqItem[] = [
  {
    id: "who-for",
    question: "Who is this masterclass designed for?",
    answer:
      "Anyone ready to move from consuming AI to directing it — students charting their first career path, professionals who want capability without a computer science degree, and founders who need automation without an engineering team. Curiosity and a laptop are enough; prior build experience is not required.",
  },
  {
    id: "no-code",
    question: "Is programming experience required?",
    answer:
      "No. Every agent is built with visual, no-code tools — the same approach teams use to ship production workflows without writing application code. You focus on architecture and outcomes; the platform handles the syntax.",
  },
  {
    id: "beginner",
    question: "Can first-time builders keep pace?",
    answer:
      "Yes — deliberately so. We begin with how agentic AI thinks and acts, then construct each build in sequence. If you can follow a live walkthrough on your machine, you have everything this weekend demands.",
  },
  {
    id: "recording",
    question: "Are sessions recorded for later viewing?",
    answer:
      "This is a live, interactive two-day session by design. The value is in building alongside the instructor, asking questions in real time, and leaving with deployed agents — something a recording cannot replace. Plan to attend both days.",
  },
  {
    id: "joining-details",
    question: "How will I access the live sessions?",
    answer:
      "Immediately after registration. Your live access link arrives at the email you provide — keep it accessible for both Saturday and Sunday sessions.",
  },
  {
    id: "tools",
    question: "Which tools and setup are required?",
    answer:
      "Industry-standard no-code platforms for agents and applications, introduced step by step during the masterclass. You need a laptop, reliable internet, and free accounts where required — we walk through setup before the first build.",
  },
  {
    id: "payment",
    question: "How does the registration payment work?",
    answer:
      "After you submit this form, you proceed to secure checkout for ₹111 (₹4,999 value). Payment confirmation reserves your seat — without it, registration is not complete.",
  },
  {
    id: "refund",
    question: "What is the refund policy?",
    answer:
      "If you could not attend or did not gain clarity from the sessions, reach out after the masterclass and we will process a refund. Email the address in the footer with your registration details — we handle the rest.",
  },
  {
    id: "after-register",
    question: "What happens once I reserve my seat?",
    answer:
      "A confirmation email with your live link lands within minutes. Arrive on time Saturday and Sunday with your laptop ready — by Sunday evening, four production agents live in the world: a Q&A chatbot, a content creator, a resume reviewer, and a voice news briefing.",
  },
  {
    id: "certificate",
    question: "Is a certificate of completion included?",
    answer:
      "Yes. Completing both days earns a certificate of completion — evidence that you did not watch AI demos, you built with agentic systems.",
  },
  {
    id: "career-roadmap",
    question: "What does the complimentary career roadmap include?",
    answer:
      "After the masterclass, you receive a personalized career roadmap at no extra cost — a clear view of next skills, portfolio projects, and roles worth pursuing in an economy where builders define their own leverage.",
  },
] as const;
