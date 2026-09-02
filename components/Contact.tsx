"use client";

import React, { useState } from "react";
import SectionHeading from "./SectionHeading";
import ScrollReveal from "./ScrollReveal";
import {
  Mail,
  Copy,
  Check,
  ArrowUpRight,
  Github,
  Linkedin,
  Send,
} from "lucide-react";

export default function Contact() {
  const email = "work.princegajjar@gmail.com";
  const [copied, setCopied] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const mailtoUrl = `mailto:${email}?subject=${encodeURIComponent(
      `[Portfolio Inquiry] ${formData.subject || "Collaboration"}`
    )}&body=${encodeURIComponent(
      `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
    )}`;
    window.location.href = mailtoUrl;
  };

  return (
    <section
      id="contact"
      className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto border-t border-slate-200/80"
      aria-label="Contact and Collaboration"
    >
      <ScrollReveal yOffset={20}>
        <SectionHeading
          number="09"
          tag="Contact"
          title="Get in touch."
          subtitle="Available for full-stack web engineering roles, technical SEO audits, and custom web development projects."
        />
      </ScrollReveal>

      <ScrollReveal
        staggerSelector=".contact-col-item"
        stagger={0.1}
        className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
      >
        {/* Left Column: Direct Reach */}
        <div className="contact-col-item lg:col-span-5 space-y-6">
          <div className="p-6 rounded-xl border border-slate-200/80 bg-white space-y-5">
            <div>
              <span className="text-xs font-mono font-semibold text-[#0f52ba] uppercase block mb-1">
                Direct Contact
              </span>
              <h3 className="text-xl font-bold text-[#0f172a]">
                Let&apos;s build together
              </h3>
              <p className="text-xs text-[#64748b] mt-1.5 leading-relaxed">
                Whether you have a specific project in mind, need a technical search audit, or want to discuss a full-time role, I&apos;d love to connect.
              </p>
            </div>

            {/* Email Pill */}
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 overflow-hidden">
                <Mail className="w-4 h-4 text-[#0f52ba] flex-shrink-0" />
                <span className="text-xs font-mono font-semibold text-[#0f172a] truncate select-all">
                  {email}
                </span>
              </div>

              <button
                onClick={handleCopyEmail}
                className="p-1.5 rounded-md hover:bg-slate-200 text-[#0f172a] transition-all cursor-pointer"
                title="Copy email to clipboard"
                aria-label="Copy email address"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-emerald-600" />
                ) : (
                  <Copy className="w-4 h-4 text-[#64748b]" />
                )}
              </button>
            </div>

            {/* Primary Action Button */}
            <a
              href={`mailto:${email}?subject=Project%20Inquiry%20-%20Prince%20Gajjar`}
              className="btn-primary w-full py-2.5 px-4 text-xs font-semibold flex items-center justify-center gap-1.5 text-center"
            >
              <span>Compose Email</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>

            {/* Social Links */}
            <div className="pt-4 border-t border-slate-100 flex items-center gap-2">
              <a
                href="https://github.com/Prince-Gajjar"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 p-2 rounded-lg bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-[#0f172a] border border-slate-200"
              >
                <Github className="w-3.5 h-3.5" />
                <span>GitHub</span>
              </a>

              <a
                href="https://linkedin.com/in/prince-gajjar-55281b305"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 p-2 rounded-lg bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-[#0f52ba] border border-slate-200"
              >
                <Linkedin className="w-3.5 h-3.5" />
                <span>LinkedIn</span>
              </a>
            </div>
          </div>
        </div>

        {/* Right Column: Inquiry Form */}
        <div className="contact-col-item lg:col-span-7 p-6 sm:p-7 rounded-xl border border-slate-200/80 bg-white">
          <h3 className="text-lg font-bold text-[#0f172a] mb-4">
            Send a Direct Message
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label
                  htmlFor="contact-name"
                  className="text-xs font-semibold text-[#0f172a]"
                >
                  Name <span className="text-[#0f52ba]">*</span>
                </label>
                <input
                  id="contact-name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Your Name"
                  className="w-full px-3.5 py-2 rounded-lg bg-white border border-slate-200 text-xs text-[#0f172a] placeholder-[#94a3b8] focus:border-[#0f52ba] focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label
                  htmlFor="contact-email"
                  className="text-xs font-semibold text-[#0f172a]"
                >
                  Email <span className="text-[#0f52ba]">*</span>
                </label>
                <input
                  id="contact-email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="your.email@company.com"
                  className="w-full px-3.5 py-2 rounded-lg bg-white border border-slate-200 text-xs text-[#0f172a] placeholder-[#94a3b8] focus:border-[#0f52ba] focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label
                htmlFor="contact-subject"
                className="text-xs font-semibold text-[#0f172a]"
              >
                Subject / Inquiry
              </label>
              <input
                id="contact-subject"
                type="text"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                placeholder="Web Development / SEO Audit"
                className="w-full px-3.5 py-2 rounded-lg bg-white border border-slate-200 text-xs text-[#0f172a] placeholder-[#94a3b8] focus:border-[#0f52ba] focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label
                htmlFor="contact-message"
                className="text-xs font-semibold text-[#0f172a]"
              >
                Message <span className="text-[#0f52ba]">*</span>
              </label>
              <textarea
                id="contact-message"
                required
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Briefly describe your project or inquiry..."
                className="w-full px-3.5 py-2 rounded-lg bg-white border border-slate-200 text-xs text-[#0f172a] placeholder-[#94a3b8] focus:border-[#0f52ba] focus:outline-none resize-none"
              />
            </div>

            <button
              type="submit"
              className="btn-primary w-full py-2.5 px-4 text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Send Message</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </ScrollReveal>
    </section>
  );
}
