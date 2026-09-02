# Context.md — Project State & Architectural Reference

**Project**: Prince Gajjar Personal Portfolio Website  
**Professional Positioning**: Full Stack Web Developer & Technical SEO Specialist  
**Design Standard**: Awwwards Site of the Day (SOTD) & Apple Pro Crystalline Luxury — Atmospheric Cursor Luminescence, Kinetic HTML5 Canvas Particle Wave, Spring-based Magnetic Attraction Physics, Fluid Liquid Tab Morphing, Continuous `clamp()` Typography, and a Live Client-Side SEO Architecture Sandbox.  
**Primary Goal**: Present Prince Gajjar as an elite, world-class Full Stack Developer and Technical SEO Specialist through authentic engineering artifacts, precision micro-interactions, and Awwwards-grade visual craft.

---

## 1. Project Architecture & Technology Stack

- **Framework**: Next.js 16+ (App Router, Turbopack, Server & Client Components)
- **Language**: TypeScript (Strict Mode)
- **Styling**: Tailwind CSS + Apple Pro Crystalline Tokens (`app/globals.css`)
- **Atmospheric Lighting**: `AtmosphericCanvas.tsx` (Dynamic Lerp cursor luminous aura + SVG micro-noise texture)
- **Kinetic Centerpiece**: `HeroKinetic.tsx` (HTML5 Canvas particle wave responding to cursor proximity)
- **Physics Micro-Interactions**: `MagneticButton.tsx` (Spring cursor attraction), `Card3DTilt.tsx` (3D perspective)
- **Segmented Morphing**: Sliding liquid background pill tabs in `SelectedWork.tsx` and `TechStack.tsx`
- **Interactive Tool**: Live Search & Schema.org JSON-LD Generator Sandbox in `AgenticAILab.tsx`
- **Motion & Smooth Inertia**: GSAP + ScrollTrigger, Lenis Smooth Scroll, `prefers-reduced-motion` compliance
- **Typography**: Fluid `clamp()` scaling, SF Pro Display / Inter, Serif Italic Accents, JetBrains Mono (Strictly for code & tabular metrics)
- **Structured Data & SEO**: Schema.org JSON-LD (`Person`, `WebSite`), dynamic `robots.txt`, dynamic `sitemap.xml`, and web manifest.

---

## 2. Directory & Component Structure

```
Portfolio-Website/
├── Context.md                     # Living architecture & state documentation (RULES.md §8.1)
├── Changelog.md                   # Chronological log of all modifications (RULES.md §8.1)
├── RULES.md                       # Core agent operating rules
├── UISKILL.md                     # UI/UX, motion, and anti-AI-slop craft standards
├── audit.md                       # Comprehensive AI-slop audit & deconstruction blueprint
├── designflaws.md                 # Awwwards-grade UI flaw audit & step-by-step master plan
├── app/
│   ├── layout.tsx                 # Root layout with Schema.org JSON-LD
│   ├── page.tsx                   # Master page with AtmosphericCanvas integration
│   ├── globals.css                # Fluid clamp typography, crystalline tokens, font smoothing
│   ├── robots.ts                  # Dynamic robots.txt
│   ├── sitemap.ts                 # Dynamic sitemap.xml
│   └── manifest.ts                # Web application manifest
├── components/
│   ├── AtmosphericCanvas.tsx      # Dynamic cursor luminous aura + SVG micro-noise
│   ├── MagneticButton.tsx         # Cursor attraction spring physics wrapper
│   ├── HeroKinetic.tsx            # HTML5 Canvas kinetic particle wave
│   ├── Navbar.tsx                 # Frosted glass header with hairline progress
│   ├── Hero.tsx                   # Fluid display headline, HeroKinetic, and MagneticButton CTAs
│   ├── Profile.tsx                # Section 01: Keynote-style editorial layout with 3D tilt
│   ├── Capabilities.tsx           # Section 02: 3 Apple Pro Crystalline feature cards with 3D tilt
│   ├── Metrics.tsx                # Proof metrics with clean borderless numbers
│   ├── SelectedWork.tsx           # Section 03: Sliding liquid tab pill + subsystem schematics
│   ├── AgenticAILab.tsx           # Section 04: Live Functional SEO & Schema.org JSON-LD Sandbox
│   ├── SeoAiWorkflow.tsx          # Section 05: 6-stage structured search methodology
│   ├── TechStack.tsx              # Section 06: Domain toolkit with sliding liquid pill tabs
│   ├── Experience.tsx             # Section 07: Career milestone timeline
│   ├── Education.tsx              # Section 08: Academic credentials & certifications
│   ├── Contact.tsx                # Section 09: Direct inquiry form & email copy
│   ├── Footer.tsx                 # Monumental 8vw closing statement & magnetic trigger
│   ├── ScrollReveal.tsx           # Reusable GSAP ScrollTrigger staggered entrance wrapper
│   ├── LenisProvider.tsx          # Synchronized Lenis smooth scroll provider
│   └── SectionHeading.tsx         # Clean typographic section heading
└── data/
    ├── projects.ts                # 5 Verified case studies
    ├── experience.ts              # 3 Career timeline roles
    ├── capabilities.ts            # 3 Core engineering pillars
    └── techStack.ts               # Production categorized toolkit
```
