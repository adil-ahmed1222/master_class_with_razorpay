"use client";

import { useEffect, useState } from "react";
import { Button, EventPrice } from "@/components/ui";
import { event } from "@/content/event";
import { scrollToRegister } from "@/lib/scroll-to-register";

/**
 * Mobile sticky CTA — visible site-wide except:
 * - Registration form in view (avoid duplicate CTAs on the form)
 * - Workflow orbital scroll track in view (immersive demo)
 * - AI companies section in view (uses its own in-section CTA + full-bleed story)
 */
export function MobileRegistrationBar() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const registerEl = document.getElementById("register-experience");
    const demoEl = document.getElementById("demo");
    const aiCompaniesSection = document.getElementById("ai-companies");

    let registerInView = false;
    let workflowInView = false;
    let aiCompaniesInView = false;

    const update = () => {
      setVisible(!registerInView && !workflowInView && !aiCompaniesInView);
    };

    const registerObserver = registerEl
      ? new IntersectionObserver(
          (entries) => {
            registerInView = entries.some((e) => e.isIntersecting);
            update();
          },
          { root: null, threshold: 0.12 },
        )
      : null;

    const aiCompaniesObserver = aiCompaniesSection
      ? new IntersectionObserver(
          (entries) => {
            aiCompaniesInView = entries.some((e) => e.isIntersecting);
            update();
          },
          { root: null, threshold: 0.08 },
        )
      : null;

    let workflowObserver: IntersectionObserver | null = null;

    const observeWorkflowTrack = (track: HTMLElement) => {
      workflowObserver?.disconnect();
      workflowObserver = new IntersectionObserver(
        (entries) => {
          workflowInView = entries.some((e) => e.isIntersecting);
          update();
        },
        { root: null, rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
      );
      workflowObserver.observe(track);
    };

    const attachWorkflowObserver = () => {
      const track = document.getElementById("workflow-demo-track");
      if (track) observeWorkflowTrack(track);
    };

    const demoMutation = demoEl
      ? new MutationObserver(() => {
          attachWorkflowObserver();
        })
      : null;

    if (registerEl && registerObserver) registerObserver.observe(registerEl);
    if (aiCompaniesSection && aiCompaniesObserver) aiCompaniesObserver.observe(aiCompaniesSection);
    if (demoEl && demoMutation) {
      demoMutation.observe(demoEl, { childList: true, subtree: true });
      attachWorkflowObserver();
    }

    update();

    return () => {
      registerObserver?.disconnect();
      aiCompaniesObserver?.disconnect();
      workflowObserver?.disconnect();
      demoMutation?.disconnect();
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-bg/95 p-4 pb-[max(1rem,env(safe-area-inset-bottom))] backdrop-blur-md lg:hidden"
      role="region"
      aria-label="Reserve your seat"
    >
      <Button
        size="lg"
        fullWidth
        className="min-h-12"
        onClick={() => scrollToRegister("mobile-sticky-bar")}
      >
        <span className="inline-flex flex-wrap items-center justify-center gap-x-1.5">
          {event.cta.primaryWithPrice}
          <EventPrice size="sm" />
        </span>
      </Button>
    </div>
  );
}
