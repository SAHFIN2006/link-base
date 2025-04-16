
import { useState } from "react";
import { Layout } from "@/components/layout";
import { motion } from "framer-motion";
import { 
  Book, BookOpen, Code, Database, Bookmark, Users, Search, 
  Key, FileText, ServerCrash, ArrowRight, PanelRight, Download,
  CircleHelp, Rocket, Heart, Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

export default function Documentation() {
  const [searchQuery, setSearchQuery] = useState("");
  
  return (
    <Layout>
      <div className="container px-4 mx-auto py-12">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex justify-center mb-4">
              <Book className="h-16 w-16 text-primary" />
            </div>
            <h1 className="text-4xl font-bold mb-4">LinkBase Documentation</h1>
            <p className="text-xl text-muted-foreground">
              Everything you need to know about using LinkBase to manage your resource collection
            </p>
          </motion.div>
          
          {/* Search */}
          <div className="mt-8 max-w-xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-3.5 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search documentation..."
                className="pl-11"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
        
        {/* Documentation Tabs */}
        <div className="max-w-4xl mx-auto">
          <Tabs defaultValue="basics" className="mt-8">
            <TabsList className="grid grid-cols-3 w-full mb-8">
              <TabsTrigger value="basics">For Basic Users</TabsTrigger>
              <TabsTrigger value="power">For Power Users</TabsTrigger>
              <TabsTrigger value="developers">For Developers</TabsTrigger>
            </TabsList>
            
            {/* Basic Users Tab */}
            <TabsContent value="basics">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <motion.div 
                  className="glass-card p-6 rounded-lg"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <BookOpen className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold">Getting Started</h3>
                  </div>
                  <p className="text-muted-foreground mb-4">
                    Learn the basics of LinkBase and how to organize your resources effectively.
                  </p>
                  <ul className="space-y-3 mb-4">
                    <li className="flex items-start gap-2">
                      <ArrowRight className="h-4 w-4 mt-1 text-primary" />
                      <span>Creating your first category</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ArrowRight className="h-4 w-4 mt-1 text-primary" />
                      <span>Adding new resources to categories</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ArrowRight className="h-4 w-4 mt-1 text-primary" />
                      <span>Using the search functionality</span>
                    </li>
                  </ul>
                  <Button variant="outline" className="w-full">Read More</Button>
                </motion.div>
                
                <motion.div 
                  className="glass-card p-6 rounded-lg"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Bookmark className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold">Managing Favorites</h3>
                  </div>
                  <p className="text-muted-foreground mb-4">
                    Learn how to save and organize your favorite resources for quick access.
                  </p>
                  <ul className="space-y-3 mb-4">
                    <li className="flex items-start gap-2">
                      <ArrowRight className="h-4 w-4 mt-1 text-primary" />
                      <span>Marking resources as favorites</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ArrowRight className="h-4 w-4 mt-1 text-primary" />
                      <span>Accessing your favorites list</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ArrowRight className="h-4 w-4 mt-1 text-primary" />
                      <span>Managing and organizing favorites</span>
                    </li>
                  </ul>
                  <Button variant="outline" className="w-full">Read More</Button>
                </motion.div>
                
                <motion.div 
                  className="glass-card p-6 rounded-lg"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Search className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold">Finding Resources</h3>
                  </div>
                  <p className="text-muted-foreground mb-4">
                    Learn how to efficiently search and locate resources in your collection.
                  </p>
                  <ul className="space-y-3 mb-4">
                    <li className="flex items-start gap-2">
                      <ArrowRight className="h-4 w-4 mt-1 text-primary" />
                      <span>Using the global search</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ArrowRight className="h-4 w-4 mt-1 text-primary" />
                      <span>Filtering resources by tags</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ArrowRight className="h-4 w-4 mt-1 text-primary" />
                      <span>Navigating category-specific resources</span>
                    </li>
                  </ul>
                  <Button variant="outline" className="w-full">Read More</Button>
                </motion.div>
                
                <motion.div 
                  className="glass-card p-6 rounded-lg"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.4 }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <CircleHelp className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold">FAQs</h3>
                  </div>
                  <p className="text-muted-foreground mb-4">
                    Find answers to the most commonly asked questions about LinkBase.
                  </p>
                  <ul className="space-y-3 mb-4">
                    <li className="flex items-start gap-2">
                      <ArrowRight className="h-4 w-4 mt-1 text-primary" />
                      <span>Account management</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ArrowRight className="h-4 w-4 mt-1 text-primary" />
                      <span>Data synchronization</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ArrowRight className="h-4 w-4 mt-1 text-primary" />
                      <span>Troubleshooting common issues</span>
                    </li>
                  </ul>
                  <Button variant="outline" className="w-full">Read More</Button>
                </motion.div>
              </div>
            </TabsContent>
            
            {/* Power Users Tab */}
            <TabsContent value="power">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <motion.div 
                  className="glass-card p-6 rounded-lg"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Rocket className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold">Advanced Techniques</h3>
                  </div>
                  <p className="text-muted-foreground mb-4">
                    Master the full power of LinkBase with these advanced features and workflows.
                  </p>
                  <ul className="space-y-3 mb-4">
                    <li className="flex items-start gap-2">
                      <ArrowRight className="h-4 w-4 mt-1 text-primary" />
                      <span>Creating nested category structures</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ArrowRight className="h-4 w-4 mt-1 text-primary" />
                      <span>Custom tagging strategies</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ArrowRight className="h-4 w-4 mt-1 text-primary" />
                      <span>Resource metadata optimization</span>
                    </li>
                  </ul>
                  <Button variant="outline" className="w-full">Read More</Button>
                </motion.div>
                
                <motion.div 
                  className="glass-card p-6 rounded-lg"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Database className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold">Data Management</h3>
                  </div>
                  <p className="text-muted-foreground mb-4">
                    Learn how to effectively manage, backup, and migrate your LinkBase data.
                  </p>
                  <ul className="space-y-3 mb-4">
                    <li className="flex items-start gap-2">
                      <ArrowRight className="h-4 w-4 mt-1 text-primary" />
                      <span>Exporting and importing data</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ArrowRight className="h-4 w-4 mt-1 text-primary" />
                      <span>Scheduled backups</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ArrowRight className="h-4 w-4 mt-1 text-primary" />
                      <span>Data recovery options</span>
                    </li>
                  </ul>
                  <Button variant="outline" className="w-full">Read More</Button>
                </motion.div>
                
                <motion.div 
                  className="glass-card p-6 rounded-lg"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Users className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold">Collaboration Features</h3>
                  </div>
                  <p className="text-muted-foreground mb-4">
                    Discover how to share and collaborate on resource collections with teams.
                  </p>
                  <ul className="space-y-3 mb-4">
                    <li className="flex items-start gap-2">
                      <ArrowRight className="h-4 w-4 mt-1 text-primary" />
                      <span>Sharing categories with others</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ArrowRight className="h-4 w-4 mt-1 text-primary" />
                      <span>Permission management</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ArrowRight className="h-4 w-4 mt-1 text-primary" />
                      <span>Activity tracking and history</span>
                    </li>
                  </ul>
                  <Button variant="outline" className="w-full">Read More</Button>
                </motion.div>
                
                <motion.div 
                  className="glass-card p-6 rounded-lg"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.4 }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Sparkles className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold">Pro Tips & Tricks</h3>
                  </div>
                  <p className="text-muted-foreground mb-4">
                    Expert techniques to maximize your productivity with LinkBase.
                  </p>
                  <ul className="space-y-3 mb-4">
                    <li className="flex items-start gap-2">
                      <ArrowRight className="h-4 w-4 mt-1 text-primary" />
                      <span>Keyboard shortcuts</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ArrowRight className="h-4 w-4 mt-1 text-primary" />
                      <span>Automation workflows</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ArrowRight className="h-4 w-4 mt-1 text-primary" />
                      <span>Hidden features and Easter eggs</span>
                    </li>
                  </ul>
                  <Button variant="outline" className="w-full">Read More</Button>
                </motion.div>
              </div>
            </TabsContent>
            
            {/* Developers Tab */}
            <TabsContent value="developers">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <motion.div 
                  className="glass-card p-6 rounded-lg"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Code className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold">API Documentation</h3>
                  </div>
                  <p className="text-muted-foreground mb-4">
                    Complete reference for the LinkBase API to build integrations and extensions.
                  </p>
                  <ul className="space-y-3 mb-4">
                    <li className="flex items-start gap-2">
                      <ArrowRight className="h-4 w-4 mt-1 text-primary" />
                      <span>Authentication and authorization</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ArrowRight className="h-4 w-4 mt-1 text-primary" />
                      <span>Endpoints reference</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ArrowRight className="h-4 w-4 mt-1 text-primary" />
                      <span>Rate limits and quotas</span>
                    </li>
                  </ul>
                  <Button variant="outline" className="w-full">Read More</Button>
                </motion.div>
                
                <motion.div 
                  className="glass-card p-6 rounded-lg"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <PanelRight className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold">Extension Development</h3>
                  </div>
                  <p className="text-muted-foreground mb-4">
                    Learn how to create custom extensions and plugins for LinkBase.
                  </p>
                  <ul className="space-y-3 mb-4">
                    <li className="flex items-start gap-2">
                      <ArrowRight className="h-4 w-4 mt-1 text-primary" />
                      <span>Extension architecture</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ArrowRight className="h-4 w-4 mt-1 text-primary" />
                      <span>Creating custom importers</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ArrowRight className="h-4 w-4 mt-1 text-primary" />
                      <span>UI integration points</span>
                    </li>
                  </ul>
                  <Button variant="outline" className="w-full">Read More</Button>
                </motion.div>
                
                <motion.div 
                  className="glass-card p-6 rounded-lg"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <FileText className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold">Technical Stack</h3>
                  </div>
                  <p className="text-muted-foreground mb-4">
                    Overview of the technologies used in building LinkBase.
                  </p>
                  <ul className="space-y-3 mb-4">
                    <li className="flex items-start gap-2">
                      <ArrowRight className="h-4 w-4 mt-1 text-primary" />
                      <span>React & TypeScript frontend</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ArrowRight className="h-4 w-4 mt-1 text-primary" />
                      <span>Supabase for backend and authentication</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ArrowRight className="h-4 w-4 mt-1 text-primary" />
                      <span>Tailwind CSS & shadcn/ui for UI</span>
                    </li>
                  </ul>
                  <Button variant="outline" className="w-full">Read More</Button>
                </motion.div>
                
                <motion.div 
                  className="glass-card p-6 rounded-lg"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.4 }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Heart className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold">Contributing</h3>
                  </div>
                  <p className="text-muted-foreground mb-4">
                    Guide to contributing to the LinkBase open source project.
                  </p>
                  <ul className="space-y-3 mb-4">
                    <li className="flex items-start gap-2">
                      <ArrowRight className="h-4 w-4 mt-1 text-primary" />
                      <span>Setting up the development environment</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ArrowRight className="h-4 w-4 mt-1 text-primary" />
                      <span>Coding guidelines & standards</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ArrowRight className="h-4 w-4 mt-1 text-primary" />
                      <span>Pull request process</span>
                    </li>
                  </ul>
                  <Button variant="outline" className="w-full">Read More</Button>
                </motion.div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
}
