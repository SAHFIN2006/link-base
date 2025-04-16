import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

// Define types for our data model
export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  createdAt: string;
  updatedAt: string;
}

export interface Resource {
  id: string;
  title: string;
  url: string;
  description: string;
  categoryId: string;
  tags: string[];
  favorite: boolean;
  createdAt: string;
  updatedAt: string;
}

interface DatabaseContextType {
  // Categories
  categories: Category[];
  getCategory: (id: string) => Category | undefined;
  addCategory: (category: Omit<Category, "id" | "createdAt" | "updatedAt">) => Promise<Category>;
  updateCategory: (id: string, data: Partial<Omit<Category, "id" | "createdAt" | "updatedAt">>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  
  // Resources
  resources: Resource[];
  getResourcesByCategory: (categoryId: string) => Resource[];
  getFavoriteResources: () => Resource[];
  addResource: (resource: Omit<Resource, "id" | "createdAt" | "updatedAt" | "favorite">) => Promise<Resource>;
  updateResource: (id: string, data: Partial<Omit<Resource, "id" | "createdAt" | "updatedAt">>) => Promise<void>;
  deleteResource: (id: string) => Promise<void>;
  toggleFavorite: (id: string) => Promise<void>;
  
  // Search
  searchResources: (query: string) => Resource[];
  
  // Stats
  getCategoryStats: () => {
    totalCategories: number;
    totalResources: number;
    favoriteResources: number;
  };

  // Connection status
  isLoading: boolean;
  error: string | null;
}

// Create context with default values
const DatabaseContext = createContext<DatabaseContextType>({
  categories: [],
  getCategory: () => undefined,
  addCategory: async () => ({ id: "", name: "", description: "", icon: "", createdAt: "", updatedAt: "" }),
  updateCategory: async () => {},
  deleteCategory: async () => {},
  
  resources: [],
  getResourcesByCategory: () => [],
  getFavoriteResources: () => [],
  addResource: async () => ({ id: "", title: "", url: "", description: "", categoryId: "", tags: [], favorite: false, createdAt: "", updatedAt: "" }),
  updateResource: async () => {},
  deleteResource: async () => {},
  toggleFavorite: async () => {},
  
  searchResources: () => [],
  
  getCategoryStats: () => ({ totalCategories: 0, totalResources: 0, favoriteResources: 0 }),
  
  isLoading: false,
  error: null
});

interface DatabaseProviderProps {
  children: ReactNode;
}

export function DatabaseProvider({ children }: DatabaseProviderProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Load data from Supabase on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        
        // Load categories
        const { data: categoriesData, error: categoriesError } = await supabase
          .from('categories')
          .select('*')
          .order('name');
          
        if (categoriesError) throw categoriesError;
        
        // Load resources
        const { data: resourcesData, error: resourcesError } = await supabase
          .from('resources')
          .select('*');
          
        if (resourcesError) throw resourcesError;
        
        // Transform the data to match our interfaces
        const transformedCategories = categoriesData.map(cat => ({
          id: cat.id,
          name: cat.name,
          description: cat.description || '',
          icon: cat.icon,
          createdAt: cat.created_at,
          updatedAt: cat.updated_at
        }));
        
        const transformedResources = resourcesData.map(res => ({
          id: res.id,
          title: res.title,
          url: res.url,
          description: res.description || '',
          categoryId: res.category_id,
          tags: res.tags || [],
          favorite: res.favorite || false,
          createdAt: res.created_at,
          updatedAt: res.updated_at
        }));
        
        setCategories(transformedCategories);
        setResources(transformedResources);
        setIsLoading(false);
      } catch (err) {
        console.error("Error loading data from Supabase:", err);
        setError("Failed to load data. Please try refreshing the page.");
        setIsLoading(false);
        toast({
          title: "Error",
          description: "Failed to load data. Please try refreshing the page.",
          variant: "destructive"
        });
      }
    };
    
    loadData();
    
    // Set up real-time subscriptions
    const categoriesChannel = supabase
      .channel('public:categories')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'categories' },
        (payload) => {
          console.log('Categories change received!', payload);
          loadData(); // Reload all data when changes occur
        }
      )
      .subscribe();
      
    const resourcesChannel = supabase
      .channel('public:resources')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'resources' },
        (payload) => {
          console.log('Resources change received!', payload);
          loadData(); // Reload all data when changes occur
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(categoriesChannel);
      supabase.removeChannel(resourcesChannel);
    };
  }, []);
  
  // Category operations
  const getCategory = (id: string) => {
    return categories.find(category => category.id === id);
  };
  
  const addCategory = async (categoryData: Omit<Category, "id" | "createdAt" | "updatedAt">) => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .insert([{
          name: categoryData.name,
          description: categoryData.description,
          icon: categoryData.icon
        }])
        .select()
        .single();
        
      if (error) throw error;
      
      const newCategory: Category = {
        id: data.id,
        name: data.name,
        description: data.description || '',
        icon: data.icon,
        createdAt: data.created_at,
        updatedAt: data.updated_at
      };
      
      setCategories(prev => [...prev, newCategory]);
      return newCategory;
    } catch (err) {
      console.error("Error adding category:", err);
      toast({
        title: "Error",
        description: "Failed to add category. Please try again.",
        variant: "destructive"
      });
      throw err;
    }
  };
  
  const updateCategory = async (id: string, data: Partial<Omit<Category, "id" | "createdAt" | "updatedAt">>) => {
    try {
      const { error } = await supabase
        .from('categories')
        .update({
          name: data.name,
          description: data.description,
          icon: data.icon
        })
        .eq('id', id);
        
      if (error) throw error;
      
    } catch (err) {
      console.error("Error updating category:", err);
      toast({
        title: "Error",
        description: "Failed to update category. Please try again.",
        variant: "destructive"
      });
      throw err;
    }
  };
  
  const deleteCategory = async (id: string) => {
    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
    } catch (err) {
      console.error("Error deleting category:", err);
      toast({
        title: "Error",
        description: "Failed to delete category. Please try again.",
        variant: "destructive"
      });
      throw err;
    }
  };
  
  // Resource operations
  const getResourcesByCategory = (categoryId: string) => {
    return resources.filter(resource => resource.categoryId === categoryId);
  };
  
  const getFavoriteResources = () => {
    return resources.filter(resource => resource.favorite);
  };
  
  const addResource = async (resourceData: Omit<Resource, "id" | "createdAt" | "updatedAt" | "favorite">) => {
    try {
      const { data, error } = await supabase
        .from('resources')
        .insert([{
          title: resourceData.title,
          url: resourceData.url,
          description: resourceData.description,
          category_id: resourceData.categoryId,
          tags: resourceData.tags
        }])
        .select()
        .single();
        
      if (error) throw error;
      
      const newResource: Resource = {
        id: data.id,
        title: data.title,
        url: data.url,
        description: data.description || '',
        categoryId: data.category_id,
        tags: data.tags || [],
        favorite: data.favorite || false,
        createdAt: data.created_at,
        updatedAt: data.updated_at
      };
      
      setResources(prev => [...prev, newResource]);
      return newResource;
    } catch (err) {
      console.error("Error adding resource:", err);
      toast({
        title: "Error",
        description: "Failed to add resource. Please try again.",
        variant: "destructive"
      });
      throw err;
    }
  };
  
  const updateResource = async (id: string, data: Partial<Omit<Resource, "id" | "createdAt" | "updatedAt">>) => {
    try {
      const { error } = await supabase
        .from('resources')
        .update({
          title: data.title,
          url: data.url,
          description: data.description,
          category_id: data.categoryId,
          tags: data.tags,
          favorite: data.favorite
        })
        .eq('id', id);
        
      if (error) throw error;
      
    } catch (err) {
      console.error("Error updating resource:", err);
      toast({
        title: "Error",
        description: "Failed to update resource. Please try again.",
        variant: "destructive"
      });
      throw err;
    }
  };
  
  const deleteResource = async (id: string) => {
    try {
      const { error } = await supabase
        .from('resources')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
    } catch (err) {
      console.error("Error deleting resource:", err);
      toast({
        title: "Error",
        description: "Failed to delete resource. Please try again.",
        variant: "destructive"
      });
      throw err;
    }
  };
  
  const toggleFavorite = async (id: string) => {
    const resource = resources.find(r => r.id === id);
    if (resource) {
      try {
        const { error } = await supabase
          .from('resources')
          .update({ favorite: !resource.favorite })
          .eq('id', id);
          
        if (error) throw error;
        
      } catch (err) {
        console.error("Error toggling favorite:", err);
        toast({
          title: "Error",
          description: "Failed to update favorite status. Please try again.",
          variant: "destructive"
        });
        throw err;
      }
    }
  };
  
  // Search
  const searchResources = (query: string) => {
    const lowerQuery = query.toLowerCase();
    return resources.filter(
      resource => 
        resource.title.toLowerCase().includes(lowerQuery) ||
        resource.description.toLowerCase().includes(lowerQuery) ||
        resource.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
  };
  
  // Stats - real-time
  const getCategoryStats = () => {
    return {
      totalCategories: categories.length,
      totalResources: resources.length,
      favoriteResources: resources.filter(r => r.favorite).length
    };
  };
  
  return (
    <DatabaseContext.Provider
      value={{
        categories,
        getCategory,
        addCategory,
        updateCategory,
        deleteCategory,
        
        resources,
        getResourcesByCategory,
        getFavoriteResources,
        addResource,
        updateResource,
        deleteResource,
        toggleFavorite,
        
        searchResources,
        
        getCategoryStats,
        
        isLoading,
        error
      }}
    >
      {children}
    </DatabaseContext.Provider>
  );
}

// Custom hook to use the database context
export function useDatabase() {
  const context = useContext(DatabaseContext);
  if (context === undefined) {
    throw new Error("useDatabase must be used within a DatabaseProvider");
  }
  return context;
}
