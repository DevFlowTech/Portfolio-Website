"use client";

import React, { useState, useEffect } from "react";
import { ArrowUp, Clock, ArrowUpRight, Mail } from "lucide-react";
import MagneticButton from "./MagneticButton";

export default function Footer() {
  const [istTime, setIstTime] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        timeZone: "Asia/Kolkata",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      };
      setIstTime(now.toLocaleTimeString("en-GB", options));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollToContact = () => {
    const el = document.getElementById("contact");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className="border-t border-slate-200 bg-white text-[#64748b] text-xs pt-16 pb-12 px-4 sm:px-6 lg:px-8 overflow-hidden relative">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Monumental Closing Statement Banner */}
        <div className="pb-10 border-b border-slate-100 flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div className="max-w-3xl">
            <span className="text-xs font-mono font-semibold text-[#0f52ba] uppercase tracking-wider block mb-3">
              NEXT STEPS & COLLABORATION
            </span>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-[-0.035em] text-[#0a192f] leading-[1.08]">
              Let&apos;s build the future of web & search.
            </h2>
          </div>

          <div className="flex-shrink-0">
            <MagneticButton strength={0.35}>
              <button
                onClick={scrollToContact}
                className="btn-sapphire-pro inline-flex items-center gap-2 px-8 py-4 text-sm font-semibold cursor-pointer shadow-lg shadow-blue-700/20 active:scale-95"
              >
                <span>Start a Conversation</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </MagneticButton>
          </div>
        </div>

        {/* Middle Tier: Live Telemetry & Navigation */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#0f52ba] text-white flex items-center justify-center text-xs font-bold font-mono shadow-xs">
              PG
            </div>
            <div>
              <span className="font-bold text-[#0a192f] block text-sm">
                Prince Gajjar
              </span>
              <span className="text-[11px] text-[#64748b]">
                Full Stack Web Developer & Technical SEO Specialist
              </span>
            </div>
          </div>

          {/* Time & Back to Top */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-xs text-[#0a192f] font-mono">
              <Clock className="w-3.5 h-3.5 text-[#0f52ba] animate-pulse" />
              <span>Ahmedabad, IN: {istTime ? `${istTime} IST` : "LIVE"}</span>
            </div>

            <MagneticButton strength={0.4}>
              <button
                onClick={scrollToTop}
                className="btn-crystalline inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold cursor-pointer"
                aria-label="Scroll back to top"
              >
                <span>Top</span>
                <ArrowUp className="w-3.5 h-3.5 text-[#0f52ba]" />
              </button>
            </MagneticButton>
          </div>
        </div>

        {/* Bottom Tier: Copyright & Signal */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-[#64748b]">
          <div>
            © {new Date().getFullYear()} Prince Gajjar. Engineered with Next.js 16, TypeScript & Awwwards-grade Craft.
          </div>
          <div>
            Built with human craft, zero AI slop & continuous fluid typography.
          </div>
        </div>
      </div>
    </footer>
  );
}
