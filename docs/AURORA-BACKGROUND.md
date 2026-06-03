# Aurora Background

A Next.js demo of the [Aceternity UI Aurora Background](https://ui.aceternity.com/components/aurora-background): a full-viewport animated background with soft blue and violet light streaks on a dark `zinc-950` base, plus centered hero copy and a pill button.

## Overview

| Item | Detail |
|------|--------|
| Framework | Next.js 16 (App Router) |
| Styling | Tailwind CSS v4 |
| Theme | Dark-only (`bg-zinc-950`, white text) |
| Animation | `aurora` keyframes (60s linear infinite) |

## How it works

1. **Base layer** — `bg-zinc-950` fills the viewport.
2. **Gradient variables** — CSS custom properties define repeating stripe gradients (`--dark-gradient`) and color bands (`--aurora`).
3. **Blur + blend** — The aurora layer uses `blur-[10px]` and `mix-blend-difference` on a `::after` pseudo-element for the soft beam look.
4. **Motion** — `after:animate-aurora` shifts `background-position` over 60 seconds.
5. **Mask** — Optional radial mask (`showRadialGradient`) fades the effect toward the edges.
6. **Content** — Children render above the effect with `relative z-10`.

## Project structure

```
nv_backgrounds/
├── app/
│   ├── globals.css          # Tailwind + aurora animation + color variables
│   ├── layout.tsx           # Root layout (dark theme)
│   └── page.tsx             # Demo page content
├── components/
│   └── ui/
│       └── aurora-background.tsx
├── lib/
│   └── utils.ts             # cn() helper
└── package.json
```

## Dependencies

```json
{
  "dependencies": {
    "clsx": "^2.1.1",
    "next": "16.2.7",
    "react": "19.2.4",
    "react-dom": "19.2.4",
    "tailwind-merge": "^3.6.0"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4",
    "tailwindcss": "^4",
    "typescript": "^5"
  }
}
```

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Component props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | — | Content centered over the background |
| `className` | `string` | — | Extra classes on the inner container |
| `showRadialGradient` | `boolean` | `true` | Applies radial mask to the aurora layer |
| `...props` | `HTMLDivElement` | — | Passed to the inner container `div` |

## Usage

```tsx
import { AuroraBackground } from "@/components/ui/aurora-background";

export default function Page() {
  return (
    <AuroraBackground>
      <div className="relative z-10 text-white">Your content</div>
    </AuroraBackground>
  );
}
```

---

## Full source code

### `components/ui/aurora-background.tsx`

```tsx
"use client";

import { cn } from "@/lib/utils";
import React, { ReactNode } from "react";

interface AuroraBackgroundProps extends React.HTMLProps<HTMLDivElement> {
  children: ReactNode;
  showRadialGradient?: boolean;
}

const auroraColorVars = {
  "--white": "#ffffff",
  "--black": "#000000",
  "--transparent": "transparent",
  "--blue-500": "#3b82f6",
  "--indigo-300": "#a5b4fc",
  "--blue-300": "#93c5fd",
  "--violet-200": "#ddd6fe",
  "--blue-400": "#60a5fa",
} as React.CSSProperties;

export const AuroraBackground = ({
  className,
  children,
  showRadialGradient = true,
  ...props
}: AuroraBackgroundProps) => {
  return (
    <main>
      <div
        className={cn(
          "relative flex flex-col h-[100vh] items-center justify-center bg-zinc-950 text-white transition-bg",
          className
        )}
        {...props}
      >
        <div className="absolute inset-0 overflow-hidden">
          <div
            style={auroraColorVars}
            //   I'm sorry but this is what peak developer performance looks like // trigger warning
            className={cn(
              `
            [--white-gradient:repeating-linear-gradient(100deg,var(--white)_0%,var(--white)_7%,var(--transparent)_10%,var(--transparent)_12%,var(--white)_16%)]
            [--dark-gradient:repeating-linear-gradient(100deg,var(--black)_0%,var(--black)_7%,var(--transparent)_10%,var(--transparent)_12%,var(--black)_16%)]
            [--aurora:repeating-linear-gradient(100deg,var(--blue-500)_10%,var(--indigo-300)_15%,var(--blue-300)_20%,var(--violet-200)_25%,var(--blue-400)_30%)]
            [background-image:var(--dark-gradient),var(--aurora)]
            [background-size:300%,_200%]
            [background-position:50%_50%,50%_50%]
            blur-[10px] filter
            after:content-[""] after:absolute after:inset-0 after:[background-image:var(--dark-gradient),var(--aurora)]
            after:[background-size:200%,_100%] 
            after:animate-aurora after:[background-attachment:fixed] after:mix-blend-difference
            pointer-events-none
            absolute -inset-[10px] opacity-50 will-change-transform`,

              showRadialGradient &&
                `[mask-image:radial-gradient(ellipse_at_100%_0%,black_10%,var(--transparent)_70%)]`
            )}
          ></div>
        </div>
        {children}
      </div>
    </main>
  );
};
```

### `lib/utils.ts`

```ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

### `app/globals.css`

```css
@import "tailwindcss";

@custom-variant dark (&:where(.dark, .dark *));

@theme inline {
  --animate-aurora: aurora 60s linear infinite;

  @keyframes aurora {
    from {
      background-position: 50% 50%, 50% 50%;
    }
    to {
      background-position: 350% 50%, 350% 50%;
    }
  }
}

:root {
  --white: #ffffff;
  --black: #000000;
  --transparent: transparent;
  --blue-500: #3b82f6;
  --indigo-300: #a5b4fc;
  --blue-300: #93c5fd;
  --violet-200: #ddd6fe;
  --blue-400: #60a5fa;
}

body {
  margin: 0;
  background: #09090b;
  color: #fafafa;
}
```

### `app/layout.tsx`

```tsx
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Aurora Background Demo",
  description: "Aurora background demo",
};

export const viewport: Viewport = {
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} dark h-full antialiased`}
      style={{ colorScheme: "dark" }}
    >
      <body className="min-h-full bg-zinc-950 text-white">{children}</body>
    </html>
  );
}
```

### `app/page.tsx`

```tsx
import { AuroraBackground } from "@/components/ui/aurora-background";

export default function Home() {
  return (
    <AuroraBackground>
      <div className="relative z-10 flex flex-col items-center gap-4 px-4 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-white md:text-7xl">
          Background lights are cool you know.
        </h1>
        <p className="font-extralight text-lg text-neutral-200 md:text-2xl">
          And this, is chemical burn.
        </p>
        <button
          type="button"
          className="mt-6 rounded-full bg-white px-6 py-3 text-sm font-medium text-zinc-950 transition hover:bg-neutral-200 md:text-base"
        >
          Debug now
        </button>
      </div>
    </AuroraBackground>
  );
}
```

### `package.json`

```json
{
  "name": "nv_backgrounds",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint"
  },
  "dependencies": {
    "clsx": "^2.1.1",
    "next": "16.2.7",
    "react": "19.2.4",
    "react-dom": "19.2.4",
    "tailwind-merge": "^3.6.0"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4",
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "eslint": "^9",
    "eslint-config-next": "16.2.7",
    "tailwindcss": "^4",
    "typescript": "^5"
  }
}
```

---

## Customization

| Goal | Change |
|------|--------|
| Stronger beams | Raise `opacity-50` on the aurora `div` |
| Softer blur | Increase `blur-[10px]` to `blur-[16px]` |
| Disable edge fade | `<AuroraBackground showRadialGradient={false}>` |
| Different colors | Edit `auroraColorVars` in `aurora-background.tsx` |
| Light mode | Restore `dark:` variants and use `bg-zinc-50` with `invert` on the aurora layer (see [Aceternity docs](https://ui.aceternity.com/components/aurora-background)) |

## Credits

Based on the Aurora Background component by [Aceternity UI](https://ui.aceternity.com/components/aurora-background), ideated by Akshith Pottigari.
