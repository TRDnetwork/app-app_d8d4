import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface AnalyticsData {
  pageViews: number;
  addToCart: number;
  purchases: number;
  conversionRate: number;
}

const AnalyticsWidget: React.FC = () => {
  const [data, setData] = useState<AnalyticsData>({
    pageViews: 0,
    addToCart: 0,
    purchases: 0,
    conversionRate: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, fetch from PostHog or internal analytics API
    const mockData = {
      pageViews: 12540,
      addToCart: 892,
      purchases: 147,
      conversionRate: 16.5
    };
    
    setTimeout(() => {
      setData(mockData);
      setLoading(false);
    }, 800);
  }, []);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Analytics Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="h-4 bg-surface rounded animate-pulse"></div>
            <div className="h-4 bg-surface rounded animate-pulse"></div>
            <div className="h-4 bg-surface rounded animate-pulse"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Store Analytics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-text-dim">Page Views</p>
            <p className="text-2xl font-bold">{data.pageViews.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-sm text-text-dim">Add to Cart</p>
            <p className="text-2xl font-bold">{data.addToCart}</p>
          </div>
          <div>
            <p className="text-sm text-text-dim">Purchases</p>
            <p className="text-2xl font-bold">{data.purchases}</p>
          </div>
          <div>
            <p className="text-sm text-text-dim">Conversion Rate</p>
            <p className="text-2xl font-bold">{data.conversionRate}%</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AnalyticsWidget;