"use client";

import React, { useState, useEffect } from "react";
import { Menu, X, ArrowUpRight } from "lucide-react";

interface NavItem {
  name: string;
  href: string;
}

const navItems: NavItem[] = [
  { name: "About", href: "#profile" },
  { name: "Capabilities", href: "#capabilities" },
  { name: "Experience", href: "#experience" },
  { name: "Work", href: "#work" },
  { name: "Drift Arena", href: "#ai-lab" },
  { name: "Stack", href: "#stack" },
  { name: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollTop || window.scrollY;
      const windowHeight =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
      const scrollRatio = windowHeight > 0 ? totalScroll / windowHeight : 0;
      setScrollProgress(Math.min(100, Math.max(0, scrollRatio * 100)));

      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      // Check if user is at the top of the page / Hero section
      const heroEl = document.getElementById("hero");
      const heroBottom = heroEl ? heroEl.getBoundingClientRect().bottom : 0;

      if (window.scrollY < 120 || heroBottom > 350) {
        setActiveSection("");
        return;
      }

      // Check if user is at the very bottom of the page
      if (
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 50
      ) {
        const lastSection = navItems[navItems.length - 1].href.substring(1);
        setActiveSection(lastSection);
        return;
      }

      const sections = navItems.map((item) => item.href.substring(1));
      let currentSection = "";
      for (let i = sections.length - 1; i >= 0; i--) {
        const sectionEl = document.getElementById(sections[i]);
        if (sectionEl) {
          const rect = sectionEl.getBoundingClientRect();
          if (rect.top <= 200) {
            currentSection = sections[i];
            break;
          }
        }
      }
      setActiveSection(currentSection);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    if (href === "#hero") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      setActiveSection("");
      return;
    }
    const target = document.querySelector(href);
    if (target) {
      const headerOffset = 80;
      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
      setActiveSection(href.substring(1));
    }
  };

  return (
    <>
      {/* Hairline Scroll Progress Bar */}
      <div
        className="fixed top-0 left-0 h-[2px] bg-gradient-to-r from-[#0f52ba] to-[#2563eb] z-50 transition-all duration-75"
        style={{ width: `${scrollProgress}%` }}
        aria-hidden="true"
      />

      {/* Clean & Professional Frosted Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? "py-3.5 bg-white/85 backdrop-blur-xl border-b border-slate-200/80 shadow-[0_4px_20px_rgba(15,82,186,0.04)]"
            : "py-5 bg-white/50 backdrop-blur-md border-b border-slate-100/60"
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Brand Wordmark */}
          <a
            href="#hero"
            onClick={(e) => scrollToSection(e, "#hero")}
            className="group flex items-center gap-2.5 focus-visible:outline-none"
            aria-label="Prince Gajjar Portfolio Home"
          >
            <div className="w-8 h-8 rounded-xl bg-sapphire-50 border border-sapphire-200/80 flex items-center justify-center group-hover:bg-[#0f52ba] transition-colors duration-200 shadow-xs">
              <span className="font-mono text-xs font-bold text-[#0f52ba] group-hover:text-white transition-colors">
                PG
              </span>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-sm tracking-tight text-[#0a192f] flex items-center gap-1 leading-none">
                Prince Gajjar
              </span>
              <span className="text-[11px] text-[#64748b] tracking-normal font-medium mt-0.5 hidden sm:inline-block">
                Full Stack & AI Developer
              </span>
            </div>
          </a>

          {/* Navigation Links */}
          <nav
            className="hidden md:flex items-center gap-1 px-3 py-1 rounded-full bg-slate-50/80 border border-slate-200/60"
            aria-label="Main Navigation"
          >
            {navItems.map((item) => {
              const isActive = activeSection === item.href.substring(1);
              return (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={(e) => scrollToSection(e, item.href)}
                  className={`px-3.5 py-1.5 text-xs font-medium rounded-full transition-all duration-200 ${
                    isActive
                      ? "text-white bg-[#0f52ba] font-semibold shadow-xs"
                      : "text-[#475569] hover:text-[#0a192f] hover:bg-white/80"
                  }`}
                >
                  {item.name}
                </a>
              );
            })}
          </nav>

          {/* Right Action Area */}
          <div className="hidden sm:flex items-center gap-3">
            <div className="flex items-center gap-2 text-xs text-[#334155] px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200/60 font-medium">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#34c759] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#34c759]"></span>
              </span>
              <span className="text-[11px]">Available for work</span>
            </div>

            <a
              href="#contact"
              onClick={(e) => scrollToSection(e, "#contact")}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#0f52ba] hover:bg-[#0d4394] text-white text-xs font-semibold transition-all duration-200 shadow-xs active:scale-95"
            >
              <span>Let&apos;s Talk</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            type="button"
            className="md:hidden p-2 rounded-xl bg-slate-50 border border-slate-200/80 text-[#0a192f] hover:bg-slate-100 focus:outline-none transition-colors"
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-[#0a192f]" /> : <Menu className="w-5 h-5 text-[#0a192f]" />}
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-slate-200/80 bg-white/95 backdrop-blur-xl px-5 pt-3 pb-6 space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex items-center gap-2 py-2 px-3 mb-2 rounded-xl bg-sapphire-50 border border-sapphire-200/60 text-xs text-[#0f52ba] font-medium">
              <span className="h-2 w-2 rounded-full bg-[#0f52ba] animate-pulse" />
              <span>Available for Select Client Projects</span>
            </div>

            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                onClick={(e) => scrollToSection(e, item.href)}
                className="block px-3.5 py-2 rounded-xl text-sm font-medium text-[#334155] hover:text-[#0a192f] hover:bg-slate-50 transition-colors"
              >
                {item.name}
              </a>
            ))}

            <div className="pt-3 border-t border-slate-100">
              <a
                href="#contact"
                onClick={(e) => scrollToSection(e, "#contact")}
                className="w-full py-2.5 px-4 rounded-full bg-[#0f52ba] text-white text-sm font-semibold text-center flex items-center justify-center gap-2 shadow-xs"
              >
                <span>Get in touch</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
