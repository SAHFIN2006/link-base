import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

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

export interface Note {
  id: string;
  title: string;
  content: string;
  categoryId: string;
  created_at: string;
  updated_at: string;
}

export interface FileResource {
  id: string;
  name: string;
  path: string;
  size: number;
  type: string;
  categoryId: string;
  url: string;
  created_at: string;
}

interface DatabaseContextType {
  categories: Category[];
  getCategory: (id: string) => Category | undefined;
  addCategory: (category: Omit<Category, "id" | "createdAt" | "updatedAt">) => Promise<Category>;
  updateCategory: (id: string, data: Partial<Omit<Category, "id" | "createdAt" | "updatedAt">>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  
  resources: Resource[];
  getResourcesByCategory: (categoryId: string) => Resource[];
  getFavoriteResources: () => Resource[];
  addResource: (resource: Omit<Resource, "id" | "createdAt" | "updatedAt" | "favorite">) => Promise<Resource>;
  updateResource: (id: string, data: Partial<Omit<Resource, "id" | "createdAt" | "updatedAt">>) => Promise<void>;
  deleteResource: (id: string) => Promise<void>;
  toggleFavorite: (id: string) => Promise<void>;
  
  notes: Note[];
  getNotesByCategory: (categoryId: string) => Note[];
  addNote: (noteData: Omit<Note, "id" | "created_at" | "updated_at">) => Promise<Note>;
  updateNote: (id: string, data: Partial<Omit<Note, "id" | "created_at" | "updated_at">>) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
  
  files: FileResource[];
  getFilesByCategory: (categoryId: string) => FileResource[];
  addFile: (fileData: Omit<FileResource, "id" | "created_at">) => Promise<FileResource>;
  deleteFile: (id: string, path: string) => Promise<void>;
  
  searchResources: (query: string) => Resource[];
  
  getCategoryStats: () => {
    totalCategories: number;
    totalResources: number;
    favoriteResources: number;
  };
  
  importData: (data: { categories: Category[], resources: Resource[] }) => Promise<void>;
  exportData: () => { categories: Category[], resources: Resource[] };

  isLoading: boolean;
  error: string | null;
}

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
  
  notes: [],
  getNotesByCategory: () => [],
  addNote: async () => ({ id: "", title: "", content: "", categoryId: "", created_at: "", updated_at: "" }),
  updateNote: async () => {},
  deleteNote: async () => {},
  
  files: [],
  getFilesByCategory: () => [],
  addFile: async () => ({ id: "", name: "", path: "", size: 0, type: "", url: "", categoryId: "", created_at: "" }),
  deleteFile: async () => {},
  
  searchResources: () => [],
  
  getCategoryStats: () => ({ totalCategories: 0, totalResources: 0, favoriteResources: 0 }),
  
  importData: async () => {},
  exportData: () => ({ categories: [], resources: [] }),
  
  isLoading: false,
  error: null
});

interface DatabaseProviderProps {
  children: ReactNode;
}

export function DatabaseProvider({ children }: DatabaseProviderProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [files, setFiles] = useState<FileResource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        
        const { data: categoriesData, error: categoriesError } = await supabase
          .from('categories')
          .select('*')
          .order('name');
          
        if (categoriesError) throw categoriesError;
        
        const { data: resourcesData, error: resourcesError } = await supabase
          .from('resources')
          .select('*');
          
        if (resourcesError) throw resourcesError;
        
        const { data: notesData, error: notesError } = await supabase
          .from('notes')
          .select('*');
          
        if (notesError) throw notesError;
        
        const { data: filesData, error: filesError } = await supabase
          .from('files')
          .select('*');
          
        if (filesError) throw filesError;
        
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
        
        const transformedNotes = notesData.map(note => ({
          id: note.id,
          title: note.title,
          content: note.content || '',
          categoryId: note.category_id,
          created_at: note.created_at,
          updated_at: note.updated_at
        }));
        
        const transformedFiles = filesData.map(file => ({
          id: file.id,
          name: file.name,
          path: file.path,
          size: file.size,
          type: file.type,
          url: file.url,
          categoryId: file.category_id,
          created_at: file.created_at
        }));
        
        setCategories(transformedCategories);
        setResources(transformedResources);
        setNotes(transformedNotes);
        setFiles(transformedFiles);
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
      
    const notesChannel = supabase
      .channel('public:notes')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'notes' },
        (payload) => {
          console.log('Notes change received!', payload);
          loadData(); // Reload all data when changes occur
        }
      )
      .subscribe();
      
    const filesChannel = supabase
      .channel('public:files')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'files' },
        (payload) => {
          console.log('Files change received!', payload);
          loadData(); // Reload all data when changes occur
        }
      )
      .subscribe();

    const handleImportData = (e: CustomEvent) => {
      if (e.detail) {
        importData(e.detail);
      }
    };

    window.addEventListener('import-data', handleImportData as EventListener);
      
    return () => {
      supabase.removeChannel(categoriesChannel);
      supabase.removeChannel(resourcesChannel);
      supabase.removeChannel(notesChannel);
      supabase.removeChannel(filesChannel);
      window.removeEventListener('import-data', handleImportData as EventListener);
    };
  }, []);
  
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
  
  const getNotesByCategory = (categoryId: string) => {
    return notes.filter(note => note.categoryId === categoryId);
  };

  const addNote = async (noteData: Omit<Note, "id" | "created_at" | "updated_at">) => {
    try {
      const { data, error } = await supabase
        .from('notes')
        .insert([{
          title: noteData.title,
          content: noteData.content,
          category_id: noteData.categoryId
        }])
        .select()
        .single();
        
      if (error) throw error;
      
      const newNote: Note = {
        id: data.id,
        title: data.title,
        content: data.content || '',
        categoryId: data.category_id,
        created_at: data.created_at,
        updated_at: data.updated_at
      };
      
      setNotes(prev => [...prev, newNote]);
      return newNote;
    } catch (err) {
      console.error("Error adding note:", err);
      toast({
        title: "Error",
        description: "Failed to add note. Please try again.",
        variant: "destructive"
      });
      throw err;
    }
  };

  const updateNote = async (id: string, data: Partial<Omit<Note, "id" | "created_at" | "updated_at">>) => {
    try {
      const { error } = await supabase
        .from('notes')
        .update({
          title: data.title,
          content: data.content,
          category_id: data.categoryId
        })
        .eq('id', id);
        
      if (error) throw error;
      
      setNotes(prevNotes => 
        prevNotes.map(note => 
          note.id === id 
            ? { ...note, ...data, updated_at: new Date().toISOString() } 
            : note
        )
      );
    } catch (err) {
      console.error("Error updating note:", err);
      toast({
        title: "Error",
        description: "Failed to update note. Please try again.",
        variant: "destructive"
      });
      throw err;
    }
  };

  const deleteNote = async (id: string) => {
    try {
      const { error } = await supabase
        .from('notes')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      setNotes(prevNotes => prevNotes.filter(note => note.id !== id));
    } catch (err) {
      console.error("Error deleting note:", err);
      toast({
        title: "Error",
        description: "Failed to delete note. Please try again.",
        variant: "destructive"
      });
      throw err;
    }
  };

  const getFilesByCategory = (categoryId: string) => {
    return files.filter(file => file.categoryId === categoryId);
  };

  const addFile = async (fileData: Omit<FileResource, "id" | "created_at">) => {
    try {
      const { data, error } = await supabase
        .from('files')
        .insert([{
          name: fileData.name,
          path: fileData.path,
          size: fileData.size,
          type: fileData.type,
          url: fileData.url,
          category_id: fileData.categoryId
        }])
        .select()
        .single();
        
      if (error) throw error;
      
      const newFile: FileResource = {
        id: data.id,
        name: data.name,
        path: data.path,
        size: data.size,
        type: data.type,
        url: data.url,
        categoryId: data.category_id,
        created_at: data.created_at
      };
      
      setFiles(prev => [...prev, newFile]);
      return newFile;
    } catch (err) {
      console.error("Error adding file:", err);
      toast({
        title: "Error",
        description: "Failed to add file. Please try again.",
        variant: "destructive"
      });
      throw err;
    }
  };

  const deleteFile = async (id: string, path: string) => {
    try {
      const { error: dbError } = await supabase
        .from('files')
        .delete()
        .eq('id', id);
        
      if (dbError) throw dbError;
      
      setFiles(prevFiles => prevFiles.filter(file => file.id !== id));
    } catch (err) {
      console.error("Error deleting file:", err);
      toast({
        title: "Error",
        description: "Failed to delete file. Please try again.",
        variant: "destructive"
      });
      throw err;
    }
  };

  const searchResources = (query: string) => {
    const lowerQuery = query.toLowerCase();
    return resources.filter(
      resource => 
        resource.title.toLowerCase().includes(lowerQuery) ||
        resource.description.toLowerCase().includes(lowerQuery) ||
        resource.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
  };
  
  const getCategoryStats = () => {
    return {
      totalCategories: categories.length,
      totalResources: resources.length,
      favoriteResources: resources.filter(r => r.favorite).length
    };
  };
  
  const importData = async (data: { categories: Category[], resources: Resource[] }) => {
    try {
      setIsLoading(true);
      
      if (data.categories && data.categories.length > 0) {
        const categoriesToImport = data.categories.map(cat => ({
          name: cat.name,
          description: cat.description,
          icon: cat.icon
        }));
        
        const { error } = await supabase
          .from('categories')
          .insert(categoriesToImport);
          
        if (error) throw error;
      }
      
      if (data.resources && data.resources.length > 0) {
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const { data: freshCategories } = await supabase
          .from('categories')
          .select('*');
          
        const categoryMap = new Map();
        freshCategories.forEach((cat: any) => {
          categoryMap.set(cat.name, cat.id);
        });
        
        const resourcesToImport = data.resources.map(res => {
          const categoryName = data.categories.find(c => c.id === res.categoryId)?.name;
          const categoryId = categoryName ? categoryMap.get(categoryName) : null;
          
          return {
            title: res.title,
            url: res.url,
            description: res.description,
            category_id: categoryId || null,
            tags: res.tags,
            favorite: res.favorite
          };
        });
        
        const { error } = await supabase
          .from('resources')
          .insert(resourcesToImport);
          
        if (error) throw error;
      }
      
      toast({
        title: "Import Successful",
        description: `Imported ${data.categories.length} categories and ${data.resources.length} resources.`,
      });
      
      setIsLoading(false);
    } catch (err) {
      console.error("Error importing data:", err);
      setIsLoading(false);
      toast({
        title: "Import Failed",
        description: "There was an error importing your data. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const exportData = () => {
    return {
      categories,
      resources
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
        
        notes,
        getNotesByCategory,
        addNote,
        updateNote,
        deleteNote,
        
        files,
        getFilesByCategory,
        addFile,
        deleteFile,
        
        searchResources,
        
        getCategoryStats,
        
        importData,
        exportData,
        
        isLoading,
        error
      }}
    >
      {children}
    </DatabaseContext.Provider>
  );
}

export function useDatabase() {
  const context = useContext(DatabaseContext);
  if (context === undefined) {
    throw new Error("useDatabase must be used within a DatabaseProvider");
  }
  return context;
}
