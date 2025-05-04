
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useDatabase } from "@/context/database-context";
import { FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Plus, Info, Video, Tag } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";

export interface ResourceFormData {
  id?: string;
  title: string;
  url: string;
  description: string;
  categoryId: string;
  tags: string[];
  identificationData?: {
    owner?: string;
    contactInfo?: string;
    accessType?: 'public' | 'private' | 'restricted';
    createdBy?: string;
  };
}

interface AddResourceDialogProps {
  categories: { id: string; name: string }[];
  initialData?: ResourceFormData;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ResourceFormData) => void;
}

// Common tag suggestions by category
const commonTags: Record<string, string[]> = {
  // Default tags that could apply to any category
  default: ["tutorial", "guide", "reference", "documentation", "free", "paid", "tool", "video", "book", "course"],
  
  // Technology specific tags
  programming: ["javascript", "python", "react", "node", "typescript", "sql", "css", "html", "api", "library", "framework"],
  "artificial-intelligence": ["machine-learning", "neural-networks", "deep-learning", "chatgpt", "natural-language", "computer-vision", "llm", "data-science"],
  cybersecurity: ["encryption", "security", "privacy", "hacking", "certificates", "authentication", "firewall", "pentest"],
  blockchain: ["crypto", "ethereum", "bitcoin", "nft", "web3", "defi", "wallet", "smart-contract"],
  cloud: ["aws", "azure", "gcp", "serverless", "kubernetes", "docker", "devops", "saas"],
  design: ["ui", "ux", "figma", "sketch", "prototype", "typography", "color", "accessibility"],
  gaming: ["unity", "unreal", "3d", "game-design", "level-design", "assets", "physics", "multiplayer"],
};

export function AddResourceDialog({
  categories,
  initialData,
  isOpen,
  onClose,
  onSave,
}: AddResourceDialogProps) {
  const { resources } = useDatabase();
  const [formData, setFormData] = useState<ResourceFormData>(
    initialData || {
      title: "",
      url: "",
      description: "",
      categoryId: categories[0]?.id || "",
      tags: [],
      identificationData: {
        owner: "",
        contactInfo: "",
        accessType: 'public',
        createdBy: ""
      }
    }
  );
  const [tagInput, setTagInput] = useState("");
  const [suggestedTags, setSuggestedTags] = useState<string[]>([]);
  const [mediaUrl, setMediaUrl] = useState("");
  const [activeTab, setActiveTab] = useState<string>("basic");
  
  const isEditing = !!initialData?.id;
  
  // Update suggested tags when category changes
  useEffect(() => {
    if (formData.categoryId) {
      const categoryName = categories.find(c => c.id === formData.categoryId)?.name.toLowerCase() || "";
      
      // Get category-specific tags from our predefined list
      const categorySpecificTags = Object.keys(commonTags).find(key => 
        categoryName.includes(key) || key.includes(categoryName)
      );
      
      // Get tags from similar resources in the same category
      const tagsFromSameCategory = resources
        .filter(r => r.categoryId === formData.categoryId)
        .flatMap(r => r.tags || []);
        
      // Combine and deduplicate tags
      const combined = [...new Set([
        ...(categorySpecificTags ? commonTags[categorySpecificTags] : []),
        ...commonTags.default,
        ...tagsFromSameCategory
      ])];
      
      // Filter out tags already added to the current resource
      const filtered = combined.filter(tag => !formData.tags.includes(tag));
      
      // Sort by frequency of use in existing resources
      const tagCounts = filtered.reduce<Record<string, number>>((acc, tag) => {
        const count = resources.filter(r => (r.tags || []).includes(tag)).length;
        acc[tag] = count;
        return acc;
      }, {});
      
      const sorted = filtered.sort((a, b) => (tagCounts[b] || 0) - (tagCounts[a] || 0));
      
      // Take top 10 suggestions
      setSuggestedTags(sorted.slice(0, 10));
    }
  }, [formData.categoryId, formData.tags, categories, resources]);
  
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    
    // Handle nested identificationData fields
    if (name.startsWith('identificationData.')) {
      const field = name.split('.')[1];
      setFormData((prev) => ({
        ...prev,
        identificationData: {
          ...prev.identificationData,
          [field]: value
        }
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleAddTag = (tag: string = tagInput.trim()) => {
    if (tag && !formData.tags.includes(tag)) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tag],
      }));
      setTagInput("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }));
  };

  const handleAddMedia = () => {
    if (mediaUrl.trim()) {
      // Extract YouTube video ID
      let videoId = '';
      try {
        if (mediaUrl.includes('youtube.com/watch?v=')) {
          videoId = new URL(mediaUrl).searchParams.get('v') || '';
        } else if (mediaUrl.includes('youtu.be/')) {
          videoId = mediaUrl.split('youtu.be/')[1]?.split('?')[0];
        }
      } catch (error) {
        toast({
          title: "Invalid URL",
          description: "Please enter a valid YouTube URL",
          variant: "destructive",
        });
        return;
      }
      
      if (videoId) {
        // For YouTube videos, store in a format that indicates it's a media resource
        setFormData(prev => ({
          ...prev,
          url: `https://www.youtube.com/embed/${videoId}`,
          tags: [...prev.tags, 'video', 'youtube']
        }));
        setMediaUrl('');
      } else {
        // Handle other media types if needed
        setFormData(prev => ({
          ...prev,
          url: mediaUrl,
          tags: [...prev.tags, 'media']
        }));
        setMediaUrl('');
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form data
    if (!formData.title.trim()) {
      toast({
        title: "Title is required",
        description: "Please enter a title for your resource",
        variant: "destructive",
      });
      return;
    }
    
    if (!formData.url.trim()) {
      toast({
        title: "URL is required",
        description: "Please enter a URL for your resource",
        variant: "destructive",
      });
      return;
    }
    
    // Validate identification data if on that tab
    if (activeTab === "identification" && formData.identificationData) {
      if (!formData.identificationData.owner) {
        toast({
          title: "Owner field is required",
          description: "Please provide the owner information",
          variant: "destructive",
        });
        return;
      }
    }
    
    onSave(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[650px] max-h-[90vh] overflow-y-auto glass-panel border-white/10">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{isEditing ? "Edit Resource" : "Add New Resource"}</DialogTitle>
            <DialogDescription>
              {isEditing
                ? "Update the details of your resource link."
                : "Add a new resource link to your collection."}
            </DialogDescription>
          </DialogHeader>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="basic" className="text-xs sm:text-sm">Basic Info</TabsTrigger>
              <TabsTrigger value="tags" className="text-xs sm:text-sm">Tags & Media</TabsTrigger>
              <TabsTrigger value="identification" className="text-xs sm:text-sm">Identification</TabsTrigger>
            </TabsList>
            
            <TabsContent value="basic" className="space-y-4 mt-2">
              <div className="grid grid-cols-1 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Resource title"
                    required
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="url">URL</Label>
                  <Input
                    id="url"
                    name="url"
                    type="url"
                    value={formData.url}
                    onChange={handleChange}
                    placeholder="https://example.com"
                    required
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Brief description of the resource"
                    rows={2}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="categoryId">Category</Label>
                  <select
                    id="categoryId"
                    name="categoryId"
                    value={formData.categoryId}
                    onChange={handleChange}
                    className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    required
                  >
                    <option value="" disabled>Select a category</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="tags" className="space-y-4 mt-2">
              <Card className="border border-white/10 bg-black/20">
                <CardContent className="pt-4">
                  <div className="grid gap-2">
                    <div className="flex items-center mb-2">
                      <Tag size={16} className="mr-2" />
                      <Label htmlFor="tags">Tags</Label>
                    </div>
                    <div className="flex">
                      <Input
                        id="tags"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        placeholder="Add tags (press Enter)"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddTag();
                          }
                        }}
                      />
                      <Button 
                        type="button" 
                        variant="secondary"
                        onClick={() => handleAddTag()}
                        className="ml-2"
                      >
                        <Plus size={16} />
                      </Button>
                    </div>
                    
                    {/* Suggested tags */}
                    {suggestedTags.length > 0 && (
                      <div className="mt-2">
                        <p className="text-xs text-muted-foreground mb-1">Suggested tags:</p>
                        <div className="flex flex-wrap gap-1">
                          {suggestedTags.slice(0, 5).map(tag => (
                            <Button
                              key={tag}
                              type="button"
                              variant="outline"
                              size="sm"
                              className="h-7 text-xs"
                              onClick={() => handleAddTag(tag)}
                            >
                              {tag}
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {formData.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {formData.tags.map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/20 text-primary-foreground"
                          >
                            {tag}
                            <button
                              type="button"
                              onClick={() => handleRemoveTag(tag)}
                              className="ml-1.5 text-primary-foreground hover:text-white inline-flex h-4 w-4 items-center justify-center rounded-full"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
              
              {/* Media URL input */}
              <Card className="border border-white/10 bg-black/20">
                <CardContent className="pt-4">
                  <div className="grid gap-2">
                    <div className="flex items-center mb-2">
                      <Video size={16} className="mr-2" />
                      <Label htmlFor="mediaUrl">Add Media Resource</Label>
                    </div>
                    <div className="flex">
                      <Input
                        id="mediaUrl"
                        value={mediaUrl}
                        onChange={(e) => setMediaUrl(e.target.value)}
                        placeholder="https://youtube.com/watch?v=..."
                        type="url"
                      />
                      <Button 
                        type="button" 
                        variant="secondary"
                        onClick={handleAddMedia}
                        className="ml-2"
                        disabled={!mediaUrl.trim()}
                      >
                        <Plus size={16} />
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Add YouTube videos or other media resources
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="identification" className="space-y-4 mt-2">
              <Card className="border border-white/10 bg-black/20">
                <CardContent className="pt-4">
                  <div className="flex items-center mb-3">
                    <Info size={16} className="mr-2" />
                    <h4 className="font-medium">Resource Identification</h4>
                  </div>
                  
                  <div className="grid gap-3">
                    <div className="grid gap-1.5">
                      <Label htmlFor="owner">Owner <span className="text-destructive">*</span></Label>
                      <Input
                        id="owner"
                        name="identificationData.owner"
                        value={formData.identificationData?.owner || ""}
                        onChange={handleChange}
                        placeholder="Resource owner"
                      />
                    </div>
                    
                    <div className="grid gap-1.5">
                      <Label htmlFor="contactInfo">Contact Information</Label>
                      <Input
                        id="contactInfo"
                        name="identificationData.contactInfo"
                        value={formData.identificationData?.contactInfo || ""}
                        onChange={handleChange}
                        placeholder="Contact email or phone"
                      />
                    </div>
                    
                    <div className="grid gap-1.5">
                      <Label htmlFor="accessType">Access Type</Label>
                      <select
                        id="accessType"
                        name="identificationData.accessType"
                        value={formData.identificationData?.accessType || "public"}
                        onChange={handleChange}
                        className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <option value="public">Public</option>
                        <option value="private">Private</option>
                        <option value="restricted">Restricted</option>
                      </select>
                    </div>
                    
                    <div className="grid gap-1.5">
                      <Label htmlFor="createdBy">Created By</Label>
                      <Input
                        id="createdBy"
                        name="identificationData.createdBy"
                        value={formData.identificationData?.createdBy || ""}
                        onChange={handleChange}
                        placeholder="Creator name"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          
          <DialogFooter className="mt-6">
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {isEditing ? "Save Changes" : "Add Resource"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
