/**
 * Masterclass agenda — promise-per-hour (Section 5, 08-copywriting).
 * Two days · three hours per session · four production builds.
 */

export interface AgendaHour {
  id: string;
  hour: string;
  title: string;
  /** What the attendee can DO by the end of this hour. */
  outcome: string;
}

export const agendaSection = {
  eyebrow: "Two days",
  title: "Six hours. Four production agents.",
  description:
    "Three hours each day — Saturday and Sunday, 7:00 PM to 10:00 PM IST. Each session moves from foundations to finished work. By Sunday evening, four agents exist in the world — not on a slide.",
} as const;

export const agenda: readonly AgendaHour[] = [
  {
    id: "sat-hour-1",
    hour: "Saturday · Hour 1",
    title: "AI Foundations & Model Access",
    outcome:
      "Ground yourself in how agentic AI thinks, decides, and acts — then secure the free open-source model API keys that power every build this weekend. You leave knowing why agents replace tasks, not just answers, and ready to ship.",
  },
  {
    id: "sat-hour-2",
    hour: "Saturday · Hour 2",
    title: "Q&A Chatbot & AI Content Creator Assistant",
    outcome:
      "Ship your first two production agents. Build a Q&A chatbot — user input in, language model out, answer delivered — the clean three-step pipeline every agent runs on. Then wire an intent-routing content engine that classifies the ask and returns publish-ready social posts with hooks, CTAs, and hashtags, or professional ad copy with headlines and emotional triggers. Both go live before the hour ends.",
  },
  {
    id: "sat-hour-3",
    hour: "Saturday · Hour 3",
    title: "AI Resume Reviewer",
    outcome:
      "Build and publish your AI Resume Reviewer. Upload a CV and route the request — full review, summary, cover letter, interview prep, or career advice. The pipeline extracts the document, analyzes each section, and returns improvement suggestions you can apply immediately. Live and accessible by session close.",
  },
  {
    id: "sun-hour-1",
    hour: "Sunday · Hour 1",
    title: "GitHub, IDEs & App Builders",
    outcome:
      "Before your final build, understand the modern stack behind real AI products — version control with GitHub, the IDE platforms where software gets written, and visual app builders that turn ideas into shippable products. The foundation that separates a weekend experiment from something the world can use.",
  },
  {
    id: "sun-hour-2",
    hour: "Sunday · Hour 2",
    title: "Voice News Intelligence Briefing",
    outcome:
      "Create your Voice News Intelligence Briefing — a voice-first research app that scans the news, synthesizes what matters, and speaks a clear briefing back. Not a mockup on your screen. A real product, built from scratch and ready to share.",
  },
  {
    id: "sun-hour-3",
    hour: "Sunday · Hour 3",
    title: "Deploy Live",
    outcome:
      "Take your voice app from build to browser — deploy to a live URL, test every path end to end, and close the weekend with four production agents: a Q&A chatbot, a content creator, a resume reviewer, and a voice briefing anyone can open.",
  },
] as const;
