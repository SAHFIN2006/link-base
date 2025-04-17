
import { useState, useEffect } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { 
  Menu, X, Moon, Sun, Github, BarChart, 
  Download, Upload, Keyboard, Filter, 
  FileJson, XCircle, CheckCircle
} from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { useTheme } from "@/context/theme-context";
import { KeyboardShortcutsButton } from "@/components/keyboard-shortcuts";
import { cn } from "@/lib/utils";
import { useHotkeys } from "@/hooks/use-hotkeys";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [exportOptions, setExportOptions] = useState({
    categories: true,
    resources: true,
    settings: true
  });
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importPreview, setImportPreview] = useState<any>(null);
  const [importOptions, setImportOptions] = useState({
    categories: true,
    resources: true,
    settings: true,
    overwrite: false
  });
  const [filterText, setFilterText] = useState("");
  const [exportFormat, setExportFormat] = useState("json");
  
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();

  // Register keyboard shortcut for search focus
  useHotkeys('Ctrl+K', () => {
    const searchInput = document.querySelector('input[placeholder*="Search"]') as HTMLInputElement;
    if (searchInput) {
      searchInput.focus();
    }
  }, "Focus search");

  // Scroll to top when route changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Handle scroll detection for background change
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  // Determine background class based on scroll position and theme
  const navClasses = cn(
    "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
    isScrolled 
      ? "py-2 backdrop-blur-lg shadow-md " + 
        (theme === "dark" ? "bg-black/70" : "bg-white/90 border-b border-gray-100")
      : "py-3"
  );

  const navLinks = [
    { title: "Home", path: "/" },
    { title: "Categories", path: "/categories" },
    { title: "My Links", path: "/my-links" },
    { title: "Analytics", path: "/analytics" },
  ];

  // Export data functionality - enhanced
  const handleExportData = () => {
    setIsExportDialogOpen(true);
  };

  const processExport = () => {
    // Get data based on selected options
    const exportData: any = {};
    
    if (exportOptions.categories) {
      exportData.categories = JSON.parse(localStorage.getItem('categories') || '[]');
    }
    
    if (exportOptions.resources) {
      const resources = JSON.parse(localStorage.getItem('resources') || '[]');
      
      // Apply filter if any
      exportData.resources = filterText 
        ? resources.filter((resource: any) => 
            resource.title?.toLowerCase().includes(filterText.toLowerCase()) ||
            resource.description?.toLowerCase().includes(filterText.toLowerCase()) ||
            resource.url?.toLowerCase().includes(filterText.toLowerCase())
          ) 
        : resources;
    }
    
    if (exportOptions.settings) {
      exportData.settings = JSON.parse(localStorage.getItem('settings') || '{}');
    }
    
    // Format export based on selected format
    let blob;
    let fileExtension;
    
    if (exportFormat === 'json') {
      blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      fileExtension = 'json';
    } else if (exportFormat === 'csv' && exportData.resources) {
      // Simple CSV export for resources
      const headers = ['title', 'url', 'description', 'categoryId', 'created_at'];
      const csvContent = [
        headers.join(','),
        ...exportData.resources.map((resource: any) => 
          headers.map(header => 
            `"${(resource[header] || '').toString().replace(/"/g, '""')}"`
          ).join(',')
        )
      ].join('\n');
      
      blob = new Blob([csvContent], { type: 'text/csv' });
      fileExtension = 'csv';
    } else {
      // Default to JSON
      blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      fileExtension = 'json';
    }
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `linkbase-export-${new Date().toISOString().slice(0, 10)}.${fileExtension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Export Successful",
      description: `Your data has been exported as ${fileExtension.toUpperCase()}`,
    });
    
    setIsExportDialogOpen(false);
  };

  // Import data functionality - enhanced
  const handleImportData = () => {
    setIsImportDialogOpen(true);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setImportFile(file);
    
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        setImportPreview(data);
      } catch (error) {
        console.error('Error parsing import file:', error);
        toast({
          title: "Import Error",
          description: "The selected file is not valid JSON",
          variant: "destructive"
        });
      }
    };
    reader.readAsText(file);
  };

  const processImport = () => {
    if (!importPreview) return;
    
    try {
      // Import categories
      if (importOptions.categories && importPreview.categories) {
        const existingCategories = JSON.parse(localStorage.getItem('categories') || '[]');
        
        if (importOptions.overwrite) {
          localStorage.setItem('categories', JSON.stringify(importPreview.categories));
        } else {
          // Merge without duplicates
          const mergedCategories = [
            ...existingCategories,
            ...importPreview.categories.filter((importCat: any) => 
              !existingCategories.some((existingCat: any) => existingCat.id === importCat.id)
            )
          ];
          localStorage.setItem('categories', JSON.stringify(mergedCategories));
        }
      }
      
      // Import resources
      if (importOptions.resources && importPreview.resources) {
        const existingResources = JSON.parse(localStorage.getItem('resources') || '[]');
        
        if (importOptions.overwrite) {
          localStorage.setItem('resources', JSON.stringify(importPreview.resources));
        } else {
          // Merge without duplicates
          const mergedResources = [
            ...existingResources,
            ...importPreview.resources.filter((importRes: any) => 
              !existingResources.some((existingRes: any) => existingRes.id === importRes.id)
            )
          ];
          localStorage.setItem('resources', JSON.stringify(mergedResources));
        }
      }
      
      // Import settings
      if (importOptions.settings && importPreview.settings) {
        const existingSettings = JSON.parse(localStorage.getItem('settings') || '{}');
        
        if (importOptions.overwrite) {
          localStorage.setItem('settings', JSON.stringify(importPreview.settings));
        } else {
          // Merge settings
          localStorage.setItem('settings', JSON.stringify({
            ...existingSettings,
            ...importPreview.settings
          }));
        }
      }
      
      toast({
        title: "Import Successful",
        description: "Your data has been imported successfully",
      });
      
      // Dispatch event to notify components about the import
      window.dispatchEvent(new CustomEvent('import-data'));
      
      // Reset and close dialog
      setImportFile(null);
      setImportPreview(null);
      setIsImportDialogOpen(false);
      
      // Reload the current page to reflect changes
      navigate(0);
      
    } catch (error) {
      console.error('Error during import:', error);
      toast({
        title: "Import Failed",
        description: "There was an error importing your data",
        variant: "destructive"
      });
    }
  };

  return (
    <>
      <nav className={navClasses}>
        <div className="container px-4 mx-auto flex items-center justify-between">
          {/* Logo */}
          <Logo withText={!isMobile || !isScrolled} size={isScrolled ? "sm" : "md"} />

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  "text-sm font-medium transition-colors",
                  location.pathname === link.path
                    ? "navbar-link-active"
                    : "navbar-link"
                )}
              >
                {link.title}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-1">
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-1"
              onClick={handleExportData}
              title="Export Data"
            >
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline-block">Export</span>
            </Button>
            
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-1"
              onClick={handleImportData}
              title="Import Data"
            >
              <Upload className="h-4 w-4" />
              <span className="hidden sm:inline-block">Import</span>
            </Button>
            
            <KeyboardShortcutsButton />
            
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-full"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5 text-yellow-400" />
              ) : (
                <Moon className="h-5 w-5 text-slate-700" />
              )}
              <span className="sr-only">Toggle theme</span>
            </Button>
            
            <Button variant="outline" size="sm" className="gap-2">
              <Github className="h-4 w-4" />
              <span className="hidden sm:inline-block">GitHub</span>
            </Button>
          </div>

          {/* Mobile menu button */}
          <button
            className={cn(
              "md:hidden p-1",
              theme === "dark" ? "text-white" : "text-gray-700"
            )}
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className={cn(
            "md:hidden absolute top-full left-0 right-0 border-t animate-fade-in-bottom",
            theme === "dark" 
              ? "bg-black/95 backdrop-blur-lg border-white/10" 
              : "bg-white/95 backdrop-blur-lg border-gray-100"
          )}>
            <div className="container px-4 py-4 mx-auto flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={cn(
                    "py-2 px-4 text-sm font-medium rounded-md transition-colors",
                    location.pathname === link.path
                      ? theme === "dark" 
                        ? "bg-primary/20 text-white" 
                        : "bg-linkblue/10 text-linkblue"
                      : theme === "dark"
                        ? "text-muted-foreground hover:bg-white/5" 
                        : "text-gray-600 hover:bg-gray-50"
                  )}
                >
                  {link.title}
                </Link>
              ))}
              
              <div className="flex flex-col gap-2 pt-2 mt-2 border-t border-gray-100 dark:border-white/10">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="gap-2 justify-start"
                  onClick={handleExportData}
                >
                  <Download className="h-4 w-4" />
                  Export Data
                </Button>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="gap-2 justify-start"
                  onClick={handleImportData}
                >
                  <Upload className="h-4 w-4" />
                  Import Data
                </Button>
              </div>
              
              <div className="flex items-center justify-between pt-2 mt-2 border-t border-gray-100 dark:border-white/10">
                <KeyboardShortcutsButton />
                
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                >
                  {theme === "dark" ? (
                    <Sun className="h-5 w-5 text-yellow-400" />
                  ) : (
                    <Moon className="h-5 w-5 text-slate-700" />
                  )}
                  <span className="sr-only">Toggle theme</span>
                </Button>
                
                <Button variant="outline" size="sm" className="gap-2">
                  <Github className="h-4 w-4" />
                  <span>GitHub</span>
                </Button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Export Dialog */}
      <Dialog open={isExportDialogOpen} onOpenChange={setIsExportDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Export Data</DialogTitle>
            <DialogDescription>
              Choose what data you want to export and the format
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4 space-y-4">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="export-categories" 
                  checked={exportOptions.categories}
                  onCheckedChange={(checked) => 
                    setExportOptions({...exportOptions, categories: !!checked})
                  }
                />
                <label htmlFor="export-categories" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Categories
                </label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="export-resources" 
                  checked={exportOptions.resources}
                  onCheckedChange={(checked) => 
                    setExportOptions({...exportOptions, resources: !!checked})
                  }
                />
                <label htmlFor="export-resources" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Resources and Links
                </label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="export-settings" 
                  checked={exportOptions.settings}
                  onCheckedChange={(checked) => 
                    setExportOptions({...exportOptions, settings: !!checked})
                  }
                />
                <label htmlFor="export-settings" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Settings
                </label>
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="export-format" className="text-sm font-medium">
                Export Format
              </label>
              <Select
                value={exportFormat}
                onValueChange={setExportFormat}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="json">JSON (.json)</SelectItem>
                  <SelectItem value="csv">CSV (.csv) - Resources only</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {exportOptions.resources && (
              <div className="space-y-2">
                <label htmlFor="filter-resources" className="text-sm font-medium">
                  Filter Resources (Optional)
                </label>
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <Input
                    id="filter-resources"
                    placeholder="Filter by title, description, or URL"
                    value={filterText}
                    onChange={(e) => setFilterText(e.target.value)}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Leave empty to export all resources
                </p>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsExportDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              onClick={processExport}
              disabled={!exportOptions.categories && !exportOptions.resources && !exportOptions.settings}
            >
              Export
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Import Dialog */}
      <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Import Data</DialogTitle>
            <DialogDescription>
              Select a JSON file to import
            </DialogDescription>
          </DialogHeader>
          
          <Tabs defaultValue="upload" className="w-full">
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="upload">Select File</TabsTrigger>
              <TabsTrigger value="preview" disabled={!importPreview}>Preview</TabsTrigger>
            </TabsList>
            
            <TabsContent value="upload" className="space-y-4">
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <label htmlFor="file-upload" className="text-sm font-medium">
                  Select JSON File
                </label>
                <div className="flex items-center gap-2">
                  <Input 
                    id="file-upload"
                    type="file"
                    accept=".json"
                    onChange={handleFileSelect}
                  />
                  <FileJson className="h-5 w-5 text-muted-foreground" />
                </div>
                <p className="text-xs text-muted-foreground">
                  Only JSON files exported from LinkBase are supported
                </p>
              </div>
              
              {importPreview && (
                <div className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Import Options</h4>
                    
                    {importPreview.categories && (
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="import-categories" 
                          checked={importOptions.categories}
                          onCheckedChange={(checked) => 
                            setImportOptions({...importOptions, categories: !!checked})
                          }
                        />
                        <label htmlFor="import-categories" className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                          Categories ({importPreview.categories.length})
                        </label>
                      </div>
                    )}
                    
                    {importPreview.resources && (
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="import-resources" 
                          checked={importOptions.resources}
                          onCheckedChange={(checked) => 
                            setImportOptions({...importOptions, resources: !!checked})
                          }
                        />
                        <label htmlFor="import-resources" className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                          Resources ({importPreview.resources.length})
                        </label>
                      </div>
                    )}
                    
                    {importPreview.settings && (
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="import-settings" 
                          checked={importOptions.settings}
                          onCheckedChange={(checked) => 
                            setImportOptions({...importOptions, settings: !!checked})
                          }
                        />
                        <label htmlFor="import-settings" className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                          Settings
                        </label>
                      </div>
                    )}
                    
                    <div className="flex items-center space-x-2 pt-2 mt-2 border-t">
                      <Checkbox 
                        id="import-overwrite" 
                        checked={importOptions.overwrite}
                        onCheckedChange={(checked) => 
                          setImportOptions({...importOptions, overwrite: !!checked})
                        }
                      />
                      <label htmlFor="import-overwrite" className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        Overwrite existing data (otherwise merge)
                      </label>
                    </div>
                  </div>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="preview" className="space-y-4">
              {importPreview && (
                <div className="border rounded-md p-4 h-64 overflow-y-auto">
                  <pre className="text-xs whitespace-pre-wrap">
                    {JSON.stringify(importPreview, null, 2)}
                  </pre>
                </div>
              )}
            </TabsContent>
          </Tabs>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setIsImportDialogOpen(false);
                setImportFile(null);
                setImportPreview(null);
              }}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              onClick={processImport}
              disabled={!importPreview || (!importOptions.categories && !importOptions.resources && !importOptions.settings)}
            >
              Import
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
