
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { 
  Plus, Folder, Filter, Search, ArrowRight, Brain, Briefcase, Calendar, 
  Code, Cog, Lock, Monitor, Zap, Database, Shield, Cpu, Gamepad, BarChart, 
  Bot, AlertCircle, Layers, ArrowDownAZ, ArrowUpZA, Calendar as CalendarIcon, Clock
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
  
  // Get default icons for categories
  const getCategoryIcon = (categoryId: string) => {
    switch(categoryId) {
      case "artificial-intelligence": return <Brain size={32} />;
      case "blockchain": return <Database size={32} />;
      case "cybersecurity": return <Shield size={32} />;
      case "gaming": return <Gamepad size={32} />;
      case "machine-learning": return <Bot size={32} />;
      case "automation": return <Cog size={32} />;
      case "nanotech": return <Cpu size={32} className="rotate-45" />;
      case "programming": return <Code size={32} />;
      case "statistics": return <BarChart size={32} />;
      case "data-science": return <Layers size={32} />;
      case "robotics": return <Cpu size={32} />;
      case "software": return <Folder size={32} />;
      case "hardware": return <Cpu size={32} />;
      case "tech-stock": return <Monitor size={32} />;
      case "news-events": return <Calendar size={32} />;
      case "innovation": return <Zap size={32} />;
      case "vault": return <Lock size={32} />;
      case "business": return <Briefcase size={32} />;
      default: return <AlertCircle size={32} />;
    }
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
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-4xl font-bold mb-2">Explore Categories</h1>
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
                className="pl-11 bg-black/40 dark:bg-black/40 border-white/10 dark:border-white/10"
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
        
        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCategories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <CategoryCard
                title={category.name}
                icon={getCategoryIcon(category.id)}
                path={`/category/${category.id}`}
              />
            </motion.div>
          ))}
        </div>
        
        {filteredCategories.length === 0 && (
          <div className="text-center py-20">
            <Folder className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
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
