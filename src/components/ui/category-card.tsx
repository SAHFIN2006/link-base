
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: delay * 0.1 }}
    >
      <Link 
        to={path} 
        className={cn(
          "glass-card flex flex-col items-center justify-center p-6 rounded-xl link-card-hover h-40 group",
          className
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
