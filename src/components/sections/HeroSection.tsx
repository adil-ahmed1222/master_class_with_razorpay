"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { Container, EventTitle, Body, Eyebrow, Button, CountdownTimer, LiveSeatCounter } from "@/components/ui";
import { EventMeta } from "@/components/sections/EventMeta";
import { event } from "@/content/event";
import { scrollToRegister } from "@/lib/scroll-to-register";
import { scrollToDemo } from "@/lib/scroll-to-demo";

/**
 * HeroSection — the visual identity of the site (01/02/03/04/05/06).
 * Editorial dark-luxury layout: massive headline beside the story atmosphere
 * Site background in layout; hero owns legibility scrims + content.
 * LCP is hero TEXT (server-rendered); no WebGL on the critical path (10-performance).
 */

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};

function handleReserve() {
  scrollToRegister("hero");
}

function handleWatchDemo() {
  scrollToDemo("hero");
}

export function HeroSection() {
  const reduce = useReducedMotion();

  return (
    <section id="top" className="relative min-h-[100svh] overflow-hidden">
      {/* Legibility: keep the headline readable over the shared Core backdrop. */}
      <div
        aria-hidden
        className="absolute inset-0 bg-bg/10 lg:bg-[linear-gradient(to_right,rgb(5_5_5/0.35)_0%,rgb(5_5_5/0.15)_24%,transparent_58%)]"
      />
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-bg"
      />

      <Container className="relative z-10 flex min-h-[100svh] items-center pb-24 pt-28">
        <motion.div
          className="flex max-w-2xl flex-col gap-7"
          variants={container}
          initial={reduce ? false : "hidden"}
          animate="show"
        >
          <motion.div variants={item}>
            <Eyebrow tone="accent" withRule>
              {event.schedule.heroEyebrow}
            </Eyebrow>
          </motion.div>

          <motion.div variants={item}>
            <EventTitle size="xl" />
          </motion.div>

          <motion.div variants={item}>
            <Body size="lg" className="max-w-xl">
              {event.heroSubheadline}
            </Body>
          </motion.div>

          <motion.div variants={item}>
            <EventMeta />
          </motion.div>

          <motion.div variants={item} className="flex flex-wrap items-center gap-4">
            <Button size="lg" onClick={handleReserve}>
              {event.cta.primary}
            </Button>
            <Button size="lg" variant="ghost" onClick={handleWatchDemo}>
              {event.cta.secondary}
            </Button>
          </motion.div>

          <motion.div
            variants={item}
            className="mt-2 flex flex-col gap-6 border-t border-white/8 pt-8"
          >
            <div className="flex flex-col gap-3">
              <span className="font-sans text-overline uppercase text-text-2">
                Doors open in
              </span>
              <CountdownTimer
                target={event.startsAt}
                size="lg"
                ariaLabel={event.schedule.countdownAriaLabel}
              />
            </div>
            <LiveSeatCounter className="max-w-sm" />
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
}
