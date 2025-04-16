
import { useState } from "react";
import * as LucideIcons from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Create a proper type for our icon map
type LucideIcon = React.ComponentType<React.SVGProps<SVGSVGElement> & { size?: number | string }>;

// Filter out the non-icon exports and construct a clean icon map
const iconMap: Record<string, LucideIcon> = {};

// Add only the actual icon components to our map
Object.entries(LucideIcons).forEach(([name, component]) => {
  // Skip utility functions and non-component exports
  if (
    typeof component === 'function' && 
    name !== 'createLucideIcon' && 
    name !== 'icons' &&
    name !== 'default' &&
    name !== 'type'
  ) {
    iconMap[name] = component as LucideIcon;
  }
});

interface IconPickerProps {
  selectedIcon: string;
  onSelectIcon: (iconName: string) => void;
}

export function IconPicker({ selectedIcon, onSelectIcon }: IconPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  // Default to Folder icon if the selected icon doesn't exist
  let IconComponent: LucideIcon = LucideIcons.Folder;
  
  // Try to get the icon by name
  if (selectedIcon && iconMap[selectedIcon]) {
    IconComponent = iconMap[selectedIcon];
  } else if (selectedIcon) {
    // Try to match case-insensitively
    const key = Object.keys(iconMap).find(
      k => k.toLowerCase() === selectedIcon.toLowerCase()
    );
    if (key) {
      IconComponent = iconMap[key];
    }
  }

  // Most commonly used icons for categories to show first
  const popularIcons = [
    "Folder", "Database", "Code", "Brain", 
    "Bot", "Shield", "Cpu", "Gamepad", 
    "BarChart", "Layers", "Monitor", "Zap", 
    "Lock", "Briefcase", "Calendar", "Cog"
  ];

  // Get the rest of the icons
  const restOfIcons = Object.keys(iconMap)
    .filter(icon => !popularIcons.includes(icon));

  return (
    <div className="relative">
      <div className="flex gap-2 items-center">
        <Button 
          type="button"
          variant="outline" 
          className="w-12 h-12 p-2 flex items-center justify-center"
          onClick={() => setIsOpen(!isOpen)}
        >
          <IconComponent className="w-6 h-6" />
        </Button>
        <div className="text-sm text-muted-foreground">
          {selectedIcon || "Select an icon"}
        </div>
      </div>
      
      {isOpen && (
        <div className="absolute z-50 w-[340px] mt-2 p-3 bg-black/90 dark:bg-black/90 light:bg-white/95 backdrop-blur-xl border border-white/10 light:border-gray-200 rounded-lg shadow-lg overflow-hidden">
          <div className="mb-2 text-sm font-medium text-muted-foreground">Popular Icons</div>
          <div className="grid grid-cols-8 gap-1 mb-4">
            {popularIcons.map((name) => {
              const Icon = iconMap[name];
              if (!Icon) return null;
              return (
                <Button
                  key={name}
                  type="button"
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "w-9 h-9",
                    selectedIcon === name && "bg-primary/20 text-primary"
                  )}
                  onClick={() => {
                    onSelectIcon(name);
                    setIsOpen(false);
                  }}
                >
                  <Icon className="w-5 h-5" />
                  <span className="sr-only">{name}</span>
                </Button>
              );
            })}
          </div>
          
          <div className="mb-2 text-sm font-medium text-muted-foreground">All Icons</div>
          <div className="grid grid-cols-8 gap-1 max-h-48 overflow-y-auto">
            {restOfIcons.map((name) => {
              const Icon = iconMap[name];
              if (!Icon) return null;
              return (
                <Button
                  key={name}
                  type="button"
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "w-9 h-9",
                    selectedIcon === name && "bg-primary/20 text-primary"
                  )}
                  onClick={() => {
                    onSelectIcon(name);
                    setIsOpen(false);
                  }}
                >
                  <Icon className="w-5 h-5" />
                  <span className="sr-only">{name}</span>
                </Button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
