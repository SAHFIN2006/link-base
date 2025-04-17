
import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Layout } from "@/components/layout";
import { useDatabase } from "@/context/database-context";
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, 
  ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, 
  Legend, Area, AreaChart, ComposedChart 
} from "recharts";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { useTheme } from "@/context/theme-context";
import { Calendar } from "@/components/ui/calendar";
import { DateRange } from "react-day-picker";
import { format, subDays, startOfDay, endOfDay, isSameDay, differenceInDays, parseISO, isValid } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { 
  Activity, Users, BarChart3, PieChart as PieChartIcon, 
  Calendar as CalendarIcon, ChevronDown
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useHotkeys } from "@/hooks/use-hotkeys";

interface ActivityData {
  date: string;
  resourcesAdded: number;
  resourcesUpdated: number;
  resourcesRemoved: number;
}

export default function Analytics() {
  const { resources, categories, files } = useDatabase();
  const { theme } = useTheme();
  const [activityData, setActivityData] = useState<ActivityData[]>([]);
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 30),
    to: new Date(),
  });
  const [isLoading, setIsLoading] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState<number>(30); // seconds
  const [isAutoRefresh, setIsAutoRefresh] = useState(false);

  // Register keyboard shortcuts for this page
  useHotkeys('r', fetchAnalyticsData, "Refresh analytics data");
  useHotkeys('d', () => {
    setDateRange({
      from: subDays(new Date(), 30),
      to: new Date(),
    });
  }, "Reset date range to last 30 days");

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#a77BFF', '#FF6B6B', '#4D4DFF', '#19A7CE'];

  // Set up real-time listeners and initial data fetch
  useEffect(() => {
    fetchAnalyticsData();
    
    // Listen for changes to resources and files
    window.addEventListener('resources-updated', fetchAnalyticsData);
    window.addEventListener('files-updated', fetchAnalyticsData);
    window.addEventListener('import-data', fetchAnalyticsData);
    
    return () => {
      window.removeEventListener('resources-updated', fetchAnalyticsData);
      window.removeEventListener('files-updated', fetchAnalyticsData);
      window.removeEventListener('import-data', fetchAnalyticsData);
    };
  }, [dateRange]);

  // Auto-refresh on interval
  useEffect(() => {
    let intervalId: number;
    
    if (isAutoRefresh && refreshInterval > 0) {
      intervalId = window.setInterval(() => {
        fetchAnalyticsData();
      }, refreshInterval * 1000);
    }
    
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isAutoRefresh, refreshInterval]);

  // Generate contributor data based on resources
  const contributorsData = useMemo(() => {
    // Group resources by createdBy field
    const contributors = resources.reduce((acc, resource) => {
      const creator = resource.createdBy || 'anonymous';
      if (!acc[creator]) {
        acc[creator] = {
          userId: creator,
          userName: creator === 'anonymous' ? 'Anonymous' : creator,
          resourcesAdded: 0,
          resourcesUpdated: 0
        };
      }
      acc[creator].resourcesAdded += 1;
      return acc;
    }, {} as Record<string, any>);
    
    return Object.values(contributors)
      .sort((a, b) => b.resourcesAdded - a.resourcesAdded)
      .slice(0, 10);
  }, [resources]);

  // Generate category distribution data
  const categoryDistribution = useMemo(() => {
    // Count resources per category
    const distribution = categories.map(category => {
      const count = resources.filter(r => r.categoryId === category.id).length;
      return {
        name: category.name,
        count: count
      };
    }).filter(item => item.count > 0)
      .sort((a, b) => b.count - a.count);
    
    return distribution;
  }, [categories, resources]);

  // Generate device distribution data (simplified mock data for now)
  const deviceData = useMemo(() => {
    return [
      { device: "Desktop", count: Math.max(Math.floor(resources.length * 0.6), 1) },
      { device: "Mobile", count: Math.max(Math.floor(resources.length * 0.3), 1) },
      { device: "Tablet", count: Math.max(Math.floor(resources.length * 0.1), 1) }
    ];
  }, [resources]);

  function fetchAnalyticsData() {
    setIsLoading(true);
    
    try {
      // Get date range or default to last 30 days
      const fromDate = dateRange?.from ? startOfDay(dateRange.from) : startOfDay(subDays(new Date(), 30));
      const toDate = dateRange?.to ? endOfDay(dateRange.to) : endOfDay(new Date());
      
      // Process activity data by date
      const dateMap = new Map<string, ActivityData>();
      
      // Generate all dates in the range
      const currentDate = new Date(fromDate);
      while (currentDate <= toDate) {
        const dateStr = format(currentDate, 'yyyy-MM-dd');
        dateMap.set(dateStr, {
          date: dateStr,
          resourcesAdded: 0,
          resourcesUpdated: 0,
          resourcesRemoved: 0
        });
        currentDate.setDate(currentDate.getDate() + 1);
      }
      
      // Count resources by date
      resources.forEach(resource => {
        if (resource.created_at) {
          const createdDate = parseISO(resource.created_at);
          
          if (isValid(createdDate) && createdDate >= fromDate && createdDate <= toDate) {
            const dateStr = format(createdDate, 'yyyy-MM-dd');
            if (dateMap.has(dateStr)) {
              const data = dateMap.get(dateStr);
              if (data) {
                data.resourcesAdded++;
                dateMap.set(dateStr, data);
              }
            }
          }
          
          // Count updates if available
          if (resource.updated_at && resource.updated_at !== resource.created_at) {
            const updatedDate = parseISO(resource.updated_at);
            
            if (isValid(updatedDate) && updatedDate >= fromDate && updatedDate <= toDate) {
              const dateStr = format(updatedDate, 'yyyy-MM-dd');
              if (dateMap.has(dateStr)) {
                const data = dateMap.get(dateStr);
                if (data) {
                  data.resourcesUpdated++;
                  dateMap.set(dateStr, data);
                }
              }
            }
          }
        }
      });
      
      // For files
      files.forEach(file => {
        if (file.created_at) {
          const createdDate = parseISO(file.created_at);
          
          if (isValid(createdDate) && createdDate >= fromDate && createdDate <= toDate) {
            const dateStr = format(createdDate, 'yyyy-MM-dd');
            if (dateMap.has(dateStr)) {
              const data = dateMap.get(dateStr);
              if (data) {
                data.resourcesAdded++;
                dateMap.set(dateStr, data);
              }
            }
          }
        }
      });
      
      // Sort dates and set activity data
      const sortedActivityData = Array.from(dateMap.values())
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      
      setActivityData(sortedActivityData);
    } catch (error) {
      console.error("Error processing analytics data:", error);
    } finally {
      setIsLoading(false);
    }
  }

  // Real metrics from database
  const realMetrics = [
    { 
      name: "Total Categories", 
      value: categories.length, 
      icon: <PieChartIcon className="h-8 w-8 text-primary" /> 
    },
    { 
      name: "Total Resources", 
      value: resources.length, 
      icon: <BarChart3 className="h-8 w-8 text-primary" /> 
    },
    { 
      name: "Files Uploaded", 
      value: files.length, 
      icon: <Activity className="h-8 w-8 text-primary" /> 
    },
    { 
      name: "Contributors", 
      value: contributorsData.length, 
      icon: <Users className="h-8 w-8 text-primary" /> 
    }
  ];

  // Add "no data" message if all graphs are empty
  const hasData = useMemo(() => {
    return resources.length > 0 || files.length > 0 || categories.length > 0;
  }, [resources, files, categories]);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h1 className="text-4xl font-bold mb-2 font-display">Analytics Dashboard</h1>
            
            <div className="flex flex-wrap gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="gap-2"
                  >
                    <CalendarIcon className="h-4 w-4" />
                    {dateRange?.from ? (
                      dateRange.to ? (
                        <>
                          {format(dateRange.from, "LLL dd, y")} -{" "}
                          {format(dateRange.to, "LLL dd, y")}
                        </>
                      ) : (
                        format(dateRange.from, "LLL dd, y")
                      )
                    ) : (
                      <span>Pick a date range</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={dateRange?.from}
                    selected={dateRange}
                    onSelect={setDateRange}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
              
              <Select 
                value={refreshInterval.toString()} 
                onValueChange={(value) => setRefreshInterval(parseInt(value))}
              >
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Refresh rate" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">Every 10s</SelectItem>
                  <SelectItem value="30">Every 30s</SelectItem>
                  <SelectItem value="60">Every minute</SelectItem>
                  <SelectItem value="300">Every 5 minutes</SelectItem>
                  <SelectItem value="0">Manual refresh</SelectItem>
                </SelectContent>
              </Select>
              
              <Button 
                variant={isAutoRefresh ? "default" : "outline"}
                onClick={() => setIsAutoRefresh(!isAutoRefresh)}
              >
                {isAutoRefresh ? "Auto-refresh On" : "Auto-refresh Off"}
              </Button>
              
              <Button 
                variant="outline" 
                onClick={fetchAnalyticsData}
                disabled={isLoading}
              >
                Refresh Data
              </Button>
            </div>
          </div>
          
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {realMetrics.map((metric, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      {metric.name}
                    </CardTitle>
                    {metric.icon}
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{metric.value}</div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
          
          {/* If no data, show welcome message */}
          {!hasData ? (
            <Card className="p-8 text-center">
              <CardContent className="pt-6">
                <Activity className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">No Data Available Yet</h3>
                <p className="text-muted-foreground mb-4">
                  Start adding resources, files, or categories to see analytics data
                </p>
                <div className="flex gap-4 justify-center">
                  <Button asChild>
                    <Link to="/categories">Add Categories</Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link to="/my-links">Add Resources</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Tabs defaultValue="activity">
              <TabsList className="mb-6">
                <TabsTrigger value="activity" className="gap-2">
                  <Activity size={16} />
                  Activity
                </TabsTrigger>
                <TabsTrigger value="contributors" className="gap-2">
                  <Users size={16} />
                  Contributors
                </TabsTrigger>
                <TabsTrigger value="distribution" className="gap-2">
                  <PieChartIcon size={16} />
                  Distribution
                </TabsTrigger>
              </TabsList>
              
              {/* Activity Tab */}
              <TabsContent value="activity" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Resource Activity Over Time</CardTitle>
                    <CardDescription>
                      Shows resources added, updated, and removed over the selected time period
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart
                          data={activityData}
                          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#333' : '#eee'} />
                          <XAxis 
                            dataKey="date" 
                            stroke={theme === 'dark' ? '#999' : '#666'}
                            tick={{ fontSize: 12 }}
                            tickFormatter={(date) => {
                              // If we have many days, simplify the date format
                              if (activityData.length > 14) {
                                return format(new Date(date), 'MM/dd');
                              }
                              return format(new Date(date), 'MMM dd');
                            }}
                          />
                          <YAxis stroke={theme === 'dark' ? '#999' : '#666'} />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: theme === 'dark' ? '#1a1a1a' : '#fff',
                              border: theme === 'dark' ? '1px solid #333' : '1px solid #ddd',
                              color: theme === 'dark' ? '#fff' : '#333'
                            }}
                            formatter={(value, name) => {
                              const formattedName = name === 'resourcesAdded' 
                                ? 'Added' 
                                : name === 'resourcesUpdated' 
                                  ? 'Updated' 
                                  : 'Removed';
                              return [`${value} Resources ${formattedName}`, ''];
                            }}
                            labelFormatter={(date) => format(new Date(date), 'MMMM d, yyyy')}
                          />
                          <Legend />
                          <Area 
                            type="monotone" 
                            dataKey="resourcesAdded" 
                            stackId="1"
                            fill="#4F6FE8" 
                            stroke="#4F6FE8"
                            name="Resources Added" 
                          />
                          <Area 
                            type="monotone" 
                            dataKey="resourcesUpdated" 
                            stackId="1"
                            fill="#00C49F" 
                            stroke="#00C49F"
                            name="Resources Updated" 
                          />
                          <Line 
                            type="monotone" 
                            dataKey="resourcesRemoved" 
                            stroke="#FF6B6B"
                            strokeWidth={2}
                            name="Resources Removed" 
                          />
                        </ComposedChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Contributors Tab */}
              <TabsContent value="contributors" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Top Contributors</CardTitle>
                    <CardDescription>
                      Users who have added the most resources to the platform
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={contributorsData}
                          layout="vertical"
                          margin={{ top: 20, right: 30, left: 100, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#333' : '#eee'} />
                          <XAxis type="number" stroke={theme === 'dark' ? '#999' : '#666'} />
                          <YAxis 
                            dataKey="userName" 
                            type="category" 
                            stroke={theme === 'dark' ? '#999' : '#666'}
                            tick={{ fontSize: 12 }}
                            width={90}
                          />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: theme === 'dark' ? '#1a1a1a' : '#fff',
                              border: theme === 'dark' ? '1px solid #333' : '1px solid #ddd',
                              color: theme === 'dark' ? '#fff' : '#333'
                            }}
                          />
                          <Legend />
                          <Bar dataKey="resourcesAdded" fill="#4F6FE8" name="Resources Added">
                            {contributorsData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Bar>
                          <Bar dataKey="resourcesUpdated" fill="#00C49F" name="Resources Updated">
                            {contributorsData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[(index + 3) % COLORS.length]} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Distribution Tab */}
              <TabsContent value="distribution" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Category Distribution</CardTitle>
                      <CardDescription>
                        Resources by category
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={categoryDistribution}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="count"
                            >
                              {categoryDistribution.map((entry, index) => (
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
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Device Distribution</CardTitle>
                      <CardDescription>
                        User visits by device type
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={deviceData}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="count"
                              nameKey="device"
                            >
                              {deviceData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip 
                              formatter={(value) => [`${value} visits`, 'Count']}
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
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          )}
        </motion.div>
      </div>
    </Layout>
  );
}

// Add Link for navigation
const Link = ({ to, children, ...props }: { to: string, children: React.ReactNode } & React.AnchorHTMLAttributes<HTMLAnchorElement>) => {
  return (
    <a href={to} {...props}>
      {children}
    </a>
  );
};
