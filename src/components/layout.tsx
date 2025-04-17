
import { ReactNode, useEffect } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { HeadSEO } from "@/components/head-seo";
import { useTheme } from "@/context/theme-context";

interface LayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
  image?: string;
}

export function Layout({ children, title, description, image }: LayoutProps) {
  const { theme } = useTheme();
  
  // Apply theme class to body
  useEffect(() => {
    document.body.className = theme;
  }, [theme]);
  
  return (
    <div className="flex flex-col min-h-screen">
      <HeadSEO title={title} description={description} image={image} />
      <Navbar />
      <main className="flex-1 pt-20 pb-12">
        {children}
      </main>
      <Footer />
    </div>
  );
}
