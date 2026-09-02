import React from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Profile from "@/components/Profile";
import Capabilities from "@/components/Capabilities";
import Metrics from "@/components/Metrics";
import Experience from "@/components/Experience";
import SelectedWork from "@/components/SelectedWork";
import AgenticAILab from "@/components/AgenticAILab";
import SeoAiWorkflow from "@/components/SeoAiWorkflow";
import TechStack from "@/components/TechStack";
import Education from "@/components/Education";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import AtmosphericCanvas from "@/components/AtmosphericCanvas";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-[#ffffff] text-[#0a192f] selection:bg-sapphire-100 selection:text-[#0f52ba] overflow-x-hidden">
      {/* Atmospheric Cursor Luminescence & Micro-Noise */}
      <AtmosphericCanvas />

      {/* Clean Navbar */}
      <Navbar />

      {/* Main Content Layout */}
      <main id="main-content" className="relative z-10">
        <Hero />
        <Profile />
        <Capabilities />
        <Metrics />
        <Experience />
        <SelectedWork />
        <AgenticAILab />
        <SeoAiWorkflow />
        <TechStack />
        <Education />
        <Contact />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
