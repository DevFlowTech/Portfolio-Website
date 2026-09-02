"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  yOffset?: number;
  stagger?: number;
  staggerSelector?: string;
  triggerHook?: string;
}

export default function ScrollReveal({
  children,
  className = "",
  delay = 0,
  duration = 0.75,
  yOffset = 35,
  stagger = 0.1,
  staggerSelector,
  triggerHook = "top 88%",
}: ScrollRevealProps) {
  const elRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion || !elRef.current) return;

    const ctx = gsap.context(() => {
      const targets = staggerSelector
        ? elRef.current?.querySelectorAll(staggerSelector)
        : elRef.current;

      if (!targets) return;

      gsap.fromTo(
        targets,
        {
          opacity: 0,
          y: yOffset,
          scale: 0.98,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: duration,
          delay: delay,
          stagger: staggerSelector ? stagger : 0,
          ease: "power3.out",
          scrollTrigger: {
            trigger: elRef.current,
            start: triggerHook,
            toggleActions: "play none none none",
            once: true,
          },
        }
      );
    }, elRef);

    return () => ctx.revert();
  }, [delay, duration, yOffset, stagger, staggerSelector, triggerHook]);

  return (
    <div ref={elRef} className={className}>
      {children}
    </div>
  );
}
