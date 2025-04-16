
import { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { Menu, X, Moon, Sun, Github } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const isMobile = useIsMobile();

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

  const navClasses = `fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
    isScrolled ? "py-3 bg-black/70 backdrop-blur-lg shadow-md" : "py-5"
  }`;

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
              className={`text-sm font-medium transition-colors hover:text-white ${
                location.pathname === link.path
                  ? "text-white"
                  : "text-muted-foreground"
              }`}
            >
              {link.title}
            </Link>
          ))}
        </div>

        {/* Theme toggle and github button */}
        <div className="hidden md:flex items-center gap-4">
          <Button variant="ghost" size="icon" className="rounded-full">
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all" />
            <span className="sr-only">Toggle theme</span>
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Github className="h-4 w-4" />
            <span className="hidden sm:inline-block">GitHub</span>
          </Button>
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden text-white p-1"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-black/95 backdrop-blur-lg border-t border-white/10 animate-fade-in-bottom">
          <div className="container px-4 py-4 mx-auto flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`py-2 px-4 text-sm font-medium rounded-md transition-colors ${
                  location.pathname === link.path
                    ? "bg-primary/20 text-white"
                    : "text-muted-foreground hover:bg-white/5"
                }`}
              >
                {link.title}
              </Link>
            ))}
            <div className="flex items-center justify-between pt-2 mt-2 border-t border-white/10">
              <Button variant="ghost" size="icon">
                <Sun className="h-5 w-5" />
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
