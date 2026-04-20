import React from 'react';
import { Button } from '../ui/button';
import { useAuth } from '../../lib/auth';
import { useNavigate } from 'react-router-dom';

interface PricingTableProps {
  onPlanSelect: (plan: string) => void;
}

const PricingTable: React.FC<PricingTableProps> = ({ onPlanSelect }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const plans = [
    {
      name: 'Free',
      price: 0,
      period: 'month',
      description: 'Perfect for getting started',
      features: [
        'Basic features',
        'Limited usage',
        'Community support',
        '1 user'
      ],
      cta: 'Current Plan',
      disabled: true
    },
    {
      name: 'Pro',
      price: 29,
      period: 'month',
      description: 'For growing teams',
      features: [
        'Advanced features',
        'Higher usage limits',
        'Priority support',
        '5 users',
        'API access'
      ],
      cta: 'Upgrade to Pro',
      popular: true
    },
    {
      name: 'Enterprise',
      price: 99,
      period: 'month',
      description: 'For large organizations',
      features: [
        'All Pro features',
        'Unlimited usage',
        'Dedicated support',
        'Unlimited users',
        'Custom integrations',
        'SLA guarantee'
      ],
      cta: 'Contact Sales'
    }
  ];

  const handlePlanSelect = (plan: string) => {
    if (plan === 'Enterprise') {
      // Open contact form or redirect to sales page
      window.open('mailto:sales@trdnetwork.com', '_blank');
      return;
    }
    
    onPlanSelect(plan);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {plans.map((plan) => (
        <div
          key={plan.name}
          className={`relative rounded-lg border p-6 ${
            plan.popular ? 'border-primary shadow-lg scale-105' : 'border-border'
          }`}
        >
          {plan.popular && (
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <span className="bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">
                Most Popular
              </span>
            </div>
          )}
          
          <div className="text-center">
            <h3 className="text-xl font-bold">{plan.name}</h3>
            <p className="text-text_dim mt-1">{plan.description}</p>
            
            <div className="mt-4">
              <span className="text-3xl font-bold">${plan.price}</span>
              <span className="text-text_dim">/{plan.period}</span>
            </div>
          </div>
          
          <ul className="mt-6 space-y-3">
            {plan.features.map((feature, index) => (
              <li key={index} className="flex items-center">
                <svg className="h-5 w-5 text-success mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                {feature}
              </li>
            ))}
          </ul>
          
          <div className="mt-8">
            <Button
              onClick={() => handlePlanSelect(plan.name)}
              disabled={plan.disabled}
              variant={plan.popular ? 'primary' : 'outline'}
              className="w-full"
            >
              {plan.cta}
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PricingTable;
```

```typescript