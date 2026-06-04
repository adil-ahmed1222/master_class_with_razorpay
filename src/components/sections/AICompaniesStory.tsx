"use client";

import { useRef, type RefObject } from "react";
import { Container, Display, Headline, Body, Eyebrow, Button, EventPrice } from "@/components/ui";
import {
  ScrollStory,
  StoryStage,
  useStoryProgress,
  usePrefersReducedMotion,
} from "@/components/motion";
import { useIsLgUp } from "@/components/motion/use-media-query";
import { EventMeta } from "@/components/sections/EventMeta";
import { BrandMark } from "@/components/sections/BrandLogos";
import { aiCompanies, type AICompany } from "@/content/ai-companies";
import { event } from "@/content/event";
import { scrollToRegister } from "@/lib/scroll-to-register";
import { clamp, cn } from "@/lib/utils";

/**
 * AICompaniesStory — "The Companies Building the AI Future" (Section 5.5).
 *
 * A SCROLL-DRIVEN cinematic brand reveal (Apple keynote / OpenAI launch feel), never
 * hover-driven and identical on phone, tablet and desktop. One viewport is pinned and
 * 14 chapters cross-fade through it: an opening statement, ten companies introduced ONE
 * AT A TIME as monumental brand moments, the ensemble, the payoff, and the registration
 * bridge.
 *
 * Each company owns its identity: its official brand colour drives a monumental logotype,
 * the background Core tints to it, capabilities and the progress rail pick it up. A
 * scroll-synced "conductor" marks the active chapter [data-active] so its brand reveal
 * resolves (see globals.css) — and a relay "bridge" line hands off from the previous
 * company so the ecosystem feels like it is evolving, not like slides changing.
 *
 * Reduced motion: ScrollStory degrades to a stacked, full-height vertical scroll; reveals
 * are forced visible; the scrub-only progress rail is omitted.
 */

const STAGE_VH_DESKTOP = 72;
/** Shorter track on mobile so crossfades keep pace with touch scroll. */
const STAGE_VH_MOBILE = 50;
const DEFAULT_TINT = "#36e1ff"; // site accent — used outside the company range
const N = aiCompanies.length; // 10
const TOTAL_STAGES = N + 4; // intro + 10 + ensemble + payoff + cta = 14

/** Pin below fixed nav; use dvh so mobile browser chrome does not clip content. */
const AI_COMPANIES_STICKY =
  "sticky top-[var(--nav-h)] z-10 h-[calc(100dvh-var(--nav-h))] max-h-[calc(100dvh-var(--nav-h))] touch-pan-y overflow-hidden bg-bg";

function handleReserve() {
  scrollToRegister("ai-companies");
}

export function AICompaniesStory() {
  const reduced = usePrefersReducedMotion();
  const isLgUp = useIsLgUp();
  const chapterRefs = useRef<(HTMLDivElement | null)[]>([]);
  const glowRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const numRef = useRef<HTMLSpanElement>(null);
  const nameRef = useRef<HTMLSpanElement>(null);

  return (
    <ScrollStory
      stageCount={TOTAL_STAGES}
      stageVh={isLgUp ? STAGE_VH_DESKTOP : STAGE_VH_MOBILE}
      scrubSeconds={isLgUp ? 1 : 0.35}
      skipEntryFade
      stickyClassName={AI_COMPANIES_STICKY}
    >
      {/* Persistent background intelligence — the AI Core, zoomed out, tinting to the
          active company so the ecosystem visibly evolves as you move through it. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center"
      >
        <div className="animate-[nv-core-breathe_7s_ease-in-out_infinite]">
          <div
            ref={glowRef}
            className="size-[min(82vw,580px)] rounded-full"
            style={{
              color: DEFAULT_TINT,
              transition: "color 700ms ease",
              background:
                "radial-gradient(circle, color-mix(in srgb, currentColor 16%, transparent), color-mix(in srgb, currentColor 7%, transparent) 42%, transparent 70%)",
            }}
          />
        </div>
      </div>

      <StoryConductor
        chapterRefs={chapterRefs}
        glowRef={glowRef}
        railRef={railRef}
        fillRef={fillRef}
        numRef={numRef}
        nameRef={nameRef}
      />

      {/* Chapter 1 — the opening statement */}
      <StoryStage
        index={0}
        className="z-10 items-center justify-center px-4 py-6 sm:py-8"
      >
        <Container className="relative">
          <div className="mx-auto flex max-w-3xl flex-col items-center gap-7 text-center">
            <Eyebrow tone="accent" withRule>
              The companies building the AI future
            </Eyebrow>
            <Display as="h2" size="xl">
              The AI Revolution Is Already Underway
            </Display>
            <Body size="lg" className="max-w-2xl">
              A new generation of companies is redefining how humans work, learn,
              communicate, and build. Meet them — one at a time.
            </Body>
          </div>
        </Container>
      </StoryStage>

      {/* Chapters 2–11 — one hero company at a time */}
      {aiCompanies.map((company, i) => (
        <StoryStage
          key={company.id}
          index={i + 1}
          className="z-10 items-center justify-center px-4 py-6 lg:py-0"
        >
          <div
            ref={(el) => {
              chapterRefs.current[i] = el;
            }}
            data-reveal={company.reveal}
            className="w-full"
          >
            <CompanyChapter company={company} position={i + 1} />
          </div>
        </StoryStage>
      ))}

      {/* Chapter 12 — the ensemble: one ecosystem */}
      <StoryStage
        index={N + 1}
        className={cn(
          "z-10 items-start justify-start",
          "px-4 pt-2 pb-[max(1.25rem,env(safe-area-inset-bottom))]",
          "lg:items-center lg:justify-center lg:px-0 lg:py-0",
        )}
      >
        <EnsembleChapter />
      </StoryStage>

      {/* Chapter 13 — narrative payoff */}
      <StoryStage index={N + 2} className="z-10 justify-center">
        <Container className="relative">
          <div className="mx-auto flex max-w-4xl flex-col items-center gap-8 text-center">
            <Display as="h2" size="l">
              This Masterclass Is Not About Learning A Tool.{" "}
              <span className="text-accent">It Is About Understanding The Ecosystem.</span>
            </Display>
            <Body size="lg" className="mx-auto max-w-2xl">
              Learn how AI agents, automation systems, workflows, and modern AI
              infrastructure work together.
            </Body>
          </div>
        </Container>
      </StoryStage>

      {/* Chapter 14 — the natural conclusion: register */}
      <StoryStage index={N + 3} className="z-10 justify-center">
        <Container className="relative">
          <div className="mx-auto flex max-w-2xl flex-col items-center gap-8 text-center">
            <Eyebrow tone="accent" withRule>
              Your place in it
            </Eyebrow>
            <Display as="h2" size="l">
              {event.title}
            </Display>
            <EventMeta className="justify-center" />
            <Button size="lg" onClick={handleReserve}>
              <span className="inline-flex flex-wrap items-center justify-center gap-x-1.5">
                {event.cta.primaryWithPrice}
                <EventPrice size="sm" />
              </span>
            </Button>
          </div>
        </Container>
      </StoryStage>

      {/* Continuous progress rail (scrub-driven; omitted under reduced motion) */}
      {!reduced && (
        <div
          ref={railRef}
          className="pointer-events-none absolute inset-x-0 bottom-8 z-20 opacity-0 transition-opacity duration-500"
        >
          <Container>
            <div className="flex items-center gap-4">
              <span className="font-display text-caption tabular-nums text-text">
                <span ref={numRef}>01</span>
                <span className="text-text-2"> / {String(N).padStart(2, "0")}</span>
              </span>
              <div className="relative h-px flex-1 overflow-hidden bg-white/12">
                <div
                  ref={fillRef}
                  className="absolute inset-y-0 left-0 w-full origin-left"
                  style={{ transform: "scaleX(0)", backgroundColor: DEFAULT_TINT }}
                />
              </div>
              <span
                ref={nameRef}
                className="font-sans text-caption uppercase tracking-[0.16em] text-text-2"
              >
                OpenAI
              </span>
            </div>
          </Container>
        </div>
      )}
    </ScrollStory>
  );
}

/* -------------------------------- Conductor -------------------------------- */

type Refs = {
  chapterRefs: RefObject<(HTMLDivElement | null)[]>;
  glowRef: RefObject<HTMLDivElement | null>;
  railRef: RefObject<HTMLDivElement | null>;
  fillRef: RefObject<HTMLDivElement | null>;
  numRef: RefObject<HTMLSpanElement | null>;
  nameRef: RefObject<HTMLSpanElement | null>;
};

/**
 * Headless: maps the story's smoothed scroll progress to the active company, toggling
 * [data-active] (brand reveal), tinting the Core, and advancing the progress rail —
 * all imperatively, no per-frame React renders.
 */
function StoryConductor({ chapterRefs, glowRef, railRef, fillRef, numRef, nameRef }: Refs) {
  const lastIndex = useRef(-2);
  const span = TOTAL_STAGES - 1;

  useStoryProgress((p) => {
    const active = p * span; // 0..(TOTAL-1)
    const nearest = Math.round(active);
    const inCompanies = nearest >= 1 && nearest <= N;

    if (nearest !== lastIndex.current) {
      lastIndex.current = nearest;
      const companyIndex = nearest - 1; // valid only when inCompanies

      chapterRefs.current?.forEach((el, i) => {
        el?.setAttribute("data-active", String(i === companyIndex));
      });

      const c = inCompanies ? aiCompanies[companyIndex] : undefined;
      if (glowRef.current) glowRef.current.style.color = c?.color ?? DEFAULT_TINT;

      if (c) {
        if (numRef.current) numRef.current.textContent = String(nearest).padStart(2, "0");
        if (nameRef.current) nameRef.current.textContent = c.name;
        if (fillRef.current) fillRef.current.style.backgroundColor = c.color;
      }
    }

    // Continuous fill across the ten company chapters (stages 1..N).
    const railProgress = clamp((active - 1) / (N - 1), 0, 1);
    if (fillRef.current) fillRef.current.style.transform = `scaleX(${railProgress})`;

    const show = active >= 0.5 && active <= N + 0.5;
    if (railRef.current) railRef.current.style.opacity = show ? "1" : "0";
  });

  return null;
}

/* --------------------------------- Chapters --------------------------------- */

function CompanyChapter({ company, position }: { company: AICompany; position: number }) {
  const { color } = company;
  return (
    <Container className="relative">
      <div className="bl-lockup mx-auto flex max-w-4xl flex-col items-center gap-5 text-center sm:gap-6">
        {company.bridge ? (
          <p
            className="font-sans text-caption uppercase tracking-[0.18em]"
            style={{ color }}
          >
            {company.bridge}
          </p>
        ) : (
          <p className="font-sans text-caption uppercase tracking-[0.18em] text-text-2">
            {`Introducing · ${String(position).padStart(2, "0")} of ${String(N).padStart(2, "0")}`}
          </p>
        )}

        <p className="font-sans text-overline uppercase tracking-[0.22em] text-text-2">
          {company.personality}
        </p>

        <BrandMark
          id={company.id}
          color={color}
          className={cn(
            "h-12 w-12 sm:h-[4.5rem] sm:w-[4.5rem]",
            company.id === "groq" && "h-14 w-14 sm:h-[4.5rem] sm:w-[4.5rem]",
          )}
        />

        <Display as="h3" size="xl" style={{ color }} className="leading-[0.95]">
          {company.name}
        </Display>

        <Body size="lg" className="hidden max-w-2xl sm:block">
          {company.essence}
        </Body>

        <ul className="flex flex-wrap justify-center gap-2.5">
          {company.capabilities.map((capability) => (
            <li key={capability}>
              <span
                className="inline-block rounded-pill border px-4 py-1.5 font-sans text-caption text-text"
                style={{ borderColor: `${color}55`, backgroundColor: `${color}14` }}
              >
                {capability}
              </span>
            </li>
          ))}
        </ul>

        <div
          className="mx-auto mt-1 max-w-xl border-l-2 pl-5 text-left"
          style={{ borderColor: color }}
        >
          <p className="font-sans text-overline uppercase text-text-2">In this masterclass</p>
          <p className="font-sans text-body text-text">{company.connection}</p>
        </div>
      </div>
    </Container>
  );
}

function EnsembleChapter() {
  return (
    <Container className="relative w-full">
      <div className="flex flex-col gap-6 sm:gap-10 lg:gap-12">
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-3 text-center sm:gap-4">
          <Eyebrow tone="accent" withRule>
            One ecosystem
          </Eyebrow>
          <Headline
            size="h2"
            className="text-balance text-[clamp(1.25rem,5vw,2.75rem)] leading-tight"
          >
            Together, they are shaping the future of AI.
          </Headline>
        </div>
        <ul className="grid grid-cols-2 items-start gap-x-5 gap-y-6 sm:grid-cols-3 sm:gap-x-8 sm:gap-y-8 lg:grid-cols-5 lg:gap-y-10">
          {aiCompanies.map((company) => (
            <li key={company.id} className="flex flex-col items-center gap-2 text-center sm:gap-3">
              {/* Uniform logo tile so every cell is the same height and names always
                  align: official mark where we have one, brand-colour monogram otherwise. */}
              <span className="grid size-12 place-items-center rounded-xl border border-white/10 bg-white/[0.04] p-2 sm:size-14">
                <BrandMark
                  id={company.id}
                  color={company.color}
                  static
                  className={cn(
                    "h-7 w-7 sm:h-8 sm:w-8",
                    company.id === "groq" && "h-7 w-7 sm:h-8 sm:w-8",
                    company.id === "google" && "h-7 w-7 sm:h-8 sm:w-8",
                  )}
                />
              </span>
              <span
                className="font-display text-sm font-semibold sm:text-body-lg"
                style={{ color: company.color }}
              >
                {company.name}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </Container>
  );
}
