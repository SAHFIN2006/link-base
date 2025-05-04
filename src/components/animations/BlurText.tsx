
import React from "react";
import { cn } from "@/lib/utils";

interface BlurTextProps {
  children: string;
  className?: string;
  tag?: keyof JSX.IntrinsicElements;
  startDelay?: number; // Added this prop to fix the error
}

export function BlurText({
  children,
  className,
  tag: Tag = "span",
  startDelay, // Added this prop parameter
}: BlurTextProps) {
  return (
    <Tag 
      className={cn(
        "inline-block text-muted-foreground",
        className
      )}
    >
      {children}
    </Tag>
  );
}
