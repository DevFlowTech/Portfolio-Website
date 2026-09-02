"use client";

import React, { useEffect, useRef } from "react";
import {
  ArrowDown,
  ArrowUpRight,
  Github,
  Linkedin,
  MapPin,
  Code2,
  Cpu,
  Search,
} from "lucide-react";
import Card3DTilt from "./Card3DTilt";
import MagneticButton from "./MagneticButton";
import HeroKinetic from "./HeroKinetic";
import gsap from "gsap";

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        contentRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" }
      );
    }, heroRef);

    return () => ctx.revert();
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="hero"
      ref={heroRef}
      className="relative min-h-[92vh] flex flex-col justify-center pt-36 pb-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto overflow-hidden"
      aria-label="Introduction and Overview"
    >
      {/* Interactive Kinetic Background Wave */}
      <HeroKinetic />

      <div ref={contentRef} className="w-full relative z-10">
        {/* Apple Pro Status & Location Pill */}
        <div className="flex flex-wrap items-center gap-3 mb-8 text-xs text-[#475569]">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 border border-sapphire-200/80 shadow-xs text-[#0a192f] font-semibold backdrop-blur-md">
            <span className="h-2 w-2 rounded-full bg-[#0f52ba] animate-pulse" />
            <span>Prince Gajjar</span>
            <span className="text-slate-300">·</span>
            <span className="text-[#0f52ba]">Full Stack & SEO Specialist</span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-50 border border-slate-200/70 text-[#64748b]">
            <MapPin className="w-3.5 h-3.5 text-[#0f52ba]" />
            <span>Ahmedabad, Gujarat, India</span>
          </div>
        </div>

        {/* Fluid Awwwards-Grade Headline */}
        <div className="max-w-5xl mb-8">
          <h1 className="font-display-hero font-extrabold text-[#0a192f]">
            High-performance web systems.{" "}
            <span className="block text-[#475569]">
              Intelligent search workflows.
            </span>
            <span className="block font-serif italic text-transparent bg-clip-text bg-gradient-to-r from-[#0f52ba] via-[#2563eb] to-[#38bdf8] font-normal tracking-tight">
              engineered with human craft.
            </span>
          </h1>
        </div>

        {/* High-Signal Editorial Copy */}
        <p className="max-w-2xl text-base sm:text-lg text-[#334155] mb-10 leading-relaxed font-normal">
          I build production-grade web applications with React and Node.js, design autonomous LLM prompt pipelines, and architect technical SEO foundations that drive compounding organic growth.
        </p>

        {/* 3D Interactive Capability Preview Chips */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-10 max-w-3xl">
          <Card3DTilt maxTilt={5}>
            <div className="p-3.5 rounded-2xl bg-white border border-sapphire-200/70 shadow-xs flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#0f52ba] flex items-center justify-center flex-shrink-0">
                <Code2 className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] text-[#64748b] font-mono block">LAYER 01</span>
                <span className="text-xs font-bold text-[#0a192f]">React.js & Next.js Core</span>
              </div>
            </div>
          </Card3DTilt>

          <Card3DTilt maxTilt={5}>
            <div className="p-3.5 rounded-2xl bg-white border border-sapphire-200/70 shadow-xs flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#0f52ba] flex items-center justify-center flex-shrink-0">
                <Cpu className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] text-[#64748b] font-mono block">LAYER 02</span>
                <span className="text-xs font-bold text-[#0a192f]">Autonomous LLM Workflows</span>
              </div>
            </div>
          </Card3DTilt>

          <Card3DTilt maxTilt={5}>
            <div className="p-3.5 rounded-2xl bg-white border border-sapphire-200/70 shadow-xs flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#0f52ba] flex items-center justify-center flex-shrink-0">
                <Search className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] text-[#64748b] font-mono block">LAYER 03</span>
                <span className="text-xs font-bold text-[#0a192f]">Technical SEO & Vitals</span>
              </div>
            </div>
          </Card3DTilt>
        </div>

        {/* Magnetic Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 sm:gap-4">
          <MagneticButton strength={0.3}>
            <button
              onClick={() => scrollToSection("work")}
              className="btn-sapphire-pro inline-flex items-center gap-2 px-7 py-3.5 text-sm font-semibold cursor-pointer shadow-lg shadow-blue-700/20 active:scale-95"
            >
              <span>Explore Case Studies</span>
              <ArrowDown className="w-4 h-4" />
            </button>
          </MagneticButton>

          <MagneticButton strength={0.3}>
            <button
              onClick={() => scrollToSection("ai-lab")}
              className="btn-crystalline inline-flex items-center gap-2 px-7 py-3.5 text-sm font-semibold cursor-pointer active:scale-95"
            >
              <span>Play Drift Arena</span>
              <ArrowUpRight className="w-4 h-4 text-[#0f52ba]" />
            </button>
          </MagneticButton>

          <div className="h-5 w-px bg-slate-200 hidden sm:block mx-1" />

          {/* Social Links with Magnetic Pull */}
          <div className="flex items-center gap-2">
            <MagneticButton strength={0.4}>
              <a
                href="https://github.com/Prince-Gajjar"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-full bg-white hover:bg-slate-50 text-[#0a192f] border border-sapphire-200/80 transition-all shadow-xs hover:border-[#0f52ba] flex items-center justify-center"
                aria-label="Prince Gajjar GitHub Profile"
              >
                <Github className="w-4 h-4" />
              </a>
            </MagneticButton>

            <MagneticButton strength={0.4}>
              <a
                href="https://linkedin.com/in/prince-gajjar-55281b305"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-full bg-blue-50 hover:bg-blue-100 text-[#0f52ba] border border-sapphire-300 transition-all shadow-xs flex items-center justify-center"
                aria-label="Prince Gajjar LinkedIn Profile"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            </MagneticButton>
          </div>
        </div>
      </div>
    </section>
  );
}
