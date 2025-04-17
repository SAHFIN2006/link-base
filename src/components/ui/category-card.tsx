
import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface CategoryCardProps {
  title: string;
  icon: ReactNode;
  path: string;
  className?: string;
  delay?: number;
}

export function CategoryCard({ title, icon, path, className, delay = 0 }: CategoryCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ 
        type: "spring",
        stiffness: 100,
        damping: 12,
        delay: delay * 0.1 
      }}
      whileHover={{ 
        y: -5,
        transition: { duration: 0.2 } 
      }}
      className={cn(
        "w-full h-full",
        className
      )}
    >
      <Link 
        to={path} 
        className={cn(
          "glass-card flex flex-col items-center justify-center p-6 rounded-xl h-40 group",
          "hover:shadow-lg hover:shadow-accent/20 transition-all duration-300"
        )}
      >
        <div className="text-primary mb-4 transition-transform duration-300 group-hover:scale-110 group-hover:text-linkblue">
          {icon}
        </div>
        <h3 className="text-lg font-medium text-center">{title}</h3>
        <p className="text-sm text-muted-foreground mt-1">Explore resources</p>
      </Link>
    </motion.div>
  );
}
