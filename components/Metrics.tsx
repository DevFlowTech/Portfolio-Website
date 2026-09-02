"use client";

import React, { useEffect, useRef, useState } from "react";
import ScrollReveal from "./ScrollReveal";
import TextScramble from "./TextScramble";
import { Calendar, Award, Briefcase, TrendingUp } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

interface MetricItem {
  id: string;
  targetValue: number;
  suffix: string;
  label: string;
  detail: string;
  icon: React.ReactNode;
}

const metricsList: MetricItem[] = [
  {
    id: "experience",
    targetValue: 1,
    suffix: "+",
    label: "Year of Experience",
    detail:
      "Delivering production web software, AI workflows, and technical SEO.",
    icon: <Calendar className="w-4 h-4 text-[#0f52ba]" />,
  },
  {
    id: "seo-projects",
    targetValue: 8,
    suffix: "+",
    label: "Client SEO Audits",
    detail:
      "Executed technical audit, schema implementation, and search optimizations.",
    icon: <Award className="w-4 h-4 text-[#0f52ba]" />,
  },
  {
    id: "client-projects",
    targetValue: 5,
    suffix: "+",
    label: "Client Applications",
    detail: "Full-stack development, custom solutions, and web deployments.",
    icon: <Briefcase className="w-4 h-4 text-[#0f52ba]" />,
  },
  {
    id: "cycle-reduction",
    targetValue: 40,
    suffix: "%",
    label: "Research Time Saved",
    detail: "Achieved via automated LLM entity-extraction pipelines.",
    icon: <TrendingUp className="w-4 h-4 text-[#0f52ba]" />,
  },
];

export default function Metrics() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [counts, setCounts] = useState<{ [key: string]: number }>({
    experience: 0,
    "seo-projects": 0,
    "client-projects": 0,
    "cycle-reduction": 0,
  });

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion) {
      setCounts({
        experience: 1,
        "seo-projects": 8,
        "client-projects": 5,
        "cycle-reduction": 40,
      });
      return;
    }

    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top 85%",
        once: true,
        onEnter: () => {
          metricsList.forEach((m) => {
            const obj = { val: 0 };
            gsap.to(obj, {
              val: m.targetValue,
              duration: 1.4,
              ease: "power2.out",
              onUpdate: () => {
                setCounts((prev) => ({
                  ...prev,
                  [m.id]: Math.floor(obj.val),
                }));
              },
            });
          });
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto border-t border-slate-200/80"
      aria-label="Key Execution Metrics"
    >
      <ScrollReveal yOffset={15}>
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-xs font-mono font-semibold uppercase tracking-wider text-[#64748b]">
            Key Execution Metrics
          </h2>
        </div>
      </ScrollReveal>

      {/* Clean 4-Column Metric Grid with Borderless Dividers */}
      <ScrollReveal
        staggerSelector=".metric-stat-item"
        stagger={0.08}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
      >
        {metricsList.map((m) => (
          <div
            key={m.id}
            className="metric-stat-item group pt-4 border-t border-slate-200/80 hover:border-[#0f52ba]/40 transition-colors flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-[#0f172a] group-hover:text-[#0f52ba] transition-colors uppercase tracking-wide">
                  <TextScramble text={m.label} triggerOnHover={true} />
                </span>
                <div className="p-1.5 rounded-md bg-slate-50 text-[#0f52ba] group-hover:bg-blue-50 group-hover:scale-110 transition-all duration-300">
                  {m.icon}
                </div>
              </div>

              {/* Large Clean Number */}
              <div className="text-4xl sm:text-5xl font-bold font-mono tracking-tight text-[#0f172a] my-2 group-hover:translate-x-0.5 transition-transform">
                <span>{counts[m.id] ?? 0}</span>
                <span className="text-[#0f52ba]">{m.suffix}</span>
              </div>
            </div>

            <p className="text-xs text-[#475569] leading-relaxed pt-2">
              {m.detail}
            </p>
          </div>
        ))}
      </ScrollReveal>
    </section>
  );
}
