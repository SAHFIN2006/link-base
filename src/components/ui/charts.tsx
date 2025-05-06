import React from "react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
  AreaChart as RechartsAreaChart,
  Area,
  Sector,
  RadialBarChart as RechartsRadialBarChart,
  RadialBar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis
} from "recharts";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { cn } from "@/lib/utils";

// Enhanced color palette with gradients for better visuals
const COLORS = [
  "#9b87f5", "#7E69AB", "#6E59A5", "#8B5CF6", "#D946EF", 
  "#F97316", "#0EA5E9", "#22C55E", "#EAB308", "#EC4899"
];

interface ChartItem {
  name: string;
  value: number;
}

interface RadialChartProps {
  data: ChartItem[];
  className?: string;
  valueFormatter?: (value: number) => string;
  showAnimation?: boolean;
  showLegend?: boolean;
  emptyText?: string;
  centerText?: string;
  activeIndex?: number;
  setActiveIndex?: React.Dispatch<React.SetStateAction<number>>;
}

// Enhanced Radial Chart with animations and active segment highlight
export function RadialChart({ 
  data, 
  className, 
  valueFormatter,
  showAnimation = true,
  showLegend = true,
  emptyText = "No data available",
  centerText,
  activeIndex: externalActiveIndex,
  setActiveIndex: setExternalActiveIndex
}: RadialChartProps) {
  const [internalActiveIndex, setInternalActiveIndex] = React.useState(0);
  
  const activeIndex = externalActiveIndex !== undefined ? externalActiveIndex : internalActiveIndex;
  const setActiveIndex = setExternalActiveIndex || setInternalActiveIndex;
  
  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };

  const renderActiveShape = (props: any) => {
    const { 
      cx, cy, innerRadius, outerRadius, startAngle, endAngle,
      fill, payload, percent, value
    } = props;
  
    return (
      <g>
        <text x={cx} y={cy} dy={-18} textAnchor="middle" fill="#888" fontSize="12px">
          {payload.name}
        </text>
        <text x={cx} y={cy} dy={8} textAnchor="middle" fill="#333" fontSize="16px" fontWeight="bold">
          {valueFormatter ? valueFormatter(value) : value}
        </text>
        <text x={cx} y={cy} dy={25} textAnchor="middle" fill="#888" fontSize="12px">
          {`(${(percent * 100).toFixed(0)}%)`}
        </text>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius + 10}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
          opacity={0.8}
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 10}
          outerRadius={outerRadius + 14}
          fill={fill}
        />
      </g>
    );
  };

  return (
    <ChartContainer config={{}} className={className}>
      {data.length > 0 ? (
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <defs>
              {COLORS.map((color, index) => (
                <linearGradient key={`gradient-${index}`} id={`gradient-${index}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={color} stopOpacity={0.9}/>
                  <stop offset="100%" stopColor={color} stopOpacity={0.7}/>
                </linearGradient>
              ))}
            </defs>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              innerRadius={40}
              paddingAngle={5}
              activeIndex={activeIndex}
              activeShape={renderActiveShape}
              onMouseEnter={onPieEnter}
              animationDuration={showAnimation ? 1000 : 0}
              animationBegin={0}
              animationEasing="ease-out"
            >
              {data.map((_, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={`url(#gradient-${index % COLORS.length})`} 
                  stroke="#fff" 
                  strokeWidth={1}
                />
              ))}
            </Pie>
            <Tooltip 
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="rounded-lg border bg-background p-3 shadow-md">
                      <p className="font-medium text-base">{data.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {valueFormatter 
                          ? valueFormatter(data.value) 
                          : `${data.value}`}
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            {showLegend && (
              <Legend 
                layout="horizontal" 
                verticalAlign="bottom" 
                align="center" 
                wrapperStyle={{ paddingTop: 20 }}
                formatter={(value) => <span className="text-xs">{value}</span>}
              />
            )}
            {centerText && (
              <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="text-lg font-medium">
                {centerText}
              </text>
            )}
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex items-center justify-center h-full text-muted-foreground">
          {emptyText}
        </div>
      )}
    </ChartContainer>
  );
}

interface BarChartProps {
  data: ChartItem[];
  className?: string;
  yAxisWidth?: number;
  showAnimation?: boolean;
  showLegend?: boolean;
  emptyText?: string;
  layout?: "vertical" | "horizontal";
  valueFormatter?: (value: number) => string;
  barSize?: number;
}

export function BarChart({ 
  data, 
  className, 
  yAxisWidth = 50, 
  showAnimation = true,
  showLegend = true,
  emptyText = "No data available",
  layout = "vertical",
  valueFormatter,
  barSize = 20
}: BarChartProps) {
  const isHorizontal = layout === "horizontal";
  
  return (
    <ChartContainer config={{}} className={className}>
      {data.length > 0 ? (
        <ResponsiveContainer width="100%" height="100%">
          <RechartsBarChart
            data={data}
            layout={layout}
            margin={{ top: 20, right: 30, left: yAxisWidth, bottom: 40 }}
          >
            <defs>
              {COLORS.map((color, index) => (
                <linearGradient 
                  key={`gradient-${index}`} 
                  id={`barGradient-${index}`} 
                  x1="0" 
                  y1="0" 
                  x2={isHorizontal ? "0" : "1"} 
                  y2={isHorizontal ? "1" : "0"}
                >
                  <stop offset="0%" stopColor={color} stopOpacity={0.9}/>
                  <stop offset="100%" stopColor={color} stopOpacity={0.7}/>
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
            <XAxis 
              dataKey={isHorizontal ? "name" : "value"} 
              type={isHorizontal ? "category" : "number"} 
              tick={{ fill: 'var(--foreground)', fontSize: 12 }} 
              angle={isHorizontal ? -45 : 0}
              textAnchor={isHorizontal ? "end" : "middle"}
              height={60}
            />
            <YAxis 
              width={yAxisWidth} 
              dataKey={isHorizontal ? "value" : "name"}
              type={isHorizontal ? "number" : "category"}
              tick={{ fill: 'var(--foreground)', fontSize: 12 }}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="rounded-lg border bg-background p-3 shadow-md">
                      <p className="font-medium text-base">{data.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {valueFormatter 
                          ? valueFormatter(data.value) 
                          : `${data.value}`}
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar 
              dataKey="value" 
              fill="#8884d8"
              animationDuration={showAnimation ? 1500 : 0}
              animationBegin={0}
              animationEasing="ease-out"
              barSize={barSize}
              radius={[4, 4, 0, 0]}
            >
              {data.map((_, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={`url(#barGradient-${index % COLORS.length})`}
                  className="hover:opacity-80 transition-opacity duration-300"
                />
              ))}
            </Bar>
            {showLegend && (
              <Legend 
                layout="horizontal" 
                verticalAlign="bottom" 
                align="center"
                wrapperStyle={{ paddingTop: 20 }}
                formatter={(value) => <span className="text-xs">{value}</span>}
              />
            )}
          </RechartsBarChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex items-center justify-center h-full text-muted-foreground">
          {emptyText}
        </div>
      )}
    </ChartContainer>
  );
}

interface AreaChartProps {
  data: any[];
  dataKey: string;
  className?: string;
  showAnimation?: boolean;
  showLegend?: boolean;
  emptyText?: string;
  valueFormatter?: (value: number) => string;
  xAxisDataKey?: string;
  areaColors?: string[];
}

export function AreaChart({ 
  data, 
  dataKey, 
  className,
  showAnimation = true,
  showLegend = true,
  emptyText = "No data available",
  valueFormatter,
  xAxisDataKey = "name",
  areaColors = ["#9b87f5", "#6B8AFF"]
}: AreaChartProps) {
  return (
    <ChartContainer config={{}} className={className}>
      {data.length > 0 ? (
        <ResponsiveContainer width="100%" height="100%">
          <RechartsAreaChart
            data={data}
            margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
          >
            <defs>
              <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={areaColors[0]} stopOpacity={0.8}/>
                <stop offset="95%" stopColor={areaColors[1]} stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
            <XAxis 
              dataKey={xAxisDataKey} 
              tick={{ fill: 'var(--foreground)' }} 
              angle={-45}
              textAnchor="end"
              height={60}
              minTickGap={5}
            />
            <YAxis 
              tick={{ fill: 'var(--foreground)' }}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="rounded-lg border bg-background p-3 shadow-md">
                      <p className="font-medium text-base">{data[xAxisDataKey]}</p>
                      <p className="text-sm text-muted-foreground">
                        {valueFormatter 
                          ? valueFormatter(data[dataKey]) 
                          : `${data[dataKey]}`}
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area 
              type="monotone" 
              dataKey={dataKey} 
              stroke={areaColors[0]} 
              fill="url(#areaGradient)"
              strokeWidth={2}
              activeDot={{ r: 6, strokeWidth: 1, stroke: "#fff" }}
              isAnimationActive={showAnimation}
              animationDuration={1500}
              animationEasing="ease-out"
            />
            {showLegend && (
              <Legend 
                layout="horizontal" 
                verticalAlign="bottom"
                wrapperStyle={{ paddingTop: 20 }}
              />
            )}
          </RechartsAreaChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex items-center justify-center h-full text-muted-foreground">
          {emptyText}
        </div>
      )}
    </ChartContainer>
  );
}

interface CustomRadialBarChartProps {
  data: ChartItem[];
  className?: string;
  emptyText?: string;
  showAnimation?: boolean;
  showLegend?: boolean;
  valueFormatter?: (value: number) => string;
}

export function CustomRadialBarChart({
  data,
  className,
  emptyText = "No data available",
  showAnimation = true,
  showLegend = true,
  valueFormatter
}: CustomRadialBarChartProps) {
  return (
    <ChartContainer config={{}} className={className}>
      {data.length > 0 ? (
        <ResponsiveContainer width="100%" height="100%">
          <RechartsRadialBarChart 
            cx="50%" 
            cy="50%" 
            innerRadius="20%" 
            outerRadius="90%" 
            barSize={20} 
            data={data}
          >
            <defs>
              {COLORS.map((color, index) => (
                <linearGradient 
                  key={`radialGradient-${index}`} 
                  id={`radialGradient-${index}`} 
                  x1="0" 
                  y1="0" 
                  x2="1" 
                  y2="1"
                >
                  <stop offset="0%" stopColor={color} stopOpacity={0.9}/>
                  <stop offset="100%" stopColor={color} stopOpacity={0.7}/>
                </linearGradient>
              ))}
            </defs>
            <PolarAngleAxis 
              type="number" 
              domain={[0, 'auto']} 
              angleAxisId={0} 
              tick={false}
            />
            <RadialBar
              background
              dataKey="value"
              angleAxisId={0}
              isAnimationActive={showAnimation}
              animationDuration={1500}
              animationEasing="ease-out"
            >
              {data.map((_, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={`url(#radialGradient-${index % COLORS.length})`} 
                />
              ))}
            </RadialBar>
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="rounded-lg border bg-background p-3 shadow-md">
                      <p className="font-medium text-base">{data.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {valueFormatter 
                          ? valueFormatter(data.value) 
                          : `${data.value}`}
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            {showLegend && (
              <Legend 
                layout="horizontal" 
                verticalAlign="bottom"
                wrapperStyle={{ paddingTop: 20 }}
              />
            )}
          </RechartsRadialBarChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex items-center justify-center h-full text-muted-foreground">
          {emptyText}
        </div>
      )}
    </ChartContainer>
  );
}

interface DynamicChartProps {
  data: ChartItem[];
  className?: string;
  chartType?: "pie" | "bar" | "radial" | "area" | "radialBar";
  valueFormatter?: (value: number) => string;
  showAnimation?: boolean;
}

export function DynamicChart({
  data,
  className,
  chartType = "pie",
  valueFormatter,
  showAnimation = true
}: DynamicChartProps) {
  const formattedAreaData = React.useMemo(() => {
    // Convert the data format for area chart if needed
    if (chartType === "area") {
      return data;
    }
    return data;
  }, [data, chartType]);

  if (chartType === "pie") {
    return <RadialChart data={data} className={className} valueFormatter={valueFormatter} showAnimation={showAnimation} />;
  }
  if (chartType === "bar") {
    return <BarChart data={data} className={className} valueFormatter={valueFormatter} showAnimation={showAnimation} />;
  }
  if (chartType === "radialBar") {
    return <CustomRadialBarChart data={data} className={className} valueFormatter={valueFormatter} showAnimation={showAnimation} />;
  }
  if (chartType === "area") {
    return <AreaChart data={formattedAreaData} dataKey="value" className={className} valueFormatter={valueFormatter} showAnimation={showAnimation} />;
  }
  return <RadialChart data={data} className={className} valueFormatter={valueFormatter} showAnimation={showAnimation} />;
}
