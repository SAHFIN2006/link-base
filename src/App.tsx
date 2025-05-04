
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { DatabaseProvider } from "@/context/database-context";
import { ThemeProvider } from "@/context/theme-context";
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ShinyText } from "@/components/animations";

// Pages
import Index from "./pages/Index";
import Categories from "./pages/Categories";
import CategoryDetails from "./pages/CategoryDetails";
import MyLinks from "./pages/MyLinks";
import NotFound from "./pages/NotFound";
import Analytics from "./pages/Analytics";

const queryClient = new QueryClient();

// Welcome notification component
function WelcomeNotification() {
  const [isOpen, setIsOpen] = useState(false);
  
  useEffect(() => {
    // Check if we've shown this before
    const hasShown = localStorage.getItem('welcomeNotificationShown');
    
    if (!hasShown) {
      // Show after a short delay for better UX
      const timer = setTimeout(() => {
        setIsOpen(true);
        // Mark as shown
        localStorage.setItem('welcomeNotificationShown', 'true');
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, []);
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[500px] glass-panel">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl">
            <ShinyText>Welcome to LinkVault</ShinyText>
          </DialogTitle>
        </DialogHeader>
        <DialogDescription className="text-center py-6">
          This is a fucking Vibe Coding Project, Don't expect anything work properly.<br/><br/>
          Built with <a href="https://lovable.dev" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">lovable.dev</a>
        </DialogDescription>
        <DialogFooter>
          <Button className="w-full" onClick={() => setIsOpen(false)}>
            Let's Go!
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Scroll to top component for navigation
function ScrollToTop() {
  const { pathname } = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  
  return null;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <DatabaseProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <ScrollToTop />
            <WelcomeNotification />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/category/:categoryId" element={<CategoryDetails />} />
              <Route path="/my-links" element={<MyLinks />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </DatabaseProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
