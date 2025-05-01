
import React from "react";
import { cn } from "@/lib/utils";

interface ShinyTextProps {
  children: React.ReactNode;
  className?: string;
  gradient?: string;
  duration?: number;
  tag?: keyof JSX.IntrinsicElements;
}

export function ShinyText({
  children,
  className,
  gradient = "from-linkblue via-linkblue-light to-linkblue",
  duration = 3,
  tag: Tag = "span",
}: ShinyTextProps) {
  return (
    <Tag
      className={cn(
        "inline-block relative overflow-hidden bg-clip-text text-transparent",
        `bg-gradient-to-r ${gradient}`,
        className
      )}
      style={{
        WebkitTextFillColor: "transparent",
      }}
    >
      <span className="relative z-10">{children}</span>
      <span
        className="absolute inset-0 w-[200%] animate-shimmer bg-gradient-to-r from-transparent via-white/30 to-transparent"
        style={{ 
          animationDuration: `${duration}s`, 
          WebkitMaskImage: "linear-gradient(110deg, #000 25%, rgba(0, 0, 0, 0.8) 50%, #000 75%)",
          maskImage: "linear-gradient(110deg, #000 25%, rgba(0, 0, 0, 0.8) 50%, #000 75%)",
          WebkitMaskSize: "200% 100%", 
          maskSize: "200% 100%" 
        }}
      />
    </Tag>
  );
}
