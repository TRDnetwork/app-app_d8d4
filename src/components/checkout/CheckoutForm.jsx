import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Button } from '../ui/button';
import { useToast } from '../ui/use-toast';
import { checkoutStore } from '../../stores/checkoutStore';
import { cartStore } from '../../stores/cartStore';
import { fetchWithAuth } from '../../lib/api';
import { useNavigate } from 'react-router-dom';

// Initialize Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { address, deliverySpeed, paymentMethod } = checkoutStore();
  const { getSubtotal, couponCode, discount } = cartStore();

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    if (!address || !deliverySpeed || !paymentMethod) {
      toast({
        title: 'Missing Information',
        description: 'Please complete all steps before placing your order.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      // Create checkout session
      const response = await fetchWithAuth('/api/stripe/create-checkout-session', {
        method: 'POST',
        body: JSON.stringify({
          address,
          deliverySpeed,
          couponCode,
        }),
      });

      const { sessionId } = response;

      // Redirect to Stripe Checkout
      const { error } = await stripe.redirectToCheckout({
        sessionId,
      });

      if (error) {
        throw error;
      }
    } catch (err) {
      console.error('Checkout error:', err);
      toast({
        title: 'Payment Failed',
        description: err.message || 'An error occurred during checkout. Please try again.',
        variant: 'destructive',
      });
      setErrors({ form: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-surface p-6 rounded-lg border border-border">
        <h3 className="text-lg font-semibold mb-4">Payment Details</h3>
        <div className="p-4 bg-muted rounded-lg mb-4">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#F8FAFC',
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
        {errors.card && <p className="text-error text-sm">{errors.card}</p>}
      </div>

      <div className="flex justify-between items-center pt-4 border-t border-border">
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate('/cart')}
          disabled={loading}
        >
          Back to Cart
        </Button>
        <Button type="submit" disabled={!stripe || loading}>
          {loading ? 'Processing...' : 'Place Order'}
        </Button>
      </div>
    </form>
  );
};

const CheckoutFormWrapper = () => {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  );
};

export default CheckoutFormWrapper;