
import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface SplitTextProps {
  children: string;
  className?: string;
  highlightClassName?: string;
  duration?: number;
  delay?: number;
  tag?: keyof JSX.IntrinsicElements;
}

export function SplitText({
  children,
  className,
  highlightClassName = "text-primary",
  duration = 0.05,
  delay = 0,
  tag: Tag = "span",
}: SplitTextProps) {
  const [isVisible, setIsVisible] = useState(false);
  const letters = children.split("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100); // Small delay to ensure the component has mounted
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <Tag className={cn("inline-block", className)}>
      {letters.map((letter, index) => (
        <span
          key={index}
          className={cn(
            "inline-block transition-all duration-300 transform opacity-0",
            isVisible && "opacity-100",
            letter === " " ? "mr-1.5" : "",
            isVisible && highlightClassName
          )}
          style={{
            transitionDelay: `${delay + index * duration}s`,
            transform: isVisible ? "translateY(0)" : "translateY(20px)",
          }}
        >
          {letter === " " ? "\u00A0" : letter}
        </span>
      ))}
    </Tag>
  );
}
