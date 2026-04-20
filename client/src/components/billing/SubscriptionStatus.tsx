import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { useAuth } from '../../lib/auth';
import { useNavigate } from 'react-router-dom';

interface SubscriptionStatusProps {
  subscription: any;
  onManageSubscription: () => void;
  onCancelSubscription: () => void;
}

const SubscriptionStatus: React.FC<SubscriptionStatusProps> = ({ 
  subscription, 
  onManageSubscription,
  onCancelSubscription 
}) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  if (!subscription) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Current Plan</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-text_dim mb-4">You are currently on the Free plan.</p>
          <Button onClick={() => navigate('/pricing')}>
            Upgrade to Pro or Enterprise
          </Button>
        </CardContent>
      </Card>
    );
  }
  
  const isTrial = subscription.status === 'trialing';
  const isCanceled = subscription.status === 'canceled';
  
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle>Current Plan</CardTitle>
          <Button variant="outline" size="sm" onClick={onManageSubscription}>
            Manage Subscription
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold capitalize">{subscription.plan}</h3>
            {isTrial && (
              <p className="text-warning text-sm">
                Trial ends on {new Date(subscription.current_period_end).toLocaleDateString()}
              </p>
            )}
            {isCanceled && (
              <p className="text-warning text-sm">
                Subscription will end on {new Date(subscription.current_period_end).toLocaleDateString()}
              </p>
            )}
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-text_dim">Status</p>
              <p className={`capitalize ${isTrial ? 'text-warning' : isCanceled ? 'text-warning' : 'text-success'}`}>
                {subscription.status}
              </p>
            </div>
            <div>
              <p className="text-text_dim">Next Billing Date</p>
              <p>{new Date(subscription.current_period_end).toLocaleDateString()}</p>
            </div>
          </div>
          
          {!isCanceled && (
            <Button 
              variant="destructive" 
              size="sm" 
              onClick={onCancelSubscription}
            >
              Cancel Subscription
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SubscriptionStatus;
```

```typescript