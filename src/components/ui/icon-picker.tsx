
import { useState, useEffect, useMemo } from "react";
import * as LucideIcons from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

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
    name !== 'createLucideIcon' && 
    name !== 'icons' &&
    name !== 'default' &&
    name !== '__esModule' &&
    name !== 'type' &&
    typeof component === 'function'
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
  const [searchTerm, setSearchTerm] = useState("");
  
  // Default to Folder icon if the selected icon doesn't exist
  const IconComponent = iconMap[selectedIcon] || LucideIcons.Folder;

  // Most commonly used icons for categories to show first
  const popularIcons = [
    "Folder", "Database", "Code", "Brain", 
    "Bot", "Shield", "Cpu", "Gamepad", 
    "BarChart", "Layers", "Monitor", "Zap", 
    "Lock", "Briefcase", "Calendar", "Cog",
    "Book", "FileText", "Globe", "Home",
    "Link", "HeartHandshake", "Users", "Smile"
  ];

  // Filter icons based on search term
  const filteredIcons = useMemo(() => {
    const allIconNames = Object.keys(iconMap);
    
    if (!searchTerm) {
      // If no search, show popular icons first, then the rest alphabetically
      const remainingIcons = allIconNames.filter(name => !popularIcons.includes(name)).sort();
      return [...popularIcons, ...remainingIcons];
    }
    
    // If searching, filter all icons by search term
    return allIconNames.filter(name => 
      name.toLowerCase().includes(searchTerm.toLowerCase())
    ).sort();
  }, [searchTerm]);

  // Create a document click handler to close the dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (isOpen && !target.closest('[data-icon-picker="true"]')) {
        setIsOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative" data-icon-picker="true">
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
        <div className="absolute z-50 w-[340px] mt-2 p-3 bg-background/95 backdrop-blur-xl border border-border rounded-lg shadow-lg max-h-[500px] overflow-hidden flex flex-col">
          <div className="mb-2 relative">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search icons..."
              className="pl-8"
              autoFocus
            />
          </div>
          
          <div className="overflow-y-auto flex-1 grid grid-cols-8 gap-1">
            {filteredIcons.map((name) => {
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
                  title={name}
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
