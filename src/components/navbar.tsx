
import { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { Menu, X, Moon, Sun, Github, ExternalLink } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { useTheme } from "@/context/theme-context";
import { cn } from "@/lib/utils";

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
      ? "py-3 backdrop-blur-lg shadow-md " + 
        (theme === "dark" ? "bg-black/70" : "bg-white/90 border-b border-gray-100")
      : "py-5"
  );

  const navLinks = [
    { title: "Home", path: "/" },
    { title: "Categories", path: "/categories" },
    { title: "My Links", path: "/my-links" },
  ];

  return (
    <nav className={navClasses}>
      <div className="container px-4 mx-auto flex items-center justify-between">
        {/* Logo */}
        <Logo withText={!isMobile || !isScrolled} size={isScrolled ? "sm" : "md"} />

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
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

        {/* Theme toggle and github button */}
        <div className="hidden md:flex items-center gap-4">
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
            <div className="flex items-center justify-between pt-2 mt-2 border-t border-gray-100 dark:border-white/10">
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
