import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./data/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Pure White & Crystal Canvas
        canvas: {
          DEFAULT: "#ffffff",
          pure: "#ffffff",
          ice: "#f8faff",
          subtle: "#f0f6ff",
          muted: "#e2edfd",
          dark: "#050b14",
          "dark-card": "#0a1526",
        },
        // Complete Royal Sapphire Color Hierarchy
        sapphire: {
          50: "#f0f7ff",
          100: "#e0effe",
          200: "#bae0fd",
          300: "#7cc7fb",
          400: "#38a9f8",
          500: "#0e8cee",
          600: "#006fd6",
          700: "#0f52ba", // Canonical Royal Sapphire
          800: "#0d4394",
          900: "#0f3675",
          950: "#0a192f", // Deep Midnight Sapphire
          DEFAULT: "#0f52ba",
          electric: "#2563eb",
          vibrant: "#1d4ed8",
          cyan: "#38bdf8",
          sky: "#60a5fa",
        },
        slate: {
          950: "#030712",
          900: "#0a192f",
          800: "#1e293b",
          700: "#334155",
          600: "#475569",
          500: "#64748b",
          400: "#94a3b8",
          300: "#cbd5e1",
          200: "#e2e8f0",
          100: "#f1f5f9",
          50: "#f8fafc",
        },
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          "SF Pro Text",
          "SF Pro Display",
          "var(--font-inter)",
          "system-ui",
          "sans-serif",
        ],
        display: [
          "-apple-system",
          "BlinkMacSystemFont",
          "SF Pro Display",
          "var(--font-space-grotesk)",
          "system-ui",
          "sans-serif",
        ],
        mono: [
          "SF Mono",
          "var(--font-jetbrains-mono)",
          "Menlo",
          "Monaco",
          "Consolas",
          "monospace",
        ],
      },
      boxShadow: {
        "crystal-card": "0 4px 24px -2px rgba(15, 82, 186, 0.06), 0 0 0 1px rgba(15, 82, 186, 0.08), inset 0 1px 2px 0 rgba(255, 255, 255, 1)",
        "crystal-hover": "0 20px 48px -8px rgba(15, 82, 186, 0.14), 0 0 0 1.5px rgba(15, 82, 186, 0.2), inset 0 1.5px 3px 0 rgba(255, 255, 255, 1)",
        "sapphire-island": "0 20px 60px -10px rgba(15, 82, 186, 0.22), 0 0 0 1px rgba(255, 255, 255, 0.9), inset 0 1.5px 2px 0 rgba(255, 255, 255, 1)",
        "sapphire-glow": "0 0 30px rgba(15, 82, 186, 0.35)",
        "sapphire-btn": "0 6px 22px rgba(15, 82, 186, 0.35), inset 0 1px 1.5px rgba(255, 255, 255, 0.35)",
        "sapphire-btn-hover": "0 10px 30px rgba(15, 82, 186, 0.5), inset 0 1px 1.5px rgba(255, 255, 255, 0.45)",
      },
      animation: {
        "sapphire-pulse": "sapphirePulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "gyro-spin": "gyroSpin 12s linear infinite",
        "shimmer-sweep": "shimmerSweep 3s ease-in-out infinite",
        "float-gentle": "floatGentle 5s ease-in-out infinite alternate",
      },
      keyframes: {
        sapphirePulse: {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.6", transform: "scale(1.08)" },
        },
        gyroSpin: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        shimmerSweep: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(200%)" },
        },
        floatGentle: {
          "0%": { transform: "translateY(0px)" },
          "100%": { transform: "translateY(-4px)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
