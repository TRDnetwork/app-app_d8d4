import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Bar, BarChart, Line, LineChart } from 'recharts';
import { TrendingUp, Package, ShoppingCart, Star } from 'lucide-react';

const mockData = {
  revenue: [
    { month: 'Jan', value: 4500 },
    { month: 'Feb', value: 6800 },
    { month: 'Mar', value: 5200 },
    { month: 'Apr', value: 7800 },
    { month: 'May', value: 8500 },
    { month: 'Jun', value: 9200 },
  ],
  orders: [
    { month: 'Jan', value: 120 },
    { month: 'Feb', value: 180 },
    { month: 'Mar', value: 140 },
    { month: 'Apr', value: 210 },
    { month: 'May', value: 230 },
    { month: 'Jun', value: 250 },
  ],
  kpi: {
    revenue: 9200,
    orders: 250,
    productsSold: 1840,
    avgRating: 4.8,
  },
};

const AnalyticsDashboardWidget = () => {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {/* KPI Cards */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          <TrendingUp className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${mockData.kpi.revenue.toLocaleString()}</div>
          <p className="text-xs text-text-dim">+12% from last month</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
          <ShoppingCart className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{mockData.kpi.orders.toLocaleString()}</div>
          <p className="text-xs text-text-dim">+8% from last month</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Products Sold</CardTitle>
          <Package className="h-4 w-4 text-orange-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{mockData.kpi.productsSold.toLocaleString()}</div>
          <p className="text-xs text-text-dim">+15% from last month</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Avg. Rating</CardTitle>
          <Star className="h-4 w-4 text-yellow-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{mockData.kpi.avgRating}</div>
          <p className="text-xs text-text-dim">+0.2 from last month</p>
        </CardContent>
      </Card>

      {/* Revenue Chart */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Revenue Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              value: {
                label: 'Revenue',
                color: 'hsl(var(--chart-1))',
              },
            }}
            className="h-[300px]"
          >
            <LineChart data={mockData.revenue}>
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line
                type="monotone"
                dataKey="value"
                stroke="hsl(var(--chart-1))"
                strokeWidth={2}
                dot={true}
              />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Orders Chart */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Orders Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              value: {
                label: 'Orders',
                color: 'hsl(var(--chart-2))',
              },
            }}
            className="h-[300px]"
          >
            <BarChart data={mockData.orders}>
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="value" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsDashboardWidget;