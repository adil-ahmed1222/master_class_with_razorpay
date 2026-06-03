import {
  Brain,
  Database,
  MessageSquare,
  Search,
  Sparkles,
  Wrench,
} from "lucide-react";
import type { TimelineItem } from "@/components/workflow-demo/RadialOrbitalTimeline";

/**
 * AI agent pipeline nodes — same data as docs/RADIAL_ORBITAL_TIMELINE.md (agent-timeline-demo).
 */
export const agentTimelineData: TimelineItem[] = [
  {
    id: 1,
    title: "Input",
    date: "2026-06-01",
    content:
      "Receives user prompts and normalizes context for downstream agent nodes.",
    category: "ingress",
    icon: MessageSquare,
    relatedIds: [2, 3],
    status: "completed",
    energy: 92,
  },
  {
    id: 2,
    title: "Planner",
    date: "2026-06-02",
    content:
      "Breaks goals into steps, selects tools, and routes work to specialized nodes.",
    category: "orchestration",
    icon: Brain,
    relatedIds: [1, 3, 4],
    status: "completed",
    energy: 88,
  },
  {
    id: 3,
    title: "Retriever",
    date: "2026-06-02",
    content:
      "Fetches relevant documents and embeddings from the knowledge store.",
    category: "rag",
    icon: Search,
    relatedIds: [2, 5],
    status: "in-progress",
    energy: 74,
  },
  {
    id: 4,
    title: "Tools",
    date: "2026-06-03",
    content:
      "Executes MCP and API tools; returns structured results to the planner.",
    category: "execution",
    icon: Wrench,
    relatedIds: [2, 6],
    status: "in-progress",
    energy: 65,
  },
  {
    id: 5,
    title: "Memory",
    date: "2026-06-03",
    content:
      "Persists session state, long-term facts, and vector indexes for recall.",
    category: "storage",
    icon: Database,
    relatedIds: [3, 6],
    status: "pending",
    energy: 45,
  },
  {
    id: 6,
    title: "Output",
    date: "2026-06-03",
    content:
      "Synthesizes final responses with citations and streams tokens to the client.",
    category: "egress",
    icon: Sparkles,
    relatedIds: [4, 5],
    status: "pending",
    energy: 38,
  },
];

export function buildWorkflowTimelineData(): TimelineItem[] {
  return agentTimelineData;
}
