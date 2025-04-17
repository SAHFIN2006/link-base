
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Layout } from "@/components/layout";
import { useDatabase } from "@/context/database-context";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { useTheme } from "@/context/theme-context";

// Random analytics data generator for demo
const generateDummyData = () => {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const platforms = ["Desktop", "Mobile", "Tablet"];
  const categories = ["Programming", "AI", "Database", "Cloud", "Security", "Design", "Other"];
  
  // Resource additions over time
  const resourceAdditions = days.map(day => ({
    name: day,
    added: Math.floor(Math.random() * 10) + 1,
    removed: Math.floor(Math.random() * 5),
  }));
  
  // Platform distribution
  const platformData = platforms.map(platform => ({
    name: platform,
    value: Math.floor(Math.random() * 100) + 20,
  }));
  
  // Category distribution
  const categoryData = categories.map(category => ({
    name: category,
    value: Math.floor(Math.random() * 50) + 5,
  }));
  
  // Traffic data
  const trafficData = days.map(day => ({
    name: day,
    visits: Math.floor(Math.random() * 300) + 50,
    pageViews: Math.floor(Math.random() * 800) + 200,
  }));
  
  return {
    resourceAdditions,
    platformData,
    categoryData,
    trafficData,
  };
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#a77BFF', '#FF6B6B', '#4D4DFF'];

export default function Analytics() {
  const { resources, categories } = useDatabase();
  const { theme } = useTheme();
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  
  useEffect(() => {
    // In a real application, we would fetch real analytics data
    // For demo purposes, we're generating random data
    setAnalyticsData(generateDummyData());
  }, []);
  
  if (!analyticsData) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
          </div>
        </div>
      </Layout>
    );
  }
  
  // Real metrics from our database
  const realMetrics = [
    { name: "Total Categories", value: categories.length, icon: "📊" },
    { name: "Total Resources", value: resources.length, icon: "🔗" },
    { name: "Favorite Resources", value: resources.filter(r => r.favorite).length, icon: "⭐" },
    { name: "Tags Used", value: [...new Set(resources.flatMap(r => r.tags || []))].length, icon: "🏷️" }
  ];
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold mb-8 font-display">Analytics Dashboard</h1>
          
          {/* Real Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {realMetrics.map((metric, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="glass-card p-6 rounded-xl"
              >
                <div className="flex items-center">
                  <div className="mr-4 text-3xl">{metric.icon}</div>
                  <div>
                    <h3 className="text-muted-foreground font-medium">{metric.name}</h3>
                    <p className="text-3xl font-bold">{metric.value}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          <Tabs defaultValue="activity">
            <TabsList className="mb-6">
              <TabsTrigger value="activity">Activity</TabsTrigger>
              <TabsTrigger value="distribution">Distribution</TabsTrigger>
              <TabsTrigger value="traffic">Traffic</TabsTrigger>
            </TabsList>
            
            <TabsContent value="activity" className="space-y-6">
              <div className="glass-card p-6 rounded-xl">
                <h2 className="text-2xl font-semibold mb-4">Resource Activity</h2>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={analyticsData.resourceAdditions}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#333' : '#eee'} />
                      <XAxis dataKey="name" stroke={theme === 'dark' ? '#999' : '#666'} />
                      <YAxis stroke={theme === 'dark' ? '#999' : '#666'} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: theme === 'dark' ? '#1a1a1a' : '#fff',
                          border: theme === 'dark' ? '1px solid #333' : '1px solid #ddd',
                          color: theme === 'dark' ? '#fff' : '#333'
                        }}
                      />
                      <Legend />
                      <Bar dataKey="added" fill="#4F6FE8" name="Resources Added" />
                      <Bar dataKey="removed" fill="#FF6B6B" name="Resources Removed" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="distribution" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="glass-card p-6 rounded-xl">
                  <h2 className="text-2xl font-semibold mb-4">Device Distribution</h2>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={analyticsData.platformData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {analyticsData.platformData.map((entry: any, index: number) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip 
                          formatter={(value) => [`${value} users`, 'Count']}
                          contentStyle={{
                            backgroundColor: theme === 'dark' ? '#1a1a1a' : '#fff',
                            border: theme === 'dark' ? '1px solid #333' : '1px solid #ddd',
                            color: theme === 'dark' ? '#fff' : '#333'
                          }}
                        />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                
                <div className="glass-card p-6 rounded-xl">
                  <h2 className="text-2xl font-semibold mb-4">Category Distribution</h2>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={analyticsData.categoryData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {analyticsData.categoryData.map((entry: any, index: number) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip 
                          formatter={(value) => [`${value} resources`, 'Count']}
                          contentStyle={{
                            backgroundColor: theme === 'dark' ? '#1a1a1a' : '#fff',
                            border: theme === 'dark' ? '1px solid #333' : '1px solid #ddd',
                            color: theme === 'dark' ? '#fff' : '#333'
                          }}
                        />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="traffic" className="space-y-6">
              <div className="glass-card p-6 rounded-xl">
                <h2 className="text-2xl font-semibold mb-4">Traffic Overview</h2>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={analyticsData.trafficData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#333' : '#eee'} />
                      <XAxis dataKey="name" stroke={theme === 'dark' ? '#999' : '#666'} />
                      <YAxis stroke={theme === 'dark' ? '#999' : '#666'} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: theme === 'dark' ? '#1a1a1a' : '#fff',
                          border: theme === 'dark' ? '1px solid #333' : '1px solid #ddd',
                          color: theme === 'dark' ? '#fff' : '#333'
                        }}
                      />
                      <Legend />
                      <Line type="monotone" dataKey="visits" stroke="#4F6FE8" activeDot={{ r: 8 }} name="Visits" />
                      <Line type="monotone" dataKey="pageViews" stroke="#7E69AB" name="Page Views" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </Layout>
  );
}
