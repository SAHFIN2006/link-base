
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ExternalLink, Star, Trash, Edit, Share2, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export interface ResourceCardProps {
  id: string;
  title: string;
  url: string;
  description: string;
  tags?: string[];
  favorite?: boolean;
  className?: string;
  delay?: number;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onFavorite?: (id: string, status: boolean) => void;
  identificationData?: {
    owner?: string;
    contactInfo?: string;
    accessType?: 'public' | 'private' | 'restricted';
    createdBy?: string;
  };
}

export function ResourceCard({ 
  id, 
  title, 
  url, 
  description, 
  tags = [], 
  favorite = false,
  className,
  delay = 0,
  onEdit,
  onDelete,
  onFavorite,
  identificationData
}: ResourceCardProps) {
  const [isFavorite, setIsFavorite] = useState(favorite);
  const [isHovered, setIsHovered] = useState(false);
  const { toast } = useToast();
  
  // Update local state when prop changes
  useEffect(() => {
    setIsFavorite(favorite);
  }, [favorite]);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const newStatus = !isFavorite;
    setIsFavorite(newStatus);
    
    if (onFavorite) {
      onFavorite(id, newStatus);
      
      toast({
        title: newStatus ? "Added to favorites" : "Removed from favorites",
        description: newStatus 
          ? "This resource has been added to your favorites" 
          : "This resource has been removed from your favorites",
        duration: 3000
      });
    }
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onEdit) onEdit(id);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onDelete) onDelete(id);
  };

  const handleShareClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title,
        text: description,
        url
      });
    } else {
      navigator.clipboard.writeText(url);
      toast({
        title: "Link copied",
        description: "The link has been copied to your clipboard",
        duration: 3000
      });
    }
  };

  // Display type based on URL
  const isYouTubeVideo = url.includes('youtube.com/embed/') || url.includes('youtu.be/');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: delay * 0.1 }}
      className={cn(
        "glass-card rounded-lg overflow-hidden link-card-hover",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="block p-5"
      >
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg font-medium line-clamp-1">{title}</h3>
          <div className="flex items-center">
            {identificationData && identificationData.owner && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      className="h-8 w-8 rounded-full"
                    >
                      <Info className="h-4 w-4 text-primary/80" />
                      <span className="sr-only">Resource Info</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <div className="text-xs">
                      <p><strong>Owner:</strong> {identificationData.owner}</p>
                      {identificationData.accessType && (
                        <p><strong>Access:</strong> {identificationData.accessType}</p>
                      )}
                      {identificationData.createdBy && (
                        <p><strong>Created by:</strong> {identificationData.createdBy}</p>
                      )}
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            <Button 
              size="icon" 
              variant="ghost" 
              className={cn(
                "h-8 w-8 rounded-full transition-colors",
                isFavorite ? "text-yellow-400 hover:text-yellow-500" : "text-muted-foreground hover:text-foreground"
              )}
              onClick={handleFavoriteClick}
            >
              <Star className={cn("h-4 w-4", isFavorite && "fill-yellow-400")} />
              <span className="sr-only">Favorite</span>
            </Button>
          </div>
        </div>
        
        <p className="text-muted-foreground text-sm line-clamp-2 mb-4">{description}</p>
        
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {isYouTubeVideo && (
              <span className="text-xs px-2 py-1 rounded-full bg-red-500/20 text-red-400">
                #youtube
              </span>
            )}
            {tags.filter(tag => tag !== 'youtube').slice(0, 3).map((tag) => (
              <span 
                key={tag} 
                className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary"
              >
                #{tag}
              </span>
            ))}
            {tags.length > 4 && (
              <span className="text-xs px-2 py-1 rounded-full bg-gray-500/20 text-gray-400">
                +{tags.length - 4} more
              </span>
            )}
          </div>
        )}
        
        <div className="flex items-center justify-between mt-auto pt-2 border-t border-border">
          <div className="text-xs text-muted-foreground truncate max-w-[180px]">
            {isYouTubeVideo ? 'YouTube Video' : new URL(url).hostname}
          </div>
          
          <div className={cn(
            "flex items-center gap-1 transition-opacity",
            isHovered ? "opacity-100" : "opacity-0"
          )}>
            <Button
              size="icon"
              variant="ghost"
              className="h-7 w-7 rounded-full"
              onClick={handleEditClick}
            >
              <Edit className="h-3.5 w-3.5" />
              <span className="sr-only">Edit</span>
            </Button>
            
            <Button
              size="icon"
              variant="ghost"
              className="h-7 w-7 rounded-full"
              onClick={handleShareClick}
            >
              <Share2 className="h-3.5 w-3.5" />
              <span className="sr-only">Share</span>
            </Button>
            
            <Button
              size="icon"
              variant="ghost"
              className="h-7 w-7 rounded-full text-destructive hover:text-destructive"
              onClick={handleDeleteClick}
            >
              <Trash className="h-3.5 w-3.5" />
              <span className="sr-only">Delete</span>
            </Button>
            
            <Button
              size="icon"
              variant="ghost"
              className="h-7 w-7 rounded-full ml-1"
              asChild
            >
              <a href={url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-3.5 w-3.5" />
                <span className="sr-only">Visit</span>
              </a>
            </Button>
          </div>
        </div>
      </a>
    </motion.div>
  );
}
