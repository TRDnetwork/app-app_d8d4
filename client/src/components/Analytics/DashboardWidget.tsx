'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Bar, BarChart, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { Users, ShoppingCart, DollarSign, TrendingUp } from 'lucide-react';

// Mock data for analytics - in production, this would come from an API
const mockAnalyticsData = {
  dailyVisitors: [
    { date: '2024-01-01', visitors: 1200 },
    { date: '2024-01-02', visitors: 1400 },
    { date: '2024-01-03', visitors: 1100 },
    { date: '2024-01-04', visitors: 1800 },
    { date: '2024-01-05', visitors: 2100 },
    { date: '2024-01-06', visitors: 1900 },
    { date: '2024-01-07', visitors: 2300 },
  ],
  salesData: [
    { date: '2024-01-01', sales: 4500 },
    { date: '2024-01-02', sales: 5200 },
    { date: '2024-01-03', sales: 4100 },
    { date: '2024-01-04', sales: 6800 },
    { date: '2024-01-05', sales: 7200 },
    { date: '2024-01-06', sales: 6500 },
    { date: '2024-01-07', sales: 8100 },
  ],
  topProducts: [
    { name: 'Wireless Headphones', sales: 124 },
    { name: 'Smart Watch', sales: 98 },
    { name: '4K Camera', sales: 87 },
    { name: 'Streaming Box', sales: 76 },
    { name: 'Audio Cable', sales: 65 },
  ],
  conversionRates: [
    { step: 'Visitors', count: 15000 },
    { step: 'Product Views', count: 8500 },
    { step: 'Add to Cart', count: 2300 },
    { step: 'Checkout', count: 1200 },
    { step: 'Purchases', count: 850 },
  ],
};

export default function AnalyticsDashboardWidget() {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('7d');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeRange]);

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const calculateConversionRate = (start: number, end: number): number => {
    return start > 0 ? (end / start) * 100 : 0;
  };

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="h-24 bg-gray-200 rounded-lg"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Visitors</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(15234)}</div>
            <p className="text-xs text-muted-foreground">+12.5% from last {timeRange}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(850)}</div>
            <p className="text-xs text-muted-foreground">+8.2% from last {timeRange}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${formatNumber(54321)}</div>
            <p className="text-xs text-muted-foreground">+15.7% from last {timeRange}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5.6%</div>
            <p className="text-xs text-muted-foreground">+0.8% from last {timeRange}</p>
          </CardContent>
        </Card>
      </div>

      {/* Time Range Selector */}
      <div className="flex justify-end space-x-2">
        <Button
          variant={timeRange === '7d' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setTimeRange('7d')}
        >
          7D
        </Button>
        <Button
          variant={timeRange === '30d' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setTimeRange('30d')}
        >
          30D
        </Button>
        <Button
          variant={timeRange === '90d' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setTimeRange('90d')}
        >
          90D
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Visitors and Sales Over Time */}
        <Card>
          <CardHeader>
            <CardTitle>Visitors & Sales</CardTitle>
            <CardDescription>Weekly trend of visitors and sales</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                visitors: {
                  label: "Visitors",
                  color: "hsl(var(--chart-1))",
                },
                sales: {
                  label: "Sales",
                  color: "hsl(var(--chart-2))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mockAnalyticsData.dailyVisitors}>
                  <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  />
                  <YAxis
                    yAxisId="left"
                    orientation="left"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent indicator="dot" />}
                  />
                  <Line
                    yAxisId="left"
                    dataKey="visitors"
                    type="monotone"
                    stroke="var(--color-visitors)"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    yAxisId="right"
                    dataKey={(data) => mockAnalyticsData.salesData.find(s => s.date === data.date)?.sales || 0}
                    type="monotone"
                    stroke="var(--color-sales)"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card>
          <CardHeader>
            <CardTitle>Top Products</CardTitle>
            <CardDescription>Best selling products this period</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                sales: {
                  label: "Sales",
                  color: "hsl(var(--chart-3))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mockAnalyticsData.topProducts}>
                  <XAxis
                    dataKey="name"
                    tickLine={false}
                    tickMargin={8}
                    axisLine={false}
                    tickFormatter={(value) => value.slice(0, 10) + (value.length > 10 ? "..." : "")}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                  />
                  <Bar dataKey="sales" fill="var(--color-sales)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Conversion Funnel */}
      <Card>
        <CardHeader>
          <CardTitle>Conversion Funnel</CardTitle>
          <CardDescription>Customer journey from visit to purchase</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockAnalyticsData.conversionRates.map((step, index) => (
              <div key={step.step} className="flex items-center space-x-4">
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">{step.step}</span>
                    <span className="text-sm text-muted-foreground">{formatNumber(step.count)}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-orange-500 h-2.5 rounded-full"
                      style={{
                        width: `${(step.count / mockAnalyticsData.conversionRates[0].count) * 100}%`,
                      }}
                    ></div>
                  </div>
                </div>
                {index > 0 && (
                  <div className="text-sm text-muted-foreground">
                    {calculateConversionRate(
                      mockAnalyticsData.conversionRates[index - 1].count,
                      step.count
                    ).toFixed(1)}
                    %
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}