'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';

export default function CustomerPortal() {
  const [subscription, setSubscription] = useState<any>(null);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch subscription
        const subResponse = await fetch('/api/billing/subscription');
        if (subResponse.ok) {
          const subData = await subResponse.json();
          setSubscription(subData.subscription);
        }

        // Fetch invoices
        const invResponse = await fetch('/api/billing/invoices');
        if (invResponse.ok) {
          const invData = await invResponse.json();
          setInvoices(invData.invoices);
        }
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to load billing information',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  const handleManageBilling = async () => {
    try {
      // In a real application, this would call your API to get the customer portal URL
      const response = await fetch('/api/billing/customer-portal?returnUrl=' + encodeURIComponent(window.location.href));
      
      if (response.ok) {
        const data = await response.json();
        // Redirect to Stripe Customer Portal
        window.location.href = data.url;
      } else {
        throw new Error('Failed to get customer portal URL');
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to access billing management',
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-pulse space-y-4 w-full max-w-2xl">
          <div className="h-8 bg-surface rounded"></div>
          <div className="space-y-2">
            <div className="h-4 bg-surface rounded"></div>
            <div className="h-4 bg-surface rounded w-3/4"></div>
          </div>
          <div className="h-32 bg-surface rounded"></div>
          <div className="h-8 bg-surface rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Billing & Subscription</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Current Plan</CardTitle>
            <CardDescription>Your subscription details</CardDescription>
          </CardHeader>
          <CardContent>
            {subscription ? (
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium">Plan</p>
                  <p className="text-lg">{subscription.plan}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Status</p>
                  <p className={`text-lg ${subscription.status === 'active' ? 'text-success' : 'text-warning'}`}>
                    {subscription.status}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Next Billing Date</p>
                  <p className="text-lg">
                    {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ) : (
              <p>You don't have an active subscription.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Manage Billing</CardTitle>
            <CardDescription>Update payment method, view invoices</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleManageBilling} className="w-full">
              Manage Billing
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Invoice History</CardTitle>
          <CardDescription>Download and view your past invoices</CardDescription>
        </CardHeader>
        <CardContent>
          {invoices.length > 0 ? (
            <div className="space-y-4">
              {invoices.map((invoice) => (
                <div key={invoice._id} className="flex items-center justify-between p-4 border rounded">
                  <div>
                    <p className="font-medium">Invoice #{invoice.stripeInvoiceId.slice(-8)}</p>
                    <p className="text-sm text-text_dim">
                      {new Date(invoice.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="font-bold">${invoice.amount}</span>
                    <Button variant="outline" size="sm" asChild>
                      <a href={invoice.pdfUrl} target="_blank" rel="noopener noreferrer">
                        Download
                      </a>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>No invoices found.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
```

```typescript