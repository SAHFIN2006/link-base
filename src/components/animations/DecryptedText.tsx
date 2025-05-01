
import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface DecryptedTextProps {
  children: React.ReactNode;
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
      
      const finalText = typeof children === 'string' ? children : 
                         React.isValidElement(children) ? 
                         React.Children.toArray(children).map(child => 
                           typeof child === 'string' ? child : ''
                         ).join('') : 
                         String(children);
                         
      let iteration = 0;
      const totalIterations = 10; // How many random iterations before settling
      
      const interval = setInterval(() => {
        setDisplayedText(() => {
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
  }, [children, delay, duration, chars]);

  // Safe stringify of children for initial state
  const safeChildren = typeof children === 'string' ? children : 
                     React.isValidElement(children) ? 
                     React.Children.toArray(children).map(child => 
                       typeof child === 'string' ? child : ''
                     ).join('') : 
                     String(children);

  return (
    <Tag className={cn("font-mono", className)}>
      {displayedText || safeChildren.replace(/./g, "_")}
    </Tag>
  );
}
