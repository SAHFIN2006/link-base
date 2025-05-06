
import { useEffect, useState, useCallback, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  RadialChart, 
  BarChart, 
  AreaChart, 
  CustomRadialBarChart, 
  DynamicChart,
  LineChart,
  ComboChart,
  ScatterPlotChart 
} from "@/components/ui/charts";
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
  BarChart3,
  LineChart as LineChartIcon,
  AreaChart as AreaChartIcon,
  Activity,
  ScatterChart,
  ArrowUpRight, 
  ArrowDownRight,
  Sliders
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
import { Tooltip as UITooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from "sonner";

function Analytics() {
  const { categories, resources, getCategoryStats, getFavoriteResources } = useDatabase();
  const [deviceData, setDeviceData] = useState<DeviceInfo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [timeFilter, setTimeFilter] = useState("all");
  const [chartType, setChartType] = useState("category");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activePieIndex, setActivePieIndex] = useState(0);
  const [selectedChartType, setSelectedChartType] = useState<"pie" | "bar" | "radialBar" | "line" | "area" | "combo">("pie");
  const [advancedConfig, setAdvancedConfig] = useState({
    showBrush: false,
    stacked: false,
    showMultipleSeries: false
  });
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

  // Generate multiple series data for advanced charts
  const getMultiSeriesData = useCallback(() => {
    const data = [];
    const categoryNames = categories.map(c => c.name).slice(0, 3);
    const now = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(now.getDate() - i);
      const dateStr = date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
      
      const item: Record<string, string | number> = { name: dateStr };
      
      categoryNames.forEach(cat => {
        // Generate random but consistent values
        const seed = (dateStr.charCodeAt(0) + cat.charCodeAt(0)) % 10;
        item[cat] = Math.floor(Math.random() * 10) + seed + 1;
      });
      
      data.push(item);
    }
    
    return { data, series: categoryNames };
  }, [categories]);

  const categoryCounts = getCategoryCounts();
  const contributionByCategory = getContributionByCategory();
  const browserChartData = getDeviceChartData();
  const osChartData = getOSChartData();
  const deviceTypeData = getDeviceTypeData();
  const { data: multiSeriesData, series: multiSeriesList } = getMultiSeriesData();

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

  const growthData = useMemo(() => generateGrowthData(), [generateGrowthData]);

  const filteredGrowthData = useMemo(() => {
    // Apply time filter to growth data
    if (timeFilter === "all") return growthData;
    
    const now = new Date();
    let filterDate = new Date();
    
    if (timeFilter === "today") {
      filterDate.setHours(0, 0, 0, 0);
    } else if (timeFilter === "week") {
      filterDate.setDate(now.getDate() - 7);
    } else if (timeFilter === "month") {
      filterDate.setMonth(now.getMonth() - 1);
    }
    
    return growthData.filter(item => {
      const itemDate = new Date(item.name);
      return itemDate >= filterDate;
    });
  }, [growthData, timeFilter]);

  const handleClearAnalytics = () => {
    if (confirm("Are you sure you want to clear all device analytics data?")) {
      localStorage.removeItem('device_analytics');
      setDeviceData([]);
      toast.success("Analytics data cleared successfully");
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    toast.info("Refreshing analytics data...");
    
    // Update device info
    trackAndUpdateDeviceInfo();
    
    // Simulate data refresh with a delay
    setTimeout(() => {
      setIsRefreshing(false);
      toast.success("Analytics data refreshed successfully");
    }, 1000);
  };

  // Chart configuration based on selected chart type
  const chartConfig = useMemo(() => ({
    showBrush: advancedConfig.showBrush,
    stacked: advancedConfig.stacked,
    dataKeys: advancedConfig.showMultipleSeries ? multiSeriesList : ["value"],
    barKeys: ["value"],
    lineKeys: advancedConfig.showMultipleSeries ? multiSeriesList.slice(1) : []
  }), [advancedConfig, multiSeriesList]);

  return (
    <div className="container mx-auto py-6 space-y-6 pb-20">
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
              <SelectItem value="advanced">Advanced Charts</SelectItem>
            </SelectContent>
          </Select>

          <TooltipProvider>
            <UITooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="outline" 
                  size="icon"
                  className="h-9 w-9"
                  onClick={() => setAdvancedConfig(prev => ({
                    ...prev,
                    showBrush: !prev.showBrush
                  }))}
                >
                  <Sliders className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Chart Settings</p>
              </TooltipContent>
            </UITooltip>
          </TooltipProvider>
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
          <Tabs defaultValue="pie" value={selectedChartType} onValueChange={(v) => setSelectedChartType(v as any)}>
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="pie" className="flex items-center gap-1">
                <ChartPie className="h-3 w-3" />
                <span>Pie</span>
              </TabsTrigger>
              <TabsTrigger value="bar" className="flex items-center gap-1">
                <ChartBar className="h-3 w-3" />
                <span>Bar</span>
              </TabsTrigger>
              <TabsTrigger value="line" className="flex items-center gap-1">
                <LineChartIcon className="h-3 w-3" />
                <span>Line</span>
              </TabsTrigger>
            </TabsList>
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="area" className="flex items-center gap-1">
                <AreaChartIcon className="h-3 w-3" />
                <span>Area</span>
              </TabsTrigger>
              <TabsTrigger value="radialBar" className="flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                <span>Radial</span>
              </TabsTrigger>
              <TabsTrigger value="combo" className="flex items-center gap-1">
                <Activity className="h-3 w-3" />
                <span>Combo</span>
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
                      <TooltipProvider>
                        <UITooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              className={cn("h-8 w-8 p-0", selectedChartType === "pie" && "bg-accent")}
                              onClick={() => setSelectedChartType("pie")}
                            >
                              <ChartPie className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Pie Chart</p>
                          </TooltipContent>
                        </UITooltip>
                      </TooltipProvider>
                      
                      <TooltipProvider>
                        <UITooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              className={cn("h-8 w-8 p-0", selectedChartType === "bar" && "bg-accent")}
                              onClick={() => setSelectedChartType("bar")}
                            >
                              <ChartBar className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Bar Chart</p>
                          </TooltipContent>
                        </UITooltip>
                      </TooltipProvider>
                      
                      <TooltipProvider>
                        <UITooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              className={cn("h-8 w-8 p-0", selectedChartType === "radialBar" && "bg-accent")}
                              onClick={() => setSelectedChartType("radialBar")}
                            >
                              <TrendingUp className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Radial Bar Chart</p>
                          </TooltipContent>
                        </UITooltip>
                      </TooltipProvider>
                      
                      <TooltipProvider>
                        <UITooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              className={cn("h-8 w-8 p-0", selectedChartType === "line" && "bg-accent")}
                              onClick={() => setSelectedChartType("line")}
                            >
                              <LineChartIcon className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Line Chart</p>
                          </TooltipContent>
                        </UITooltip>
                      </TooltipProvider>
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
                    chartConfig={chartConfig}
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
                    innerRadius={45}
                    outerRadius={85}
                    paddingAngle={3}
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
                <CardTitle className="flex justify-between items-center">
                  <span>Category Growth</span>
                  {!isMobile && (
                    <div className="flex items-center gap-2">
                      <TooltipProvider>
                        <UITooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              className={cn("h-8 w-8 p-0", selectedChartType === "area" && "bg-accent")}
                              onClick={() => setSelectedChartType("area")}
                            >
                              <AreaChartIcon className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Area Chart</p>
                          </TooltipContent>
                        </UITooltip>
                      </TooltipProvider>
                      
                      <TooltipProvider>
                        <UITooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              className={cn("h-8 w-8 p-0", selectedChartType === "line" && "bg-accent")}
                              onClick={() => setSelectedChartType("line")}
                            >
                              <LineChartIcon className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Line Chart</p>
                          </TooltipContent>
                        </UITooltip>
                      </TooltipProvider>
                      
                      <TooltipProvider>
                        <UITooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              className={cn("h-8 w-8 p-0", selectedChartType === "bar" && "bg-accent")}
                              onClick={() => setSelectedChartType("bar")}
                            >
                              <ChartBar className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Bar Chart</p>
                          </TooltipContent>
                        </UITooltip>
                      </TooltipProvider>
                      
                      <TooltipProvider>
                        <UITooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              className={cn("h-8 w-8 p-0", selectedChartType === "combo" && "bg-accent")}
                              onClick={() => setSelectedChartType("combo")}
                            >
                              <Activity className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Combo Chart</p>
                          </TooltipContent>
                        </UITooltip>
                      </TooltipProvider>
                    </div>
                  )}
                </CardTitle>
                <CardDescription className="flex justify-between items-center">
                  <span>Resources added over time</span>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="h-7 text-xs"
                      onClick={() => setAdvancedConfig(prev => ({
                        ...prev,
                        showMultipleSeries: !prev.showMultipleSeries
                      }))}
                    >
                      {advancedConfig.showMultipleSeries ? "Single Series" : "Multi Series"}
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="h-7 text-xs"
                      onClick={() => setAdvancedConfig(prev => ({
                        ...prev,
                        showBrush: !prev.showBrush
                      }))}
                    >
                      {advancedConfig.showBrush ? "Hide Brush" : "Show Brush"}
                    </Button>
                  </div>
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                {selectedChartType === "area" && (
                  <AreaChart 
                    data={advancedConfig.showMultipleSeries ? multiSeriesData : filteredGrowthData}
                    dataKey={advancedConfig.showMultipleSeries ? multiSeriesList[0] : "value"}
                    stackedKeys={advancedConfig.showMultipleSeries ? multiSeriesList : undefined}
                    valueFormatter={(value) => `${value} resources`}
                    showAnimation
                    showBrush={advancedConfig.showBrush}
                  />
                )}
                {selectedChartType === "line" && (
                  <LineChart 
                    data={advancedConfig.showMultipleSeries ? multiSeriesData : filteredGrowthData}
                    dataKey={advancedConfig.showMultipleSeries ? multiSeriesList : "value"}
                    valueFormatter={(value) => `${value} resources`}
                    showAnimation
                    showBrush={advancedConfig.showBrush}
                  />
                )}
                {selectedChartType === "bar" && (
                  <BarChart 
                    data={filteredGrowthData}
                    valueFormatter={(value) => `${value} resources`}
                    layout="horizontal"
                    showAnimation
                    showBrush={advancedConfig.showBrush}
                  />
                )}
                {selectedChartType === "combo" && (
                  <ComboChart 
                    data={multiSeriesData}
                    barKeys={[multiSeriesList[0]]}
                    lineKeys={multiSeriesList.slice(1)}
                    valueFormatter={(value) => `${value} resources`}
                    showAnimation
                  />
                )}
              </CardContent>
              <CardFooter className="text-xs text-muted-foreground pt-0">
                <Badge variant="outline" className="ml-auto">
                  Updated daily
                </Badge>
              </CardFooter>
            </Card>
            
            <Card className="transition-all duration-300 hover:shadow-md overflow-hidden">
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>Resource Type Distribution</span>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="h-7 text-xs"
                      onClick={() => setAdvancedConfig(prev => ({
                        ...prev,
                        stacked: !prev.stacked
                      }))}
                    >
                      {advancedConfig.stacked ? "Unstacked" : "Stacked"}
                    </Button>
                  </div>
                </CardTitle>
                <CardDescription>Breakdown by resource type</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <BarChart 
                  data={contributionByCategory}
                  valueFormatter={(value) => `${value} resources`}
                  layout="horizontal"
                  showAnimation
                  stacked={advancedConfig.stacked}
                  showBrush={advancedConfig.showBrush}
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
                  <DynamicChart 
                    data={browserChartData}
                    chartType={selectedChartType}
                    valueFormatter={(value) => `${value} visits`}
                    showAnimation
                    chartConfig={chartConfig}
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
                    showBrush={advancedConfig.showBrush}
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
                  <CustomRadialBarChart 
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

        {chartType === 'advanced' && (
          <>
            <Card className="transition-all duration-300 hover:shadow-md overflow-hidden">
              <CardHeader>
                <CardTitle>Multi-Series Line Analysis</CardTitle>
                <CardDescription>Compare trends across categories</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <LineChart
                  data={multiSeriesData}
                  dataKey={multiSeriesList}
                  valueFormatter={(value) => `${value} items`}
                  showAnimation
                  showBrush={advancedConfig.showBrush}
                />
              </CardContent>
              <CardFooter className="text-xs text-muted-foreground pt-0">
                <Badge variant="outline" className="ml-auto">
                  Advanced analytics
                </Badge>
              </CardFooter>
            </Card>

            <Card className="transition-all duration-300 hover:shadow-md overflow-hidden">
              <CardHeader>
                <CardTitle>Combination Analysis</CardTitle>
                <CardDescription>Bar and line visualization</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ComboChart
                  data={multiSeriesData}
                  barKeys={[multiSeriesList[0]]}
                  lineKeys={multiSeriesList.slice(1)}
                  valueFormatter={(value) => `${value} items`}
                  showAnimation
                />
              </CardContent>
              <CardFooter className="text-xs text-muted-foreground pt-0">
                <Badge variant="outline" className="ml-auto">
                  Enhanced visualization
                </Badge>
              </CardFooter>
            </Card>

            <Card className="lg:col-span-2 transition-all duration-300 hover:shadow-md overflow-hidden">
              <CardHeader>
                <CardTitle>Advanced Area Visualization</CardTitle>
                <CardDescription>Multi-series stacked area chart</CardDescription>
              </CardHeader>
              <CardContent className="h-[350px]">
                <AreaChart
                  data={multiSeriesData}
                  dataKey={multiSeriesList[0]}
                  stackedKeys={multiSeriesList}
                  valueFormatter={(value) => `${value} resources`}
                  showAnimation
                  showBrush={advancedConfig.showBrush}
                />
              </CardContent>
              <CardFooter className="text-xs text-muted-foreground pt-0">
                <Badge variant="outline" className="ml-auto">
                  Comprehensive data view
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
