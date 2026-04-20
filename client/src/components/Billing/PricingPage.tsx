'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check } from 'lucide-react';

const plans = [
  {
    name: 'Free',
    price: 0,
    description: 'Perfect for trying out our platform',
    features: [
      '10 API calls per day',
      '50MB storage',
      'Basic support',
      'Community access',
    ],
    popular: false,
  },
  {
    name: 'Pro',
    price: 29,
    description: 'For professionals and growing businesses',
    features: [
      '10,000 API calls per day',
      '10GB storage',
      'Priority support',
      'Advanced analytics',
      'Custom domains',
      'Team collaboration',
    ],
    popular: true,
  },
  {
    name: 'Enterprise',
    price: 99,
    description: 'For large organizations with high demands',
    features: [
      'Unlimited API calls',
      '100GB storage',
      '24/7 dedicated support',
      'Custom integrations',
      'SLA guarantee',
      'Advanced security',
      'Custom reporting',
      'Dedicated account manager',
    ],
    popular: false,
  },
];

export default function PricingPage() {
  const [loading, setLoading] = useState<string | null>(null);

  const handleSubscribe = async (plan: string) => {
    setLoading(plan);
    
    try {
      // In a real application, this would call your API to create a checkout session
      const response = await fetch('/api/billing/checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          plan,
          successUrl: `${window.location.origin}/dashboard`,
          cancelUrl: `${window.location.origin}/pricing`,
        }),
      });
      
      const data = await response.json();
      
      if (data.id) {
        // Redirect to Stripe Checkout
        window.location.href = `/api/checkout-session/${data.id}`;
      } else {
        throw new Error(data.error || 'Failed to create checkout session');
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      // Handle error (show toast, etc.)
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4">Simple, transparent pricing</h1>
        <p className="text-xl text-text_dim max-w-3xl mx-auto">
          Choose the plan that's right for you. All plans include a 14-day free trial.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {plans.map((plan) => (
          <Card 
            key={plan.name} 
            className={`flex flex-col ${plan.popular ? 'border-accent shadow-lg' : ''}`}
          >
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-accent text-white text-xs font-bold px-3 py-1 rounded-full">
                  Most Popular
                </span>
              </div>
            )}
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl">{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="mb-6">
                <span className="text-4xl font-bold">${plan.price}</span>
                <span className="text-text_dim">/month</span>
                {plan.price === 0 && <span className="text-text_dim ml-2">forever</span>}
              </div>
              <ul className="space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center">
                    <Check className="h-5 w-5 text-accent mr-2 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                onClick={() => handleSubscribe(plan.name.toLowerCase())}
                disabled={loading === plan.name.toLowerCase()}
              >
                {loading === plan.name.toLowerCase() ? 'Processing...' : plan.price === 0 ? 'Get Started' : 'Start Free Trial'}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="text-center mt-16">
        <p className="text-text_dim">
          Need a custom plan?{' '}
          <a href="/contact" className="text-accent hover:underline">
            Contact sales
          </a>
        </p>
      </div>
    </div>
  );
}
```

```typescript