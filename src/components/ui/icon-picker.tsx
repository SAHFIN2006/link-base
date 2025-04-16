
import { useState } from "react";
import { 
  AlertCircle, AlignJustify, Archive, BarChart3, Bell, Bookmark, 
  Book, Box, Briefcase, Calendar, Clock, Code, Cog, Database, 
  FileText, Folder, Globe, Headphones, Heart, Home, Image, 
  Info, Link, Lock, Mail, Map, MessageSquare, Monitor, Moon, 
  Music, Package, PenTool, Phone, Play, Settings, Share, 
  ShoppingBag, Star, Sun, Tag, Terminal, Trash, 
  TrendingUp, User, Video, Zap, type LucideIcon, 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// List of available icons
const iconMap: Record<string, LucideIcon> = {
  AlertCircle, AlignJustify, Archive, BarChart3, Bell, Bookmark, 
  Book, Box, Briefcase, Calendar, Clock, Code, Cog, Database, 
  FileText, Folder, Globe, Headphones, Heart, Home, Image, 
  Info, Link, Lock, Mail, Map, MessageSquare, Monitor, Moon, 
  Music, Package, PenTool, Phone, Play, Settings, Share, 
  ShoppingBag, Star, Sun, Tag, Terminal, Trash, 
  TrendingUp, User, Video, Zap
};

interface IconPickerProps {
  selectedIcon: string;
  onSelectIcon: (iconName: string) => void;
}

export function IconPicker({ selectedIcon, onSelectIcon }: IconPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  const IconComponent = iconMap[selectedIcon] || Folder;

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
        <div className="absolute z-50 w-72 mt-2 p-2 bg-black/90 backdrop-blur-xl border border-white/10 rounded-lg shadow-lg grid grid-cols-6 gap-2 max-h-64 overflow-y-auto">
          {Object.entries(iconMap).map(([name, Icon]) => (
            <Button
              key={name}
              type="button"
              variant="ghost"
              size="icon"
              className={cn(
                "w-10 h-10",
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
          ))}
        </div>
      )}
    </div>
  );
}
