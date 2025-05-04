import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Plus, Search, Filter, Star, StarOff, Folder, 
  BarChart3, ArrowDownAZ, ArrowUpZA, Calendar, Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ResourceCard } from "@/components/ui/resource-card";
import { Layout } from "@/components/layout";
import { useDatabase, Resource } from "@/context/database-context";
import { AddResourceDialog, ResourceFormData } from "@/components/dialogs/add-resource-dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { SplitText, ShinyText, BlurText } from "@/components/animations";
import { toast } from "@/hooks/use-toast";

type SortOption = "newest" | "oldest" | "az" | "za";

export default function MyLinks() {
  const { 
    categories, 
    resources, 
    addResource, 
    updateResource, 
    deleteResource, 
    toggleFavorite 
  } = useDatabase();
  
  const [isAddResourceDialogOpen, setIsAddResourceDialogOpen] = useState(false);
  const [resourceToEdit, setResourceToEdit] = useState<ResourceFormData | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string | "all">("all");
  const [showFavorites, setShowFavorites] = useState(false);
  const [sortOption, setSortOption] = useState<SortOption>("newest");
  
  // Filter and sort resources
  const filteredResources = resources.filter(resource => {
    const matchesSearch = 
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = categoryFilter === "all" || resource.categoryId === categoryFilter;
    const matchesFavorite = !showFavorites || resource.favorite;
    
    return matchesSearch && matchesCategory && matchesFavorite;
  }).sort((a, b) => {
    switch (sortOption) {
      case "newest":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case "oldest":
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case "az":
        return a.title.localeCompare(b.title);
      case "za":
        return b.title.localeCompare(a.title);
      default:
        return 0;
    }
  });
  
  // Define the handleEditResource function
  const handleEditResource = (id: string) => {
    const resource = resources.find(r => r.id === id);
    if (resource) {
      setResourceToEdit({
        id: resource.id,
        title: resource.title,
        url: resource.url,
        description: resource.description,
        categoryId: resource.categoryId,
        tags: resource.tags,
        identificationData: resource.identificationData
      });
      setIsAddResourceDialogOpen(true);
    }
  };
  
  // Handle add/edit resource
  const handleSaveResource = (data: ResourceFormData) => {
    try {
      // Log the identification data for debugging
      if (data.identificationData) {
        console.log("Saving resource with identification data:", data.identificationData);
      }
      
      if (data.id) {
        updateResource(data.id, data);
        toast({
          title: "Resource updated",
          description: "Your resource has been successfully updated",
        });
      } else {
        addResource(data);
        toast({
          title: "Resource added",
          description: "Your resource has been successfully added",
        });
      }
      setIsAddResourceDialogOpen(false);
      setResourceToEdit(undefined);
    } catch (error) {
      console.error("Error saving resource:", error);
      toast({
        title: "Error",
        description: "There was an error saving your resource",
        variant: "destructive",
      });
    }
  };
  
  const getSortOptionIcon = () => {
    switch (sortOption) {
      case "newest": return <Clock size={16} />;
      case "oldest": return <Calendar size={16} />;
      case "az": return <ArrowDownAZ size={16} />;
      case "za": return <ArrowUpZA size={16} />;
    }
  };

  return (
    <Layout>
      <div className="container px-4 mx-auto py-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-4xl font-bold mb-2">
              <SplitText highlightClassName="text-linkblue">My </SplitText>
              <ShinyText>Resources</ShinyText>
            </h1>
            <p className="text-muted-foreground">
              <BlurText startDelay={0.3}>Manage and organize all your saved links</BlurText>
            </p>
          </div>
          
          <Button 
            onClick={() => {
              setResourceToEdit(undefined);
              setIsAddResourceDialogOpen(true);
            }}
            className="gap-2 md:self-start"
          >
            <Plus size={18} />
            Add Resource
          </Button>
        </div>
        
        {/* Filters */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-8">
          <div className="lg:col-span-6">
            <div className="relative">
              <Search className="absolute left-4 top-3.5 h-5 w-5 text-muted-foreground" />
              <Input 
                type="text" 
                placeholder="Search resources..." 
                className="pl-11 bg-black/40 border-white/10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          <div className="lg:col-span-3">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full rounded-md bg-black/40 border-white/10 h-10 px-3 py-2"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="lg:col-span-3 flex gap-3">
            <Button
              variant={showFavorites ? "default" : "outline"}
              className="flex-1 gap-2"
              onClick={() => setShowFavorites(!showFavorites)}
            >
              {showFavorites ? <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" /> : <StarOff className="h-4 w-4" />}
              {showFavorites ? "Favorites" : "All Links"}
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  {getSortOptionIcon()}
                  <span className="sr-only md:not-sr-only md:inline-block">Sort</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-black/90 backdrop-blur-lg border-white/10">
                <DropdownMenuItem 
                  className={sortOption === "newest" ? "bg-primary/20" : ""}
                  onClick={() => setSortOption("newest")}
                >
                  <Clock className="mr-2 h-4 w-4" />
                  <span>Newest First</span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className={sortOption === "oldest" ? "bg-primary/20" : ""}
                  onClick={() => setSortOption("oldest")}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  <span>Oldest First</span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className={sortOption === "az" ? "bg-primary/20" : ""}
                  onClick={() => setSortOption("az")}
                >
                  <ArrowDownAZ className="mr-2 h-4 w-4" />
                  <span>A to Z</span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className={sortOption === "za" ? "bg-primary/20" : ""}
                  onClick={() => setSortOption("za")}
                >
                  <ArrowUpZA className="mr-2 h-4 w-4" />
                  <span>Z to A</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        {/* Resource Stats */}
        <div className="glass-card rounded-xl mb-8 p-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <BarChart3 className="h-5 w-5 text-muted-foreground" />
            <span>
              Showing <span className="font-medium">{filteredResources.length}</span> of <span className="font-medium">{resources.length}</span> resources
            </span>
          </div>
          
          {categoryFilter !== "all" && (
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setCategoryFilter("all")}
            >
              Clear Filter
            </Button>
          )}
        </div>
        
        {/* Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map((resource, index) => (
            <motion.div
              key={resource.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <ResourceCard
                id={resource.id}
                title={resource.title}
                url={resource.url}
                description={resource.description}
                tags={resource.tags}
                favorite={resource.favorite}
                onEdit={handleEditResource}
                onDelete={deleteResource}
                onFavorite={toggleFavorite}
              />
            </motion.div>
          ))}
        </div>
        
        {filteredResources.length === 0 && (
          <motion.div 
            className="text-center py-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Folder className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-2xl font-semibold mb-2">No resources found</h3>
            <p className="text-muted-foreground mb-6">
              {searchQuery 
                ? `No resources matching "${searchQuery}"`
                : categoryFilter !== "all"
                  ? "No resources in this category"
                  : showFavorites
                    ? "You haven't favorited any resources yet"
                    : "Start by adding your first resource"}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => {
                  setResourceToEdit(undefined);
                  setIsAddResourceDialogOpen(true);
                }}
                className="gap-2"
              >
                <Plus size={18} />
                Add New Resource
              </Button>
              
              {(searchQuery || categoryFilter !== "all" || showFavorites) && (
                <Button 
                  variant="outline"
                  onClick={() => {
                    setSearchQuery("");
                    setCategoryFilter("all");
                    setShowFavorites(false);
                  }}
                >
                  Clear All Filters
                </Button>
              )}
            </div>
          </motion.div>
        )}
      </div>
      
      {/* Resource Dialog */}
      <AddResourceDialog
        categories={categories}
        initialData={resourceToEdit}
        isOpen={isAddResourceDialogOpen}
        onClose={() => {
          setIsAddResourceDialogOpen(false);
          setResourceToEdit(undefined);
        }}
        onSave={handleSaveResource}
      />
    </Layout>
  );
}
