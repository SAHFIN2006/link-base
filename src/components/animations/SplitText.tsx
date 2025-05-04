
import React from "react";
import { cn } from "@/lib/utils";

interface SplitTextProps {
  children: string;
  className?: string;
  highlightClassName?: string;
  tag?: keyof JSX.IntrinsicElements;
}

export function SplitText({
  children,
  className,
  highlightClassName = "text-primary",
  tag: Tag = "span",
}: SplitTextProps) {
  return (
    <Tag className={cn("inline-block", className, highlightClassName)}>
      {children}
    </Tag>
  );
}
