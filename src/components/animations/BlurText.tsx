
import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface BlurTextProps {
  children: string;
  className?: string;
  startDelay?: number;
  duration?: number;
  tag?: keyof JSX.IntrinsicElements;
}

export function BlurText({
  children,
  className,
  startDelay = 0,
  duration = 1.5,
  tag: Tag = "span",
}: BlurTextProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, startDelay * 1000);
    
    return () => clearTimeout(timer);
  }, [startDelay]);

  return (
    <Tag 
      className={cn(
        "inline-block transition-all duration-[1500ms]", 
        isVisible ? "blur-none" : "blur-[8px] opacity-70",
        className
      )}
      style={{
        transitionDuration: `${duration * 1000}ms`,
        transitionProperty: "filter, opacity",
        transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
      }}
    >
      {children}
    </Tag>
  );
}
