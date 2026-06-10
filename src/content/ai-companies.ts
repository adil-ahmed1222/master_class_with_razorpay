/**
 * "The Companies Building the AI Future" (Section 5.5) — a cinematic, scroll-driven
 * roll call where each company is INTRODUCED as a brand reveal, not explained as a card.
 *
 * Order IS the narrative order. Each entry carries its own identity (brand `color`),
 * `personality` (so no two chapters feel the same), an editorial `essence`, the
 * `capabilities` that unfold, a `connection` that ties the company back to the
 * masterclass ("why this matters to me"), and a `bridge` line that hands off from the
 * previous company (the relay). `reveal` selects the brand-reveal motion.
 *
 * `color` is each company's official brand hue (used for the monumental logotype, the
 * background Core tint, accents and the progress rail). Where an exact official MARK is
 * reliably reproducible (OpenAI, Google, Microsoft) it is rendered in BrandLogos; every
 * other company is introduced by its official brand-color logotype (its name set in its
 * own colour) — real brand identity, never a generic icon. A real SVG mark can be added
 * to BrandLogos later without touching this data.
 */

export type RevealKind = "assemble" | "rise" | "draw";

export interface AICompany {
  id: string;
  name: string;
  /** Compact mark used in the ensemble tile when no official SVG logo exists. */
  monogram: string;
  /** Official brand hue — drives logotype, Core tint, accents, progress. */
  color: string;
  /** Three-beat personality so each chapter feels distinct. */
  personality: string;
  /** One editorial line of context. */
  essence: string;
  capabilities: readonly string[];
  /** Why this company matters inside the masterclass. */
  connection: string;
  /** Relay hand-off from the previous chapter (omitted on the first). */
  bridge?: string;
  reveal: RevealKind;
}

export const aiCompanies: readonly AICompany[] = [
  {
    id: "openai",
    name: "OpenAI",
    monogram: "O",
    color: "#10A37F",
    personality: "Minimal · Clean · Reasoning-first",
    essence: "The lab that put generative AI in everyone's hands.",
    capabilities: ["GPT", "Reasoning", "Agents", "Automation"],
    connection:
      "The AI employee you build runs on these exact ideas — reasoning, memory, tool use and automation.",
    reveal: "assemble",
  },
  {
    id: "google",
    name: "Google",
    monogram: "G",
    color: "#4285F4",
    personality: "Broad · Colorful · Built across everything",
    essence: "Search and software, rebuilt around multimodal intelligence.",
    capabilities: ["Gemini", "Multimodal", "Search", "AI Infrastructure"],
    connection:
      "Multimodal AI is the new default — you'll build agents that work across text and data, not just chat.",
    bridge: "Reasoning learns to see, hear and speak.",
    reveal: "assemble",
  },
  {
    id: "anthropic",
    name: "Anthropic",
    monogram: "A",
    color: "#D97757",
    personality: "Thoughtful · Precise · Safety-first",
    essence: "Frontier reasoning, engineered to stay safe and steerable.",
    capabilities: ["Claude", "Reasoning", "Safety", "AI Assistants"],
    connection:
      "You'll design agents that reason carefully and stay in control — exactly how modern assistants are built.",
    bridge: "Raw capability meets responsibility.",
    reveal: "rise",
  },
  {
    id: "nvidia",
    name: "NVIDIA",
    monogram: "N",
    color: "#76B900",
    personality: "Powerful · Industrial · The engine underneath",
    essence: "The hardware powering modern AI.",
    capabilities: ["GPUs", "CUDA", "Training", "AI Infrastructure"],
    connection:
      "Every workflow you deploy in this masterclass runs on infrastructure like this.",
    bridge: "But none of it runs without raw compute.",
    reveal: "draw",
  },
  {
    id: "microsoft",
    name: "Microsoft",
    monogram: "MS",
    color: "#00A4EF",
    personality: "Enterprise · Platform · Deployed everywhere",
    essence: "Frontier AI woven into the tools enterprises already run.",
    capabilities: ["Copilot", "Azure AI", "Enterprise AI", "Agents"],
    connection:
      "You'll automate the same enterprise tools your team already lives in every day.",
    bridge: "Compute reaches the enterprise.",
    reveal: "assemble",
  },
  {
    id: "meta",
    name: "Meta",
    monogram: "M",
    color: "#0866FF",
    personality: "Open · Massive · Research at scale",
    essence: "Open models that put frontier AI within everyone's reach.",
    capabilities: ["Llama", "Open Models", "Research", "Scale"],
    connection:
      "Open models mean you can build a capable agent without a research lab behind you.",
    bridge: "Closed platforms give way to open models.",
    reveal: "rise",
  },
  {
    id: "perplexity",
    name: "Perplexity",
    monogram: "P",
    color: "#20B8CD",
    personality: "Search · Knowledge · Answers with sources",
    essence: "Answers with sources — AI reimagined as a research engine.",
    capabilities: ["AI Search", "Research", "Knowledge Retrieval"],
    connection:
      "Your agent will retrieve and cite real knowledge instead of guessing.",
    bridge: "Open knowledge becomes searchable truth.",
    reveal: "draw",
  },
  {
    id: "groq",
    name: "Groq",
    monogram: "G",
    color: "#F24E32",
    personality: "Fast · Silicon · Inference-first",
    essence: "Purpose-built LPUs that make AI inference radically faster.",
    capabilities: ["LPU", "Ultra-Fast Inference", "Low Latency", "Real-Time AI"],
    connection:
      "Your agent will respond in milliseconds — the speed modern workflows demand.",
    bridge: "Search needs answers that arrive instantly.",
    reveal: "rise",
  },
  {
    id: "huggingface",
    name: "Hugging Face",
    monogram: "HF",
    color: "#FFD21E",
    personality: "Community · Open source · Where AI ships",
    essence: "The open hub where the AI community ships together.",
    capabilities: ["Models", "Datasets", "Community", "Open Source AI"],
    connection:
      "You'll draw on the same open models and datasets the community ships every day.",
    bridge: "Speed meets the open model stack.",
    reveal: "assemble",
  },
  {
    id: "langchain",
    name: "LangChain",
    monogram: "LC",
    color: "#2E9E8F",
    personality: "Workflows · Orchestration · The agent's backbone",
    essence: "The framework that turns raw models into working agents.",
    capabilities: ["Agents", "Workflows", "RAG", "Orchestration"],
    connection:
      "This is the orchestration layer your AI employee is built on.",
    bridge: "Models become coordinated agents.",
    reveal: "draw",
  },
] as const;

/** Opening chapter — AI companies scroll story (Section 5.5). */
export const aiCompaniesIntro = {
  eyebrow: "The companies building the AI future",
  headline: "They Built the Stack. You're About to Meet It.",
  body:
    "A new generation of companies is redefining how humans work, learn, communicate, and build. Meet them — one at a time.",
} as const;
