"use client";

import React from "react";
import SectionHeading from "./SectionHeading";
import ScrollReveal from "./ScrollReveal";
import Card3DTilt from "./Card3DTilt";
import { Code, Cpu, Search, CheckCircle2 } from "lucide-react";

export default function Profile() {
  return (
    <section
      id="profile"
      className="py-24 md:py-32 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto border-t border-slate-200/80"
      aria-label="Profile and Background"
    >
      <ScrollReveal yOffset={20}>
        <SectionHeading
          number="01"
          tag="Overview"
          title="Bridging full-stack engineering with technical search architecture."
          subtitle="A clear focus on building robust web products, automating repetitive data tasks, and optimizing organic search discoverability."
        />
      </ScrollReveal>

      <ScrollReveal
        staggerSelector=".profile-col-item"
        stagger={0.12}
        className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start"
      >
        {/* Left Column: Editorial Narrative */}
        <div className="profile-col-item lg:col-span-7 space-y-5 text-[#334155] text-base leading-relaxed">
          <p className="text-xl sm:text-2xl font-bold text-[#0a192f] leading-snug tracking-tight">
            I build modern web applications and optimize them for organic search discoverability.
          </p>
          <p>
            My engineering work centers on <strong className="text-[#0a192f] font-bold">React.js, Next.js, Node.js, and TypeScript</strong>, building responsive user interfaces, modular REST APIs, and database schemas with strong attention to Core Web Vitals and clean code architecture.
          </p>
          <p>
            On the search front, I specialize in <strong className="text-[#0a192f] font-bold">technical SEO audits, structured data (Schema.org JSON-LD), crawl budget optimization, and local search visibility</strong>. Additionally, I develop programmatic automation scripts using modern LLM APIs (Claude, OpenAI) to accelerate research and content validation workflows.
          </p>

          {/* Key Deliverable Highlights Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-6 border-t border-slate-200/80">
            <div className="flex items-center gap-2.5 text-xs text-[#0a192f] font-semibold">
              <CheckCircle2 className="w-4 h-4 text-[#0f52ba] flex-shrink-0" />
              <span>Full-Stack React & Node.js Delivery</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-[#0a192f] font-semibold">
              <CheckCircle2 className="w-4 h-4 text-[#0f52ba] flex-shrink-0" />
              <span>Technical SEO & Core Web Vitals</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-[#0a192f] font-semibold">
              <CheckCircle2 className="w-4 h-4 text-[#0f52ba] flex-shrink-0" />
              <span>Schema.org JSON-LD & Crawl Fixes</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-[#0a192f] font-semibold">
              <CheckCircle2 className="w-4 h-4 text-[#0f52ba] flex-shrink-0" />
              <span>LLM & Prompt Automation Pipelines</span>
            </div>
          </div>
        </div>

        {/* Right Column: 3 Layered 3D Tilt Cards */}
        <div className="profile-col-item lg:col-span-5 space-y-4">
          <Card3DTilt maxTilt={4}>
            <div className="crystalline-card p-5 bg-white flex items-start gap-4 shadow-xs group">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#0f52ba] group-hover:bg-[#0f52ba] group-hover:text-white flex items-center justify-center flex-shrink-0 transition-all duration-300 shadow-2xs">
                <Code className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] text-[#0f52ba] font-mono font-bold block mb-0.5">LAYER 01</span>
                <h3 className="font-bold text-[#0a192f] text-sm group-hover:text-[#0f52ba] transition-colors">Full-Stack Web Development</h3>
                <p className="text-xs text-[#475569] mt-1 leading-relaxed">
                  React.js, Next.js, Node.js, Express, TypeScript, RESTful API architecture, and database integrations.
                </p>
              </div>
            </div>
          </Card3DTilt>

          <Card3DTilt maxTilt={4}>
            <div className="crystalline-card p-5 bg-white flex items-start gap-4 shadow-xs group">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#0f52ba] group-hover:bg-[#0f52ba] group-hover:text-white flex items-center justify-center flex-shrink-0 transition-all duration-300 shadow-2xs">
                <Cpu className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] text-[#0f52ba] font-mono font-bold block mb-0.5">LAYER 02</span>
                <h3 className="font-bold text-[#0a192f] text-sm group-hover:text-[#0f52ba] transition-colors">AI Workflows & Prompt Pipelines</h3>
                <p className="text-xs text-[#475569] mt-1 leading-relaxed">
                  LLM API integrations, prompt chain engineering, entity extraction, and automated content validation scripts.
                </p>
              </div>
            </div>
          </Card3DTilt>

          <Card3DTilt maxTilt={4}>
            <div className="crystalline-card p-5 bg-white flex items-start gap-4 shadow-xs group">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#0f52ba] group-hover:bg-[#0f52ba] group-hover:text-white flex items-center justify-center flex-shrink-0 transition-all duration-300 shadow-2xs">
                <Search className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] text-[#0f52ba] font-mono font-bold block mb-0.5">LAYER 03</span>
                <h3 className="font-bold text-[#0a192f] text-sm group-hover:text-[#0f52ba] transition-colors">Technical & Local Search SEO</h3>
                <p className="text-xs text-[#475569] mt-1 leading-relaxed">
                  Schema.org structured data, crawl budget remediation, Core Web Vitals optimization, and Google Search Console analysis.
                </p>
              </div>
            </div>
          </Card3DTilt>
        </div>
      </ScrollReveal>
    </section>
  );
}
