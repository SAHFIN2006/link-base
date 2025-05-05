
import { useState, useEffect, useMemo } from "react";
import * as LucideIcons from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Search, Folder } from "lucide-react";
import { toast } from "sonner";

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
  const [customIconUrl, setCustomIconUrl] = useState("");
  const [customIcons, setCustomIcons] = useState<{[key: string]: string}>({});
  
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

  // Load custom icons from localStorage on mount
  useEffect(() => {
    try {
      const savedIcons = localStorage.getItem('customIcons');
      if (savedIcons) {
        setCustomIcons(JSON.parse(savedIcons));
      }
    } catch (error) {
      console.error("Error loading custom icons:", error);
    }
  }, []);

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

  // Function to add a custom icon
  const handleAddCustomIcon = () => {
    if (!customIconUrl.trim()) {
      toast.error("Please enter a valid icon URL");
      return;
    }

    // Generate a unique name for the custom icon
    const iconName = `CustomIcon_${Object.keys(customIcons).length + 1}`;
    
    // Add the new custom icon
    const newCustomIcons = {
      ...customIcons,
      [iconName]: customIconUrl
    };
    
    setCustomIcons(newCustomIcons);
    
    // Save to localStorage
    try {
      localStorage.setItem('customIcons', JSON.stringify(newCustomIcons));
      toast.success("Custom icon added successfully!");
      setCustomIconUrl("");
    } catch (error) {
      console.error("Error saving custom icons:", error);
      toast.error("Failed to save custom icon");
    }
  };

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
          
          {/* Custom icon input */}
          <div className="flex gap-2 mb-3">
            <Input
              value={customIconUrl}
              onChange={(e) => setCustomIconUrl(e.target.value)}
              placeholder="Enter custom icon URL..."
              className="flex-1"
            />
            <Button 
              type="button" 
              variant="secondary" 
              size="sm" 
              onClick={handleAddCustomIcon}
            >
              Add
            </Button>
          </div>
          
          <div className="overflow-y-auto flex-1">
            {/* Custom icons section */}
            {Object.keys(customIcons).length > 0 && (
              <div className="mb-4">
                <h4 className="text-xs font-medium text-muted-foreground mb-2 px-1">Custom Icons</h4>
                <div className="grid grid-cols-8 gap-1">
                  {Object.entries(customIcons).map(([name, url]) => (
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
                      <div className="w-5 h-5 flex items-center justify-center">
                        <img 
                          src={url} 
                          alt={name} 
                          className="max-w-full max-h-full" 
                          onError={(e) => {
                            // Add error handling for broken image URLs
                            console.error(`Failed to load custom icon: ${url}`);
                            (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>';
                          }}
                        />
                      </div>
                      <span className="sr-only">{name}</span>
                    </Button>
                  ))}
                </div>
              </div>
            )}
            
            {/* Lucide icons section */}
            <div>
              <h4 className="text-xs font-medium text-muted-foreground mb-2 px-1">Lucide Icons</h4>
              <div className="grid grid-cols-8 gap-1">
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
          </div>
        </div>
      )}
    </div>
  );
}
