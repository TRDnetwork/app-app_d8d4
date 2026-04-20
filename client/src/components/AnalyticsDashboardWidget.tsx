'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, FunnelChart, Funnel } from 'recharts';
import { ArrowUpIcon, ArrowDownIcon } from 'lucide-react';

// Mock data for development
const mockFunnelData = [
  { name: 'Visitors', value: 10000, fill: '#E2E8F0' },
  { name: 'Viewed Product', value: 6500, fill: '#94A3B8' },
  { name: 'Added to Cart', value: 3200, fill: '#475569' },
  { name: 'Checkout Started', value: 1800, fill: '#1E40AF' },
  { name: 'Purchases', value: 950, fill: '#1D4ED8' }
];

const mockRevenueData = [
  { name: 'Mon', revenue: 4000 },
  { name: 'Tue', revenue: 3000 },
  { name: 'Wed', revenue: 5000 },
  { name: 'Thu', revenue: 4500 },
  { name: 'Fri', revenue: 6000 },
  { name: 'Sat', revenue: 5500 },
  { name: 'Sun', revenue: 7000 },
];

export function AnalyticsDashboardWidget() {
  const [timeRange, setTimeRange] = useState('7d');
  const [conversionRate, setConversionRate] = useState(0);

  // Calculate conversion rate from funnel data
  useEffect(() => {
    if (mockFunnelData.length > 1) {
      const visitors = mockFunnelData[0].value;
      const purchases = mockFunnelData[mockFunnelData.length - 1].value;
      setConversionRate(Number(((purchases / visitors) * 100).toFixed(2)));
    }
  }, []);

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Conversion Funnel */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Conversion Funnel</CardTitle>
            <div className="text-sm text-gray-500">
              Conversion Rate: <span className="font-bold text-green-600">{conversionRate}%</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <FunnelChart>
                <Tooltip />
                <Funnel
                  dataKey="value"
                  data={mockFunnelData}
                  isAnimationActive={true}
                >
                  {mockFunnelData.map((item, index) => (
                    <Cell key={`cell-${index}`} fill={item.fill} />
                  ))}
                </Funnel>
              </FunnelChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 grid grid-cols-5 text-center text-sm text-gray-600">
            {mockFunnelData.map((stage, index) => (
              <div key={stage.name}>
                <div className="font-medium">{stage.value.toLocaleString()}</div>
                <div>{stage.name}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Revenue Overview */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle>Revenue Overview</CardTitle>
          <div className="flex space-x-1">
            {(['7d', '30d', '90d'] as const).map((range) => (
              <Button
                key={range}
                variant={timeRange === range ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTimeRange(range)}
                className="text-xs"
              >
                {range}
              </Button>
            ))}
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">$25,500</div>
          <p className="text-xs text-gray-500 flex items-center">
            <ArrowUpIcon className="h-3 w-3 text-green-500 mr-1" />
            12.5% from last period
          </p>
          <div className="h-32 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockRevenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="revenue" fill="#1D4ED8" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Helper component for funnel chart
const Cell = ({ fill }: { fill: string }) => <rect fill={fill} />;