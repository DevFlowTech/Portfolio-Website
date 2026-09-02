"use client";

import React, { useState } from "react";
import SectionHeading from "./SectionHeading";
import ScrollReveal from "./ScrollReveal";
import Card3DTilt from "./Card3DTilt";
import { capabilities, CapabilityPillar } from "@/data/capabilities";
import { Code2, Cpu, TrendingUp, CheckCircle, Layers } from "lucide-react";

export default function Capabilities() {
  const [activePillar, setActivePillar] = useState<string>("01");

  const getIcon = (name: string) => {
    switch (name) {
      case "Code2":
        return <Code2 className="w-5 h-5" />;
      case "Cpu":
        return <Cpu className="w-5 h-5" />;
      case "TrendingUp":
        return <TrendingUp className="w-5 h-5" />;
      default:
        return <Layers className="w-5 h-5" />;
    }
  };

  return (
    <section
      id="capabilities"
      className="py-24 md:py-32 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto border-t border-slate-200/80"
      aria-label="Core Capabilities"
    >
      <ScrollReveal yOffset={20}>
        <SectionHeading
          number="02"
          tag="Capabilities"
          title="Core engineering domains & services."
          subtitle="Delivering reliable full-stack applications, intelligent prompt workflows, and data-backed search architectures."
        />
      </ScrollReveal>

      {/* 3 Apple Pro Crystalline Feature Cards with 3D Tilt */}
      <ScrollReveal
        staggerSelector=".cap-col-item"
        stagger={0.12}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        {capabilities.map((pillar: CapabilityPillar) => {
          const isActive = activePillar === pillar.number;

          return (
            <Card3DTilt key={pillar.number} maxTilt={5} scaleOnHover={1.01}>
              <div
                onClick={() => setActivePillar(pillar.number)}
                onMouseEnter={() => setActivePillar(pillar.number)}
                className={`cap-col-item crystalline-card p-6 sm:p-8 cursor-pointer flex flex-col justify-between h-full group ${
                  isActive
                    ? "bg-white border-[#0f52ba]/40 shadow-lg shadow-blue-900/5"
                    : "bg-white/85"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="font-mono text-xs font-bold text-[#0f52ba]">
                      {pillar.number}.
                    </span>
                    <div
                      className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                        isActive
                          ? "bg-gradient-to-br from-[#0f52ba] to-[#2563eb] text-white shadow-md shadow-blue-700/20"
                          : "bg-blue-50 text-[#0f52ba]"
                      }`}
                    >
                      {getIcon(pillar.iconName)}
                    </div>
                  </div>

                  <p className="text-xs text-[#0f52ba] font-bold uppercase tracking-wider mb-1">
                    {pillar.subtitle}
                  </p>

                  <h3 className="text-2xl font-bold text-[#0a192f] tracking-tight mb-3">
                    {pillar.title}
                  </h3>

                  <p className="text-sm text-[#475569] leading-relaxed mb-6 font-normal">
                    {pillar.description}
                  </p>

                  {/* Sub-capabilities */}
                  <div className="space-y-2.5 mb-6 border-t border-slate-100 pt-5">
                    {pillar.capabilitiesList.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-2.5 text-xs sm:text-sm text-[#334155] font-medium"
                      >
                        <CheckCircle className="w-4 h-4 text-[#0f52ba] flex-shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Technologies */}
                <div className="pt-4 border-t border-slate-100">
                  <div className="flex flex-wrap gap-1.5">
                    {pillar.technologies.map((tech) => (
                      <span
                        key={tech}
                        className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                          isActive
                            ? "bg-blue-50 text-[#0f52ba] font-semibold border border-sapphire-200/80"
                            : "bg-slate-100 text-[#475569]"
                        }`}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Card3DTilt>
          );
        })}
      </ScrollReveal>
    </section>
  );
}
