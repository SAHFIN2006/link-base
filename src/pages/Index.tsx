
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  ArrowRight, Plus, Folder, Search, Star,
  Monitor, Calendar, Zap, Lock, Cog, Briefcase, Brain, Code
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CategoryCard } from "@/components/ui/category-card";
import { ResourceCard } from "@/components/ui/resource-card";
import { Layout } from "@/components/layout";
import { useDatabase } from "@/context/database-context";

export default function Index() {
  const { categories, resources, getFavoriteResources, getCategoryStats } = useDatabase();
  const [favoriteResources, setFavoriteResources] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const stats = getCategoryStats();
  
  // Get default icons for featured categories
  const getCategoryIcon = (categoryId: string) => {
    switch(categoryId) {
      case "tech-stock": return <Monitor size={32} />;
      case "news-events": return <Calendar size={32} />;
      case "innovation": return <Zap size={32} />;
      case "vault": return <Lock size={32} />;
      case "automation": return <Cog size={32} />;
      case "business": return <Briefcase size={32} />;
      case "artificial-intelligence": return <Brain size={32} />;
      case "programming": return <Code size={32} />;
      default: return <Folder size={32} />;
    }
  };

  // Get favorite resources
  useEffect(() => {
    setFavoriteResources(getFavoriteResources().slice(0, 4));
  }, [resources, getFavoriteResources]);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-glow z-0" />
        
        <div className="container px-4 mx-auto relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h1 
              className="text-5xl md:text-6xl font-bold mb-6 glow-text"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Organize & Discover Valuable Resources
            </motion.h1>
            
            <motion.p 
              className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Your personal gateway to the best technology resources, curated for developers and tech enthusiasts.
            </motion.p>
            
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Button asChild size="lg" className="gap-2">
                <Link to="/categories">
                  Explore Categories
                  <ArrowRight size={18} />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="gap-2">
                <Link to="/my-links">
                  <Plus size={18} />
                  Add New Resource
                </Link>
              </Button>
            </motion.div>
            
            <motion.div
              className="bg-black/40 backdrop-blur-lg rounded-2xl p-6 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <div className="text-center p-4">
                <p className="text-2xl md:text-3xl font-bold text-white">{stats.totalCategories}</p>
                <p className="text-muted-foreground">Categories</p>
              </div>
              <div className="text-center p-4">
                <p className="text-2xl md:text-3xl font-bold text-white">{stats.totalResources}</p>
                <p className="text-muted-foreground">Resources</p>
              </div>
              <div className="text-center p-4">
                <p className="text-2xl md:text-3xl font-bold text-white">{stats.favoriteResources}</p>
                <p className="text-muted-foreground">Favorites</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Search Section */}
      <section className="py-12 bg-black/20">
        <div className="container px-4 mx-auto">
          <div className="max-w-3xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-3.5 h-5 w-5 text-muted-foreground" />
              <Input 
                type="text" 
                placeholder="Search for resources..." 
                className="pl-11 py-6 bg-black/40 border-white/10 focus:border-primary h-14 text-lg"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button size="sm" className="absolute right-2 top-2">
                Search
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Featured Categories */}
      <section className="py-16">
        <div className="container px-4 mx-auto">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-3xl font-bold">Featured Categories</h2>
            <Button asChild variant="outline" className="gap-2">
              <Link to="/categories">
                View All
                <ArrowRight size={16} />
              </Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {categories.slice(0, 8).map((category, index) => (
              <CategoryCard
                key={category.id}
                title={category.name}
                icon={getCategoryIcon(category.id)}
                path={`/category/${category.id}`}
                delay={index}
              />
            ))}
          </div>
        </div>
      </section>
      
      {/* Favorite Resources */}
      {favoriteResources.length > 0 && (
        <section className="py-16 bg-black/20">
          <div className="container px-4 mx-auto">
            <div className="flex justify-between items-center mb-10">
              <div className="flex items-center gap-3">
                <Star className="h-6 w-6 text-yellow-400 fill-yellow-400" />
                <h2 className="text-3xl font-bold">Favorite Resources</h2>
              </div>
              <Button asChild variant="outline" className="gap-2">
                <Link to="/my-links?filter=favorites">
                  View All
                  <ArrowRight size={16} />
                </Link>
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {favoriteResources.map((resource, index) => (
                <ResourceCard
                  key={resource.id}
                  id={resource.id}
                  title={resource.title}
                  url={resource.url}
                  description={resource.description}
                  tags={resource.tags}
                  favorite={resource.favorite}
                  delay={index}
                />
              ))}
            </div>
          </div>
        </section>
      )}
      
      {/* Call to Action */}
      <section className="py-20">
        <div className="container px-4 mx-auto">
          <div className="glass-card rounded-2xl overflow-hidden">
            <div className="bg-gradient-to-br from-linkblue/20 via-transparent to-linkpurple/20 p-10 md:p-16 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Organize Your Resources?</h2>
              <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
                Start collecting and categorizing your favorite links today. Create custom categories and access your resources from anywhere.
              </p>
              <Button asChild size="lg" className="gap-2">
                <Link to="/my-links">
                  Get Started
                  <ArrowRight size={18} />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
