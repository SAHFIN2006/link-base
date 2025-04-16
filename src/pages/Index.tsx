
import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  ArrowRight, Plus, Folder, Search, Star, Filter,
  Monitor, Calendar, Zap, Lock, Cog, Briefcase, Brain, Code,
  Database, Shield, Cpu, Gamepad, BarChart, Bot, AlertCircle, Layers
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CategoryCard } from "@/components/ui/category-card";
import { ResourceCard } from "@/components/ui/resource-card";
import { Layout } from "@/components/layout";
import { useDatabase } from "@/context/database-context";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Index() {
  const { categories, resources, getFavoriteResources, getCategoryStats, searchResources } = useDatabase();
  const [favoriteResources, setFavoriteResources] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchFilter, setSearchFilter] = useState<string>("all");
  const stats = getCategoryStats();
  
  // Get default icons for featured categories
  const getCategoryIcon = (categoryId: string) => {
    switch(categoryId) {
      case "artificial-intelligence": return <Brain size={32} />;
      case "blockchain": return <Database size={32} />;
      case "cybersecurity": return <Shield size={32} />;
      case "gaming": return <Gamepad size={32} />;
      case "machine-learning": return <Bot size={32} />;
      case "automation": return <Cog size={32} />;
      case "nanotech": return <Cpu size={32} className="rotate-45" />;
      case "programming": return <Code size={32} />;
      case "statistics": return <BarChart size={32} />;
      case "data-science": return <Layers size={32} />;
      case "robotics": return <Cpu size={32} />;
      case "software": return <Folder size={32} />;
      case "hardware": return <Cpu size={32} />;
      case "tech-stock": return <Monitor size={32} />;
      case "news-events": return <Calendar size={32} />;
      case "innovation": return <Zap size={32} />;
      case "vault": return <Lock size={32} />;
      case "business": return <Briefcase size={32} />;
      default: return <AlertCircle size={32} />;
    }
  };

  // Get favorite resources
  useEffect(() => {
    setFavoriteResources(getFavoriteResources().slice(0, 4));
  }, [resources, getFavoriteResources]);

  // Handle search
  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }
    
    let results = searchResources(searchQuery);
    
    // Apply filter if needed
    if (searchFilter !== "all") {
      results = results.filter(item => item.categoryId === searchFilter);
    }
    
    setSearchResults(results);
    setShowSearchResults(true);
  };

  // Filter categories to show in order requested by user
  const orderedCategories = useMemo(() => {
    const categoryOrder = [
      "artificial-intelligence", "blockchain", "cybersecurity", "gaming", 
      "machine-learning", "automation", "nanotech", "programming", 
      "statistics", "data-science", "robotics", "software", "hardware", 
      "tech-stock", "news-events", "innovation", "vault", "business"
    ];
    
    // Sort categories based on order
    return [...categories].sort((a, b) => {
      const indexA = categoryOrder.indexOf(a.id);
      const indexB = categoryOrder.indexOf(b.id);
      // If category is not in the order list, put it at the end
      if (indexA === -1) return 1;
      if (indexB === -1) return -1;
      return indexA - indexB;
    });
  }, [categories]);

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
              className="glass-card rounded-2xl p-6 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <div className="text-center p-4">
                <p className="text-2xl md:text-3xl font-bold text-foreground">{stats.totalCategories}</p>
                <p className="text-muted-foreground">Categories</p>
              </div>
              <div className="text-center p-4">
                <p className="text-2xl md:text-3xl font-bold text-foreground">{stats.totalResources}</p>
                <p className="text-muted-foreground">Resources</p>
              </div>
              <div className="text-center p-4">
                <p className="text-2xl md:text-3xl font-bold text-foreground">{stats.favoriteResources}</p>
                <p className="text-muted-foreground">Favorites</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Search Section */}
      <section className="py-12 bg-black/20 dark:bg-black/20">
        <div className="container px-4 mx-auto">
          <div className="max-w-3xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-3.5 h-5 w-5 text-muted-foreground" />
              <Input 
                type="text" 
                placeholder="Search for resources..." 
                className="pl-11 py-6 bg-black/40 dark:bg-black/40 border-white/10 dark:border-white/10 focus:border-primary h-14 text-lg"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
              <div className="absolute right-2 top-2 flex gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-1">
                      <Filter size={14} />
                      <span className="hidden sm:inline-block">
                        {searchFilter === "all" ? "All Categories" : 
                          categories.find(c => c.id === searchFilter)?.name || "Filter"}
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    <DropdownMenuLabel>Filter By Category</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup className="max-h-[300px] overflow-y-auto">
                      <DropdownMenuItem onClick={() => setSearchFilter("all")}>
                        All Categories
                      </DropdownMenuItem>
                      {categories.map(category => (
                        <DropdownMenuItem 
                          key={category.id}
                          onClick={() => setSearchFilter(category.id)}
                        >
                          {category.name}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
                
                <Button size="sm" onClick={handleSearch}>
                  Search
                </Button>
              </div>
            </div>
            
            {/* Search Results */}
            {showSearchResults && (
              <div className="mt-6">
                {searchResults.length > 0 ? (
                  <div className="glass-card rounded-xl p-4 animate-fade-in">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-medium">
                        Found {searchResults.length} result{searchResults.length !== 1 ? 's' : ''}
                      </h3>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-sm"
                        onClick={() => {
                          setShowSearchResults(false);
                          setSearchResults([]);
                          setSearchQuery('');
                        }}
                      >
                        Clear Results
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 gap-4 max-h-[300px] overflow-y-auto">
                      {searchResults.map((result) => (
                        <div key={result.id} className="flex flex-col p-3 bg-card/50 rounded-lg">
                          <div className="flex justify-between">
                            <h4 className="font-medium">{result.title}</h4>
                            <Link 
                              to={`/category/${result.categoryId}`}
                              className="text-xs px-2 py-1 bg-primary/20 rounded-full text-primary"
                            >
                              {categories.find(c => c.id === result.categoryId)?.name}
                            </Link>
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{result.description}</p>
                          <div className="flex justify-between mt-2">
                            <a 
                              href={result.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-sm text-primary hover:underline"
                            >
                              Visit Link
                            </a>
                            <div className="flex gap-1">
                              {result.tags.slice(0, 3).map((tag: string, idx: number) => (
                                <span key={idx} className="text-xs px-2 py-0.5 bg-muted rounded-full">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="glass-card rounded-xl p-6 text-center animate-fade-in">
                    <p className="text-muted-foreground">No results found for "{searchQuery}"</p>
                    <p className="text-sm mt-2">Try different keywords or browse categories below</p>
                  </div>
                )}
              </div>
            )}
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
            {orderedCategories.slice(0, 8).map((category, index) => (
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
        <section className="py-16 bg-black/20 dark:bg-black/20">
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
