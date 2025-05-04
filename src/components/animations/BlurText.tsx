
import React from "react";
import { cn } from "@/lib/utils";

interface BlurTextProps {
  children: string;
  className?: string;
  tag?: keyof JSX.IntrinsicElements;
}

export function BlurText({
  children,
  className,
  tag: Tag = "span",
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
