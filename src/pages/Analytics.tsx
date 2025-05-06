
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadialChart, BarChart, AreaChart } from "@/components/ui/charts";
import { useDatabase } from "@/context/database-context";
import { trackDeviceInfo, DeviceInfo } from "@/utils/device-tracker";
import { Link } from "react-router-dom";
import { RefreshCw, Filter, ArrowLeft, ChartPie } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import { Badge } from "@/components/ui/badge";

function Analytics() {
  const { categories, resources, getCategoryStats, getFavoriteResources } = useDatabase();
  const [deviceData, setDeviceData] = useState<DeviceInfo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [timeFilter, setTimeFilter] = useState("all");
  const [chartType, setChartType] = useState("category");
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Load device analytics data
  useEffect(() => {
    const deviceInfo = trackDeviceInfo();
    
    try {
      const savedAnalytics = localStorage.getItem('device_analytics');
      if (savedAnalytics) {
        setDeviceData(JSON.parse(savedAnalytics));
      }
    } catch (err) {
      console.error("Error loading device analytics:", err);
    }
  }, []);
  
  const stats = getCategoryStats();
  const favorites = getFavoriteResources();
  
  // Summary box data
  const summaryData = [
    { 
      title: "Total Resources", 
      value: stats.totalResources,
      description: "All resources in your library"
    },
    { 
      title: "Categories", 
      value: stats.totalCategories,
      description: "Organized collection types"
    },
    { 
      title: "Favorites", 
      value: stats.favoriteResources,
      description: "Resources marked as favorites"
    },
    { 
      title: "Recent Activity", 
      value: resources.length > 0 ? new Date(resources.sort((a, b) => 
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())[0].updatedAt
      ).toLocaleDateString() : "N/A",
      description: "Last updated resource"
    }
  ];

  // Get top categories
  const getCategoryCounts = () => {
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
  };

  // Get contribution data by category
  const getContributionByCategory = () => {
    const contributionByCategory = categories.map(category => {
      const resourcesInCategory = resources.filter(r => r.categoryId === category.id);
      return {
        name: category.name,
        value: resourcesInCategory.length
      };
    }).filter(cat => cat.value > 0);
    
    return contributionByCategory.sort((a, b) => b.value - a.value);
  };
  
  // Process device data for charts
  const getDeviceChartData = () => {
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
  };
  
  // OS distribution
  const getOSChartData = () => {
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
  };
  
  // Device type distribution
  const getDeviceTypeData = () => {
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
  };

  const categoryCounts = getCategoryCounts();
  const contributionByCategory = getContributionByCategory();
  const browserChartData = getDeviceChartData();
  const osChartData = getOSChartData();
  const deviceTypeData = getDeviceTypeData();

  const handleClearAnalytics = () => {
    if (confirm("Are you sure you want to clear all device analytics data?")) {
      localStorage.removeItem('device_analytics');
      setDeviceData([]);
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    // Simulate data refresh
    setTimeout(() => {
      const deviceInfo = trackDeviceInfo();
      try {
        const savedAnalytics = localStorage.getItem('device_analytics');
        if (savedAnalytics) {
          setDeviceData(JSON.parse(savedAnalytics));
        }
      } catch (err) {
        console.error("Error refreshing analytics data:", err);
      }
      setIsRefreshing(false);
    }, 1000);
  };

  return (
    <div className="container mx-auto py-6 space-y-8">
      {/* Navigation and Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <Breadcrumb>
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
          <h1 className="text-3xl font-bold mt-2">Analytics Dashboard</h1>
        </div>
        
        <div className="flex gap-2 items-center">
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Refreshing...' : 'Refresh'}
          </Button>
          
          <Select value={timeFilter} onValueChange={setTimeFilter}>
            <SelectTrigger className="w-[180px]">
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
          <Card key={index}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{item.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{item.value}</div>
              <p className="text-xs text-muted-foreground">{item.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Charts section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Show different charts based on selected chart type */}
        {chartType === 'category' && (
          <>
            <Card>
              <CardHeader>
                <CardTitle>Resource Distribution</CardTitle>
                <CardDescription>Resources by category</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                {categoryCounts.length > 0 ? (
                  <BarChart
                    data={categoryCounts}
                    yAxisWidth={80}
                    showAnimation
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    No data available
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Contribution by Category</CardTitle>
                <CardDescription>Resource contribution across categories</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                {contributionByCategory.length > 0 ? (
                  <RadialChart 
                    data={contributionByCategory}
                    valueFormatter={(value) => `${value} items`}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    No contribution data available
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}
        
        {chartType === 'contribution' && (
          <>
            <Card>
              <CardHeader>
                <CardTitle>Category Growth</CardTitle>
                <CardDescription>Resources added over time</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <div className="flex items-center justify-center h-full">
                  <Badge variant="outline" className="text-muted-foreground">
                    Time-series data not available in this view
                  </Badge>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Resource Type Distribution</CardTitle>
                <CardDescription>Breakdown by resource type</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <div className="flex items-center justify-center h-full">
                  <Badge variant="outline" className="text-muted-foreground">
                    Resource type data not available
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </>
        )}
        
        {chartType === 'device' && (
          <>
            <Card>
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
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    No device data available
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
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
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    No operating system data available
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Device Type Distribution</CardTitle>
                <CardDescription>Mobile vs Desktop vs Tablet</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                {deviceTypeData.length > 0 ? (
                  <RadialChart 
                    data={deviceTypeData}
                    valueFormatter={(value) => `${value} visits`}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    No device type data available
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}

export default Analytics;
