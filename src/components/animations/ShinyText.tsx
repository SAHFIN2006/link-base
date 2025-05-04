
import React from "react";
import { cn } from "@/lib/utils";

interface ShinyTextProps {
  children: React.ReactNode;
  className?: string;
  tag?: keyof JSX.IntrinsicElements;
}

export function ShinyText({
  children,
  className,
  tag: Tag = "span",
}: ShinyTextProps) {
  return (
    <Tag
      className={cn(
        "inline-block text-primary font-bold",
        className
      )}
    >
      {children}
    </Tag>
  );
}
