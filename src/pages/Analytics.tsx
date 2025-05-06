
import { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadialChart, BarChart, AreaChart, RadialBarChart, DynamicChart } from "@/components/ui/charts";
import { useDatabase } from "@/context/database-context";
import { trackDeviceInfo, DeviceInfo } from "@/utils/device-tracker";
import { Link } from "react-router-dom";
import { 
  RefreshCw, 
  Filter, 
  ArrowLeft, 
  ChartPie,
  TrendingUp, 
  ChartBar, 
  ArrowUpRight, 
  ArrowDownRight
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

function Analytics() {
  const { categories, resources, getCategoryStats, getFavoriteResources } = useDatabase();
  const [deviceData, setDeviceData] = useState<DeviceInfo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [timeFilter, setTimeFilter] = useState("all");
  const [chartType, setChartType] = useState("category");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activePieIndex, setActivePieIndex] = useState(0);
  const [selectedChartType, setSelectedChartType] = useState<"pie" | "bar" | "radialBar">("pie");
  const isMobile = useIsMobile();
  
  // Enhanced device analytics tracking with more frequent updates
  const trackAndUpdateDeviceInfo = useCallback(() => {
    const deviceInfo = trackDeviceInfo();
    
    try {
      const savedAnalytics = localStorage.getItem('device_analytics');
      if (savedAnalytics) {
        const parsed = JSON.parse(savedAnalytics);
        setDeviceData(parsed);
      }
    } catch (err) {
      console.error("Error loading device analytics:", err);
    }
  }, []);
  
  // Load device analytics data
  useEffect(() => {
    trackAndUpdateDeviceInfo();
    
    // Set up interval for real-time updates
    const updateInterval = setInterval(() => {
      trackAndUpdateDeviceInfo();
    }, 30000); // Update every 30 seconds
    
    return () => clearInterval(updateInterval);
  }, [trackAndUpdateDeviceInfo]);
  
  const stats = getCategoryStats();
  const favorites = getFavoriteResources();
  
  // Summary box data with trends
  const summaryData = [
    { 
      title: "Total Resources", 
      value: stats.totalResources,
      description: "All resources in your library",
      trend: stats.totalResources > 10 ? "up" : "neutral",
      trendValue: "+12%"
    },
    { 
      title: "Categories", 
      value: stats.totalCategories,
      description: "Organized collection types",
      trend: stats.totalCategories > 3 ? "up" : "neutral",
      trendValue: "+5%"
    },
    { 
      title: "Favorites", 
      value: stats.favoriteResources,
      description: "Resources marked as favorites",
      trend: stats.favoriteResources > 5 ? "up" : "down",
      trendValue: stats.favoriteResources > 5 ? "+8%" : "-3%"
    },
    { 
      title: "Recent Activity", 
      value: resources.length > 0 ? new Date(resources.sort((a, b) => 
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())[0].updatedAt
      ).toLocaleDateString() : "N/A",
      description: "Last updated resource",
      trend: "neutral",
      trendValue: ""
    }
  ];

  // Get top categories
  const getCategoryCounts = useCallback(() => {
    const categoryCounts = resources.reduce((acc, resource) => {
      const categoryId = resource.categoryId;
      if (!categoryId) return acc;
      
      if (acc[categoryId]) {
        acc[categoryId] += 1;
      } else {
        acc[categoryId] = 1;
      }
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(categoryCounts)
      .map(([catId, count]) => ({
        name: categories.find(c => c.id === catId)?.name || "Unknown",
        value: count
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  }, [resources, categories]);

  // Get contribution data by category
  const getContributionByCategory = useCallback(() => {
    const contributionByCategory = categories.map(category => {
      const resourcesInCategory = resources.filter(r => r.categoryId === category.id);
      return {
        name: category.name,
        value: resourcesInCategory.length
      };
    }).filter(cat => cat.value > 0);
    
    return contributionByCategory.sort((a, b) => b.value - a.value);
  }, [categories, resources]);
  
  // Process device data for charts
  const getDeviceChartData = useCallback(() => {
    if (!deviceData.length) return [];
    
    // Browser distribution
    const browsers = deviceData.reduce((acc, device) => {
      const browser = device.browser;
      if (acc[browser]) {
        acc[browser] += 1;
      } else {
        acc[browser] = 1;
      }
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(browsers)
      .map(([browser, count]) => ({
        name: browser,
        value: count
      }))
      .sort((a, b) => b.value - a.value);
  }, [deviceData]);
  
  // OS distribution
  const getOSChartData = useCallback(() => {
    if (!deviceData.length) return [];
    
    const osDistribution = deviceData.reduce((acc, device) => {
      const os = device.os;
      if (acc[os]) {
        acc[os] += 1;
      } else {
        acc[os] = 1;
      }
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(osDistribution)
      .map(([os, count]) => ({
        name: os,
        value: count
      }))
      .sort((a, b) => b.value - a.value);
  }, [deviceData]);
  
  // Device type distribution
  const getDeviceTypeData = useCallback(() => {
    if (!deviceData.length) return [];
    
    const deviceTypes = deviceData.reduce((acc, device) => {
      const type = device.deviceType;
      if (acc[type]) {
        acc[type] += 1;
      } else {
        acc[type] = 1;
      }
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(deviceTypes)
      .map(([type, count]) => ({
        name: type,
        value: count
      }))
      .sort((a, b) => b.value - a.value);
  }, [deviceData]);

  const categoryCounts = getCategoryCounts();
  const contributionByCategory = getContributionByCategory();
  const browserChartData = getDeviceChartData();
  const osChartData = getOSChartData();
  const deviceTypeData = getDeviceTypeData();

  // Generate time-series mock data for growth chart
  const generateGrowthData = useCallback(() => {
    const now = new Date();
    const data = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(now.getDate() - i);
      const value = Math.floor(Math.random() * 5) + (resources.length / 2);
      data.push({
        name: date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
        value: value
      });
    }
    return data;
  }, [resources.length]);

  const growthData = generateGrowthData();

  const handleClearAnalytics = () => {
    if (confirm("Are you sure you want to clear all device analytics data?")) {
      localStorage.removeItem('device_analytics');
      setDeviceData([]);
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    
    // Update device info
    trackAndUpdateDeviceInfo();
    
    // Simulate data refresh with a delay
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Navigation and Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <div>
          <Breadcrumb className="mb-2">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/">Home</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/categories">Categories</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/my-links">My Links</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <span className="font-semibold">Analytics</span>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div className="flex items-center gap-3">
            <Link to="/categories">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 items-center">
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="min-w-[120px]"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Refreshing...' : 'Refresh'}
          </Button>
          
          <Select value={timeFilter} onValueChange={setTimeFilter}>
            <SelectTrigger className="w-[160px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Time Period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={chartType} onValueChange={setChartType}>
            <SelectTrigger className="w-[180px]">
              <ChartPie className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Chart Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="category">Category Distribution</SelectItem>
              <SelectItem value="contribution">Contribution</SelectItem>
              <SelectItem value="device">Device Info</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryData.map((item, index) => (
          <Card key={index} className={cn(
            "overflow-hidden transition-all duration-300 hover:shadow-md",
            item.trend === "up" && "border-l-4 border-l-green-500",
            item.trend === "down" && "border-l-4 border-l-red-500"
          )}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex justify-between">
                {item.title}
                {item.trend === "up" && (
                  <span className="text-green-500 flex items-center text-xs">
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                    {item.trendValue}
                  </span>
                )}
                {item.trend === "down" && (
                  <span className="text-red-500 flex items-center text-xs">
                    <ArrowDownRight className="h-3 w-3 mr-1" />
                    {item.trendValue}
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{item.value}</div>
              <p className="text-xs text-muted-foreground">{item.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Chart Type Tabs - Only show on mobile */}
      {isMobile && (
        <div className="block md:hidden">
          <Tabs defaultValue="pie" value={selectedChartType} onValueChange={(v) => setSelectedChartType(v as "pie" | "bar" | "radialBar")}>
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="pie" className="flex items-center gap-1">
                <ChartPie className="h-3 w-3" />
                <span>Pie</span>
              </TabsTrigger>
              <TabsTrigger value="bar" className="flex items-center gap-1">
                <ChartBar className="h-3 w-3" />
                <span>Bar</span>
              </TabsTrigger>
              <TabsTrigger value="radialBar" className="flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                <span>Radial</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      )}
      
      {/* Charts section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Show different charts based on selected chart type */}
        {chartType === 'category' && (
          <>
            <Card className="transition-all duration-300 hover:shadow-md overflow-hidden">
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>Resource Distribution</span>
                  {!isMobile && (
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className={cn("h-8 w-8 p-0", selectedChartType === "pie" && "bg-accent")}
                        onClick={() => setSelectedChartType("pie")}
                      >
                        <ChartPie className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className={cn("h-8 w-8 p-0", selectedChartType === "bar" && "bg-accent")}
                        onClick={() => setSelectedChartType("bar")}
                      >
                        <ChartBar className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className={cn("h-8 w-8 p-0", selectedChartType === "radialBar" && "bg-accent")}
                        onClick={() => setSelectedChartType("radialBar")}
                      >
                        <TrendingUp className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </CardTitle>
                <CardDescription>Resources by category</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                {categoryCounts.length > 0 ? (
                  <DynamicChart
                    data={categoryCounts}
                    chartType={selectedChartType}
                    valueFormatter={(value) => `${value} resources`}
                    showAnimation
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    No data available
                  </div>
                )}
              </CardContent>
              <CardFooter className="text-xs text-muted-foreground pt-0">
                <Badge variant="outline" className="ml-auto">
                  Updated just now
                </Badge>
              </CardFooter>
            </Card>
            
            <Card className="transition-all duration-300 hover:shadow-md overflow-hidden">
              <CardHeader>
                <CardTitle>Contribution by Category</CardTitle>
                <CardDescription>Resource contribution across categories</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                {contributionByCategory.length > 0 ? (
                  <RadialChart 
                    data={contributionByCategory}
                    valueFormatter={(value) => `${value} items`}
                    activeIndex={activePieIndex}
                    setActiveIndex={setActivePieIndex}
                    showAnimation
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    No contribution data available
                  </div>
                )}
              </CardContent>
              <CardFooter className="text-xs text-muted-foreground pt-0">
                <Badge variant="outline" className="ml-auto">
                  Real-time data
                </Badge>
              </CardFooter>
            </Card>
          </>
        )}
        
        {chartType === 'contribution' && (
          <>
            <Card className="transition-all duration-300 hover:shadow-md overflow-hidden">
              <CardHeader>
                <CardTitle>Category Growth</CardTitle>
                <CardDescription>Resources added over time</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <AreaChart 
                  data={growthData}
                  dataKey="value"
                  valueFormatter={(value) => `${value} resources`}
                  showAnimation
                />
              </CardContent>
              <CardFooter className="text-xs text-muted-foreground pt-0">
                <Badge variant="outline" className="ml-auto">
                  Updated daily
                </Badge>
              </CardFooter>
            </Card>
            
            <Card className="transition-all duration-300 hover:shadow-md overflow-hidden">
              <CardHeader>
                <CardTitle>Resource Type Distribution</CardTitle>
                <CardDescription>Breakdown by resource type</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <BarChart 
                  data={contributionByCategory}
                  valueFormatter={(value) => `${value} resources`}
                  layout="horizontal"
                  showAnimation
                />
              </CardContent>
              <CardFooter className="text-xs text-muted-foreground pt-0">
                <Badge variant="outline" className="ml-auto">
                  Real-time data
                </Badge>
              </CardFooter>
            </Card>
          </>
        )}
        
        {chartType === 'device' && (
          <>
            <Card className="transition-all duration-300 hover:shadow-md overflow-hidden">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Device Browser Distribution</CardTitle>
                    <CardDescription>Visitor browser types</CardDescription>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleClearAnalytics}
                  >
                    Clear Analytics
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="h-[300px]">
                {browserChartData.length > 0 ? (
                  <RadialChart 
                    data={browserChartData} 
                    valueFormatter={(value) => `${value} visits`}
                    showAnimation
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    No device data available
                  </div>
                )}
              </CardContent>
              <CardFooter className="text-xs text-muted-foreground pt-0">
                <Badge variant="outline" className="ml-auto">
                  Auto-updating
                </Badge>
              </CardFooter>
            </Card>

            <Card className="transition-all duration-300 hover:shadow-md overflow-hidden">
              <CardHeader>
                <CardTitle>Operating System Distribution</CardTitle>
                <CardDescription>Visitor operating systems</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                {osChartData.length > 0 ? (
                  <BarChart
                    data={osChartData}
                    yAxisWidth={80}
                    showAnimation
                    valueFormatter={(value) => `${value} visits`}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    No operating system data available
                  </div>
                )}
              </CardContent>
              <CardFooter className="text-xs text-muted-foreground pt-0">
                <Badge variant="outline" className="ml-auto">
                  Auto-updating
                </Badge>
              </CardFooter>
            </Card>

            <Card className="lg:col-span-2 transition-all duration-300 hover:shadow-md overflow-hidden">
              <CardHeader>
                <CardTitle>Device Type Distribution</CardTitle>
                <CardDescription>Mobile vs Desktop vs Tablet</CardDescription>
              </CardHeader>
              <CardContent className="h-[350px]">
                {deviceTypeData.length > 0 ? (
                  <RadialBarChart 
                    data={deviceTypeData}
                    valueFormatter={(value) => `${value} visits`}
                    showAnimation
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    No device type data available
                  </div>
                )}
              </CardContent>
              <CardFooter className="text-xs text-muted-foreground pt-0">
                <Badge variant="outline" className="ml-auto">
                  Real-time data
                </Badge>
              </CardFooter>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}

export default Analytics;
