"use client";

import React from "react";
import SectionHeading from "./SectionHeading";
import ScrollReveal from "./ScrollReveal";
import DriftGame3D from "./DriftGame3D";

export default function AgenticAILab() {
  return (
    <section
      id="ai-lab"
      className="py-24 md:py-32 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto border-t border-slate-200/80"
      aria-label="Interactive 3D Freeroam Drift Arena"
    >
      <ScrollReveal yOffset={20}>
        <SectionHeading
          number="04"
          tag="3D Freeroam Drift Arena"
          title="Apex Drift 3D: Open urban circuit & physics sandbox."
          subtitle="A realistic 60fps 3D WebGL drifting simulation with procedural asphalt textures, dynamic third-person chase camera physics, steerable front wheels, 3D tire smoke, and nitro boost."
        />
      </ScrollReveal>

      {/* 3D Apex Drift Arena Container */}
      <ScrollReveal yOffset={20} delay={0.1}>
        <DriftGame3D />
      </ScrollReveal>
    </section>
  );
}
