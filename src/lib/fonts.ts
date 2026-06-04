import { Space_Grotesk, Inter, Poppins } from "next/font/google";

/**
 * Font configuration (self-hosted via next/font — no FOIT, no layout shift).
 * Source of truth: .cursor/rules/03-design-system.mdc.
 * - Space Grotesk → display headlines only.
 * - Inter → body / UI.
 * - Poppins Bold → NeuralVarsity wordmark only.
 * Only the weights actually used are requested. Exposed as CSS variables that
 * globals.css maps to --font-display / --font-sans / --font-brand.
 */

export const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-space-grotesk",
  weight: ["500", "600", "700"],
});

export const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  weight: ["400", "500", "600"],
});

export const poppins = Poppins({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-poppins",
  weight: ["700"],
});

/** Combined font CSS variables to apply on <html>. */
export const fontVariables = `${spaceGrotesk.variable} ${inter.variable} ${poppins.variable}`;
