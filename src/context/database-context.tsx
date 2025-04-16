
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

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
  addCategory: (category: Omit<Category, "id" | "createdAt" | "updatedAt">) => Category;
  updateCategory: (id: string, data: Partial<Omit<Category, "id" | "createdAt" | "updatedAt">>) => void;
  deleteCategory: (id: string) => void;
  
  // Resources
  resources: Resource[];
  getResourcesByCategory: (categoryId: string) => Resource[];
  getFavoriteResources: () => Resource[];
  addResource: (resource: Omit<Resource, "id" | "createdAt" | "updatedAt" | "favorite">) => Resource;
  updateResource: (id: string, data: Partial<Omit<Resource, "id" | "createdAt" | "updatedAt">>) => void;
  deleteResource: (id: string) => void;
  toggleFavorite: (id: string) => void;
  
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

// Default categories
const DEFAULT_CATEGORIES: Category[] = [
  {
    id: "artificial-intelligence",
    name: "Artificial Intelligence",
    description: "AI tools, models, and research papers",
    icon: "Brain",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "blockchain",
    name: "Blockchain",
    description: "Blockchain technology, cryptocurrencies, and decentralized applications",
    icon: "Database",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "cybersecurity",
    name: "Cybersecurity",
    description: "Security tools, frameworks, and best practices",
    icon: "Shield",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "gaming",
    name: "Gaming",
    description: "Game development resources and gaming platforms",
    icon: "Gamepad",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "machine-learning",
    name: "Machine Learning",
    description: "ML frameworks, algorithms, and datasets",
    icon: "Bot",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "automation",
    name: "Automation",
    description: "Tools and resources for automating workflows",
    icon: "Cog",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "nanotech",
    name: "Nanotech",
    description: "Nanotechnology research and applications",
    icon: "Cpu",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "programming",
    name: "Programming",
    description: "Programming languages, frameworks, and tools",
    icon: "Code",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "statistics",
    name: "Statistics",
    description: "Statistical analysis tools and resources",
    icon: "BarChart",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "data-science",
    name: "Data Science",
    description: "Data analysis, visualization, and data science tools",
    icon: "Layers",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "robotics",
    name: "Robotics",
    description: "Robotics hardware, software, and research",
    icon: "Cpu",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "software",
    name: "Software",
    description: "Software development tools and applications",
    icon: "Folder",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "hardware",
    name: "Hardware",
    description: "Hardware components, devices, and technologies",
    icon: "Cpu",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "tech-stock",
    name: "Tech Stock",
    description: "Latest technological products and innovations",
    icon: "Monitor",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "news-events",
    name: "News & Events",
    description: "Latest tech news and upcoming events",
    icon: "Calendar",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "innovation",
    name: "Innovation",
    description: "Cutting-edge research and technological breakthroughs",
    icon: "Zap",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "vault",
    name: "Vault",
    description: "Secure storage for important resources",
    icon: "Lock",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "business",
    name: "Business",
    description: "Business tools, strategies, and resources",
    icon: "Briefcase",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

// Sample initial resources
const SAMPLE_RESOURCES: Resource[] = [
  {
    id: "resource-1",
    title: "OpenAI",
    url: "https://openai.com",
    description: "Leading artificial intelligence research laboratory",
    categoryId: "artificial-intelligence",
    tags: ["AI", "Machine Learning", "GPT"],
    favorite: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "resource-2",
    title: "GitHub",
    url: "https://github.com",
    description: "Platform for version control and collaboration",
    categoryId: "programming",
    tags: ["Git", "Coding", "Repository"],
    favorite: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "resource-3",
    title: "Stack Overflow",
    url: "https://stackoverflow.com",
    description: "Community for developers to learn and share knowledge",
    categoryId: "programming",
    tags: ["Q&A", "Coding", "Community"],
    favorite: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// Create context with default values
const DatabaseContext = createContext<DatabaseContextType>({
  categories: [],
  getCategory: () => undefined,
  addCategory: () => ({ id: "", name: "", description: "", icon: "", createdAt: "", updatedAt: "" }),
  updateCategory: () => {},
  deleteCategory: () => {},
  
  resources: [],
  getResourcesByCategory: () => [],
  getFavoriteResources: () => [],
  addResource: () => ({ id: "", title: "", url: "", description: "", categoryId: "", tags: [], favorite: false, createdAt: "", updatedAt: "" }),
  updateResource: () => {},
  deleteResource: () => {},
  toggleFavorite: () => {},
  
  searchResources: () => [],
  
  getCategoryStats: () => ({ totalCategories: 0, totalResources: 0, favoriteResources: 0 }),
  
  isLoading: false,
  error: null
});

interface DatabaseProviderProps {
  children: ReactNode;
}

// NOTE: This is a mock implementation with localStorage
// In a real app, this would be replaced with Supabase or another database
export function DatabaseProvider({ children }: DatabaseProviderProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Load data from localStorage on mount
  useEffect(() => {
    try {
      setIsLoading(true);
      
      // Load categories
      const storedCategories = localStorage.getItem("linkbase_categories");
      if (storedCategories) {
        setCategories(JSON.parse(storedCategories));
      } else {
        // Initialize with default categories
        setCategories(DEFAULT_CATEGORIES);
        localStorage.setItem("linkbase_categories", JSON.stringify(DEFAULT_CATEGORIES));
      }
      
      // Load resources
      const storedResources = localStorage.getItem("linkbase_resources");
      if (storedResources) {
        setResources(JSON.parse(storedResources));
      } else {
        // Initialize with sample resources
        setResources(SAMPLE_RESOURCES);
        localStorage.setItem("linkbase_resources", JSON.stringify(SAMPLE_RESOURCES));
      }
      
      setIsLoading(false);
    } catch (err) {
      console.error("Error loading data from localStorage:", err);
      setError("Failed to load data. Please try refreshing the page.");
      setIsLoading(false);
    }
  }, []);
  
  // Save data to localStorage whenever it changes
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem("linkbase_categories", JSON.stringify(categories));
      localStorage.setItem("linkbase_resources", JSON.stringify(resources));
    }
  }, [categories, resources, isLoading]);
  
  // Category operations
  const getCategory = (id: string) => {
    return categories.find(category => category.id === id);
  };
  
  const addCategory = (categoryData: Omit<Category, "id" | "createdAt" | "updatedAt">) => {
    const timestamp = new Date().toISOString();
    // Generate ID from name with kebab-case
    const idFromName = categoryData.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const newCategory: Category = {
      ...categoryData,
      id: idFromName || `category-${Date.now()}`,
      createdAt: timestamp,
      updatedAt: timestamp
    };
    
    setCategories(prev => [...prev, newCategory]);
    return newCategory;
  };
  
  const updateCategory = (id: string, data: Partial<Omit<Category, "id" | "createdAt" | "updatedAt">>) => {
    setCategories(prev => 
      prev.map(category => 
        category.id === id 
          ? { ...category, ...data, updatedAt: new Date().toISOString() } 
          : category
      )
    );
  };
  
  const deleteCategory = (id: string) => {
    setCategories(prev => prev.filter(category => category.id !== id));
    setResources(prev => prev.filter(resource => resource.categoryId !== id));
  };
  
  // Resource operations
  const getResourcesByCategory = (categoryId: string) => {
    return resources.filter(resource => resource.categoryId === categoryId);
  };
  
  const getFavoriteResources = () => {
    return resources.filter(resource => resource.favorite);
  };
  
  const addResource = (resourceData: Omit<Resource, "id" | "createdAt" | "updatedAt" | "favorite">) => {
    const timestamp = new Date().toISOString();
    const newResource: Resource = {
      ...resourceData,
      id: `resource-${Date.now()}`,
      favorite: false,
      createdAt: timestamp,
      updatedAt: timestamp
    };
    
    setResources(prev => [...prev, newResource]);
    return newResource;
  };
  
  const updateResource = (id: string, data: Partial<Omit<Resource, "id" | "createdAt" | "updatedAt">>) => {
    setResources(prev => 
      prev.map(resource => 
        resource.id === id 
          ? { ...resource, ...data, updatedAt: new Date().toISOString() } 
          : resource
      )
    );
  };
  
  const deleteResource = (id: string) => {
    setResources(prev => prev.filter(resource => resource.id !== id));
  };
  
  const toggleFavorite = (id: string) => {
    setResources(prev => 
      prev.map(resource => 
        resource.id === id 
          ? { ...resource, favorite: !resource.favorite, updatedAt: new Date().toISOString() } 
          : resource
      )
    );
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
