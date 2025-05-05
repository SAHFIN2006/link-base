
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import * as LucideIcons from "lucide-react";
import { 
  Plus, Filter, Search, ArrowDownAZ, ArrowUpZA, Calendar as CalendarIcon, Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CategoryCard } from "@/components/ui/category-card";
import { Layout } from "@/components/layout";
import { useDatabase } from "@/context/database-context";
import { AddCategoryDialog, CategoryFormData } from "@/components/dialogs/add-category-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SplitText, ShinyText } from "@/components/animations";

type SortOption = "az" | "za" | "newest" | "oldest";

export default function Categories() {
  const { categories, addCategory } = useDatabase();
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddCategoryDialogOpen, setIsAddCategoryDialogOpen] = useState(false);
  const [sortOption, setSortOption] = useState<SortOption>("az");
  
  // Filter categories based on search query
  const filteredCategories = useMemo(() => {
    // First filter by search query
    const filtered = categories.filter(category => 
      category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Then sort based on sortOption
    return [...filtered].sort((a, b) => {
      switch (sortOption) {
        case "az":
          return a.name.localeCompare(b.name);
        case "za":
          return b.name.localeCompare(a.name);
        case "newest":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case "oldest":
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        default:
          return 0;
      }
    });
  }, [categories, searchQuery, sortOption]);
  
  // Get category icons based on icon name stored in database
  const getCategoryIcon = (category) => {
    if (!category.icon) return <LucideIcons.Folder size={32} />;
    
    if (category.icon.startsWith('CustomIcon_')) {
      const customIcons = JSON.parse(localStorage.getItem('customIcons') || '{}');
      const iconUrl = customIcons[category.icon];
      if (iconUrl) {
        return (
          <img 
            src={iconUrl} 
            alt={category.name} 
            className="h-8 w-8" 
            onError={(e) => {
              // Fallback to default icon on error
              e.currentTarget.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2" ry="2"></rect><path d="M9 8h6"></path><path d="M12 16v-4"></path></svg>';
            }}
          />
        );
      }
    }
    
    const IconComponent = LucideIcons[category.icon];
    if (IconComponent) {
      return <IconComponent size={32} />;
    }
    
    return <LucideIcons.Folder size={32} />;
  };
  
  const handleAddCategory = (data: CategoryFormData) => {
    addCategory(data);
    setIsAddCategoryDialogOpen(false);
  };

  const getSortOptionIcon = () => {
    switch (sortOption) {
      case "az": return <ArrowDownAZ size={16} />;
      case "za": return <ArrowUpZA size={16} />;
      case "newest": return <Clock size={16} />;
      case "oldest": return <CalendarIcon size={16} />;
    }
  };

  const getSortOptionText = () => {
    switch (sortOption) {
      case "az": return "A to Z";
      case "za": return "Z to A";
      case "newest": return "Newest First";
      case "oldest": return "Oldest First";
    }
  };

  return (
    <Layout>
      <div className="container px-4 mx-auto py-12">
        {/* Header with animations - Added spacing between Explore and Categories */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-4xl font-bold mb-2">
              <SplitText highlightClassName="text-linkblue">Explore </SplitText>
              <span className="ml-2"><ShinyText>Categories</ShinyText></span>
            </h1>
            <p className="text-muted-foreground">
              Browse all categories or create your own custom categories
            </p>
          </div>
          
          <Button 
            onClick={() => setIsAddCategoryDialogOpen(true)}
            className="gap-2 md:self-start"
          >
            <Plus size={18} />
            Add Category
          </Button>
        </div>
        
        {/* Search and Filters */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-10">
          <div className="lg:col-span-3">
            <div className="relative">
              <Search className="absolute left-4 top-3.5 h-5 w-5 text-muted-foreground" />
              <Input 
                type="text" 
                placeholder="Search categories..." 
                className="pl-11 bg-background border-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          <div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full gap-2">
                  {getSortOptionIcon()}
                  Sort: {getSortOptionText()}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setSortOption("az")} className={sortOption === "az" ? "bg-primary/20" : ""}>
                  <ArrowDownAZ className="mr-2 h-4 w-4" />
                  <span>A to Z</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortOption("za")} className={sortOption === "za" ? "bg-primary/20" : ""}>
                  <ArrowUpZA className="mr-2 h-4 w-4" />
                  <span>Z to A</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortOption("newest")} className={sortOption === "newest" ? "bg-primary/20" : ""}>
                  <Clock className="mr-2 h-4 w-4" />
                  <span>Newest First</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortOption("oldest")} className={sortOption === "oldest" ? "bg-primary/20" : ""}>
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  <span>Oldest First</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        {/* Categories Grid - Modified for 3x3 grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {filteredCategories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <CategoryCard
                title={category.name}
                icon={getCategoryIcon(category)}
                path={`/category/${category.id}`}
              />
            </motion.div>
          ))}
        </div>
        
        {filteredCategories.length === 0 && (
          <div className="text-center py-20">
            <LucideIcons.Folder className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-2xl font-semibold mb-2">No categories found</h3>
            <p className="text-muted-foreground mb-6">
              {searchQuery 
                ? `No categories matching "${searchQuery}"`
                : "Start by creating your first category"}
            </p>
            <Button 
              onClick={() => setIsAddCategoryDialogOpen(true)}
              className="gap-2"
            >
              <Plus size={18} />
              Add New Category
            </Button>
          </div>
        )}
      </div>
      
      {/* Custom Category Dialog */}
      <AddCategoryDialog
        isOpen={isAddCategoryDialogOpen}
        onClose={() => setIsAddCategoryDialogOpen(false)}
        onSave={handleAddCategory}
      />
    </Layout>
  );
}
