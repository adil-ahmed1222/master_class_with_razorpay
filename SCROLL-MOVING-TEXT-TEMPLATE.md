# Scroll Moving Text — Sticky Anchor + Scrubbed Phrase Stack

> **Reusable template** for editorial scrollytelling: a fixed left headline and a right column where phrases fade and move vertically as the user scrolls — like completing one sentence beat by beat.
>
> **Live reference in this repo:** `#ai-shift` → `AIShiftSection.tsx`, `AIShiftStory.tsx`, `content/ai-shift.ts`

---

## What the user sees

As you scroll through the section:

1. **Left column stays pinned** — e.g. `Your agent can` never moves.
2. **Right column is a vertical stack** — one phrase per viewport height (`100dvh`).
3. **Each phrase animates when it crosses the viewport center:**
   - **Enter:** rises from below (`y: 40px`) while fading from `opacity: 0.15` → `1`
   - **Hold:** full white (or accent) at center
   - **Exit:** drifts up (`y: -40px`) while fading back to `0.15`
4. **The next phrase replaces the previous** — the reader perceives: *"Your agent can qualify leads."* → *"Your agent can draft emails."* → … → *"Your agent can do it all automatically."*

This is **not** a carousel or card swap. It is typography-driven scroll scrubbing.

---

## Architecture (three layers)

```
┌─────────────────────────────────────────────────────────────┐
│  OUTER WRAPPER (.ai-shift-outer)                            │
│  height = lineCount × 100dvh   ← creates scroll distance    │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  CSS GRID (2 columns, same on mobile + desktop)       │  │
│  │  ┌──────────────────┬────────────────────────────────┐│  │
│  │  │ LEFT (sticky)    │ RIGHT (tall stack)             ││  │
│  │  │ position: sticky │ line 1  100dvh                 ││  │
│  │  │ top: nav-height  │ line 2  100dvh                 ││  │
│  │  │ "Your agent can" │ line 3  100dvh                 ││  │
│  │  │                  │ …                              ││  │
│  │  └──────────────────┴────────────────────────────────┘│  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

| Layer | Role |
|-------|------|
| **Outer wrapper** | Tall scroll track. Height = `N lines × 100dvh`. Without this, sticky + per-line triggers have nothing to scrub through. |
| **Sticky left column** | Anchor text pinned under the nav for the entire section scroll. |
| **Right column lines** | Each line is one `<p>` with `height: 100dvh`. GSAP ScrollTrigger scrubs opacity + `y` per line. |

---

## ScrollTrigger logic (per line)

Each right-column line gets **its own** ScrollTrigger:

| Setting | Value | Why |
|---------|-------|-----|
| `trigger` | the line element | Animation is tied to that row entering/leaving center |
| `start` | `"top center"` | Beat begins when line top hits viewport center |
| `end` | `"bottom center"` | Beat ends when line bottom leaves center |
| `scrub` | `0.6` desktop / `0.2` touch | Smooth catch-up; tighter on mobile so text tracks the finger |
| `ease` | `"none"` on scroll proxy | Scroll position maps 1:1; easing lives inside the beat curve |

**Important:** Do **not** drive all lines from one outer ScrollTrigger with `progress × lineCount`. Scroll distance is `(N − 1) × viewport`, not `N × viewport`, so later lines will never reach full opacity. Per-line triggers avoid that bug.

---

## Beat curve (`lineVisualAt`)

Progress `t` goes from `0` → `1` while the line travels from `start` to `end`:

```
opacity
  1.0 ┤      ╭──────╮
      │     ╱        ╲
 0.15 ┤────╱          ╲────
      0   0.4          1.0   t (beat progress)
           ↑ hold at center ↑
```

| Phase | `t` range | Opacity | Y |
|-------|-----------|---------|---|
| Enter | `0 → 0.4` | `0.15 → 1` | `40px → 0` |
| Exit | `0.4 → 1` | `1 → 0.15` | `0 → -40px` |

Easing uses **power2.out** inside each phase for a premium feel (fast start, soft landing).

---

## Dependencies

```bash
npm install gsap
```

Optional but recommended in React/Next.js:

- `useIsomorphicLayoutEffect` — run GSAP after DOM paint, safe for SSR
- `usePrefersReducedMotion` — static fallback, no scrub
- `useIsCoarsePointer` or `(pointer: coarse)` — lower scrub on touch

Register ScrollTrigger once (client only):

```ts
// gsap.ts
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.config({ ignoreMobileResize: true });
  gsap.ticker.lagSmoothing(0);
}

export { gsap, ScrollTrigger };
```

On mobile, bridge **native scroll** to ScrollTrigger (do not run Lenis + touch scroll together):

```ts
window.addEventListener("scroll", () => {
  requestAnimationFrame(() => ScrollTrigger.update());
}, { passive: true });
```

---

## Content shape (copy as data)

```ts
// content/your-section.ts
export const anchor = {
  eyebrow: "The shift",
  headline: "Your agent can",
} as const;

export const phrases = [
  "qualify leads.",
  "draft emails.",
  "send follow-ups.",
  // …
] as const;

export const payoff = "do it all automatically." as const;

export const ALL_LINES = [...phrases, payoff];
```

---

## CSS (scroll track + GPU hints)

```css
/* Outer track: one viewport slice per line */
.ai-shift-outer {
  height: calc(var(--shift-lines, 7) * 100vh);
  height: calc(var(--shift-lines, 7) * 100dvh);
}

.ai-shift-line {
  transform: translate3d(0, 0, 0);
  backface-visibility: hidden;
}

/* will-change only on fine pointer — avoids mobile layer bloat */
@media (pointer: fine) {
  .ai-shift-line {
    will-change: transform, opacity;
  }
}

/* Reduced motion: show all lines, no transform */
@media (prefers-reduced-motion: reduce) {
  .ai-shift-line {
    opacity: 1 !important;
    transform: none !important;
  }
}
```

Set `--shift-lines` inline from React: `style={{ "--shift-lines": lineCount }}`.

---

## Full minimal template (vanilla HTML + GSAP)

Copy-paste starting point without React:

```html
<section id="scroll-text-section" aria-label="Scroll moving text demo">
  <div class="outer" style="--shift-lines: 4">
    <div class="grid">
      <aside class="anchor">
        <p class="eyebrow">The shift</p>
        <p class="headline">Your agent can</p>
      </aside>
      <div class="lines">
        <p class="line">qualify leads.</p>
        <p class="line">draft emails.</p>
        <p class="line">send follow-ups.</p>
        <p class="line line--accent">do it all automatically.</p>
      </div>
    </div>
  </div>
</section>

<style>
  :root { --nav-h: 4rem; }

  .outer {
    height: calc(var(--shift-lines) * 100dvh);
  }

  .grid {
    display: grid;
    grid-template-columns: minmax(0, 0.95fr) minmax(0, 1.05fr);
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1.5rem;
    align-items: start;
  }

  .anchor {
    position: sticky;
    top: var(--nav-h);
    height: calc(100dvh - var(--nav-h));
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .headline {
    font-size: clamp(2.5rem, 5vw, 5rem);
    font-weight: 700;
    letter-spacing: -0.02em;
    color: white;
  }

  .line {
    height: 100dvh;
    min-height: 100dvh;
    display: flex;
    align-items: center;
    font-size: clamp(2rem, 4vw, 4.5rem);
    font-weight: 700;
    letter-spacing: -0.02em;
    color: white;
    margin: 0;
  }

  .line--accent { color: #36e1ff; }
</style>

<script src="https://cdn.jsdelivr.net/npm/gsap@3/dist/gsap.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/gsap@3/dist/ScrollTrigger.min.js"></script>
<script>
  gsap.registerPlugin(ScrollTrigger);

  function power2Out(t) {
    t = Math.min(1, Math.max(0, t));
    return 1 - (1 - t) * (1 - t);
  }

  function lineVisualAt(t) {
    if (t <= 0.4) {
      const e = power2Out(t / 0.4);
      return { opacity: 0.15 + 0.85 * e, y: 40 * (1 - e) };
    }
    const e = power2Out((t - 0.4) / 0.6);
    return { opacity: 1 - 0.85 * e, y: -40 * e };
  }

  const scrub = window.matchMedia("(pointer: coarse)").matches ? 0.2 : 0.6;
  const lines = gsap.utils.toArray(".line");

  lines.forEach((line) => {
    gsap.set(line, { opacity: 0.15, y: 40, force3D: true });

    const proxy = { value: 0 };
    const setOpacity = gsap.quickSetter(line, "opacity");
    const setY = gsap.quickSetter(line, "y", "px");

    gsap.to(proxy, {
      value: 1,
      ease: "none",
      scrollTrigger: {
        trigger: line,
        start: "top center",
        end: "bottom center",
        scrub,
        invalidateOnRefresh: true,
      },
      onUpdate: () => {
        const v = lineVisualAt(proxy.value);
        setOpacity(v.opacity);
        setY(v.y);
      },
    });
  });

  ScrollTrigger.refresh();
</script>
```

---

## React / Next.js template (annotated)

### 1. Beat math (pure functions — testable, portable)

```tsx
function power2Out(t: number): number {
  const c = Math.min(1, Math.max(0, t));
  return 1 - (1 - c) * (1 - c);
}

/** Maps beat progress 0→1 to opacity + vertical offset. */
function lineVisualAt(t: number): { opacity: number; y: number } {
  const p = Math.min(1, Math.max(0, t));
  if (p <= 0.4) {
    const e = power2Out(p / 0.4);
    return { opacity: 0.15 + 0.85 * e, y: 40 * (1 - e) };
  }
  const e = power2Out((p - 0.4) / 0.6);
  return { opacity: 1 - 0.85 * e, y: -40 * e };
}
```

### 2. Scroll driver hook (one ScrollTrigger per line)

```tsx
function useLineScrollTriggers(
  scopeRef: RefObject<HTMLElement | null>,
  lineRefs: RefObject<(HTMLElement | null)[]>,
  scrubSeconds: number,
  enabled: boolean,
) {
  useIsomorphicLayoutEffect(() => {
    if (!enabled || !scopeRef.current) return;

    const lines = lineRefs.current.filter(Boolean) as HTMLElement[];
    if (!lines.length) return;

    const ctx = gsap.context(() => {
      lines.forEach((line) => {
        const setOpacity = gsap.quickSetter(line, "opacity");
        const setY = gsap.quickSetter(line, "y", "px");

        gsap.set(line, { opacity: 0.15, y: 40, force3D: true });

        const proxy = { value: 0 };
        const apply = (beat: number) => {
          const v = lineVisualAt(beat);
          setOpacity(v.opacity);
          setY(v.y);
        };

        gsap.to(proxy, {
          value: 1,
          ease: "none",
          scrollTrigger: {
            trigger: line,
            start: "top center",
            end: "bottom center",
            scrub: scrubSeconds,
            invalidateOnRefresh: true,
            fastScrollEnd: true,
          },
          onUpdate: () => apply(proxy.value),
        });

        apply(0);
      });

      ScrollTrigger.refresh();
    }, scopeRef);

    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("resize", refresh, { passive: true });
    window.visualViewport?.addEventListener("resize", refresh, { passive: true });

    return () => {
      window.removeEventListener("resize", refresh);
      window.visualViewport?.removeEventListener("resize", refresh);
      ctx.revert(); // kills all ScrollTriggers in this scope
    };
  }, [enabled, scopeRef, lineRefs, scrubSeconds]);
}
```

**Why `gsap.quickSetter`?** Updates DOM directly on each scrub tick — no React re-renders per frame.

**Why `gsap.context` + `ctx.revert()`?** Cleans up triggers on unmount / Strict Mode remount.

### 3. Layout JSX

```tsx
export function ScrollMovingText({ lines, anchor, scrubSeconds = 0.6 }) {
  const outerRef = useRef<HTMLDivElement>(null);
  const lineRefs = useRef<(HTMLParagraphElement | null)[]>([]);

  useLineScrollTriggers(outerRef, lineRefs, scrubSeconds, true);

  return (
    <div
      ref={outerRef}
      className="scroll-text-outer"
      style={{ "--shift-lines": lines.length } as CSSProperties}
    >
      <div className="scroll-text-grid">
        <aside className="scroll-text-anchor">
          <p className="headline">{anchor}</p>
        </aside>

        <div className="scroll-text-lines">
          {lines.map((text, i) => (
            <p
              key={text}
              ref={(el) => { lineRefs.current[i] = el; }}
              className="scroll-text-line"
            >
              {text}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
```

Sticky anchor classes (Tailwind example):

```
sticky top-[var(--nav-h)] h-[calc(100dvh-var(--nav-h))] self-start
```

Each line:

```
h-[100dvh] min-h-[100dvh] flex items-center
font-bold tracking-[-0.02em] text-[clamp(2rem,4vw,4.5rem)]
```

---

## Adaptation checklist (other projects)

| Step | Action |
|------|--------|
| 1 | Define `anchor` string + `phrases[]` (+ optional `payoff`) |
| 2 | Set `--shift-lines` = `phrases.length` (include payoff if used) |
| 3 | Build 2-column grid; left `position: sticky` |
| 4 | Stack right lines at `100dvh` each |
| 5 | Register GSAP ScrollTrigger once |
| 6 | One trigger per line: `top center` → `bottom center`, `scrub` |
| 7 | Map proxy `0→1` through `lineVisualAt()` |
| 8 | Touch: `scrub: 0.2`, native scroll → `ScrollTrigger.update()` |
| 9 | `prefers-reduced-motion`: static list, no scrub |
| 10 | `ScrollTrigger.refresh()` after fonts load and on resize |

---

## Tuning knobs

| Knob | Default | Effect |
|------|---------|--------|
| `SCRUB_DESKTOP` | `0.6` | Higher = more lag/smoothness on wheel |
| `SCRUB_COARSE` | `0.2` | Lower = snappier on touch |
| Enter/exit split | `0.4 / 0.6` | More hold at center vs faster crossfade |
| Y travel | `±40px` | Larger = more dramatic vertical motion |
| Inactive opacity | `0.15` | Lower = stronger focus on active line |
| Line height | `100dvh` | Shorter (e.g. `80dvh`) = faster pacing, less scroll |
| Payoff color | accent token | Last line visually “lands” the sentence |

---

## Accessibility

- **Reduced motion:** Render static two-column list; disable ScrollTrigger.
- **Screen readers:** Hidden `aria-live="polite"` span updating to full sentence when active phrase changes (optional enhancement).
- **Semantics:** One `<section aria-label="…">`; anchor is real text, not `aria-hidden`.
- **Contrast:** Active line white on dark bg; inactive at 15% opacity still has visible text nearby — do not rely on color alone for meaning.

---

## Files in this repo

| File | Purpose |
|------|---------|
| `src/components/sections/AIShiftStory.tsx` | Layout + GSAP hook + reduced-motion fallback |
| `src/components/sections/AIShiftSection.tsx` | Section shell + site background scrim |
| `src/content/ai-shift.ts` | Copy: anchor, phrases, payoff |
| `src/app/globals.css` | `.ai-shift-outer`, `.ai-shift-line` |
| `src/components/motion/gsap.ts` | ScrollTrigger registration |
| `src/components/motion/LenisProvider.tsx` | Native scroll bridge on touch |

---

## Common pitfalls

1. **Single outer trigger with `progress × N`** — later lines stay faded (opacity stuck at 0.15).
2. **Forgetting outer height** — sticky works but nothing scrubs; section feels static.
3. **Animating `color` every frame** — expensive on mobile; use CSS classes for active/inactive instead.
4. **Lenis + touch scroll together** — jank; use native scroll on `(pointer: coarse)`.
5. **No `ScrollTrigger.refresh()`** after layout/fonts — triggers fire at wrong positions.
6. **Stacking columns on mobile only** — changes the editorial layout; keep grid if you want parity.

---

*Template derived from the NeuralVarsity AI Shift section. Copy freely into other projects; swap copy, tokens, and nav height (`--nav-h`) as needed.*
