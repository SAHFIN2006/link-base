
import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface DecryptedTextProps {
  children: string;
  className?: string;
  duration?: number;
  delay?: number;
  tag?: keyof JSX.IntrinsicElements;
}

export function DecryptedText({
  children,
  className,
  duration = 2,
  delay = 0,
  tag: Tag = "span",
}: DecryptedTextProps) {
  const [displayedText, setDisplayedText] = useState("");
  const [isDecrypting, setIsDecrypting] = useState(false);
  
  // Set of possible characters for the random effect
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    
    // Start after delay
    timer = setTimeout(() => {
      setIsDecrypting(true);
      
      const finalText = children;
      let iteration = 0;
      const totalIterations = 10; // How many random iterations before settling
      
      const interval = setInterval(() => {
        setDisplayedText(current => {
          const result = finalText.split("").map((char, idx) => {
            // If we've already "decrypted" this character, return it
            if (idx < iteration / totalIterations * finalText.length) {
              return finalText[idx];
            }
            
            // Return a random character for those we haven't "decrypted" yet
            if (char === " ") return " ";
            return chars[Math.floor(Math.random() * chars.length)];
          }).join("");
          
          // Increase iteration counter
          if (iteration < totalIterations * finalText.length) {
            iteration += 1;
          } else {
            clearInterval(interval);
            setIsDecrypting(false);
          }
          
          return result;
        });
      }, duration * 1000 / (totalIterations * finalText.length)); // Distribute iterations over the duration
      
      return () => clearInterval(interval);
    }, delay * 1000);
    
    return () => clearTimeout(timer);
  }, [children, delay, duration]);

  return (
    <Tag className={cn("inline-block font-mono", className)}>
      {displayedText || children.replace(/./g, "_")}
    </Tag>
  );
}
