"use client";

import { useLayoutEffect, useState } from "react";
import { ScrollTrigger } from "@/components/motion/gsap";
import { Container } from "@/components/ui";
import { WorkflowDemoGate } from "@/components/workflow-demo/WorkflowDemoGate";
import { WorkflowDemoHeader } from "@/components/workflow-demo/WorkflowDemoHeader";
import { WorkflowOrbitalScrollView } from "@/components/workflow-demo/WorkflowOrbitalScrollView";
import { scrollToWorkflowTrack } from "@/lib/scroll-to-demo";

export function WorkflowDemoSection() {
  const [generated, setGenerated] = useState(false);

  useLayoutEffect(() => {
    if (!generated) return;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        scrollToWorkflowTrack(0.75);
        ScrollTrigger.refresh();
      });
    });
  }, [generated]);

  const handleGenerate = () => {
    setGenerated(true);
  };

  return (
    <section
      id="demo"
      aria-labelledby="workflow-demo-heading"
      className="relative scroll-mt-[var(--nav-h)]"
    >
      <div
        aria-hidden
        className="absolute inset-0 bg-bg/25 lg:bg-[linear-gradient(to_right,var(--color-bg)_0%,rgb(5_5_5/0.45)_24%,transparent_65%)]"
      />

      <Container className="relative py-16 sm:py-20 lg:py-section">
        <WorkflowDemoHeader variant="full" />
        {!generated ? (
          <WorkflowDemoGate onGenerate={handleGenerate} />
        ) : (
          <div className="mt-8 sm:mt-10 lg:mt-12">
            <WorkflowOrbitalScrollView />
          </div>
        )}
      </Container>
    </section>
  );
}
