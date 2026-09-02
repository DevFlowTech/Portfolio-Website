"use client";

import React, { useState, useRef, useEffect } from "react";
import SectionHeading from "./SectionHeading";
import ScrollReveal from "./ScrollReveal";
import Card3DTilt from "./Card3DTilt";
import { techCategories, TechCategory } from "@/data/techStack";

export default function TechStack() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const tabContainerRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [pillStyle, setPillStyle] = useState({ left: 0, width: 0, opacity: 0 });

  const categories = [{ id: "all", name: "All Domains" }, ...techCategories];
  const activeIdx = categories.findIndex((c) => c.id === selectedCategory);

  useEffect(() => {
    const currentTab = tabRefs.current[activeIdx];
    if (currentTab && tabContainerRef.current) {
      const containerRect = tabContainerRef.current.getBoundingClientRect();
      const tabRect = currentTab.getBoundingClientRect();
      setPillStyle({
        left: tabRect.left - containerRect.left + tabContainerRef.current.scrollLeft,
        width: tabRect.width,
        opacity: 1,
      });
    }
  }, [activeIdx]);

  const displayedCategories =
    selectedCategory === "all"
      ? techCategories
      : techCategories.filter((c) => c.id === selectedCategory);

  return (
    <section
      id="stack"
      className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto border-t border-slate-200/80"
      aria-label="Technology Stack"
    >
      <ScrollReveal yOffset={20}>
        <SectionHeading
          number="06"
          tag="Toolkit"
          title="Production technologies & tool ecosystem."
          subtitle="A focused overview of the programming languages, frameworks, AI APIs, and SEO diagnostics used across production client projects."
        />
      </ScrollReveal>

      {/* Fluid Sliding Liquid Domain Pill Tabs */}
      <ScrollReveal yOffset={15} delay={0.05}>
        <div
          ref={tabContainerRef}
          className="relative flex flex-wrap gap-1 mb-8 p-1 rounded-full bg-slate-100/80 border border-slate-200/70 max-w-fit"
        >
          {/* Sliding Liquid Background Pill */}
          <div
            style={{
              transform: `translate3d(${pillStyle.left}px, 0, 0)`,
              width: `${pillStyle.width}px`,
              opacity: pillStyle.opacity,
              transition: "transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), width 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
            className="absolute top-1 bottom-1 rounded-full bg-[#0f52ba] shadow-xs pointer-events-none z-0"
          />

          {categories.map((cat, idx) => (
            <button
              key={cat.id}
              ref={(el) => {
                tabRefs.current[idx] = el;
              }}
              onClick={() => setSelectedCategory(cat.id)}
              className={`relative z-10 px-4 py-1.5 rounded-full text-xs font-semibold transition-colors duration-150 cursor-pointer ${
                selectedCategory === cat.id
                  ? "text-white"
                  : "text-[#475569] hover:text-[#0a192f]"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </ScrollReveal>

      {/* Clean Domain Cards with 3D Tilt & Dynamic Spotlight */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayedCategories.map((cat: TechCategory) => (
          <Card3DTilt key={cat.id} maxTilt={4} scaleOnHover={1.01} className="rounded-2xl">
            <div className="p-6 rounded-2xl border border-slate-200/80 bg-white hover:border-[#0f52ba]/30 hover:shadow-lg hover:shadow-blue-900/5 transition-all duration-200 flex flex-col justify-between h-full">
              <div>
                <span className="text-xs font-mono font-semibold text-[#0f52ba] block mb-1">
                  {cat.name.toUpperCase()}
                </span>

                <h3 className="text-lg font-bold text-[#0a192f] mb-1">
                  {cat.name}
                </h3>

                <p className="text-xs text-[#64748b] leading-relaxed mb-5">
                  {cat.description}
                </p>

                {/* Skills List */}
                <div className="space-y-1.5 pt-3 border-t border-slate-100">
                  {cat.skills.map((skill) => (
                    <div
                      key={skill.name}
                      className="flex items-center justify-between p-2 rounded-xl bg-slate-50 hover:bg-blue-50/60 transition-colors text-xs text-[#0a192f] font-medium"
                    >
                      <span>{skill.name}</span>
                      {skill.highlight && (
                        <span className="text-[10px] font-mono text-[#0f52ba] font-semibold">
                          Primary
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card3DTilt>
        ))}
      </div>
    </section>
  );
}
