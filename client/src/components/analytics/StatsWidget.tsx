import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '../ui/chart';
import { Bar, BarChart, Line, LineChart, XAxis, YAxis } from 'recharts';

// Types for analytics data
interface SalesData {
  date: string;
  sales: number;
  orders: number;
}

interface ProductPerformance {
  name: string;
  views: number;
  addToCart: number;
  purchases: number;
}

interface DashboardStats {
  totalSales: number;
  totalOrders: number;
  conversionRate: number;
  avgOrderValue: number;
}

const StatsWidget = () => {
  const [salesData, setSalesData] = useState<SalesData[]>([]);
  const [productData, setProductData] = useState<ProductPerformance[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalSales: 0,
    totalOrders: 0,
    conversionRate: 0,
    avgOrderValue: 0
  });
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');
  const [loading, setLoading] = useState(true);

  // Mock data loading - in production, this would fetch from an analytics API
  useEffect(() => {
    const loadMockData = () => {
      // Simulate API delay
      setTimeout(() => {
        // Generate mock sales data
        const data: SalesData[] = [];
        const now = new Date();
        
        for (let i = 0; i < (timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90); i++) {
          const date = new Date(now);
          date.setDate(date.getDate() - i);
          
          data.push({
            date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            sales: Math.floor(Math.random() * 5000) + 1000,
            orders: Math.floor(Math.random() * 50) + 10
          });
        }
        
        setSalesData(data.reverse());
        
        // Generate mock product performance data
        setProductData([
          { name: 'Headphones', views: 1250, addToCart: 180, purchases: 45 },
          { name: 'Laptop', views: 980, addToCart: 150, purchases: 32 },
          { name: 'Phone', views: 2100, addToCart: 320, purchases: 78 },
          { name: 'Tablet', views: 890, addToCart: 110, purchases: 24 },
          { name: 'Watch', views: 1560, addToCart: 210, purchases: 56 }
        ]);
        
        // Calculate overall stats
        const totalSales = data.reduce((sum, day) => sum + day.sales, 0);
        const totalOrders = data.reduce((sum, day) => sum + day.orders, 0);
        const conversionRate = 2.4; // Mock percentage
        const avgOrderValue = Math.round(totalSales / totalOrders);
        
        setStats({
          totalSales,
          totalOrders,
          conversionRate,
          avgOrderValue
        });
        
        setLoading(false);
      }, 800);
    };
    
    loadMockData();
  }, [timeRange]);

  if (loading) {
    return (
      <Card className="bg-surface border-border">
        <CardHeader>
          <CardTitle>Analytics Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="h-4 bg-muted rounded animate-pulse"></div>
            <div className="h-4 bg-muted rounded animate-pulse w-3/4"></div>
            <div className="h-64 bg-muted rounded animate-pulse mt-6"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-surface border-border">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Analytics Dashboard</CardTitle>
        <select 
          value={timeRange} 
          onChange={(e) => setTimeRange(e.target.value as '7d' | '30d' | '90d')}
          className="bg-background border border-border rounded px-3 py-1 text-sm"
        >
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
        </select>
      </CardHeader>
      <CardContent>
        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center p-3 bg-card rounded">
            <div className="text-2xl font-bold text-accent">${stats.totalSales.toLocaleString()}</div>
            <div className="text-sm text-text-dim">Total Sales</div>
          </div>
          <div className="text-center p-3 bg-card rounded">
            <div className="text-2xl font-bold">{stats.totalOrders.toLocaleString()}</div>
            <div className="text-sm text-text-dim">Total Orders</div>
          </div>
          <div className="text-center p-3 bg-card rounded">
            <div className="text-2xl font-bold">{stats.conversionRate}%</div>
            <div className="text-sm text-text-dim">Conversion Rate</div>
          </div>
          <div className="text-center p-3 bg-card rounded">
            <div className="text-2xl font-bold">${stats.avgOrderValue}</div>
            <div className="text-sm text-text-dim">Avg Order Value</div>
          </div>
        </div>

        {/* Sales Trend Chart */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">Sales Trend</h3>
          <ChartContainer 
            config={{
              sales: { label: "Sales", color: "hsl(var(--accent))" },
              orders: { label: "Orders", color: "hsl(var(--accent-alt))" }
            }}
            className="h-64"
          >
            <LineChart data={salesData}>
              <XAxis dataKey="date" />
              <YAxis yAxisId="left" orientation="left" />
              <YAxis yAxisId="right" orientation="right" />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line yAxisId="left" type="monotone" dataKey="sales" stroke="hsl(var(--accent))" name="Sales" />
              <Line yAxisId="right" type="monotone" dataKey="orders" stroke="hsl(var(--accent-alt))" name="Orders" />
            </LineChart>
          </ChartContainer>
        </div>

        {/* Product Performance */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Product Performance</h3>
          <ChartContainer 
            config={{
              views: { label: "Views", color: "hsl(var(--text-dim))" },
              addToCart: { label: "Add to Cart", color: "hsl(var(--accent-alt))" },
              purchases: { label: "Purchases", color: "hsl(var(--accent))" }
            }}
            className="h-64"
          >
            <BarChart data={productData}>
              <XAxis dataKey="name" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="views" fill="hsl(var(--text-dim))" name="Views" />
              <Bar dataKey="addToCart" fill="hsl(var(--accent-alt))" name="Add to Cart" />
              <Bar dataKey="purchases" fill="hsl(var(--accent))" name="Purchases" />
            </BarChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsWidget;