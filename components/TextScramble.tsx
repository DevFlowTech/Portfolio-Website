"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";

interface TextScrambleProps {
  text: string;
  className?: string;
  triggerOnHover?: boolean;
  triggerOnceOnMount?: boolean;
  chars?: string;
  speed?: number;
  as?: React.ElementType;
}

const DEFAULT_CHARS = "0101XYZ_#@&<>%§λ▲◆";

export default function TextScramble({
  text,
  className = "",
  triggerOnHover = true,
  triggerOnceOnMount = false,
  chars = DEFAULT_CHARS,
  speed = 30,
  as: Component = "span",
}: TextScrambleProps) {
  const [displayText, setDisplayText] = useState(text);
  const [isScrambling, setIsScrambling] = useState(false);
  const frameRef = useRef<number>(0);
  const iterationRef = useRef<number>(0);

  const scramble = useCallback(() => {
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      setDisplayText(text);
      return;
    }

    cancelAnimationFrame(frameRef.current);
    iterationRef.current = 0;
    setIsScrambling(true);

    const maxIterations = text.length * 3;
    let lastTime = performance.now();

    const update = (time: number) => {
      if (time - lastTime >= speed) {
        lastTime = time;
        const currentIteration = iterationRef.current;

        const scrambled = text
          .split("")
          .map((char, index) => {
            if (char === " ") return " ";
            if (index < currentIteration / 3) {
              return text[index];
            }
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join("");

        setDisplayText(scrambled);
        iterationRef.current += 1;

        if (iterationRef.current > maxIterations) {
          setDisplayText(text);
          setIsScrambling(false);
          return;
        }
      }

      frameRef.current = requestAnimationFrame(update);
    };

    frameRef.current = requestAnimationFrame(update);
  }, [text, chars, speed]);

  useEffect(() => {
    if (triggerOnceOnMount) {
      scramble();
    } else {
      setDisplayText(text);
    }

    return () => cancelAnimationFrame(frameRef.current);
  }, [text, triggerOnceOnMount, scramble]);

  const handleMouseEnter = () => {
    if (triggerOnHover && !isScrambling) {
      scramble();
    }
  };

  return (
    <Component
      onMouseEnter={handleMouseEnter}
      className={`inline-block font-inherit cursor-default select-none ${className}`}
      aria-label={text}
    >
      {displayText}
    </Component>
  );
}
