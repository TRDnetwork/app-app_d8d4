'use client';

import { loadStripe } from '@stripe/stripe-js';
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from '@stripe/react-stripe-js';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

// Initialize Stripe with publishable key
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);

export default function PaymentForm({ clientSecret, onBack, onPaymentSuccess }) {
  const [isLoading, setIsLoading] = useState(false);

  const fetchClientSecret = () => {
    return clientSecret;
  };

  const handlePaymentSuccess = () => {
    setIsLoading(true);
    // Simulate API call to confirm payment
    setTimeout(() => {
      onPaymentSuccess();
    }, 1500);
  };

  const options = { fetchClientSecret };

  return (
    <div>
      <div className="mb-6">
        <Button variant="ghost" onClick={onBack} className="p-0 h-auto">
          ← Back to Delivery Options
        </Button>
      </div>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Payment</h2>
        <EmbeddedCheckoutProvider stripe={stripePromise} options={options}>
          <EmbeddedCheckout />
        </EmbeddedCheckoutProvider>
      </div>
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-500">
          Secure payment powered by{' '}
          <span className="font-medium text-orange-600">Stripe</span>
        </p>
      </div>
    </div>
  );
}