'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';

export default function PaymentMethod({ onNext, onBack }) {
  const stripe = useStripe();
  const elements = useElements();
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardComplete, setCardComplete] = useState(false);
  const [loading, setLoading] = useState(false);

  const cardOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#9e2146',
      },
    },
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);

    try {
      // In a real app, you'd create a PaymentIntent on your backend first
      // Then confirm the card payment
      const { error, paymentIntent } = await stripe.confirmCardPayment(
        'pi_test_payment_intent_client_secret', // This would come from your backend
        {
          payment_method: {
            card: elements.getElement(CardElement),
            billing_details: {
              name: 'Jenny Rosen',
            },
          },
        }
      );

      if (error) {
        console.error('Payment error:', error);
        // Show error to customer
      } else if (paymentIntent.status === 'succeeded') {
        console.log('Payment succeeded:', paymentIntent);
        // Payment was successful, proceed to order review
        onNext();
      }
    } catch (error) {
      console.error('Payment error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-lg font-medium">Payment Method</h2>
      
      <div className="space-y-4">
        <label className="flex cursor-pointer items-center space-x-3 rounded-lg border p-4">
          <input
            type="radio"
            name="paymentMethod"
            value="card"
            checked={paymentMethod === 'card'}
            onChange={() => setPaymentMethod('card')}
            className="h-4 w-4 text-accent focus:ring-accent"
          />
          <span className="font-medium">Credit/Debit Card</span>
        </label>
        
        {paymentMethod === 'card' && (
          <div className="rounded-lg border p-4">
            <CardElement
              options={cardOptions}
              onChange={(e) => setCardComplete(e.complete)}
            />
          </div>
        )}

        <label className="flex cursor-pointer items-center space-x-3 rounded-lg border p-4">
          <input
            type="radio"
            name="paymentMethod"
            value="paypal"
            checked={paymentMethod === 'paypal'}
            onChange={() => setPaymentMethod('paypal')}
            className="h-4 w-4 text-accent focus:ring-accent"
          />
          <span className="font-medium">PayPal</span>
        </label>

        <label className="flex cursor-pointer items-center space-x-3 rounded-lg border p-4">
          <input
            type="radio"
            name="paymentMethod"
            value="cod"
            checked={paymentMethod === 'cod'}
            onChange={() => setPaymentMethod('cod')}
            className="h-4 w-4 text-accent focus:ring-accent"
          />
          <span className="font-medium">Cash on Delivery</span>
        </label>
      </div>

      <div className="flex justify-between pt-6">
        <Button variant="outline" onClick={onBack}>
          Back to Delivery
        </Button>
        <Button type="submit" disabled={!stripe || loading}>
          {loading ? 'Processing...' : 'Continue to Review'}
        </Button>
      </div>
    </form>
  );
}