
import { useState } from "react";
import { Github, Linkedin, Mail, Twitter, Send, Database, ExternalLink } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

export function Footer() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    
    // Simulate sending email
    setTimeout(() => {
      toast({
        title: "Message sent!",
        description: "We'll get back to you as soon as possible.",
      });
      setEmail("");
      setMessage("");
      setIsSending(false);
    }, 1500);
  };

  return (
    <footer className="border-t border-white/10 dark:border-white/10 bg-card/80 dark:bg-black/40 backdrop-blur-md py-12">
      <div className="container px-4 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo and description */}
          <div className="flex flex-col gap-4">
            <Logo />
            <p className="text-muted-foreground max-w-md">
              Your gateway to the best technology resources, curated for developers
              and tech enthusiasts.
            </p>
            <div className="flex gap-2 items-center">
              <Database className="h-4 w-4 text-primary" />
              <p className="text-sm text-muted-foreground">
                <span className="font-medium">Storage:</span> LocalStorage (Supabase Integration Coming Soon)
              </p>
            </div>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} LinkBase. All rights reserved.
            </p>
          </div>

          {/* Quick links */}
          <div className="flex flex-col gap-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <div className="grid grid-cols-1 gap-2">
              <a href="/" className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2">
                <span className="w-1 h-1 bg-primary rounded-full"></span>
                Home
              </a>
              <a href="/categories" className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2">
                <span className="w-1 h-1 bg-primary rounded-full"></span>
                Categories
              </a>
              <a href="/my-links" className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2">
                <span className="w-1 h-1 bg-primary rounded-full"></span>
                My Links
              </a>
            </div>
            
            <h3 className="text-lg font-semibold mt-4">Connect With Us</h3>
            <div className="flex gap-3">
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="bg-muted p-2 rounded-full hover:bg-primary/20 transition-colors"
                aria-label="GitHub"
              >
                <Github className="h-4 w-4" />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-muted p-2 rounded-full hover:bg-primary/20 transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-4 w-4" />
              </a>
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-muted p-2 rounded-full hover:bg-primary/20 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-4 w-4" />
              </a>
              <a 
                href="mailto:contact@linkbase.com" 
                className="bg-muted p-2 rounded-full hover:bg-primary/20 transition-colors"
                aria-label="Email"
              >
                <Mail className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Contact Form */}
          <div className="flex flex-col gap-4">
            <h3 className="text-lg font-semibold">Get In Touch</h3>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <Input
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-muted/50 border-white/10 dark:border-white/10"
              />
              <div className="relative">
                <textarea 
                  placeholder="Your message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  className="w-full min-h-[100px] p-3 rounded-md bg-muted/50 border border-white/10 dark:border-white/10 text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <Button type="submit" className="gap-2" disabled={isSending}>
                {isSending ? "Sending..." : "Send Message"}
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
      </div>
    </footer>
  );
}
