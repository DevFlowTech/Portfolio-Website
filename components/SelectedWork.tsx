"use client";

import React, { useState, useRef, useEffect } from "react";
import SectionHeading from "./SectionHeading";
import ScrollReveal from "./ScrollReveal";
import Card3DTilt from "./Card3DTilt";
import { projects } from "@/data/projects";
import { CheckCircle2, FileCode2, Database, Cpu, Activity, ShieldCheck, Search } from "lucide-react";

export default function SelectedWork() {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const activeProject = projects[selectedIdx];

  const tabContainerRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [pillStyle, setPillStyle] = useState({ left: 0, width: 0, opacity: 0 });

  useEffect(() => {
    const currentTab = tabRefs.current[selectedIdx];
    if (currentTab && tabContainerRef.current) {
      const containerRect = tabContainerRef.current.getBoundingClientRect();
      const tabRect = currentTab.getBoundingClientRect();
      setPillStyle({
        left: tabRect.left - containerRect.left + tabContainerRef.current.scrollLeft,
        width: tabRect.width,
        opacity: 1,
      });
    }
  }, [selectedIdx]);

  const handleTabChange = (idx: number) => {
    if (idx === selectedIdx) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setSelectedIdx(idx);
      setIsTransitioning(false);
    }, 120);
  };

  const renderSubsystemVisual = (type: string) => {
    switch (type) {
      case "erp":
        return (
          <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between text-[#0f52ba] font-bold pb-2 border-b border-slate-100">
              <span className="flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5" />
                <span>INVENTORY_RECONCILE_ENGINE</span>
              </span>
              <span className="text-emerald-600 flex items-center gap-1 text-[11px]">
                <Activity className="w-3 h-3 animate-pulse" />
                <span>14,290 SKU SYNC</span>
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="p-2.5 rounded bg-slate-50 border border-slate-100">
                <span className="text-[#64748b] block text-[10px]">AUTH LAYER</span>
                <span className="text-[#0a192f] font-bold">JWT + RBAC Matrix</span>
              </div>
              <div className="p-2.5 rounded bg-slate-50 border border-slate-100">
                <span className="text-[#64748b] block text-[10px]">REST LATENCY</span>
                <span className="text-[#0f52ba] font-bold">&lt;14ms Response</span>
              </div>
            </div>
          </div>
        );
      case "healthcare-ai":
        return (
          <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between text-[#0f52ba] font-bold pb-2 border-b border-slate-100">
              <span className="flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5" />
                <span>CLAUDE_PROMPT_PIPELINE</span>
              </span>
              <span className="text-emerald-600 text-[11px] font-bold">HIPAA VERIFIED</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="p-2.5 rounded bg-slate-50 border border-slate-100">
                <span className="text-[#64748b] block text-[10px]">ENTITY EXTRACTION</span>
                <span className="text-[#0a192f] font-bold">Zero-Shot Chain</span>
              </div>
              <div className="p-2.5 rounded bg-slate-50 border border-slate-100">
                <span className="text-[#64748b] block text-[10px]">SCHEMA INJECTION</span>
                <span className="text-[#0f52ba] font-bold">Valid JSON-LD</span>
              </div>
            </div>
          </div>
        );
      case "real-estate":
        return (
          <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between text-[#0f52ba] font-bold pb-2 border-b border-slate-100">
              <span className="flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5" />
                <span>LIGHTHOUSE_VITALS_AUDIT</span>
              </span>
              <span className="text-emerald-600 font-bold text-[11px]">SCORE: 100/100</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="p-2.5 rounded bg-slate-50 border border-slate-100">
                <span className="text-[#64748b] block text-[10px]">LARGEST CONTENTFUL</span>
                <span className="text-[#0a192f] font-bold">LCP 0.8s</span>
              </div>
              <div className="p-2.5 rounded bg-slate-50 border border-slate-100">
                <span className="text-[#64748b] block text-[10px]">LAYOUT SHIFT</span>
                <span className="text-emerald-600 font-bold">CLS: 0.000</span>
              </div>
            </div>
          </div>
        );
      case "security-gate":
        return (
          <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between text-[#0f52ba] font-bold pb-2 border-b border-slate-100">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>GATE_QR_VALIDATOR</span>
              </span>
              <span className="text-emerald-600 text-[11px] font-bold">&lt;50ms AUTH</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="p-2.5 rounded bg-slate-50 border border-slate-100">
                <span className="text-[#64748b] block text-[10px]">PAYLOAD VERIFY</span>
                <span className="text-[#0a192f] font-bold">HMAC Signature</span>
              </div>
              <div className="p-2.5 rounded bg-slate-50 border border-slate-100">
                <span className="text-[#64748b] block text-[10px]">AUDIT LOGGING</span>
                <span className="text-[#0f52ba] font-bold">Realtime Node Log</span>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between text-[#0f52ba] font-bold pb-2 border-b border-slate-100">
              <span className="flex items-center gap-1.5">
                <Search className="w-3.5 h-3.5" />
                <span>LOCAL_SEARCH_DOMINANCE</span>
              </span>
              <span className="text-emerald-600 text-[11px] font-bold">90-DAY UPTICK</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="p-2.5 rounded bg-slate-50 border border-slate-100">
                <span className="text-[#64748b] block text-[10px]">GBP 3-PACK</span>
                <span className="text-[#0a192f] font-bold">Top 3 Rankings</span>
              </div>
              <div className="p-2.5 rounded bg-slate-50 border border-slate-100">
                <span className="text-[#64748b] block text-[10px]">SCHEMA TYPE</span>
                <span className="text-[#0f52ba] font-bold">LegalService JSON-LD</span>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <section
      id="work"
      className="py-24 md:py-32 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto border-t border-slate-200/80"
      aria-label="Selected Projects and Case Studies"
    >
      <ScrollReveal yOffset={20}>
        <SectionHeading
          number="03"
          tag="Case Studies"
          title="Selected engineering & search case studies."
          subtitle="Production web applications, healthcare prompt pipelines, and technical search optimizations built for real-world reliability."
        />
      </ScrollReveal>

      {/* Fluid Sliding Liquid Tab Navigator */}
      <ScrollReveal yOffset={15} delay={0.05}>
        <div
          ref={tabContainerRef}
          className="relative flex overflow-x-auto pb-2 mb-8 gap-1 border-b border-slate-200/80 scrollbar-none"
          role="tablist"
        >
          {/* Sliding Liquid Background Pill */}
          <div
            style={{
              transform: `translate3d(${pillStyle.left}px, 0, 0)`,
              width: `${pillStyle.width}px`,
              opacity: pillStyle.opacity,
              transition: "transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), width 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
            className="absolute bottom-0 h-[2px] bg-[#0f52ba] pointer-events-none z-10"
          />

          {projects.map((proj, idx) => (
            <button
              key={proj.id}
              ref={(el) => {
                tabRefs.current[idx] = el;
              }}
              role="tab"
              aria-selected={selectedIdx === idx}
              onClick={() => handleTabChange(idx)}
              className={`flex-shrink-0 px-4 py-2.5 text-xs sm:text-sm font-semibold transition-colors duration-150 flex items-center gap-2 cursor-pointer ${
                selectedIdx === idx
                  ? "text-[#0f52ba]"
                  : "text-[#64748b] hover:text-[#0a192f]"
              }`}
            >
              <span className="font-mono text-xs opacity-75">{proj.number}.</span>
              <span>{proj.title}</span>
            </button>
          ))}
        </div>
      </ScrollReveal>

      {/* Razor-Sharp Case Study Architecture Card */}
      <ScrollReveal yOffset={20} delay={0.1}>
        <Card3DTilt maxTilt={2} enableSpotlight={true} spotlightColor="rgba(15, 82, 186, 0.05)" className="rounded-[24px]">
          <div
            data-cursor-view="true"
            className={`crystalline-card p-6 sm:p-9 bg-white shadow-lg shadow-blue-900/5 transition-opacity duration-150 ${
              isTransitioning ? "opacity-30" : "opacity-100"
            }`}
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left: Problem, Tagline & Features */}
              <div className="lg:col-span-7 space-y-6">
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono text-[#0f52ba] font-semibold mb-1.5">
                    <span>PROJECT {activeProject.number}</span>
                    <span className="text-slate-300">/</span>
                    <span className="uppercase text-[#64748b]">{activeProject.category}</span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-extrabold text-[#0a192f] tracking-tight mb-2">
                    {activeProject.title}
                  </h3>

                  <p className="text-sm font-semibold text-[#0f52ba] mb-3">
                    {activeProject.tagline}
                  </p>

                  <p className="text-sm text-[#475569] leading-relaxed">
                    {activeProject.description}
                  </p>
                </div>

                {/* Core Features */}
                <div className="space-y-2.5 pt-4 border-t border-slate-100">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#0a192f]">
                    Delivered Capabilities
                  </h4>
                  <div className="space-y-2">
                    {activeProject.features.map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#334155]">
                        <CheckCircle2 className="w-4 h-4 text-[#0f52ba] flex-shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Technologies */}
                <div className="pt-4 border-t border-slate-100">
                  <div className="flex flex-wrap gap-1.5">
                    {activeProject.technologies.map((t) => (
                      <span
                        key={t}
                        className="px-3 py-1 rounded-full text-xs font-mono bg-slate-100 text-[#0f52ba] font-semibold border border-slate-200/60"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right: Interactive Subsystem Visualization & Implementation Highlights */}
              <div className="lg:col-span-5 space-y-5">
                {/* Subsystem Schematic */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                  <span className="text-[11px] font-mono uppercase font-bold text-[#64748b] block">
                    Subsystem Architecture Schematic
                  </span>
                  {renderSubsystemVisual(activeProject.architectureType)}
                </div>

                {/* Implementation Highlights Box */}
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                  <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#0a192f] flex items-center gap-1.5">
                    <FileCode2 className="w-4 h-4 text-[#0f52ba]" />
                    <span>Technical Implementation Highlights</span>
                  </h4>
                  <ul className="space-y-2 text-xs text-[#475569]">
                    {activeProject.technicalHighlights.map((th, thIdx) => (
                      <li key={thIdx} className="flex items-start gap-2 leading-relaxed">
                        <span className="text-[#0f52ba] font-bold">›</span>
                        <span>{th}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Documented Outcome Banner */}
                {activeProject.metricsResult && (
                  <div className="p-4 rounded-2xl bg-blue-50/80 border border-blue-200 text-xs text-[#0a192f] shadow-xs">
                    <strong className="font-bold text-[#0f52ba] block mb-1">
                      Documented Impact
                    </strong>
                    <span className="text-[#334155] leading-relaxed">
                      {activeProject.metricsResult}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Card3DTilt>
      </ScrollReveal>
    </section>
  );
}
