
import React from "react";
import { cn } from "@/lib/utils";

interface DecryptedTextProps {
  children: React.ReactNode;
  className?: string;
  tag?: keyof JSX.IntrinsicElements;
}

export function DecryptedText({
  children,
  className,
  tag: Tag = "span",
}: DecryptedTextProps) {
  // Convert children to string safely
  const textContent = typeof children === 'string' ? children : 
                     React.isValidElement(children) ? 
                     React.Children.toArray(children).map(child => 
                       typeof child === 'string' ? child : ''
                     ).join('') : 
                     String(children);
  
  return (
    <Tag className={cn("font-mono", className)}>
      {textContent}
    </Tag>
  );
}
