import React from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../lib/auth';

const PricingPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const plans = [
    {
      id: 'free',
      name: 'Free',
      price: 0,
      period: 'month',
      features: [
        'Basic workout tracking',
        '1 workout plan',
        '5 workout logs per month',
        'Email support'
      ],
      cta: 'Get Started'
    },
    {
      id: 'pro',
      name: 'Pro',
      price: 9.99,
      period: 'month',
      features: [
        'All Free features',
        'Unlimited workout plans',
        'Unlimited workout logs',
        'Advanced analytics',
        'Priority email support',
        'Mobile app access'
      ],
      cta: 'Start Free Trial'
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 29.99,
      period: 'month',
      features: [
        'All Pro features',
        'Team collaboration',
        'Custom workout templates',
        'API access',
        'Dedicated account manager',
        '24/7 phone support'
      ],
      cta: 'Contact Sales'
    }
  ];

  const handlePlanSelect = async (planId: string) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      // In a real app, this would call the API to create a checkout session
      const response = await fetch('/api/billing/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ planId }),
      });

      const data = await response.json();
      
      if (data.success) {
        // Redirect to Stripe Checkout
        window.location.href = `https://checkout.stripe.com/c/pay/${data.sessionId}`;
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-4">Simple, Transparent Pricing</h1>
      <p className="text-xl text-center text-text-dim mb-12">Choose the plan that's right for you</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {plans.map((plan) => (
          <Card 
            key={plan.id} 
            className={plan.id === 'pro' ? 'border-accent shadow-lg' : ''}
          >
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">{plan.name}</CardTitle>
              <div className="mt-4">
                <span className="text-4xl font-bold">${plan.price}</span>
                <span className="text-text-dim">/{plan.period}</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <svg className="h-5 w-5 text-accent mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button 
                onClick={() => handlePlanSelect(plan.id)}
                className={plan.id === 'pro' ? 'bg-accent hover:bg-orange-600' : ''}
              >
                {plan.cta}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      <div className="mt-12 text-center">
        <p className="text-text-dim">
          All plans include a 7-day free trial. Cancel anytime.
        </p>
      </div>
    </div>
  );
};

export default PricingPage;
```

```typescript