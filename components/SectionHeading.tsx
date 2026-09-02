import React from "react";
import TextScramble from "./TextScramble";

interface SectionHeadingProps {
  number: string;
  tag: string;
  title: string;
  subtitle?: string;
  className?: string;
}

export default function SectionHeading({
  number,
  tag,
  title,
  subtitle,
  className = "",
}: SectionHeadingProps) {
  return (
    <div className={`mb-12 max-w-3xl ${className}`}>
      {/* Clean Numeric & Domain Eyebrow with Scramble */}
      <div className="flex items-center gap-2 mb-3 group cursor-default">
        <span className="font-mono text-xs font-semibold text-[#0f52ba]">
          {number}.
        </span>
        <span className="text-xs font-semibold uppercase tracking-wider text-[#64748b] group-hover:text-[#0f52ba] transition-colors">
          <TextScramble text={tag} triggerOnHover={true} />
        </span>
      </div>

      {/* Main Title */}
      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#0f172a] leading-tight">
        {title}
      </h2>

      {/* Subtitle */}
      {subtitle && (
        <p className="mt-3 text-base text-[#475569] leading-relaxed font-normal">
          {subtitle}
        </p>
      )}
    </div>
  );
}
