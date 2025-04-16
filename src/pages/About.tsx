
import { Layout } from "@/components/layout";
import { motion } from "framer-motion";
import { 
  Info, Heart, Code, Database, Zap, UserRound, Mail
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function About() {
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
              <Info className="h-16 w-16 text-primary" />
            </div>
            <h1 className="text-4xl font-bold mb-4">About LinkBase</h1>
            <p className="text-xl text-muted-foreground">
              Our mission is to help developers and tech enthusiasts organize and discover valuable resources
            </p>
          </motion.div>
        </div>
        
        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          <div className="glass-card p-8 rounded-xl mb-12">
            <h2 className="text-2xl font-bold mb-6">Our Story</h2>
            <p className="text-lg mb-6">
              LinkBase started as a personal project to solve the problem of managing the ever-growing collection of valuable online resources, tutorials, documentation, and tools that developers discover throughout their careers.
            </p>
            <p className="text-lg mb-6">
              What began as a simple solution for personal use has evolved into a powerful platform designed to help the entire tech community organize, discover, and share the best resources available online.
            </p>
            <p className="text-lg mb-6">
              Today, LinkBase serves as a central hub for developers and tech enthusiasts to curate their personal knowledge bases, create custom categories, and easily access their important links from anywhere.
            </p>
            <div className="flex items-center gap-2 text-primary">
              <Heart className="h-5 w-5 fill-primary" />
              <p className="font-medium">Built with passion for the developer community</p>
            </div>
          </div>
          
          <h2 className="text-2xl font-bold mb-6">Technology Stack</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
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
                <h3 className="text-xl font-semibold">Frontend</h3>
              </div>
              <ul className="space-y-2 text-muted-foreground">
                <li>• React</li>
                <li>• TypeScript</li>
                <li>• Tailwind CSS</li>
                <li>• shadcn/ui components</li>
                <li>• Framer Motion</li>
              </ul>
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
                <h3 className="text-xl font-semibold">Backend</h3>
              </div>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Supabase</li>
                <li>• PostgreSQL database</li>
                <li>• Authentication</li>
                <li>• Realtime subscriptions</li>
                <li>• Storage</li>
              </ul>
            </motion.div>
            
            <motion.div 
              className="glass-card p-6 rounded-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Features</h3>
              </div>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Custom categories</li>
                <li>• Resource management</li>
                <li>• Favoriting system</li>
                <li>• Powerful search</li>
                <li>• Responsive design</li>
              </ul>
            </motion.div>
          </div>
          
          <h2 className="text-2xl font-bold mb-6">Meet the Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            <motion.div 
              className="glass-card p-6 rounded-lg text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <UserRound className="h-12 w-12 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-1">Sarah Johnson</h3>
              <p className="text-primary mb-3">Founder & Lead Developer</p>
              <p className="text-sm text-muted-foreground mb-4">
                Full-stack developer with 10+ years of experience in building web applications.
              </p>
              <div className="flex justify-center">
                <a href="mailto:sarah@linkbase.com" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors">
                  <Mail className="h-4 w-4" />
                  Contact
                </a>
              </div>
            </motion.div>
            
            <motion.div 
              className="glass-card p-6 rounded-lg text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <UserRound className="h-12 w-12 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-1">Michael Chen</h3>
              <p className="text-primary mb-3">UX/UI Designer</p>
              <p className="text-sm text-muted-foreground mb-4">
                Passionate about creating intuitive and beautiful user experiences.
              </p>
              <div className="flex justify-center">
                <a href="mailto:michael@linkbase.com" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors">
                  <Mail className="h-4 w-4" />
                  Contact
                </a>
              </div>
            </motion.div>
            
            <motion.div 
              className="glass-card p-6 rounded-lg text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <UserRound className="h-12 w-12 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-1">Alex Rivera</h3>
              <p className="text-primary mb-3">Backend Developer</p>
              <p className="text-sm text-muted-foreground mb-4">
                Database expert with a focus on performance and security.
              </p>
              <div className="flex justify-center">
                <a href="mailto:alex@linkbase.com" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors">
                  <Mail className="h-4 w-4" />
                  Contact
                </a>
              </div>
            </motion.div>
          </div>
          
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Get in Touch</h2>
            <p className="text-lg text-muted-foreground mb-6">
              Have questions, feedback, or just want to say hello? We'd love to hear from you!
            </p>
            <Button size="lg" className="gap-2">
              <Mail className="h-5 w-5" />
              Contact Us
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
