"use client";

import React, { useEffect, useRef } from "react";

export default function HeroKinetic() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReducedMotion) return;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let animationFrameId: number;

    const handleResize = () => {
      if (!canvas) return;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.offsetWidth;
      height = canvas.offsetHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    // Mouse tracking with smooth target interpolation
    let targetMouseX = -2000;
    let targetMouseY = -2000;
    let currentMouseX = -2000;
    let currentMouseY = -2000;

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      targetMouseX = e.clientX - rect.left;
      targetMouseY = e.clientY - rect.top;
    };

    const onMouseLeave = () => {
      targetMouseX = -2000;
      targetMouseY = -2000;
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    document.addEventListener("mouseleave", onMouseLeave);

    // Grid configuration for 3D topological waveform
    const cols = 28;
    const rows = 14;
    let time = 0;

    const render = () => {
      time += 0.016;

      // Smooth mouse interpolation (Lerp)
      currentMouseX += (targetMouseX - currentMouseX) * 0.08;
      currentMouseY += (targetMouseY - currentMouseY) * 0.08;

      ctx.clearRect(0, 0, width, height);

      const cellW = width / (cols - 1);
      const cellH = height / (rows - 1);

      // Compute 3D projected vertices
      const grid: {
        x: number;
        y: number;
        elevation: number;
        glow: number;
      }[][] = [];

      for (let r = 0; r < rows; r++) {
        grid[r] = [];
        for (let c = 0; c < cols; c++) {
          const baseX = c * cellW;
          const baseY = r * cellH;

          // Mathematical sinusoidal wave elevation
          const wave1 = Math.sin(c * 0.35 + time * 1.2 + r * 0.25) * 16;
          const wave2 = Math.cos(r * 0.4 - time * 0.8 + c * 0.2) * 12;
          let elevation = wave1 + wave2;

          // Mouse proximity displacement
          const dx = baseX - currentMouseX;
          const dy = baseY - currentMouseY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const maxDist = 180;
          let glow = 0;

          if (dist < maxDist) {
            const force = Math.cos((dist / maxDist) * (Math.PI / 2));
            elevation += force * 35; // Lift up towards cursor
            glow = force;
          }

          const projectedY = baseY - elevation * 0.6;
          const projectedX = baseX + (dx / (dist + 50)) * (glow * 12);

          grid[r][c] = {
            x: projectedX,
            y: projectedY,
            elevation,
            glow,
          };
        }
      }

      // Draw horizontal topological wave lines
      for (let r = 0; r < rows; r++) {
        ctx.beginPath();
        for (let c = 0; c < cols; c++) {
          const pt = grid[r][c];
          if (c === 0) {
            ctx.moveTo(pt.x, pt.y);
          } else {
            const prev = grid[r][c - 1];
            const midX = (prev.x + pt.x) / 2;
            const midY = (prev.y + pt.y) / 2;
            ctx.quadraticCurveTo(prev.x, prev.y, midX, midY);
          }
        }
        ctx.strokeStyle = "rgba(15, 82, 186, 0.08)";
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Draw vertical cross-connectors with subtle gradient
      for (let c = 0; c < cols; c += 2) {
        ctx.beginPath();
        for (let r = 0; r < rows; r++) {
          const pt = grid[r][c];
          if (r === 0) {
            ctx.moveTo(pt.x, pt.y);
          } else {
            const prev = grid[r - 1][c];
            ctx.lineTo(pt.x, pt.y);
          }
        }
        ctx.strokeStyle = "rgba(37, 99, 235, 0.04)";
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }

      // Draw glowing luminous nodes near cursor and wave peaks
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const pt = grid[r][c];
          if (pt.glow > 0.15) {
            ctx.beginPath();
            ctx.arc(pt.x, pt.y, 1.5 + pt.glow * 2.5, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(15, 82, 186, ${0.3 + pt.glow * 0.6})`;
            ctx.shadowColor = "#38bdf8";
            ctx.shadowBlur = pt.glow * 10;
            ctx.fill();
            ctx.shadowBlur = 0; // Reset
          } else if ((r + c) % 3 === 0 && Math.abs(pt.elevation) > 18) {
            ctx.beginPath();
            ctx.arc(pt.x, pt.y, 1, 0, Math.PI * 2);
            ctx.fillStyle = "rgba(15, 82, 186, 0.25)";
            ctx.fill();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseleave", onMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-80"
      aria-hidden="true"
    />
  );
}
