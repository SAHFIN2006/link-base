
import React, { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface RotatingTextProps {
  texts: string[];
  className?: string;
  prefixText?: string;
  rotationDelay?: number;
  tag?: keyof JSX.IntrinsicElements;
}

export function RotatingText({
  texts,
  className,
  prefixText = "",
  rotationDelay = 2,
  tag: Tag = "span",
}: RotatingTextProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const rotateText = () => {
    setIsAnimating(true);
    
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    // Set a timeout to change the text after animation completes
    timeoutRef.current = setTimeout(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % texts.length);
      setIsAnimating(false);
    }, 500); // 500ms for the animation duration
  };

  useEffect(() => {
    // Initial delay before starting the rotation
    const initialTimeout = setTimeout(() => {
      rotateText();
      
      // Set up interval for subsequent rotations
      const interval = setInterval(rotateText, rotationDelay * 1000);
      return () => clearInterval(interval);
    }, 1000);
    
    return () => {
      clearTimeout(initialTimeout);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [rotationDelay, texts.length]);

  return (
    <Tag className={cn("inline-block", className)}>
      {prefixText && <span>{prefixText} </span>}
      <span className="inline-block relative overflow-hidden">
        <span
          className={cn(
            "inline-block transition-transform duration-500",
            isAnimating ? "-translate-y-full opacity-0" : "translate-y-0 opacity-100"
          )}
        >
          {texts[currentIndex]}
        </span>
        <span
          className={cn(
            "absolute top-0 left-0 transition-transform duration-500",
            isAnimating ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
          )}
        >
          {texts[(currentIndex + 1) % texts.length]}
        </span>
      </span>
    </Tag>
  );
}
