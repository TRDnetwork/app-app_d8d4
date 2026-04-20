import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '../ui/chart';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';

// Mock data for the dashboard - in a real app, this would come from an API
const mockData = [
  { date: '2023-10-01', sessions: 400, orders: 80 },
  { date: '2023-10-02', sessions: 300, orders: 60 },
  { date: '2023-10-03', sessions: 500, orders: 100 },
  { date: '2023-10-04', sessions: 200, orders: 40 },
  { date: '2023-10-05', sessions: 600, orders: 120 },
  { date: '2023-10-06', sessions: 450, orders: 90 },
  { date: '2023-10-07', sessions: 550, orders: 110 },
];

const chartConfig = {
  sessions: {
    label: 'Sessions',
    color: '#1E40AF',
  },
  orders: {
    label: 'Orders',
    color: '#10B981',
  },
} as const;

export function AnalyticsDashboardWidget() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={mockData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(5)}
            />
            <YAxis />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            <Bar dataKey="sessions" fill="var(--color-sessions)" radius={4} />
            <Bar dataKey="orders" fill="var(--color-orders)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}