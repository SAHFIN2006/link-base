
import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  ArrowLeft, Plus, Trash, Edit, Search, 
  Brain, Briefcase, Calendar, Code, Cog, Folder, Lock, Monitor, Zap  
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ResourceCard } from "@/components/ui/resource-card";
import { Layout } from "@/components/layout";
import { useDatabase, Resource } from "@/context/database-context";
import { AddResourceDialog, ResourceFormData } from "@/components/dialogs/add-resource-dialog";
import { AddCategoryDialog } from "@/components/dialogs/add-category-dialog";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function CategoryDetails() {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();
  const { 
    getCategory, 
    categories,
    resources, 
    getResourcesByCategory,
    addResource,
    updateResource,
    deleteResource,
    toggleFavorite,
    updateCategory,
    deleteCategory
  } = useDatabase();
  
  const [category, setCategory] = useState<any>(null);
  const [categoryResources, setCategoryResources] = useState<Resource[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddResourceDialogOpen, setIsAddResourceDialogOpen] = useState(false);
  const [isEditCategoryDialogOpen, setIsEditCategoryDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [resourceToEdit, setResourceToEdit] = useState<ResourceFormData | undefined>(undefined);
  
  // Fetch category and resources
  useEffect(() => {
    if (categoryId) {
      const categoryData = getCategory(categoryId);
      if (categoryData) {
        setCategory(categoryData);
        const resources = getResourcesByCategory(categoryId);
        setCategoryResources(resources);
      } else {
        navigate("/categories");
      }
    }
  }, [categoryId, getCategory, getResourcesByCategory, resources, navigate]);
  
  // Filter resources based on search query
  const filteredResources = categoryResources.filter(resource => 
    resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    resource.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  
  // Get category icon
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
  
  // Handle add/edit resource
  const handleSaveResource = (data: ResourceFormData) => {
    if (data.id) {
      updateResource(data.id, data);
    } else {
      addResource({ ...data, categoryId: categoryId || "" });
    }
    setIsAddResourceDialogOpen(false);
    setResourceToEdit(undefined);
  };
  
  // Handle resource edit
  const handleEditResource = (id: string) => {
    const resource = categoryResources.find(r => r.id === id);
    if (resource) {
      setResourceToEdit({
        id: resource.id,
        title: resource.title,
        url: resource.url,
        description: resource.description,
        categoryId: resource.categoryId,
        tags: resource.tags
      });
      setIsAddResourceDialogOpen(true);
    }
  };
  
  // Handle category edit
  const handleUpdateCategory = (data: any) => {
    if (category) {
      updateCategory(category.id, data);
      setCategory({ ...category, ...data });
    }
    setIsEditCategoryDialogOpen(false);
  };
  
  // Handle category delete
  const handleDeleteCategory = () => {
    if (category) {
      deleteCategory(category.id);
      navigate("/categories");
    }
  };

  if (!category) {
    return (
      <Layout>
        <div className="container px-4 mx-auto py-12 text-center">
          <p>Loading...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container px-4 mx-auto py-12">
        {/* Header with Back Button */}
        <div className="mb-8">
          <Button 
            variant="ghost"
            size="sm"
            className="gap-2 mb-4"
            asChild
          >
            <Link to="/categories">
              <ArrowLeft size={16} />
              Back to Categories
            </Link>
          </Button>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-2xl bg-primary/20 flex items-center justify-center text-primary">
                {getCategoryIcon(category.id)}
              </div>
              <div>
                <h1 className="text-4xl font-bold">{category.name}</h1>
                <p className="text-muted-foreground mt-1">{category.description}</p>
              </div>
            </div>
            
            <div className="flex gap-3 self-start">
              <Button 
                variant="outline" 
                size="sm"
                className="gap-2"
                onClick={() => setIsEditCategoryDialogOpen(true)}
              >
                <Edit size={16} />
                Edit
              </Button>
              <Button 
                variant="destructive" 
                size="sm"
                className="gap-2"
                onClick={() => setIsDeleteDialogOpen(true)}
              >
                <Trash size={16} />
                Delete
              </Button>
            </div>
          </div>
        </div>
        
        {/* Resources Section */}
        <div className="mb-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
            <h2 className="text-2xl font-bold">Resources ({categoryResources.length})</h2>
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
          
          {/* Search */}
          <div className="relative mb-8">
            <Search className="absolute left-4 top-3.5 h-5 w-5 text-muted-foreground" />
            <Input 
              type="text" 
              placeholder="Search resources..." 
              className="pl-11 bg-black/40 border-white/10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          {/* Resources Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.map((resource, index) => (
              <ResourceCard
                key={resource.id}
                id={resource.id}
                title={resource.title}
                url={resource.url}
                description={resource.description}
                tags={resource.tags}
                favorite={resource.favorite}
                delay={index}
                onEdit={handleEditResource}
                onDelete={deleteResource}
                onFavorite={toggleFavorite}
              />
            ))}
          </div>
          
          {filteredResources.length === 0 && (
            <div className="text-center py-16">
              <Folder className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-2xl font-semibold mb-2">No resources found</h3>
              <p className="text-muted-foreground mb-6">
                {searchQuery 
                  ? `No resources matching "${searchQuery}"`
                  : "Start by adding your first resource to this category"}
              </p>
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
            </div>
          )}
        </div>
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
      
      {/* Edit Category Dialog */}
      {category && (
        <AddCategoryDialog
          initialData={{
            id: category.id,
            name: category.name,
            description: category.description,
            icon: category.icon
          }}
          isOpen={isEditCategoryDialogOpen}
          onClose={() => setIsEditCategoryDialogOpen(false)}
          onSave={handleUpdateCategory}
        />
      )}
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px] glass-panel border-white/10">
          <DialogHeader>
            <DialogTitle>Delete Category</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this category? This action will also delete all resources within this category.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteCategory}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
