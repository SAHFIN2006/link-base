
import { Link } from "react-router-dom";
import { Github, Twitter, Linkedin, Mail, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Logo } from "@/components/ui/logo";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { useDatabase } from "@/context/database-context";

export function Footer() {
  const [email, setEmail] = useState("");
  const { toast } = useToast();
  const { categories } = useDatabase();
  
  // Get top categories (limit to 4)
  const topCategories = categories.slice(0, 4);
  
  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Subscribed!",
      description: "You've successfully subscribed to our newsletter.",
    });
    setEmail("");
  };

  return (
    <footer className="border-t border-border bg-background py-12">
      <div className="container px-4 mx-auto">
        {/* Top Section with Logo and Newsletter */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-12">
          <div>
            <Logo size="lg" />
            <p className="mt-4 text-muted-foreground max-w-md">
              Your personal gateway to the best technology resources, 
              curated for developers and tech enthusiasts.
            </p>
            <div className="flex items-center gap-1 mt-4">
              <Heart className="h-4 w-4 text-red-500" />
              <p className="text-sm text-muted-foreground">
                Built with passion for the developer community
              </p>
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-4">Stay Updated</h3>
            <p className="text-muted-foreground mb-4">
              Subscribe to our newsletter for the latest resources and updates.
            </p>
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Button type="submit">
                Subscribe
              </Button>
            </form>
          </div>
        </div>
        
        {/* Middle Section with Links */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 mb-12">
          <div>
            <h4 className="font-medium mb-3">Navigation</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link></li>
              <li><Link to="/categories" className="text-muted-foreground hover:text-foreground transition-colors">Categories</Link></li>
              <li><Link to="/my-links" className="text-muted-foreground hover:text-foreground transition-colors">My Links</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium mb-3">Popular Categories</h4>
            <ul className="space-y-2">
              {topCategories.map(category => (
                <li key={category.id}>
                  <Link 
                    to={`/category/${category.id}`} 
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium mb-3">Connect</h4>
            <div className="flex gap-3">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="p-2 bg-muted/50 rounded-full hover:bg-primary/20 transition-colors">
                <Github className="h-4 w-4" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="p-2 bg-muted/50 rounded-full hover:bg-primary/20 transition-colors">
                <Twitter className="h-4 w-4" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="p-2 bg-muted/50 rounded-full hover:bg-primary/20 transition-colors">
                <Linkedin className="h-4 w-4" />
              </a>
              <a href="mailto:contact@linkbase.com" className="p-2 bg-muted/50 rounded-full hover:bg-primary/20 transition-colors">
                <Mail className="h-4 w-4" />
              </a>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              <Mail className="inline h-3 w-3 mr-1" /> contact@linkbase.com
            </p>
          </div>
        </div>
        
        {/* Bottom Section with Copyright */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-6 border-t border-border">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} LinkBase. All rights reserved.
          </p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <span className="text-sm text-muted-foreground">
              Made with ❤️ for developers
            </span>
            <Link to="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
