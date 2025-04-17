
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Layout } from "@/components/layout";
import { useDatabase } from "@/context/database-context";
import { supabase } from "@/integrations/supabase/client";
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
import { format, subDays, startOfDay, endOfDay, isSameDay, differenceInDays } from "date-fns";
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

interface ActivityData {
  date: string;
  resourcesAdded: number;
  resourcesUpdated: number;
  resourcesRemoved: number;
}

interface UserContribution {
  userId: string;
  userName: string;
  resourcesAdded: number;
  resourcesUpdated: number;
  avatar?: string;
}

interface DeviceData {
  device: string;
  count: number;
}

interface CategoryDistribution {
  name: string;
  count: number;
}

export default function Analytics() {
  const { resources, categories } = useDatabase();
  const { theme } = useTheme();
  const [activityData, setActivityData] = useState<ActivityData[]>([]);
  const [contributorsData, setContributorsData] = useState<UserContribution[]>([]);
  const [deviceData, setDeviceData] = useState<DeviceData[]>([]);
  const [categoryDistribution, setCategoryDistribution] = useState<CategoryDistribution[]>([]);
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 30),
    to: new Date(),
  });
  const [isLoading, setIsLoading] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState<number>(30);  // seconds
  const [isAutoRefresh, setIsAutoRefresh] = useState(true);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#a77BFF', '#FF6B6B', '#4D4DFF', '#19A7CE'];

  // Setup real-time subscriptions and initial data fetch
  useEffect(() => {
    fetchAnalyticsData();
    
    // Set up realtime subscription
    const resourceChannel = supabase
      .channel('resource-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'resources' },
        () => {
          console.log('Resources changed, updating analytics...');
          fetchAnalyticsData();
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(resourceChannel);
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

  const fetchAnalyticsData = async () => {
    setIsLoading(true);
    
    try {
      // Get date range or default to last 30 days
      const fromDate = dateRange?.from ? startOfDay(dateRange.from) : startOfDay(subDays(new Date(), 30));
      const toDate = dateRange?.to ? endOfDay(dateRange.to) : endOfDay(new Date());
      
      // Fetch activity data - resources added/updated/removed by date
      const { data: activityData, error: activityError } = await supabase
        .from('resources')
        .select('id, created_at, updated_at, deleted_at, categoryId')
        .gte('created_at', fromDate.toISOString())
        .lte('created_at', toDate.toISOString())
        .order('created_at', { ascending: true });
        
      if (activityError) {
        throw activityError;
      }
      
      // Fetch contributors data
      const { data: contributorsData, error: contributorsError } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, avatar_url')
        .order('first_name', { ascending: true });
        
      if (contributorsError) {
        throw contributorsError;
      }
      
      // Process activity data
      const processedActivityData = processActivityData(activityData || []);
      setActivityData(processedActivityData);
      
      // Process contributors data
      const processedContributorsData = processContributorsData(activityData || [], contributorsData || []);
      setContributorsData(processedContributorsData);
      
      // Process device data (simulated for now)
      setDeviceData([
        { device: "Desktop", count: Math.floor(Math.random() * 700) + 200 },
        { device: "Mobile", count: Math.floor(Math.random() * 500) + 100 },
        { device: "Tablet", count: Math.floor(Math.random() * 200) + 50 }
      ]);
      
      // Process category distribution
      const categoryStats = processCategoryDistribution(activityData || []);
      setCategoryDistribution(categoryStats);
      
    } catch (error) {
      console.error("Error fetching analytics data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Process activity data by date
  const processActivityData = (data: any[]): ActivityData[] => {
    // Get all days in the date range
    const dateMap = new Map<string, ActivityData>();
    
    const startDate = dateRange?.from ? new Date(dateRange.from) : subDays(new Date(), 30);
    const endDate = dateRange?.to ? new Date(dateRange.to) : new Date();
    
    // Generate all dates in the range
    const currentDate = new Date(startDate);
    while (currentDate <= endDate) {
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
    data.forEach(item => {
      const createdAtDate = format(new Date(item.created_at), 'yyyy-MM-dd');
      
      // Count new resources
      if (dateMap.has(createdAtDate)) {
        const dayData = dateMap.get(createdAtDate);
        if (dayData) {
          dayData.resourcesAdded++;
          dateMap.set(createdAtDate, dayData);
        }
      }
      
      // Count updated resources (if different from creation date)
      if (item.updated_at && item.created_at !== item.updated_at) {
        const updatedAtDate = format(new Date(item.updated_at), 'yyyy-MM-dd');
        if (dateMap.has(updatedAtDate)) {
          const dayData = dateMap.get(updatedAtDate);
          if (dayData) {
            dayData.resourcesUpdated++;
            dateMap.set(updatedAtDate, dayData);
          }
        }
      }
      
      // Count deleted resources
      if (item.deleted_at) {
        const deletedAtDate = format(new Date(item.deleted_at), 'yyyy-MM-dd');
        if (dateMap.has(deletedAtDate)) {
          const dayData = dateMap.get(deletedAtDate);
          if (dayData) {
            dayData.resourcesRemoved++;
            dateMap.set(deletedAtDate, dayData);
          }
        }
      }
    });
    
    // Convert map to array
    return Array.from(dateMap.values()).sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  };

  // Process contributors data
  const processContributorsData = (resourcesData: any[], usersData: any[]): UserContribution[] => {
    const userContributions = new Map<string, UserContribution>();
    
    // Initialize with all users
    usersData.forEach(user => {
      userContributions.set(user.id, {
        userId: user.id,
        userName: `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'Anonymous',
        resourcesAdded: 0,
        resourcesUpdated: 0,
        avatar: user.avatar_url
      });
    });
    
    // Count contributions
    resourcesData.forEach(resource => {
      const userId = resource.created_by || 'anonymous';
      
      if (!userContributions.has(userId)) {
        userContributions.set(userId, {
          userId,
          userName: 'Anonymous',
          resourcesAdded: 0,
          resourcesUpdated: 0
        });
      }
      
      const userContribution = userContributions.get(userId);
      if (userContribution) {
        userContribution.resourcesAdded++;
        userContributions.set(userId, userContribution);
      }
    });
    
    return Array.from(userContributions.values())
      .filter(user => user.resourcesAdded > 0 || user.resourcesUpdated > 0)
      .sort((a, b) => b.resourcesAdded - a.resourcesAdded);
  };

  // Process category distribution
  const processCategoryDistribution = (resourcesData: any[]): CategoryDistribution[] => {
    const categoryMap = new Map<string, number>();
    
    // Initialize all categories with 0
    categories.forEach(category => {
      categoryMap.set(category.id, 0);
    });
    
    // Count resources by category
    resourcesData.forEach(resource => {
      if (resource.categoryId) {
        const count = categoryMap.get(resource.categoryId) || 0;
        categoryMap.set(resource.categoryId, count + 1);
      }
    });
    
    // Convert to array with category names
    return Array.from(categoryMap.entries())
      .map(([categoryId, count]) => {
        const category = categories.find(c => c.id === categoryId);
        return {
          name: category ? category.name : 'Unknown',
          count
        };
      })
      .filter(item => item.count > 0)
      .sort((a, b) => b.count - a.count);
  };

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
      name: "Favorite Resources", 
      value: resources.filter(r => r.favorite).length, 
      icon: <Activity className="h-8 w-8 text-primary" /> 
    },
    { 
      name: "Contributors", 
      value: contributorsData.length, 
      icon: <Users className="h-8 w-8 text-primary" /> 
    }
  ];

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
                        data={contributorsData.slice(0, 10)}
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
                          {contributorsData.slice(0, 10).map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Bar>
                        <Bar dataKey="resourcesUpdated" fill="#00C49F" name="Resources Updated">
                          {contributorsData.slice(0, 10).map((entry, index) => (
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
        </motion.div>
      </div>
    </Layout>
  );
}
