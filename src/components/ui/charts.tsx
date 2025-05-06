
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
} from "recharts";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";

// Color palette for charts
const COLORS = [
  "#8884d8", "#82ca9d", "#ffc658", "#ff7f50", "#e8c1a0", 
  "#ff6b6b", "#47b39c", "#ffc75e", "#6a0572", "#36486b"
];

interface ChartItem {
  name: string;
  value: number;
}

interface RadialChartProps {
  data: ChartItem[];
  className?: string;
  valueFormatter?: (value: number) => string;
}

export function RadialChart({ data, className, valueFormatter }: RadialChartProps) {
  return (
    <ChartContainer config={{}} className={className}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={80}
            innerRadius={40}
            fill="#8884d8"
            paddingAngle={5}
            label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload;
                return (
                  <div className="rounded-lg border bg-background p-2 shadow-md">
                    <p className="font-medium">{data.name}</p>
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
        </PieChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}

interface BarChartProps {
  data: ChartItem[];
  className?: string;
  yAxisWidth?: number;
  showAnimation?: boolean;
}

export function BarChart({ data, className, yAxisWidth = 50, showAnimation = false }: BarChartProps) {
  return (
    <ChartContainer config={{}} className={className}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
          <XAxis dataKey="name" tick={{ fill: 'var(--foreground)' }} />
          <YAxis width={yAxisWidth} tick={{ fill: 'var(--foreground)' }} />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload;
                return (
                  <div className="rounded-lg border bg-background p-2 shadow-md">
                    <p className="font-medium">{data.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {data.value}
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
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </RechartsBarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}

interface AreaChartProps {
  data: any[];
  dataKey: string;
  className?: string;
}

export function AreaChart({ data, dataKey, className }: AreaChartProps) {
  return (
    <ChartContainer config={{}} className={className}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsAreaChart
          data={data}
          margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
          <XAxis dataKey="name" tick={{ fill: 'var(--foreground)' }} />
          <YAxis tick={{ fill: 'var(--foreground)' }} />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload;
                return (
                  <div className="rounded-lg border bg-background p-2 shadow-md">
                    <p className="font-medium">{data.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {data[dataKey]}
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
            stroke="#8884d8" 
            fill="#8884d8"
            fillOpacity={0.3}
          />
        </RechartsAreaChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
