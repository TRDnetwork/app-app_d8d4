import React, { useState } from 'react';
import { Button } from '../ui/button';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';
import { useCheckoutStore } from '../../stores/checkoutStore';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

// Lazy load Stripe to reduce initial bundle size
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

      if (stripe