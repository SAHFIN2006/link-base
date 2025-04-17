
import { useState, useEffect, useMemo } from "react";
import * as Icons from "lucide-react";
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
Object.entries(Icons).forEach(([name, component]) => {
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
  const [searchTerm, setSearchTerm] = useState("");
  const [iconCategories, setIconCategories] = useState<any>({});
  
  // Default to Folder icon if the selected icon doesn't exist
  const IconComponent = selectedIcon && iconMap[selectedIcon] 
    ? iconMap[selectedIcon] 
    : Icons.Folder;

  // Most commonly used icons for categories to show first
  const popularIcons = [
    "Folder", "Database", "Code", "Brain", 
    "Bot", "Shield", "Cpu", "Gamepad", 
    "BarChart", "Layers", "Monitor", "Zap", 
    "Lock", "Briefcase", "Calendar", "Cog",
    "Book", "FileText", "Globe", "Home",
    "Link", "Workflow", "Users", "Smile"
  ];

  // Filter and categorize icons based on search term
  useEffect(() => {
    const categorizeIcons = () => {
      // Define icon categories with their prefixes or patterns
      const categories: Record<string, string[]> = {
        "Communication": ["message", "mail", "phone", "chat"],
        "Files & Documents": ["file", "folder", "document", "book"],
        "Interface": ["layout", "sidebar", "panel", "grid", "list", "menu"],
        "Technology": ["code", "server", "database", "cloud", "terminal"],
        "People": ["user", "person", "profile", "avatar", "man", "woman"],
        "Business": ["chart", "graph", "presentation", "briefcase", "trending"],
        "Media": ["image", "video", "music", "audio", "camera", "play"],
        "Shapes": ["square", "circle", "triangle", "hexagon", "octagon"],
        "Weather & Nature": ["cloud", "sun", "moon", "snow", "rain", "tree", "leaf"],
        "Travel": ["map", "compass", "navigation", "car", "plane", "bus"],
        "Others": []
      };
      
      const categorizedIcons: Record<string, string[]> = {
        "Popular": popularIcons
      };
      
      // Initialize all categories
      Object.keys(categories).forEach(category => {
        categorizedIcons[category] = [];
      });
      
      // Get all icon names
      const allIconNames = Object.keys(iconMap);
      
      // Filter based on search term
      const filteredIcons = searchTerm
        ? allIconNames.filter(name => 
            name.toLowerCase().includes(searchTerm.toLowerCase()))
        : allIconNames;
      
      // For each filtered icon, find its category
      filteredIcons.forEach(iconName => {
        if (popularIcons.includes(iconName) && !searchTerm) {
          // Skip popular icons in other categories if not searching
          return;
        }
        
        let assigned = false;
        
        // Check which category this icon belongs to
        for (const [categoryName, patterns] of Object.entries(categories)) {
          if (patterns.some(pattern => 
            iconName.toLowerCase().includes(pattern.toLowerCase())
          )) {
            categorizedIcons[categoryName].push(iconName);
            assigned = true;
            break;
          }
        }
        
        // If no category matched, put in "Others"
        if (!assigned) {
          categorizedIcons["Others"].push(iconName);
        }
      });
      
      // Remove empty categories
      const result: Record<string, string[]> = {};
      for (const [category, icons] of Object.entries(categorizedIcons)) {
        if (icons.length > 0) {
          result[category] = icons.sort();
        }
      }
      
      return result;
    };
    
    setIconCategories(categorizeIcons());
  }, [searchTerm]);

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
        <div className="absolute z-50 w-[340px] mt-2 p-3 dark:bg-background/95 light:bg-background/95 backdrop-blur-xl border border-border rounded-lg shadow-lg max-h-96 overflow-hidden flex flex-col">
          <div className="mb-2 relative">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search icons..."
              className="pl-8"
            />
          </div>
          
          <div className="overflow-y-auto flex-1">
            {Object.entries(iconCategories).map(([category, icons]) => (
              <div key={category} className="mb-4">
                <div className="mb-2 text-sm font-medium text-muted-foreground">{category}</div>
                <div className="grid grid-cols-8 gap-1">
                  {(icons as string[]).map((name) => {
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
            ))}
            
            {Object.keys(iconCategories).length === 0 && (
              <div className="py-8 text-center text-muted-foreground">
                No icons found for "{searchTerm}"
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
