"use client";

import React, { useEffect, useRef } from "react";

export default function AtmosphericCanvas() {
  const glow1Ref = useRef<HTMLDivElement>(null);
  const glow2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReducedMotion) return;

    let mouseX = typeof window !== "undefined" ? window.innerWidth / 2 : 500;
    let mouseY = typeof window !== "undefined" ? window.innerHeight / 2 : 500;
    let currentX1 = mouseX;
    let currentY1 = mouseY;
    let currentX2 = mouseX;
    let currentY2 = mouseY;
    let animationFrameId: number;
    let time = 0;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY + window.scrollY;
    };

    const render = () => {
      time += 0.012;

      // Primary Sapphire Aurora (direct Lerp response)
      currentX1 += (mouseX - currentX1) * 0.05;
      currentY1 += (mouseY - currentY1) * 0.05;

      // Secondary Azure/Indigo Ambient Bloom (delayed counter-drift)
      currentX2 += (mouseX - currentX2) * 0.025;
      currentY2 += (mouseY - currentY2) * 0.025;

      const orbitOffsetX = Math.sin(time) * 120;
      const orbitOffsetY = Math.cos(time * 0.8) * 80;

      if (glow1Ref.current) {
        glow1Ref.current.style.transform = `translate3d(${currentX1 - 320}px, ${currentY1 - 320}px, 0)`;
      }

      if (glow2Ref.current) {
        glow2Ref.current.style.transform = `translate3d(${currentX2 - 400 + orbitOffsetX}px, ${currentY2 - 400 + orbitOffsetY}px, 0)`;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    render();

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      aria-hidden="true"
    >
      {/* Secondary Ethereal Ambient Bloom */}
      <div
        ref={glow2Ref}
        className="w-[800px] h-[800px] rounded-full bg-gradient-to-tr from-cyan-400/8 via-blue-600/5 to-transparent blur-[140px] will-change-transform opacity-70"
      />

      {/* Primary Dynamic Cursor-Tracking Luminous Aura */}
      <div
        ref={glow1Ref}
        className="w-[640px] h-[640px] rounded-full bg-gradient-to-br from-[#0f52ba]/12 via-indigo-500/8 to-transparent blur-[110px] will-change-transform opacity-80"
      />

      {/* Micro-Noise Base-64 SVG Overlay for Tactile Crystalline Texture */}
      <div className="absolute inset-0 opacity-[0.025] mix-blend-overlay bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIj48ZmlsdGVyIGlkPSJuIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iMC44IiBzdGl0Y2hUaWxlcz0ic3RpdGNoIi8+PC9maWx0ZXI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsdGVyPSJ1cmwoI24pIi8+PC9zdmc+')] pointer-events-none" />
    </div>
  );
}
