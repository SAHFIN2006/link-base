
import { Github, Linkedin, Mail, Twitter } from "lucide-react";
import { Logo } from "@/components/ui/logo";

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black/40 backdrop-blur-md py-12">
      <div className="container px-4 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo and description */}
          <div className="flex flex-col gap-4">
            <Logo />
            <p className="text-muted-foreground max-w-md">
              Your gateway to the best technology resources, curated for developers
              and tech enthusiasts.
            </p>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} LinkBase. All rights reserved.
            </p>
          </div>

          {/* Quick links */}
          <div className="flex flex-col gap-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <div className="grid grid-cols-1 gap-2">
              <a href="/" className="text-muted-foreground hover:text-white transition-colors">
                Home
              </a>
              <a href="/categories" className="text-muted-foreground hover:text-white transition-colors">
                Categories
              </a>
              <a href="/my-links" className="text-muted-foreground hover:text-white transition-colors">
                My Links
              </a>
            </div>
          </div>

          {/* Connect */}
          <div className="flex flex-col gap-4">
            <h3 className="text-lg font-semibold">Connect With Us</h3>
            <div className="flex flex-col gap-3">
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center gap-3 text-muted-foreground hover:text-white transition-colors"
              >
                <Github size={18} />
                <span>GitHub</span>
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-muted-foreground hover:text-white transition-colors"
              >
                <Twitter size={18} />
                <span>Twitter</span>
              </a>
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-muted-foreground hover:text-white transition-colors"
              >
                <Linkedin size={18} />
                <span>LinkedIn</span>
              </a>
              <a 
                href="mailto:contact@linkbase.com" 
                className="flex items-center gap-3 text-muted-foreground hover:text-white transition-colors"
              >
                <Mail size={18} />
                <span>Email</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
