
import { Link } from "react-router-dom";
import { Database } from "lucide-react";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  withText?: boolean;
  className?: string;
}

export function Logo({ size = "md", withText = true, className = "" }: LogoProps) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
  };

  return (
    <Link to="/" className={`flex items-center gap-3 ${className}`}>
      <Database className={`${sizeClasses[size]} text-linkblue`} />
      {withText && (
        <span className="text-xl font-bold text-foreground">
          Link<span className="text-linkblue">Base</span>
        </span>
      )}
    </Link>
  );
}
