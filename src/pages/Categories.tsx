
import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Folder, Filter, Search, ArrowRight, Brain, Briefcase, Calendar, Code, Cog, Lock, Monitor, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CategoryCard } from "@/components/ui/category-card";
import { Layout } from "@/components/layout";
import { useDatabase } from "@/context/database-context";
import { AddCategoryDialog, CategoryFormData } from "@/components/dialogs/add-category-dialog";

export default function Categories() {
  const { categories, addCategory } = useDatabase();
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddCategoryDialogOpen, setIsAddCategoryDialogOpen] = useState(false);
  
  // Filter categories based on search query
  const filteredCategories = categories.filter(category => 
    category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.description.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Get default icons for categories
  const getCategoryIcon = (categoryId: string) => {
    switch(categoryId) {
      case "tech-stock": return <Monitor size={32} />;
      case "news-events": return <Calendar size={32} />;
      case "innovation": return <Zap size={32} />;
      case "vault": return <Lock size={32} />;
      case "automation": return <Cog size={32} />;
      case "business": return <Briefcase size={32} />;
      case "artificial-intelligence": return <Brain size={32} />;
      case "programming": return <Code size={32} />;
      default: return <Folder size={32} />;
    }
  };
  
  const handleAddCategory = (data: CategoryFormData) => {
    addCategory(data);
    setIsAddCategoryDialogOpen(false);
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
                className="pl-11 bg-black/40 border-white/10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          <div>
            <Button variant="outline" className="w-full gap-2">
              <Filter size={16} />
              Sort Categories
            </Button>
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
