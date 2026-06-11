# AI Shift Section — Layout & Code Backup

> **Section:** “The Shift” (`#ai-shift`)  
> **Purpose:** Backup reference to recreate this section with the same layout, copy, and scroll-driven task animation.  
> **Snapshot:** NeuralVarsity masterclass landing page (June 2026).

---

## Visual layout (matches production)

```
┌─────────────────────────────────────────────────────────────────┐
│  [Nav: NeuralVarsity · Live Online · ₹111 · Reserve My Seat]   │
├──────────────────────────┬──────────────────────────────────────┤
│  THE SHIFT  (eyebrow)    │  Lead Qualification          MANUAL │
│                          │  You skim every inquiry…             │
│  What you do by hand     ├──────────────────────────────────────┤
│  today, your agent does  │  Email Drafting              MANUAL │
│  next — one task at a    │  …                                 │
│  time.                   ├──────────────────────────────────────┤
│                          │  (4 more rows, hairline dividers)    │
│  (left 5/12 cols)        │  (right 7/12 cols)                   │
└──────────────────────────┴──────────────────────────────────────┘
```

| Element | Spec |
|--------|------|
| **Layout** | Two-column grid on `lg+`: headline `col-span-5`, task list `col-span-7`. Stacks single column on mobile. |
| **Eyebrow** | `The shift` — accent tone, rule line (`Eyebrow tone="accent" withRule`) |
| **Headline** | `What you do by hand today, your agent does next — one task at a time.` — `Headline size="h2"` |
| **Task rows** | 6 items, `border-t border-white/8`, left accent bar on scroll, `MANUAL` → `AUTOMATED` crossfade |
| **Background** | Section scrim: `bg-bg/25` + desktop gradient overlay |
| **Scroll** | Pinned `ScrollStory` — tasks animate Manual → Automated as user scrolls (one row at a time) |

---

## File map

| File | Role |
|------|------|
| `src/components/sections/AIShiftSection.tsx` | Section shell, scrim, `ScrollStory` pin |
| `src/components/sections/AIShiftTasks.tsx` | Two-column UI + scroll-scrubbed row animation |
| `src/content/ai-shift.ts` | Task copy (6 items) |
| `src/components/motion/ScrollStory.tsx` | Pin + progress framework (dependency) |
| `src/components/ui/Container.tsx` | Max-width container |
| `src/components/ui/Typography.tsx` | `Eyebrow`, `Headline` |
| `src/app/page.tsx` | Mount inside `<StoryZone>` after registration |

---

## Dependencies

- **Scroll framework:** `ScrollStory`, `useStoryProgress` from `@/components/motion`
- **UI:** `Container`, `Eyebrow`, `Headline` from `@/components/ui`
- **Motion:** `usePrefersReducedMotion`, `useMediaQuery` (mobile track height)
- **Design tokens:** `--bg`, `--accent`, `--text`, `--text-2`, `--nav-h` (see `globals.css`)

---

## Page integration

```tsx
// src/app/page.tsx (inside StoryZone, after HeroRegistrationSection)
import { AIShiftSection } from "@/components/sections/AIShiftSection";

<StoryZone>
  <HeroSection />
  <HeroRegistrationSection />
  <AIShiftSection />
  {/* … */}
</StoryZone>
```

---

## Content — `src/content/ai-shift.ts`

```ts
/**
 * "The AI Shift" (Section 2) — reframed from a year timeline to the real shift:
 * the everyday tasks moving from manual work to AI-assisted work (08-copywriting).
 * No hype, no buzzwords — concrete jobs the attendee already recognises.
 */

export interface AutomationTask {
  id: string;
  task: string;
  /** How it gets done by hand today. */
  manual: string;
  /** How the agent handles it once built. */
  automated: string;
}

export const automationTasks: readonly AutomationTask[] = [
  {
    id: "lead-qualification",
    task: "Lead Qualification",
    manual: "You skim every inquiry and guess who is worth a reply.",
    automated: "The agent scores and prioritises each lead the moment it lands.",
  },
  {
    id: "email-drafting",
    task: "Email Drafting",
    manual: "You rewrite the same reply for the hundredth time.",
    automated: "A tailored draft is ready before you open the inbox.",
  },
  {
    id: "follow-ups",
    task: "Follow-Ups",
    manual: "You forget who to chase, and when.",
    automated: "Every follow-up is scheduled and sent on time, on its own.",
  },
  {
    id: "customer-support",
    task: "Customer Support",
    manual: "Repetitive questions eat your afternoons.",
    automated: "The agent answers the routine ones and escalates the rest.",
  },
  {
    id: "scheduling",
    task: "Scheduling",
    manual: "Six messages to land on one meeting slot.",
    automated: "The agent books the slot and sends the invite.",
  },
  {
    id: "research",
    task: "Research",
    manual: "Twenty tabs open to brief a single prospect.",
    automated: "A concise, sourced summary arrives in seconds.",
  },
] as const;
```

---

## Section shell — `src/components/sections/AIShiftSection.tsx`

```tsx
"use client";

import { ScrollStory } from "@/components/motion";
import { useMediaQuery } from "@/components/motion/use-media-query";
import { AIShiftTasks } from "@/components/sections/AIShiftTasks";

const STAGE_VH_DESKTOP = 100;
/** Shorter mobile track — same pinned scene, less finger travel (MOBILE-SCROLL-PERFORMANCE.md). */
const STAGE_VH_MOBILE = 78;

/**
 * Section 2 — The AI Shift. Not a year timeline and not an A→B slide: a single pinned
 * scene where the same six tasks progressively transform from manual to AI-assisted as
 * you scroll (see AIShiftTasks). ScrollStory provides the pin + smoothed progress;
 * ScrollStory drives section crossfades only (06-motion).
 */
export function AIShiftSection() {
  const coarsePointer = useMediaQuery("(pointer: coarse)", false);

  return (
    <section id="ai-shift" aria-label="The AI shift: from manual work to AI-assisted work" className="relative">
      <div
        aria-hidden
        className="absolute inset-0 bg-bg/25 lg:bg-[linear-gradient(to_right,var(--color-bg)_0%,rgb(5_5_5/0.45)_24%,transparent_65%)]"
      />
      <ScrollStory
        stageCount={5}
        stageVh={coarsePointer ? STAGE_VH_MOBILE : STAGE_VH_DESKTOP}
        skipEntryFade
        className="relative"
      >
        <div className="flex h-full items-center pt-[calc(var(--nav-h)+1rem)] pb-10">
          <AIShiftTasks />
        </div>
      </ScrollStory>
    </section>
  );
}
```

### ScrollStory parameters (this section)

| Prop | Value | Notes |
|------|-------|-------|
| `stageCount` | `5` | Tall scroll track = `stageCount × stageVh` svh |
| `stageVh` | `100` desktop / `78` mobile | Controls scroll distance through the animation |
| `skipEntryFade` | `true` | No fade-in when section pins |
| Pin padding | `pt-[calc(var(--nav-h)+1rem)]` | Clears fixed nav |

---

## Task list UI — `src/components/sections/AIShiftTasks.tsx`

```tsx
"use client";

import { type CSSProperties, useRef } from "react";
import { Container, Eyebrow, Headline } from "@/components/ui";
import { useStoryProgress } from "@/components/motion";
import { usePrefersReducedMotion } from "@/components/motion/use-prefers-reduced-motion";
import { automationTasks } from "@/content/ai-shift";

/**
 * AIShiftTasks — Section 2 as Apple-style product storytelling. The reader should feel
 * "I am watching my workload disappear," not "I am watching rows animate."
 *
 * Storyboard (scrubbed across one pinned scene):
 *  - Intro hold: all six tasks read Manual. Calm, equal, no motion → "my workload".
 *  - Then ONE task at a time: a subtle highlight crosses the row, "Manual" dissolves,
 *    "AUTOMATED" takes its place, and a thin accent edge fills in. Completed rows STAY
 *    completed — the accent accumulates down the list → growing momentum.
 *  - Outro hold: every task is automated — cumulative accent on the list only.
 *
 * Everything is driven by a single CSS var per row (--t) off the smoothed story
 * progress, so only one change happens at a time and the eye always tracks it.
 */

const N = automationTasks.length;
const INTRO = 0.1; // calm "this is my workload" hold
const OUTRO = 0.18; // final pause + Core settle
const SPAN = 1 - INTRO - OUTRO;
const SLOT = SPAN / N;
const GAP = 0.16; // flat band inside each slot → strictly one task transforms at a time

function smoothstep(x: number): number {
  const c = Math.min(1, Math.max(0, x));
  return c * c * (3 - 2 * c);
}

export function AIShiftTasks() {
  const rowRefs = useRef<(HTMLLIElement | null)[]>([]);
  const reduced = usePrefersReducedMotion();

  useStoryProgress((p) => {
    if (reduced) return; // static layout owns the reduced-motion state

    for (let i = 0; i < N; i++) {
      const row = rowRefs.current[i];
      if (!row) continue;
      const s0 = INTRO + i * SLOT + SLOT * GAP;
      const s1 = INTRO + (i + 1) * SLOT - SLOT * GAP;
      const t = smoothstep((p - s0) / (s1 - s0));
      row.style.setProperty("--t", String(t));
    }
  });

  return (
    <Container>
      {/* Two-column editorial layout: the headline sits BESIDE the list on desktop so
          the whole scene fits below the nav (no vertical clipping), without shrinking
          any type. Stacks on smaller screens. */}
      <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-16">
        <header className="flex flex-col gap-4 lg:col-span-5">
          <Eyebrow tone="accent" withRule>
            The shift
          </Eyebrow>
          <Headline size="h2">
            What you do by hand today, your agent does next — one task at a time.
          </Headline>
        </header>

        <ul className="flex flex-col lg:col-span-7">
          {automationTasks.map((task, i) => (
            <li
              key={task.id}
              ref={(el) => {
                rowRefs.current[i] = el;
              }}
              className="relative border-t border-white/8 py-4 pl-6"
              style={{ "--t": reduced ? 1 : 0 } as CSSProperties}
            >
              {/* Accent edge that fills in as the task is handed over (accumulates). */}
              <span
                aria-hidden
                className="absolute left-0 top-0 h-full w-[2px] bg-accent"
                style={{ opacity: "var(--t)" }}
              />

              {/* Subtle takeover highlight — only visible while this row transforms. */}
              {!reduced ? (
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-transparent via-accent/12 to-transparent"
                  style={{
                    transform: "translateX(calc(var(--t) * 240% - 70%))",
                    opacity: "calc(4 * var(--t) * (1 - var(--t)))",
                  }}
                />
              ) : null}

              <div className="relative flex flex-col gap-2">
                <div className="flex items-baseline justify-between gap-6">
                  <span className="font-sans text-body-lg font-medium text-text">
                    {task.task}
                  </span>
                  {reduced ? (
                    <span className="font-sans text-overline uppercase text-accent">
                      Automated
                    </span>
                  ) : (
                    <span className="relative inline-grid text-overline uppercase">
                      <span
                        className="col-start-1 row-start-1 whitespace-nowrap text-text-2"
                        style={{ opacity: "calc(1 - var(--t))" }}
                      >
                        Manual
                      </span>
                      <span
                        className="col-start-1 row-start-1 whitespace-nowrap text-accent"
                        style={{ opacity: "var(--t)" }}
                      >
                        Automated
                      </span>
                    </span>
                  )}
                </div>

                {reduced ? (
                  <div className="hidden flex-col gap-1 sm:flex">
                    <p className="font-sans text-body text-text-2">{task.manual}</p>
                    <p className="font-sans text-body text-text">{task.automated}</p>
                  </div>
                ) : (
                  <div className="relative hidden min-h-[2.5rem] sm:block">
                    <p
                      className="absolute inset-x-0 top-0 font-sans text-body text-text-2"
                      style={{ opacity: "calc(1 - var(--t))" }}
                    >
                      {task.manual}
                    </p>
                    <p
                      className="absolute inset-x-0 top-0 font-sans text-body text-text"
                      style={{ opacity: "var(--t)" }}
                    >
                      {task.automated}
                    </p>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </Container>
  );
}
```

---

## Animation model

Each list row exposes a CSS custom property `--t` from `0` (fully manual) to `1` (fully automated).

| Progress slice | Behavior |
|----------------|----------|
| `0 – 0.10` | Intro hold — all rows show Manual |
| `0.10 – 0.82` | Six slots — one row transforms at a time |
| `0.82 – 1.00` | Outro hold — all rows Automated |

**Per-row effects driven by `--t`:**
- Left `2px` accent bar opacity
- Sweeping highlight (`translateX` + bell-curve opacity)
- `Manual` / `Automated` label crossfade
- Manual vs automated description crossfade (`sm+` only)

**Reduced motion:** `--t` fixed at `1`; shows final Automated state and both description lines stacked.

---

## Tailwind / design tokens used

```css
/* From globals.css — required for faithful recreation */
--bg: #050505;
--accent: #36E1FF;
--text: #FFFFFF;
--text-2: #A8B0C0;
--nav-h: 4rem;
```

| Class | Purpose |
|-------|---------|
| `lg:grid-cols-12` | 12-column grid at desktop |
| `lg:col-span-5` / `lg:col-span-7` | Headline / list split |
| `border-t border-white/8` | Hairline row dividers |
| `text-body-lg font-medium` | Task title |
| `text-overline uppercase` | MANUAL / AUTOMATED label |
| `text-body text-text-2` | Manual description |
| `bg-accent` | Left progress bar |

---

## Minimal static version (no scroll)

If you only need the **layout from the screenshot** (all Manual, no scroll pin):

1. Omit `ScrollStory` wrapper — use a plain `<section>` with the scrim div.
2. Replace `AIShiftTasks` scroll logic with static markup: always show `Manual` and manual descriptions.
3. Or set `--t: 0` on every row and skip `useStoryProgress`.

```tsx
<section id="ai-shift" className="relative py-section">
  <div aria-hidden className="absolute inset-0 bg-bg/25 lg:bg-[linear-gradient(...)]" />
  <div className="relative pt-[calc(var(--nav-h)+1rem)]">
    <AIShiftTasks /> {/* with useStoryProgress disabled / --t: 0 */}
  </div>
</section>
```

---

## Checklist to recreate elsewhere

- [ ] Copy `ai-shift.ts` content
- [ ] Copy `AIShiftSection.tsx` + `AIShiftTasks.tsx`
- [ ] Ensure `ScrollStory` + `LenisProvider` (or native scroll bridge) exist
- [ ] Ensure `Eyebrow`, `Headline`, `Container` match design system
- [ ] Set `--nav-h` and mount below fixed nav
- [ ] Place inside story zone with site aurora/background if desired
- [ ] Test: scroll through section — rows flip one at a time
- [ ] Test: `prefers-reduced-motion` — all Automated, no scrub

---

*Generated from production codebase. Update this file if `AIShiftSection` or `AIShiftTasks` change.*
