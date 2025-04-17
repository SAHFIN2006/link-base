
import { useState } from "react";
import * as LucideIcons from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Create a type for our icon components
type IconComponent = React.ForwardRefExoticComponent<React.PropsWithoutRef<React.SVGProps<SVGSVGElement> & {
  size?: number | string;
}> & React.RefAttributes<SVGSVGElement>>;

// Filter out the non-icon exports and construct a clean icon map
const iconMap: Record<string, IconComponent> = {};

// Add only the actual icon components to our map
Object.entries(LucideIcons).forEach(([name, component]) => {
  // Skip utility functions and non-component exports
  if (
    typeof component === 'function' && 
    name !== 'createLucideIcon' && 
    name !== 'icons' &&
    name !== 'default' &&
    name !== '__esModule' &&
    name !== 'type'
  ) {
    iconMap[name] = component as IconComponent;
  }
});

interface IconPickerProps {
  selectedIcon: string;
  onSelectIcon: (iconName: string) => void;
}

export function IconPicker({ selectedIcon, onSelectIcon }: IconPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  // Default to Folder icon if the selected icon doesn't exist
  const IconComponent = selectedIcon && iconMap[selectedIcon] 
    ? iconMap[selectedIcon] 
    : LucideIcons.Folder;

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
        <div className="absolute z-50 w-[340px] mt-2 p-3 dark:bg-background/95 light:bg-background/95 backdrop-blur-xl border border-border rounded-lg shadow-lg overflow-hidden">
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
