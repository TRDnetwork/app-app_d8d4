import React, { useState } from 'react';
import { Button } from '../ui/button';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';
import { useCheckoutStore } from '../../stores/checkoutStore';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

// Load Stripe with publishable key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const PaymentForm = ({ onBack, onPaymentSuccess }: { onBack: () => void; onPaymentSuccess: () => void }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { paymentMethod, setPaymentMethod } = useCheckoutStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setError(null);

    try {
      // In a real app, you'd create a payment intent on your backend
      // and confirm the payment here. This is a simplified example.
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
        'temporary_client_secret', // This would come from your backend
        {
          payment_method: {
            card: elements.getElement(CardElement)!,
            billing_details: {
              name: 'Jenny Rosen',
            },
          },
        }
      );

      if (stripeError) {
        setError(stripeError.message || 'Payment failed');
      } else if (paymentIntent.status === 'succeeded') {
        onPaymentSuccess();
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-2xl font-bold">Payment Method</h2>
      <RadioGroup
        defaultValue={paymentMethod}
        onValueChange={(value) => setPaymentMethod(value as any)}
        className="space-y-4"
      >
        <div
          className={`p-4 border rounded-lg cursor-pointer ${
            paymentMethod === 'stripe' ? 'border-primary' : 'border-border'
          }`}
          onClick={() => setPaymentMethod('stripe')}
        >
          <div className="flex items-center space-x-3">
            <RadioGroupItem value="stripe" id="stripe" />
            <Label htmlFor="stripe" className="font-medium">Credit/Debit Card</Label>
          </div>
          {paymentMethod === 'stripe' && (
            <div className="mt-4 space-y-4">
              <div className="p-4 bg-surface rounded border border-border">
                <CardElement
                  options={{
                    style: {
                      base: {
                        fontSize: '16px',
                        color: '#ffffff',
                        '::placeholder': {
                          color: '#94A3B8',
                        },
                      },
                      invalid: {
                        color: '#EF4444',
                      },
                    },
                  }}
                />
              </div>
              <p className="text-sm text-text_dim">
                Your card details are encrypted and secure. We never store your full card number.
              </p>
            </div>
          )}
        </div>

        <div
          className={`p-4 border rounded-lg cursor-pointer ${
            paymentMethod === 'upi' ? 'border-primary' : 'border-border'
          }`}
          onClick={() => setPaymentMethod('upi')}
        >
          <div className="flex items-center space-x-3">
            <RadioGroupItem value="upi" id="upi" />
            <Label htmlFor="upi" className="font-medium">UPI</Label>
          </div>
          {paymentMethod === 'upi' && (
            <div className="mt-4 space-y-2">
              <Input placeholder="your-vpa@upi" />
              <p className="text-sm text-text_dim">
                Pay via UPI apps like Google Pay, PhonePe, or Paytm.
              </p>
            </div>
          )}
        </div>

        <div
          className={`p-4 border rounded-lg cursor-pointer ${
            paymentMethod === 'cod' ? 'border-primary' : 'border-border'
          }`}
          onClick={() => setPaymentMethod('cod')}
        >
          <div className="flex items-center space-x-3">
            <RadioGroupItem value="cod" id="cod" />
            <Label htmlFor="cod" className="font-medium">Cash on Delivery</Label>
          </div>
          {paymentMethod === 'cod' && (
            <p className="mt-4 text-sm text-text_dim">
              Pay in cash when your order is delivered.
            </p>
          )}
        </div>
      </RadioGroup>

      {error && (
        <div className="p-3 bg-destructive/10 border border-destructive text-destructive rounded text-sm">
          {error}
        </div>
      )}

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack} type="button">
          Back to Delivery
        </Button>
        <Button type="submit" disabled={!stripe || loading}>
          {loading ? 'Processing...' : 'Review Order'}
        </Button>
      </div>
    </form>
  );
};

const PaymentStep = ({ onBack, onNext }: { onBack: () => void; onNext: () => void }) => {
  return (
    <Elements stripe={stripePromise}>
      <PaymentForm onBack={onBack} onPaymentSuccess={onNext} />
    </Elements>
  );
};

export default PaymentStep;