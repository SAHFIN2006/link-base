
import { useEffect, useState } from "react";
import { RadialChart, BarChart, AreaChart } from "@/components/ui/chart";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useDatabase } from "@/context/database-context";
import { trackDeviceInfo, DeviceInfo } from "@/utils/device-tracker";

function Analytics() {
  const { categories, resources, getCategoryStats, getFavoriteResources } = useDatabase();
  const [deviceData, setDeviceData] = useState<DeviceInfo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
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
  const browserChartData = getDeviceChartData();
  const osChartData = getOSChartData();
  const deviceTypeData = getDeviceTypeData();

  const handleClearAnalytics = () => {
    if (confirm("Are you sure you want to clear all device analytics data?")) {
      localStorage.removeItem('device_analytics');
      setDeviceData([]);
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-8">
      <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
      
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
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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

        <Card>
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
      </div>
    </div>
  );
}

export default Analytics;
