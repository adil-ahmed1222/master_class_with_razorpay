"use client";

import { useRef, type RefObject } from "react";
import { Container, Display, Headline, Body, Eyebrow, Button, EventPrice, EventTitle } from "@/components/ui";
import {
  ScrollStory,
  StoryStage,
  useStoryProgress,
  usePrefersReducedMotion,
} from "@/components/motion";
import { useIsLgUp } from "@/components/motion/use-media-query";
import { EventMeta } from "@/components/sections/EventMeta";
import { BrandMark } from "@/components/sections/BrandLogos";
import { aiCompanies, aiCompaniesIntro, type AICompany } from "@/content/ai-companies";
import { event } from "@/content/event";
import { scrollToRegister } from "@/lib/scroll-to-register";
import { cn } from "@/lib/utils";

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
 * the background Core tints to it, capabilities pick it up. A scroll-synced "conductor"
 * marks the active chapter [data-active] so its brand reveal resolves (see globals.css)
 * — and a relay "bridge" line hands off from the previous company so the ecosystem
 * feels like it is evolving, not like slides changing.
 *
 * Reduced motion: ScrollStory degrades to a stacked, full-height vertical scroll; reveals
 * are forced visible; the scrub-driven register CTA is omitted.
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
  const registerCtaRef = useRef<HTMLDivElement>(null);

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

      <StoryConductor chapterRefs={chapterRefs} glowRef={glowRef} registerCtaRef={registerCtaRef} />

      {/* Chapter 1 — the opening statement */}
      <StoryStage
        index={0}
        className="z-10 items-center justify-center px-4 py-6 pb-8 sm:py-8 lg:pb-0"
      >
        <Container className="relative">
          <div className="mx-auto flex max-w-3xl flex-col items-center gap-7 text-center">
            <Eyebrow tone="accent" withRule>
              {aiCompaniesIntro.eyebrow}
            </Eyebrow>
            <Display as="h2" size="xl">
              {aiCompaniesIntro.headline}
            </Display>
            <Body size="lg" className="max-w-2xl">
              {aiCompaniesIntro.body}
            </Body>
          </div>
        </Container>
      </StoryStage>

      {/* Chapters 2–11 — one hero company at a time */}
      {aiCompanies.map((company, i) => (
        <StoryStage
          key={company.id}
          index={i + 1}
          className={cn(
            "z-10 items-center justify-center px-4",
            /* Reserve dock height only — keeps content centered without a dead zone */
            "pb-[calc(4.25rem+max(0.75rem,env(safe-area-inset-bottom)))]",
            "lg:pb-0",
          )}
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
            <EventTitle as="h2" size="l" />
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

      {/* Register CTA during company reveals (replaces progress rail) */}
      {!reduced && (
        <div
          ref={registerCtaRef}
          id="ai-companies-register-cta"
          className="absolute inset-x-0 bottom-0 z-20 border-t border-white/10 bg-bg/90 px-4 py-3 backdrop-blur-md pb-[max(0.75rem,env(safe-area-inset-bottom))] lg:bottom-8 lg:border-0 lg:bg-transparent lg:py-0 lg:backdrop-blur-none"
          style={{ display: "none" }}
          aria-hidden
        >
          <Container className="p-0 lg:px-6">
            <div className="flex justify-center">
              <Button
                size="md"
                onClick={handleReserve}
                className="pointer-events-auto min-h-11 w-full max-w-md lg:min-h-12 lg:max-w-none lg:px-8"
              >
                <span className="inline-flex flex-wrap items-center justify-center gap-x-1.5 text-body lg:text-body-lg">
                  {event.cta.primaryWithPrice}
                  <EventPrice size="sm" />
                </span>
              </Button>
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
  registerCtaRef: RefObject<HTMLDivElement | null>;
};

/**
 * Headless: maps the story's smoothed scroll progress to the active company, toggling
 * [data-active] (brand reveal), tinting the Core, and showing the register CTA —
 * all imperatively, no per-frame React renders.
 */
function StoryConductor({ chapterRefs, glowRef, registerCtaRef }: Refs) {
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
    }

    const showRegister = active >= 0.5 && active <= N + 0.5;
    if (registerCtaRef.current) {
      registerCtaRef.current.style.display = showRegister ? "block" : "none";
      registerCtaRef.current.setAttribute("aria-hidden", showRegister ? "false" : "true");
    }
  });

  return null;
}

/* --------------------------------- Chapters --------------------------------- */

function CompanyChapter({ company, position }: { company: AICompany; position: number }) {
  const { color } = company;
  return (
    <Container className="relative">
      <div className="bl-lockup mx-auto flex max-w-4xl flex-col items-center gap-4 text-center sm:gap-6">
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

        <ul className="flex max-w-full flex-wrap justify-center gap-2 sm:gap-2.5">
          {company.capabilities.map((capability) => (
            <li key={capability}>
              <span
                className="inline-block rounded-pill border px-3 py-1 font-sans text-caption text-text sm:px-4 sm:py-1.5"
                style={{ borderColor: `${color}55`, backgroundColor: `${color}14` }}
              >
                {capability}
              </span>
            </li>
          ))}
        </ul>

        <div
          className="mx-auto mt-0 max-w-xl border-l-2 pl-4 text-left sm:mt-1 sm:pl-5"
          style={{ borderColor: color }}
        >
          <p className="font-sans text-overline uppercase text-text-2">In this masterclass</p>
          <p className="font-sans text-caption text-text sm:text-body">{company.connection}</p>
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
