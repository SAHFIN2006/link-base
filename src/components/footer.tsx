
import { Link } from "react-router-dom";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { 
  FolderKanban, 
  Settings, 
  Info, 
  HeartHandshake, 
  Github, 
  Twitter, 
  Home, 
  FileText,
  BarChart
} from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t">
      <div className="container flex flex-col gap-4 py-6 md:flex-row md:items-center md:justify-between md:py-8">
        <div className="flex flex-wrap gap-4 items-center">
          <Link to="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <Home size={16} />
            Home
          </Link>
          <Link to="/categories" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <FolderKanban size={16} />
            Categories
          </Link>
          <Link to="/my-links" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <HeartHandshake size={16} />
            My Links
          </Link>
          <Link to="/analytics" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <BarChart size={16} />
            Analytics
          </Link>
        </div>
        <div className="flex gap-4 items-center">
          <div className="flex items-center gap-4">
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <Github size={18} />
              <span className="sr-only">GitHub</span>
            </a>
            <a 
              href="https://twitter.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <Twitter size={18} />
              <span className="sr-only">Twitter</span>
            </a>
          </div>
          <ThemeToggle />
        </div>
      </div>
    </footer>
  );
}
