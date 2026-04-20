import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '../ui/chart';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';

interface UsageDashboardProps {
  usageStats: {
    api_calls: { total: number, daily: Array<{ date: string, count: number }> };
    storage: { total: number, daily: Array<{ date: string, count: number }> };
    seats: { total: number, daily: Array<{ date: string, count: number }> };
  };
}

const UsageDashboard: React.FC<UsageDashboardProps> = ({ usageStats }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* API Calls */}
      <Card>
        <CardHeader>
          <CardTitle>API Calls</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold mb-2">{usageStats.api_calls.total.toLocaleString()}</div>
          <p className="text-text_dim text-sm mb-4">API calls this month</p>
          
          <ChartContainer config={{
            count: {
              label: "API Calls",
              color: "#1E40AF",
            },
          }}>
            <BarChart accessibilityLayer data={usageStats.api_calls.daily}>
              <CartesianGrid vertical={false} />
              <XAxis 
                dataKey="date" 
                tickLine={false} 
                tickMargin={8} 
                axisLine={false}
                tickFormatter={(value) => value.slice(5)} // Show only MM-DD
              />
              <YAxis hide />
              <ChartTooltip 
                cursor={false} 
                content={<ChartTooltipContent hideLabel />}
              />
              <Bar dataKey="count" fill="var(--color-count)" radius={4} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
      
      {/* Storage */}
      <Card>
        <CardHeader>
          <CardTitle>Storage</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold mb-2">{(usageStats.storage.total / 1024 / 1024).toFixed(2)} GB</div>
          <p className="text-text_dim text-sm mb-4">Storage used this month</p>
          
          <ChartContainer config={{
            count: {
              label: "Storage (MB)",
              color: "#1E40AF",
            },
          }}>
            <BarChart accessibilityLayer data={usageStats.storage.daily}>
              <CartesianGrid vertical={false} />
              <XAxis 
                dataKey="date" 
                tickLine={false} 
                tickMargin={8} 
                axisLine={false}
                tickFormatter={(value) => value.slice(5)}
              />
              <YAxis hide />
              <ChartTooltip 
                cursor={false} 
                content={<ChartTooltipContent hideLabel />}
              />
              <Bar dataKey="count" fill="var(--color-count)" radius={4} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
      
      {/* Seats */}
      <Card>
        <CardHeader>
          <CardTitle>Team Seats</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold mb-2">{usageStats.seats.total}</div>
          <p className="text-text_dim text-sm mb-4">Team members this month</p>
          
          <ChartContainer config={{
            count: {
              label: "Seats",
              color: "#1E40AF",
            },
          }}>
            <BarChart accessibilityLayer data={usageStats.seats.daily}>
              <CartesianGrid vertical={false} />
              <XAxis 
                dataKey="date" 
                tickLine={false} 
                tickMargin={8} 
                axisLine={false}
                tickFormatter={(value) => value.slice(5)}
              />
              <YAxis hide />
              <ChartTooltip 
                cursor={false} 
                content={<ChartTooltipContent hideLabel />}
              />
              <Bar dataKey="count" fill="var(--color-count)" radius={4} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default UsageDashboard;
```

```typescript