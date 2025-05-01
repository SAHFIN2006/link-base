
import { Link } from "react-router-dom";
import { ShinyText } from "@/components/animations";
import { 
  Github, 
  Twitter, 
  Mail,
  Phone,
  MapPin,
  Heart
} from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t">
      <div className="container py-8 px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="mb-2">
              <ShinyText className="text-lg font-medium">LinkVault</ShinyText>
            </div>
            <p className="text-sm text-muted-foreground">
              Organize all your resources, links, and files in one central place.
              Save, manage, and share your collections easily.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/categories" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Categories
                </Link>
              </li>
              <li>
                <Link to="/my-links" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  My Links
                </Link>
              </li>
              <li>
                <Link to="/analytics" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Analytics
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-4">Contact</h3>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail size={14} />
                <span>support@linkvault.app</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone size={14} />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin size={14} />
                <span>San Francisco, CA 94103</span>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-4">Follow Us</h3>
            <div className="flex gap-4">
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Github size={20} />
                <span className="sr-only">GitHub</span>
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Twitter size={20} />
                <span className="sr-only">Twitter</span>
              </a>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t text-center">
          <p className="text-sm text-muted-foreground flex items-center justify-center gap-1">
            Made with <Heart size={14} className="text-red-500 fill-red-500" /> in 2023
          </p>
        </div>
      </div>
    </footer>
  );
}
