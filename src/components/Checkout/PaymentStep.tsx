import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';

interface PaymentStepProps {
  onBack: () => void;
  onContinue: () => void;
  amount: number;
}

const PaymentStep: React.FC<PaymentStepProps> = ({ onBack, onContinue, amount }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      setError('Stripe has not loaded yet.');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount }),
      });

      const session = await response.json();

      if (response.ok) {
        const result = await stripe.redirectToCheckout({
          sessionId: session.id,
        });

        if (result.error) {
          setError(result.error.message || 'An error occurred');
        }
      } else {
        setError(session.error || 'Failed to create checkout session');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Payment Method</h2>
      <Card>
        <CardHeader>
          <CardTitle>Card Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Name on Card</Label>
                <Input id="name" placeholder="John Doe" required />
              </div>
              <div>
                <Label htmlFor="card">Card Details</Label>
                <CardElement
                  options={{
                    style: {
                      base: {
                        fontSize: '16px',
                        color: '#4b5563',
                        '::placeholder': {
                          color: '#9ca3af',
                        },
                      },
                      invalid: {
                        color: '#ef4444',
                      },
                    },
                  }}
                  className="p-3 border border-border rounded-md"
                />
              </div>
              {error && <div className="text-red-500 text-sm">{error}</div>}
              <div className="flex justify-between pt-4">
                <Button variant="outline" type="button" onClick={onBack}>
                  Back
                </Button>
                <Button type="submit" disabled={!stripe || isProcessing}>
                  {isProcessing ? 'Processing...' : `Pay $${amount.toFixed(2)}`}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentStep;