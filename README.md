# NeuralVarsity — Agentic AI Masterclass Landing Page

Premium event-registration landing page for **Build Your First AI Employee** (4–5 Jul 2026 · two-day live online · ₹111). Its single job: convert visitors into registrants.

> Governance lives in `.cursor/rules/` (12 Context Engineering rules). Read those before contributing.

## Status

Production landing page — hero through registration, workflow demo, FAQ, and final CTA.

## Tech Stack

- **Next.js 16** (App Router) · **React 19** · **TypeScript** (strict)
- **Tailwind CSS v4** (CSS-first `@theme`, no `tailwind.config.js`)
- **GSAP + ScrollTrigger**, **Framer Motion**, **Lenis** (motion — later phase)
- **React Three Fiber + Three.js** (WebGPU-first 3D — later phase)
- **Zod** (validation) · **web-vitals** (perf reporting)

## Getting Started

```bash
npm install
cp .env.example .env.local   # then edit values
npm run dev                  # http://localhost:3000
```

Scripts: `dev`, `build`, `start`, `lint`, `typecheck`, `favicons`.

## Project Structure

```
src/
  app/            Router, root layout, global tokens (globals.css)
  components/     sections, ui, workflow-demo, forms, motion, background
  content/        Typed single-source content (event, agenda, faq, ...)
  lib/            fonts, env, utils, analytics, validation, countdown
scripts/          favicon generation
.cursor/rules/    Context Engineering rules (source of truth)
```

## Conventions

- Server Components by default; `"use client"` only at interactive/3D/motion leaves.
- Never hardcode event facts — import from `src/content/event.ts`.
- Reference design tokens (defined in `globals.css` `@theme`); never hardcode hexes.
- No PII in analytics events. Validate all external data with Zod.
- Honor `prefers-reduced-motion` and WebGPU→WebGL2→static fallbacks.
