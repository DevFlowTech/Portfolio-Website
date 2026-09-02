"use client";

import React from "react";
import SectionHeading from "./SectionHeading";
import ScrollReveal from "./ScrollReveal";
import { GraduationCap, Award, CheckCircle2 } from "lucide-react";

export default function Education() {
  const certifications = [
    "MERN Stack Development Workshop",
    "Cybersecurity & Web Security Workshop",
    "Advanced Prompt Engineering for AI Applications",
    "Agentic AI Development Fundamentals",
  ];

  return (
    <section
      className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto border-t border-slate-200/80"
      aria-label="Academic Background and Certifications"
    >
      <ScrollReveal yOffset={20}>
        <SectionHeading
          number="08"
          tag="Credentials"
          title="Education & professional training."
          subtitle="Formal academic degrees in computer applications alongside specialized technical workshops."
        />
      </ScrollReveal>

      <ScrollReveal
        staggerSelector=".edu-item"
        stagger={0.1}
        className="grid grid-cols-1 lg:grid-cols-12 gap-6"
      >
        {/* Left Column: Degrees */}
        <div className="edu-item lg:col-span-7 space-y-4">
          <div className="p-6 rounded-xl border border-slate-200/80 bg-white">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-blue-50 text-[#0f52ba] flex items-center justify-center">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-mono font-medium text-[#64748b] block">
                    UNDERGRADUATE DEGREE
                  </span>
                  <h3 className="text-base font-bold text-[#0f172a]">
                    Bachelor of Computer Applications (BCA)
                  </h3>
                </div>
              </div>
              <span className="text-xs font-mono font-semibold text-[#0f52ba] px-2.5 py-1 rounded bg-slate-100">
                Exp. 2026
              </span>
            </div>
            <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-xs text-[#64748b]">
              <span className="font-semibold text-[#0f172a]">SVGU University</span>
              <span>Graduation: 2026</span>
            </div>
          </div>

          <div className="p-6 rounded-xl border border-slate-200/80 bg-white">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-blue-50 text-[#0f52ba] flex items-center justify-center">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-mono font-medium text-[#64748b] block">
                    TECHNICAL DIPLOMA
                  </span>
                  <h3 className="text-base font-bold text-[#0f172a]">
                    Diploma in Computer Engineering
                  </h3>
                </div>
              </div>
              <span className="text-xs font-mono font-semibold text-[#0f52ba] px-2.5 py-1 rounded bg-slate-100">
                2024
              </span>
            </div>
            <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-xs text-[#64748b]">
              <span className="font-semibold text-[#0f172a]">LJ University</span>
              <span>Graduated: 2024</span>
            </div>
          </div>
        </div>

        {/* Right Column: Certifications */}
        <div className="edu-item lg:col-span-5 p-6 rounded-xl border border-slate-200/80 bg-slate-50/50 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Award className="w-4 h-4 text-[#0f52ba]" />
              <h3 className="text-sm font-bold text-[#0f172a]">
                Specialized Certifications
              </h3>
            </div>

            <div className="space-y-2">
              {certifications.map((cert, index) => (
                <div
                  key={index}
                  className="flex items-start gap-2 p-2.5 rounded-lg bg-white border border-slate-200 text-xs text-[#0f172a] font-medium"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#0f52ba] flex-shrink-0 mt-0.5" />
                  <span>{cert}</span>
                </div>
              ))}
            </div>
          </div>

          <p className="mt-4 pt-3 border-t border-slate-200/60 text-[11px] text-[#64748b]">
            Continuous hands-on learning across modern web engineering and LLM tooling.
          </p>
        </div>
      </ScrollReveal>
    </section>
  );
}
