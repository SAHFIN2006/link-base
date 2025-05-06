
import React, { useMemo } from "react";
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
  PolarRadiusAxis,
  Brush,
  ReferenceLine,
  LineChart,
  Line,
  ComposedChart,
  Scatter
} from "recharts";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { cn } from "@/lib/utils";

// Enhanced color palette with gradients for better visuals
const COLORS = [
  "#8b5cf6", "#d946ef", "#ec4899", "#f97316", "#0ea5e9", 
  "#22c55e", "#eab308", "#6366f1", "#3b82f6", "#10b981"
];

// Additional gradient definitions
const gradientOffset = (data: Array<{ value: number }>) => {
  const dataMax = Math.max(...data.map(i => i.value));
  const dataMin = Math.min(...data.map(i => i.value));
  
  if (dataMax <= 0) {
    return 0;
  }
  if (dataMin >= 0) {
    return 1;
  }
  
  return dataMax / (dataMax - dataMin);
};

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
  innerRadius?: number;
  outerRadius?: number;
  paddingAngle?: number;
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
  setActiveIndex: setExternalActiveIndex,
  innerRadius = 40,
  outerRadius = 80,
  paddingAngle = 5
}: RadialChartProps) {
  const [internalActiveIndex, setInternalActiveIndex] = React.useState(0);
  
  const activeIndex = externalActiveIndex !== undefined ? externalActiveIndex : internalActiveIndex;
  const setActiveIndex = setExternalActiveIndex || setInternalActiveIndex;
  
  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };

  // Enhanced active shape render with better animations and details
  const renderActiveShape = (props: any) => {
    const { 
      cx, cy, innerRadius, outerRadius, startAngle, endAngle,
      fill, payload, percent, value
    } = props;
  
    return (
      <g>
        <text x={cx} y={cy} dy={-18} textAnchor="middle" fill="var(--foreground)" fontSize="12px">
          {payload.name}
        </text>
        <text x={cx} y={cy} dy={8} textAnchor="middle" fill="var(--foreground)" fontSize="16px" fontWeight="bold">
          {valueFormatter ? valueFormatter(value) : value}
        </text>
        <text x={cx} y={cy} dy={25} textAnchor="middle" fill="var(--muted-foreground)" fontSize="12px">
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
              outerRadius={outerRadius}
              innerRadius={innerRadius}
              paddingAngle={paddingAngle}
              activeIndex={activeIndex}
              activeShape={renderActiveShape}
              onMouseEnter={onPieEnter}
              animationDuration={showAnimation ? 1200 : 0}
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
  stacked?: boolean;
  showBrush?: boolean;
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
  barSize = 20,
  stacked = false,
  showBrush = false
}: BarChartProps) {
  const isHorizontal = layout === "horizontal";
  
  return (
    <ChartContainer config={{}} className={className}>
      {data.length > 0 ? (
        <ResponsiveContainer width="100%" height="100%">
          <RechartsBarChart
            data={data}
            layout={layout}
            margin={{ top: 20, right: 30, left: yAxisWidth, bottom: showBrush ? 60 : 40 }}
            barGap={4}
            barCategoryGap={12}
          >
            <defs>
              {COLORS.map((color, index) => (
                <linearGradient 
                  key={`barGradient-${index}`} 
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
              padding={{ left: 20, right: 20 }}
              tickLine={{ stroke: 'var(--border)' }}
              axisLine={{ stroke: 'var(--border)' }}
            />
            <YAxis 
              width={yAxisWidth} 
              dataKey={isHorizontal ? "value" : "name"}
              type={isHorizontal ? "number" : "category"}
              tick={{ fill: 'var(--foreground)', fontSize: 12 }}
              tickLine={{ stroke: 'var(--border)' }}
              axisLine={{ stroke: 'var(--border)' }}
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
              cursor={{ fill: 'var(--muted)', opacity: 0.1 }}
            />
            <Bar 
              dataKey="value" 
              fill="#8884d8"
              animationDuration={showAnimation ? 1500 : 0}
              animationBegin={0}
              animationEasing="ease-out"
              barSize={barSize}
              radius={[4, 4, 0, 0]}
              stackId={stacked ? "stack" : undefined}
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
            {showBrush && (
              <Brush 
                dataKey="name" 
                height={20} 
                stroke="var(--primary)"
                fill="var(--background)"
                tickFormatter={(value) => value.toString().slice(0, 8)}
              />
            )}
            {isHorizontal && (
              <ReferenceLine y={0} stroke="var(--border)" />
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
  showGradient?: boolean;
  stackedKeys?: string[];
  syncId?: string;
  showBrush?: boolean;
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
  areaColors = ["#9b87f5", "#6B8AFF"],
  showGradient = true,
  stackedKeys,
  syncId,
  showBrush = false
}: AreaChartProps) {
  // Calculate gradient offset for positive/negative areas
  const offset = useMemo(() => {
    if (!data || !dataKey || !data.length) return 0.5;
    return gradientOffset(data.map(item => ({ value: item[dataKey] })));
  }, [data, dataKey]);

  return (
    <ChartContainer config={{}} className={className}>
      {data.length > 0 ? (
        <ResponsiveContainer width="100%" height="100%">
          <RechartsAreaChart
            data={data}
            margin={{ top: 20, right: 30, left: 0, bottom: showBrush ? 60 : 20 }}
            syncId={syncId}
          >
            <defs>
              {showGradient && (
                <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={areaColors[0]} stopOpacity={0.8}/>
                  <stop offset="95%" stopColor={areaColors[1]} stopOpacity={0.1}/>
                </linearGradient>
              )}
              {areaColors.map((color, index) => (
                <linearGradient 
                  key={`areaGradient-${index}`} 
                  id={`areaGradient-${index}`} 
                  x1="0" 
                  y1="0" 
                  x2="0" 
                  y2="1"
                >
                  <stop offset="5%" stopColor={color} stopOpacity={0.8}/>
                  <stop offset="95%" stopColor={color} stopOpacity={0.1}/>
                </linearGradient>
              ))}
              <linearGradient id="splitColor" x1="0" y1="0" x2="0" y2="1">
                <stop offset={offset} stopColor="green" stopOpacity={0.8} />
                <stop offset={offset} stopColor="red" stopOpacity={0.8} />
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
              tickLine={{ stroke: 'var(--border)' }}
              axisLine={{ stroke: 'var(--border)' }}
            />
            <YAxis 
              tick={{ fill: 'var(--foreground)' }}
              tickLine={{ stroke: 'var(--border)' }}
              axisLine={{ stroke: 'var(--border)' }}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="rounded-lg border bg-background p-3 shadow-md">
                      <p className="font-medium text-base">{payload[0].payload[xAxisDataKey]}</p>
                      {payload.map((entry, index) => (
                        <p key={`tooltip-${index}`} className="text-sm text-muted-foreground">
                          <span className="inline-block w-3 h-3 mr-2 rounded-full" style={{ backgroundColor: entry.color }}></span>
                          {entry.name}: {valueFormatter 
                            ? valueFormatter(entry.value as number) 
                            : entry.value}
                        </p>
                      ))}
                    </div>
                  );
                }
                return null;
              }}
            />
            {stackedKeys ? (
              // Render multiple stacked areas if stackedKeys are provided
              stackedKeys.map((key, index) => (
                <Area 
                  key={`area-${key}`}
                  type="monotone" 
                  dataKey={key} 
                  stroke={COLORS[index % COLORS.length]} 
                  fill={`url(#areaGradient-${index % areaColors.length})`}
                  strokeWidth={2}
                  activeDot={{ r: 6, strokeWidth: 1, stroke: "#fff" }}
                  isAnimationActive={showAnimation}
                  animationDuration={1500 + (index * 300)}
                  animationEasing="ease-out"
                  stackId="1"
                />
              ))
            ) : (
              // Render single area chart
              <Area 
                type="monotone" 
                dataKey={dataKey} 
                stroke={areaColors[0]} 
                fill={showGradient ? "url(#areaGradient)" : areaColors[0]}
                strokeWidth={2}
                activeDot={{ r: 6, strokeWidth: 1, stroke: "#fff" }}
                isAnimationActive={showAnimation}
                animationDuration={1500}
                animationEasing="ease-out"
              />
            )}
            {showLegend && (
              <Legend 
                layout="horizontal" 
                verticalAlign="bottom"
                wrapperStyle={{ paddingTop: 20 }}
                formatter={(value) => <span className="text-xs">{value}</span>}
              />
            )}
            {showBrush && (
              <Brush 
                dataKey={xAxisDataKey} 
                height={20} 
                stroke="var(--primary)"
                fill="var(--background)"
                tickFormatter={(value) => value.toString().slice(0, 8)}
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
            startAngle={180}
            endAngle={-180}
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
            <PolarRadiusAxis 
              tickCount={5} 
              tick={{ fill: 'var(--foreground)', fontSize: 12 }}
            />
            <RadialBar
              background={{ fill: 'var(--muted)' }}
              dataKey="value"
              angleAxisId={0}
              isAnimationActive={showAnimation}
              animationDuration={1500}
              animationBegin={200}
              animationEasing="ease-out"
              label={{ 
                position: 'insideStart', 
                fill: 'var(--background)', 
                fontSize: 12, 
                fontWeight: 'bold',
                formatter: (value) => valueFormatter ? valueFormatter(value).toString() : value.toString()
              }}
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
                formatter={(value) => <span className="text-xs">{value}</span>}
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

interface LineChartProps {
  data: any[];
  dataKey: string | string[];
  className?: string;
  showAnimation?: boolean;
  showLegend?: boolean;
  emptyText?: string;
  valueFormatter?: (value: number) => string;
  xAxisDataKey?: string;
  showDots?: boolean;
  syncId?: string;
  showBrush?: boolean;
}

export function LineChart({
  data,
  dataKey,
  className,
  showAnimation = true,
  showLegend = true,
  emptyText = "No data available",
  valueFormatter,
  xAxisDataKey = "name",
  showDots = true,
  syncId,
  showBrush = false
}: LineChartProps) {
  const keys = Array.isArray(dataKey) ? dataKey : [dataKey];
  
  return (
    <ChartContainer config={{}} className={className}>
      {data.length > 0 ? (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 20, right: 30, left: 0, bottom: showBrush ? 60 : 20 }}
            syncId={syncId}
          >
            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
            <XAxis 
              dataKey={xAxisDataKey} 
              tick={{ fill: 'var(--foreground)' }}
              angle={-45}
              textAnchor="end"
              height={60}
              tickLine={{ stroke: 'var(--border)' }}
              axisLine={{ stroke: 'var(--border)' }}
            />
            <YAxis
              tick={{ fill: 'var(--foreground)' }}
              tickLine={{ stroke: 'var(--border)' }}
              axisLine={{ stroke: 'var(--border)' }}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="rounded-lg border bg-background p-3 shadow-md">
                      <p className="font-medium text-base">{payload[0].payload[xAxisDataKey]}</p>
                      {payload.map((entry, index) => (
                        <p key={`tooltip-${index}`} className="text-sm text-muted-foreground">
                          <span className="inline-block w-3 h-3 mr-2 rounded-full" style={{ backgroundColor: entry.color }}></span>
                          {entry.name}: {valueFormatter 
                            ? valueFormatter(entry.value as number) 
                            : entry.value}
                        </p>
                      ))}
                    </div>
                  );
                }
                return null;
              }}
            />
            {keys.map((key, index) => (
              <Line
                key={`line-${key}`}
                type="monotone"
                dataKey={key}
                stroke={COLORS[index % COLORS.length]}
                strokeWidth={2}
                dot={showDots}
                activeDot={{ r: 6, strokeWidth: 1, stroke: "#fff" }}
                isAnimationActive={showAnimation}
                animationDuration={1500 + (index * 300)}
                animationEasing="ease-out"
              />
            ))}
            {showLegend && (
              <Legend 
                layout="horizontal" 
                verticalAlign="bottom"
                wrapperStyle={{ paddingTop: 20 }}
                formatter={(value) => <span className="text-xs">{value}</span>}
              />
            )}
            {showBrush && (
              <Brush 
                dataKey={xAxisDataKey} 
                height={20} 
                stroke="var(--primary)"
                fill="var(--background)"
                tickFormatter={(value) => value.toString().slice(0, 8)}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex items-center justify-center h-full text-muted-foreground">
          {emptyText}
        </div>
      )}
    </ChartContainer>
  );
}

interface ComboChartProps {
  data: any[];
  barKeys: string[];
  lineKeys: string[];
  className?: string;
  showAnimation?: boolean;
  showLegend?: boolean;
  emptyText?: string;
  valueFormatter?: (value: number) => string;
  xAxisDataKey?: string;
  syncId?: string;
}

export function ComboChart({
  data,
  barKeys,
  lineKeys,
  className,
  showAnimation = true,
  showLegend = true,
  emptyText = "No data available",
  valueFormatter,
  xAxisDataKey = "name",
  syncId
}: ComboChartProps) {
  return (
    <ChartContainer config={{}} className={className}>
      {data.length > 0 ? (
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={data}
            margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
            syncId={syncId}
          >
            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
            <XAxis 
              dataKey={xAxisDataKey} 
              tick={{ fill: 'var(--foreground)' }}
              angle={-45}
              textAnchor="end"
              height={60}
              tickLine={{ stroke: 'var(--border)' }}
              axisLine={{ stroke: 'var(--border)' }}
            />
            <YAxis
              tick={{ fill: 'var(--foreground)' }}
              tickLine={{ stroke: 'var(--border)' }}
              axisLine={{ stroke: 'var(--border)' }}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="rounded-lg border bg-background p-3 shadow-md">
                      <p className="font-medium text-base">{payload[0].payload[xAxisDataKey]}</p>
                      {payload.map((entry, index) => (
                        <p key={`tooltip-${index}`} className="text-sm text-muted-foreground">
                          <span className="inline-block w-3 h-3 mr-2 rounded-full" style={{ backgroundColor: entry.color }}></span>
                          {entry.name}: {valueFormatter 
                            ? valueFormatter(entry.value as number) 
                            : entry.value}
                        </p>
                      ))}
                    </div>
                  );
                }
                return null;
              }}
            />
            {barKeys.map((key, index) => (
              <Bar
                key={`bar-${key}`}
                dataKey={key}
                fill={`url(#barGradient-${index % COLORS.length})`}
                isAnimationActive={showAnimation}
                animationDuration={1500}
                animationBegin={index * 100}
                animationEasing="ease-out"
                barSize={20}
                radius={[4, 4, 0, 0]}
              />
            ))}
            {lineKeys.map((key, index) => (
              <Line
                key={`line-${key}`}
                type="monotone"
                dataKey={key}
                stroke={COLORS[(index + barKeys.length) % COLORS.length]}
                strokeWidth={2}
                dot
                activeDot={{ r: 6, strokeWidth: 1, stroke: "#fff" }}
                isAnimationActive={showAnimation}
                animationDuration={1500 + (index * 300)}
                animationEasing="ease-out"
              />
            ))}
            {showLegend && (
              <Legend 
                layout="horizontal" 
                verticalAlign="bottom"
                wrapperStyle={{ paddingTop: 20 }}
                formatter={(value) => <span className="text-xs">{value}</span>}
              />
            )}
          </ComposedChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex items-center justify-center h-full text-muted-foreground">
          {emptyText}
        </div>
      )}
    </ChartContainer>
  );
}

interface ScatterChartProps {
  data: any[];
  dataKey: string;
  xAxisKey?: string;
  yAxisKey?: string;
  className?: string;
  showAnimation?: boolean;
  showLegend?: boolean;
  emptyText?: string;
  valueFormatter?: (value: number) => string;
}

export function ScatterPlotChart({
  data,
  dataKey,
  xAxisKey = "x",
  yAxisKey = "y",
  className,
  showAnimation = true,
  showLegend = true,
  emptyText = "No data available",
  valueFormatter
}: ScatterChartProps) {
  return (
    <ChartContainer config={{}} className={className}>
      {data.length > 0 ? (
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={data}
            margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
            <XAxis 
              dataKey={xAxisKey} 
              type="number"
              tick={{ fill: 'var(--foreground)' }}
              tickLine={{ stroke: 'var(--border)' }}
              axisLine={{ stroke: 'var(--border)' }}
            />
            <YAxis
              dataKey={yAxisKey}
              type="number"
              tick={{ fill: 'var(--foreground)' }}
              tickLine={{ stroke: 'var(--border)' }}
              axisLine={{ stroke: 'var(--border)' }}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="rounded-lg border bg-background p-3 shadow-md">
                      <p className="font-medium text-base">{data[dataKey]}</p>
                      <p className="text-sm text-muted-foreground">
                        X: {data[xAxisKey]}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Y: {valueFormatter 
                          ? valueFormatter(data[yAxisKey]) 
                          : data[yAxisKey]}
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Scatter 
              name={dataKey} 
              data={data} 
              fill={COLORS[0]}
              isAnimationActive={showAnimation}
              animationDuration={1500}
              animationEasing="ease-out"
            >
              {data.map((_, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={COLORS[index % COLORS.length]} 
                />
              ))}
            </Scatter>
            {showLegend && (
              <Legend 
                layout="horizontal" 
                verticalAlign="bottom"
                wrapperStyle={{ paddingTop: 20 }}
                formatter={(value) => <span className="text-xs">{value}</span>}
              />
            )}
          </ComposedChart>
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
  data: any[];
  className?: string;
  chartType?: "pie" | "bar" | "radial" | "area" | "radialBar" | "line" | "combo" | "scatter";
  valueFormatter?: (value: number) => string;
  showAnimation?: boolean;
  chartConfig?: {
    xAxis?: string;
    yAxis?: string;
    dataKeys?: string[];
    barKeys?: string[];
    lineKeys?: string[];
    showBrush?: boolean;
    stacked?: boolean;
  };
}

export function DynamicChart({
  data,
  className,
  chartType = "pie",
  valueFormatter,
  showAnimation = true,
  chartConfig
}: DynamicChartProps) {
  // Enhanced chart selector with more options and better configuration
  switch(chartType) {
    case "pie":
      return (
        <RadialChart 
          data={data} 
          className={className} 
          valueFormatter={valueFormatter} 
          showAnimation={showAnimation} 
        />
      );
    case "bar":
      return (
        <BarChart 
          data={data} 
          className={className} 
          valueFormatter={valueFormatter} 
          showAnimation={showAnimation}
          showBrush={chartConfig?.showBrush}
          stacked={chartConfig?.stacked}
        />
      );
    case "radialBar":
      return (
        <CustomRadialBarChart 
          data={data} 
          className={className} 
          valueFormatter={valueFormatter} 
          showAnimation={showAnimation} 
        />
      );
    case "area":
      return (
        <AreaChart 
          data={data} 
          dataKey={chartConfig?.dataKeys?.[0] || "value"}
          xAxisDataKey={chartConfig?.xAxis || "name"}
          stackedKeys={chartConfig?.dataKeys?.length > 1 ? chartConfig.dataKeys : undefined}
          className={className} 
          valueFormatter={valueFormatter} 
          showAnimation={showAnimation} 
          showBrush={chartConfig?.showBrush}
        />
      );
    case "line":
      return (
        <LineChart 
          data={data} 
          dataKey={chartConfig?.dataKeys || "value"}
          xAxisDataKey={chartConfig?.xAxis || "name"}
          className={className} 
          valueFormatter={valueFormatter} 
          showAnimation={showAnimation}
          showBrush={chartConfig?.showBrush}
        />
      );
    case "combo":
      return (
        <ComboChart 
          data={data} 
          barKeys={chartConfig?.barKeys || ["value"]}
          lineKeys={chartConfig?.lineKeys || []}
          xAxisDataKey={chartConfig?.xAxis || "name"}
          className={className} 
          valueFormatter={valueFormatter} 
          showAnimation={showAnimation}
        />
      );
    case "scatter":
      return (
        <ScatterPlotChart 
          data={data} 
          dataKey="name"
          xAxisKey={chartConfig?.xAxis || "x"}
          yAxisKey={chartConfig?.yAxis || "y"} 
          className={className} 
          valueFormatter={valueFormatter} 
          showAnimation={showAnimation}
        />
      );
    case "radial":
    default:
      return (
        <RadialChart 
          data={data} 
          className={className} 
          valueFormatter={valueFormatter} 
          showAnimation={showAnimation} 
        />
      );
  }
}
