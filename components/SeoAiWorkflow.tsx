"use client";

import React from "react";
import ScrollReveal from "./ScrollReveal";
import {
  Search,
  Compass,
  FileQuestion,
  FileCode,
  ShieldCheck,
  LineChart,
} from "lucide-react";

interface WorkflowStep {
  step: string;
  name: string;
  desc: string;
  icon: React.ReactNode;
}

const steps: WorkflowStep[] = [
  {
    step: "01",
    name: "Search Query Clustering",
    desc: "Programmatic clustering of high-intent search queries by keyword difficulty and volume.",
    icon: <Search className="w-4 h-4 text-[#0f52ba]" />,
  },
  {
    step: "02",
    name: "Intent Classification",
    desc: "Segmenting queries into informational, commercial, and transactional search intents.",
    icon: <Compass className="w-4 h-4 text-[#0f52ba]" />,
  },
  {
    step: "03",
    name: "Semantic Gap Extraction",
    desc: "Corpus diffing across top-ranking competitors to discover missing topic entities.",
    icon: <FileQuestion className="w-4 h-4 text-[#0f52ba]" />,
  },
  {
    step: "04",
    name: "Structured Content Drafts",
    desc: "Generating structured, technically accurate drafts adhering to target heading hierarchies.",
    icon: <FileCode className="w-4 h-4 text-[#0f52ba]" />,
  },
  {
    step: "05",
    name: "Technical Schema Validation",
    desc: "Injecting Schema.org JSON-LD structured data and auditing Core Web Vitals impact.",
    icon: <ShieldCheck className="w-4 h-4 text-[#0f52ba]" />,
  },
  {
    step: "06",
    name: "Index & Rank Tracking",
    desc: "Monitoring Google Search Console indexing status and tracking organic impressions.",
    icon: <LineChart className="w-4 h-4 text-[#0f52ba]" />,
  },
];

export default function SeoAiWorkflow() {
  return (
    <section
      className="py-20 md:py-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto border-t border-slate-200/80"
      aria-label="SEO and AI Workflow Methodology"
    >
      <ScrollReveal yOffset={20}>
        <div className="mb-10 max-w-3xl">
          <div className="flex items-center gap-2 mb-3">
            <span className="font-mono text-xs font-semibold text-[#0f52ba]">
              05.
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#64748b]">
              Methodology
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0f172a]">
            Search engine optimization methodology.
          </h2>
          <p className="mt-3 text-base text-[#475569] leading-relaxed">
            A structured 6-stage lifecycle combining manual technical audits with programmatic AI research to maintain high search visibility and technical compliance.
          </p>
        </div>
      </ScrollReveal>

      {/* Clean 6-Step Grid */}
      <ScrollReveal
        staggerSelector=".seo-method-card"
        stagger={0.08}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
      >
        {steps.map((s) => (
          <div
            key={s.step}
            className="seo-method-card p-5 rounded-xl border border-slate-200/80 bg-white hover:border-slate-300 transition-all duration-200"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono font-semibold text-[#0f52ba]">
                STEP {s.step}
              </span>
              <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-[#0f52ba]">
                {s.icon}
              </div>
            </div>

            <h3 className="text-base font-bold text-[#0f172a] mb-1.5">
              {s.name}
            </h3>

            <p className="text-xs text-[#475569] leading-relaxed font-normal">
              {s.desc}
            </p>
          </div>
        ))}
      </ScrollReveal>
    </section>
  );
}
