"use client";

import React, { useState } from "react";
import SectionHeading from "./SectionHeading";
import ScrollReveal from "./ScrollReveal";
import { experienceData, ExperienceItem } from "@/data/experience";
import { Building2, Calendar, MapPin, CheckCircle2, ChevronDown } from "lucide-react";

export default function Experience() {
  const [expandedId, setExpandedId] = useState<string>(experienceData[0].id);

  return (
    <section
      id="experience"
      className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto border-t border-slate-200/80"
      aria-label="Professional Experience"
    >
      <ScrollReveal yOffset={20}>
        <SectionHeading
          number="07"
          tag="Experience"
          title="Professional work history & milestones."
          subtitle="A track record of engineering full-stack applications, managing technical SEO campaigns, and executing automated data workflows."
        />
      </ScrollReveal>

      {/* Clean Milestone Timeline */}
      <ScrollReveal
        staggerSelector=".exp-timeline-item"
        stagger={0.12}
        className="space-y-6"
      >
        {experienceData.map((item: ExperienceItem, index: number) => {
          const isExpanded = expandedId === item.id;

          return (
            <div
              key={item.id}
              onClick={() => setExpandedId(isExpanded ? "" : item.id)}
              className={`exp-timeline-item p-6 sm:p-7 rounded-xl border transition-all duration-200 cursor-pointer ${
                isExpanded
                  ? "border-[#0f52ba]/50 bg-white shadow-sm"
                  : "border-slate-200/80 bg-slate-50/50 hover:bg-white hover:border-slate-300"
              }`}
            >
              {/* Header */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="font-mono text-xs font-semibold text-[#0f52ba]">
                      ROLE {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="text-slate-300">·</span>
                    <span className="text-xs text-[#64748b] font-medium uppercase">
                      {item.type}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-[#0f172a] tracking-tight">
                    {item.role}
                  </h3>
                </div>

                <div className="flex flex-wrap items-center gap-2 text-xs text-[#475569]">
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 font-semibold text-[#0f172a]">
                    <Building2 className="w-3.5 h-3.5 text-[#0f52ba]" />
                    <span>{item.company}</span>
                  </div>

                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-slate-200 font-medium">
                    <Calendar className="w-3.5 h-3.5 text-[#0f52ba]" />
                    <span>{item.period}</span>
                  </div>

                  <div className="hidden sm:flex items-center gap-1 text-[#64748b]">
                    <MapPin className="w-3 h-3 text-[#0f52ba]" />
                    <span>{item.location}</span>
                  </div>

                  <div className={`p-1 rounded-full text-[#64748b] transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </div>
              </div>

              {/* Summary */}
              <p className="text-sm text-[#475569] leading-relaxed mb-4">
                {item.summary}
              </p>

              {/* Expandable Key Deliverables */}
              <div
                className={`grid transition-all duration-200 ease-in-out ${
                  isExpanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0 pointer-events-none"
                }`}
              >
                <div className="overflow-hidden">
                  <div className="space-y-2 pt-4 border-t border-slate-200">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-[#0f172a] mb-2">
                      Key Responsibilities & Deliverables
                    </h4>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-[#475569]">
                      {item.responsibilities.map((resp, rIdx) => (
                        <li key={rIdx} className="flex items-start gap-2 leading-relaxed">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#0f52ba] flex-shrink-0 mt-0.5" />
                          <span>{resp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Documented Outcome */}
                  {item.keyAchievement && (
                    <div className="mt-4 p-3.5 rounded-lg bg-blue-50/70 border border-blue-200 text-xs text-[#0f172a]">
                      <strong className="text-[#0f52ba] font-bold">Outcome: </strong>
                      <span>{item.keyAchievement}</span>
                    </div>
                  )}

                  {/* Tech Stack */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap gap-1.5">
                    {item.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-0.5 rounded text-[11px] font-mono bg-slate-100 text-[#475569]"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </ScrollReveal>
    </section>
  );
}
