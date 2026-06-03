/**
 * Workflow demo section — educational scroll story (Section 4).
 */

export const workflowDemoSection = {
  title: "Build Your First AI Employee",
  subtitle: "See how an AI Employee works step-by-step.",
  inputLabel: "Describe what your AI Employee should do",
  inputDefaultValue: "I want to qualify leads and generate personalized emails",
  generateLabel: "Generate Workflow",
  gate: {
    lead:
      "Describe the job once. Then follow a live lead from form submission to a Gmail draft—no code, just connected steps.",
    inputHelper: "Sample prompt for this demo. In the session you will wire your own.",
    previewTitle: "What this walkthrough covers",
    previewSteps: [
      "Input receives prompts",
      "Planner routes the work",
      "Retriever fetches knowledge",
      "Tools execute APIs",
      "Memory persists state",
      "Output streams the response",
    ] as const,
    generateHint: "Interactive demo · scroll the orbit to open each node one at a time",
  },
} as const;

export type WorkflowNode = {
  id: string;
  label: string;
  paragraphs: readonly string[];
  bullets?: readonly string[];
  closing?: string;
};

export const workflowNodes: readonly WorkflowNode[] = [
  {
    id: "webhook",
    label: "Webhook",
    paragraphs: [
      "This is where everything begins.",
      "Whenever a lead submits a form, the information is instantly received by your AI Employee.",
      "Think of it as the entry point of the workflow.",
    ],
    closing: "Scroll down to see what happens next.",
  },
  {
    id: "ai-agent",
    label: "AI Agent",
    paragraphs: ["The AI analyzes the lead.", "It understands:"],
    bullets: ["Name", "Company", "Requirements", "Priority"],
    closing:
      "Then it decides what action should happen next. Instead of manually reviewing every lead, the AI Employee does it automatically.",
  },
  {
    id: "telegram",
    label: "Telegram Notification",
    paragraphs: ["The AI instantly informs your team.", "You receive:"],
    bullets: ["Lead Score", "Priority Level", "Suggested Action"],
    closing: "You get this within seconds. No manual follow-up is required.",
  },
  {
    id: "email-generator",
    label: "Email Generator",
    paragraphs: ["The AI creates a personalized email.", "Every message is generated using:"],
    bullets: ["Lead Information", "Business Context", "Desired Outcome"],
    closing: "Each email is unique.",
  },
  {
    id: "gmail",
    label: "Gmail Draft",
    paragraphs: ["The draft is automatically prepared.", "Your AI Employee has now:"],
    bullets: [
      "Received the lead",
      "Analyzed the lead",
      "Notified the team",
      "Written the email",
      "Created the draft",
    ],
    closing: "without any manual work.",
  },
] as const;

export const workflowComplete = {
  title: "Workflow Complete",
  body: "This is how an AI Employee works.",
  footnote:
    "During the masterclass, you will learn how to build workflows like this from scratch.",
} as const;
