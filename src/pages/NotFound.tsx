
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <Layout>
      <div className="container px-4 mx-auto py-16 md:py-24 flex flex-col items-center justify-center text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-md"
        >
          <div className="relative mb-8">
            <div className="text-[10rem] font-bold leading-none opacity-10">404</div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-2xl md:text-3xl font-bold">
              Page Not Found
            </div>
          </div>
          
          <p className="text-muted-foreground mb-8 max-w-md">
            The page you're looking for doesn't exist or has been moved.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="gap-2">
              <Link to="/">
                <Home size={18} />
                Back to Home
              </Link>
            </Button>
            <Button asChild variant="outline" className="gap-2">
              <Link to="/categories">
                <Search size={18} />
                Explore Categories
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
}
