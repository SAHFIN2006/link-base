
import { Link } from "react-router-dom";
import { Github, Twitter, Linkedin, Mail, Heart, Search, Home, Categories, Folder, BarChart } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { KeyboardShortcutsButton } from "@/components/keyboard-shortcuts";
import { useHotkeys } from "@/hooks/use-hotkeys";

export function Footer() {
  // Register keyboard shortcuts for the footer
  useHotkeys('Alt+h', () => {
    window.location.href = "/";
  }, "Go to Home");
  
  useHotkeys('Alt+c', () => {
    window.location.href = "/categories";
  }, "Go to Categories");
  
  useHotkeys('Alt+l', () => {
    window.location.href = "/my-links";
  }, "Go to My Links");
  
  useHotkeys('Alt+a', () => {
    window.location.href = "/analytics";
  }, "Go to Analytics");

  return (
    <footer className="border-t border-border bg-background/80 backdrop-blur-sm py-8">
      <div className="container px-4 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Logo and Description */}
          <div className="flex flex-col space-y-4">
            <Logo size="md" />
            <p className="text-muted-foreground text-sm max-w-xs">
              Your personal gateway to the best technology resources, curated for developers.
            </p>
            <div className="flex items-center gap-1">
              <Heart className="h-3 w-3 text-red-500" />
              <p className="text-xs text-muted-foreground">
                Made with care for the developer community
              </p>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="font-medium mb-4 text-sm uppercase tracking-wider text-muted-foreground">Navigation</h4>
            <div className="grid grid-cols-1 gap-3">
              <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm">
                <Home className="h-4 w-4" />
                Home
              </Link>
              <Link to="/categories" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm">
                <Categories className="h-4 w-4" />
                Categories
              </Link>
              <Link to="/my-links" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm">
                <Folder className="h-4 w-4" />
                My Links
              </Link>
              <Link to="/analytics" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm">
                <BarChart className="h-4 w-4" />
                Analytics
              </Link>
            </div>
          </div>
          
          {/* Social Links */}
          <div>
            <h4 className="font-medium mb-4 text-sm uppercase tracking-wider text-muted-foreground">Connect</h4>
            <div className="flex flex-wrap gap-2">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="p-2 bg-muted/50 rounded-full hover:bg-primary/10 transition-colors" title="GitHub">
                <Github className="h-4 w-4" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="p-2 bg-muted/50 rounded-full hover:bg-primary/10 transition-colors" title="Twitter">
                <Twitter className="h-4 w-4" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="p-2 bg-muted/50 rounded-full hover:bg-primary/10 transition-colors" title="LinkedIn">
                <Linkedin className="h-4 w-4" />
              </a>
              <a href="mailto:contact@linkbase.com" className="p-2 bg-muted/50 rounded-full hover:bg-primary/10 transition-colors" title="Email">
                <Mail className="h-4 w-4" />
              </a>
              <div className="p-2 bg-muted/50 rounded-full hover:bg-primary/10 transition-colors cursor-pointer">
                <KeyboardShortcutsButton />
              </div>
            </div>
            <p className="mt-4 text-xs text-muted-foreground flex items-center gap-1">
              <Mail className="inline h-3 w-3" /> 
              contact@linkbase.com
            </p>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="flex justify-center border-t border-border pt-4 mt-4">
          <p className="text-xs text-muted-foreground text-center">
            © {new Date().getFullYear()} LinkBase. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
