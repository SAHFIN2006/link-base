
import React from "react";
import { cn } from "@/lib/utils";

interface RotatingTextProps {
  texts: string[];
  className?: string;
  prefixText?: string;
  tag?: keyof JSX.IntrinsicElements;
}

export function RotatingText({
  texts,
  className,
  prefixText = "",
  tag: Tag = "span",
}: RotatingTextProps) {
  // Just display the first text in the array
  return (
    <Tag className={cn("inline-block", className)}>
      {prefixText && <span>{prefixText} </span>}
      {texts[0]}
    </Tag>
  );
}
