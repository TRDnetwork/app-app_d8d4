import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { useAuth } from '../lib/auth';
import { useNavigate } from 'react-router-dom';
import PricingTable from '../components/billing/PricingTable';
import SubscriptionStatus from '../components/billing/SubscriptionStatus';
import UsageDashboard from '../components/billing/UsageDashboard';
import InvoiceHistory from '../components/billing/InvoiceHistory';

const Billing: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [subscription, setSubscription] = useState<any>(null);
  const [usageStats, setUsageStats] = useState<any>({
    api_calls: { total: 0, daily: [] },
    storage: { total: 0, daily: [] },
    seats: { total: 0, daily: [] }
  });
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch subscription, usage stats, and invoices
    const fetchData = async () => {
      try {
        // In a real app, you would fetch this data from your API
        // For now, we'll use mock data
        setSubscription({
          plan: 'pro',
          status: 'active',
          current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        });

        setUsageStats({
          api_calls: {
            total: 45000,
            daily: [
              { date: '2024-01-01', count: 1200 },
              { date: '2024-01-02', count: 1500 },
              { date: '2024-01-03', count: 1800 },
              { date: '2024-01-04', count: 2100 },
              { date: '2024-01-05', count: 2400 },
              { date: '2024-01-06', count: 2700 },
              { date: '2024-01-07', count: 3000 }
            ]
          },
          storage: {
            total: 2048000000, // 2GB in bytes
            daily: [
              { date: '2024-01-01', count: 200000000 },
              { date: '2024-01-02', count: 220000000 },
              { date: '2024-01-03', count: 240000000 },
              { date: '2024-01-04', count: 260000000 },
              { date: '2024-01-05', count: 280000000 },
              { date: '2024-01-06', count: 300000000 },
              { date: '2024-01-07', count: 320000000 }
            ]
          },
          seats: {
            total: 5,
            daily: [
              { date: '2024-01-01', count: 3 },
              { date: '2024-01-02', count: 4 },
              { date: '2024-01-03', count: 5 },
              { date: '2024-01-04', count: 5 },
              { date: '2024-01-05', count: 5 },
              { date: '2024-01-06', count: 5 },
              { date: '2024-01-07', count: 5 }
            ]
          }
        });

        setInvoices([
          {
            id: 'inv_123',
            amount: 29.99,
            status: 'paid',
            date: 'Jan 1, 2024',
            pdf_url: '#'
          },
          {
            id: 'inv_124',
            amount: 29.99,
            status: 'paid',
            date: 'Dec 1, 2023',
            pdf_url: '#'
          },
          {
            id: 'inv_125',
            amount: 29.99,
            status: 'paid',
            date: 'Nov 1, 2023',
            pdf_url: '#'
          }
        ]);
      } catch (error) {
        console.error('Error fetching billing data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handlePlanSelect = (plan: string) => {
    // In a real app, you would create a checkout session
    // For now, we'll just navigate to a mock checkout
    navigate('/checkout');
  };

  const handleManageSubscription = async () => {
    // In a real app, you would redirect to the customer portal
    // For now, we'll just show an alert
    alert('Redirecting to customer portal...');
  };

  const handleCancelSubscription = async () => {
    if (window.confirm('Are you sure you want to cancel your subscription? It will remain active until the end of the billing period.')) {
      // In a real app, you would call your API to cancel the subscription
      // For now, we'll just update the local state
      setSubscription({
        ...subscription,
        status: 'canceled'
      });
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-surface rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-64 bg-surface rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Billing & Subscription</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <SubscriptionStatus
            subscription={subscription}
            onManageSubscription={handleManageSubscription}
            onCancelSubscription={handleCancelSubscription}
          />
          
          <UsageDashboard usageStats={usageStats} />
          
          <InvoiceHistory invoices={invoices} />
        </div>
        
        <div>
          <PricingTable onPlanSelect={handlePlanSelect} />
        </div>
      </div>
    </div>
  );
};

export default Billing;
```

```typescript