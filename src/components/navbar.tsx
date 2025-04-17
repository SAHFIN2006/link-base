
import { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { Menu, X, Moon, Sun, Github, BarChart, Download, Upload, Keyboard } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { useTheme } from "@/context/theme-context";
import { KeyboardShortcutsButton } from "@/components/keyboard-shortcuts";
import { cn } from "@/lib/utils";
import { useHotkeys } from "@/hooks/use-hotkeys";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const isMobile = useIsMobile();
  const { theme, setTheme } = useTheme();

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

  // Export data functionality
  const handleExportData = () => {
    const exportData = {
      categories: JSON.parse(localStorage.getItem('categories') || '[]'),
      resources: JSON.parse(localStorage.getItem('resources') || '[]')
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `linkbase-export-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Import data functionality
  const handleImportData = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target?.result as string);
          if (data.categories && data.resources) {
            // We'll handle the import in the database context
            window.dispatchEvent(new CustomEvent('import-data', { detail: data }));
          }
        } catch (error) {
          console.error('Error parsing import file:', error);
        }
      };
      reader.readAsText(file);
    };
    
    input.click();
  };

  return (
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
  );
}
