import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../lib/auth';

const BillingDashboard: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [currentPlan, setCurrentPlan] = useState<any>(null);
  const [usageStats, setUsageStats] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const loadBillingData = async () => {
      try {
        // Load current plan and usage stats
        const [planRes, usageRes] = await Promise.all([
          fetch('/api/billing/current-plan', {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            }
          }),
          fetch('/api/billing/usage-dashboard', {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            }
          })
        ]);

        const planData = await planRes.json();
        const usageData = await usageRes.json();

        setCurrentPlan(planData.data);
        setUsageStats(usageData.data.usageStats || {});
      } catch (error) {
        console.error('Error loading billing data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadBillingData();
  }, [isAuthenticated, navigate]);

  const handleUpdateSubscription = async (newPlan: string) => {
    try {
      const response = await fetch('/api/billing/update-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify({ planId: newPlan })
      });

      if (response.ok) {
        // Refresh data
        const planRes = await fetch('/api/billing/current-plan', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
          }
        });
        const planData = await planRes.json();
        setCurrentPlan(planData.data);
      }
    } catch (error) {
      console.error('Error updating subscription:', error);
    }
  };

  const handleCancelSubscription = async () => {
    if (window.confirm('Are you sure you want to cancel your subscription? You will lose access to premium features at the end of your billing period.')) {
      try {
        const response = await fetch('/api/billing/cancel-subscription', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
          }
        });

        if (response.ok) {
          // Refresh data
          const planRes = await fetch('/api/billing/current-plan', {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            }
          });
          const planData = await planRes.json();
          setCurrentPlan(planData.data);
        }
      } catch (error) {
        console.error('Error canceling subscription:', error);
      }
    }
  };

  const handleManagePayment = async () => {
    try {
      const response = await fetch('/api/billing/billing-portal', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });

      const data = await response.json();
      
      if (data.success) {
        // Redirect to Stripe billing portal
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Error creating billing portal session:', error);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/4"></div>
          <div className="h-4 bg-muted rounded w-1/2"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="h-32 bg-muted rounded"></div>
            <div className="h-32 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Billing & Subscription</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Current Plan Card */}
        <Card>
          <CardHeader>
            <CardTitle>Current Plan</CardTitle>
            <CardDescription>Your subscription details</CardDescription>
          </CardHeader>
          <CardContent>
            {currentPlan ? (
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold capitalize">{currentPlan.plan}</h3>
                  <p className="text-text-dim">
                    {currentPlan.status === 'active' ? 'Active' : 'Inactive'}
                    {currentPlan.current_period_end && (
                      <span>, renews on {new Date(currentPlan.current_period_end).toLocaleDateString()}</span>
                    )}
                  </p>
                </div>
                
                {currentPlan.plan !== 'free' && (
                  <div className="space-y-2">
                    <Button 
                      variant="outline" 
                      onClick={() => handleUpdateSubscription(currentPlan.plan === 'pro' ? 'enterprise' : 'pro')}
                      className="w-full"
                    >
                      {currentPlan.plan === 'pro' ? 'Upgrade to Enterprise' : 'Upgrade to Pro'}
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      onClick={handleCancelSubscription}
                      className="w-full text-error"
                    >
                      Cancel Subscription
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div>
                <p>You are on the Free plan.</p>
                <Button 
                  onClick={() => navigate('/pricing')}
                  className="mt-4 bg-accent hover:bg-orange-600"
                >
                  Upgrade to Pro
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Usage Stats Card */}
        <Card>
          <CardHeader>
            <CardTitle>Usage This Month</CardTitle>
            <CardDescription>Track your resource usage</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.keys(usageStats).length > 0 ? (
                Object.entries(usageStats).map(([type, count]) => (
                  <div key={type} className="flex justify-between">
                    <span className="capitalize">{type.replace('_', ' ')}</span>
                    <span className="font-semibold">{count}</span>
                  </div>
                ))
              ) : (
                <p className="text-text-dim">No usage data this month</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Payment Method Card */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Payment Method</CardTitle>
          <CardDescription>Update your billing information</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleManagePayment}>
            Manage Payment Method
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default BillingDashboard;
```

```typescript