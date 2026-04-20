import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Button } from '../ui/button';
import { useNavigate } from 'react-router-dom';
import { checkoutStore } from '../../stores/checkoutStore';
import { cartStore } from '../../stores/cartStore';
import { fetchWithAuth } from '../../lib/api';

// Initialize Stripe with publishable key from environment
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const StripePaymentForm = () => {
  const navigate = useNavigate();
  const { address, deliverySpeed } = checkoutStore();
  const { items, couponCode } = cartStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePayment = async () => {
    if (!address || !deliverySpeed || items.length === 0) {
      setError('Please complete all previous steps');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Create checkout session via backend
      const response = await fetchWithAuth('/api/stripe/create-checkout-session', {
        method: 'POST',
        body: JSON.stringify({
          items: items.map(item => ({
            product_id: item.product_id,
            quantity: item.quantity,
            price: item.price_snapshot
          })),
          address,
          deliverySpeed,
          couponCode
        })
      });

      const { sessionId } = response;

      // Redirect to Stripe Checkout
      const stripe = await stripePromise;
      const { error } = await stripe.redirectToCheckout({
        sessionId
      });

      if (error) {
        setError(error.message);
      }
    } catch (err) {
      setError(err.message || 'Failed to initialize payment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Credit/Debit Card</h3>
        <p className="text-text-dim text-sm mb-4">
          Secure payment powered by Stripe. Your card details are never stored.
        </p>
        <div className="bg-muted p-4 rounded-lg border border-border">
          <div className="flex items-center gap-3 text-sm">
            <span className="text-text-dim">Accepted cards:</span>
            <div className="flex gap-2">
              <span className="font-mono">Visa</span>
              <span className="font-mono">Mastercard</span>
              <span className="font-mono">Amex</span>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="text-sm text-destructive bg-destructive/10 p-3 rounded border border-destructive/20">
          {error}
        </div>
      )}

      <Button
        onClick={handlePayment}
        disabled={loading}
        className="w-full"
      >
        {loading ? 'Processing...' : 'Pay Now'}
      </Button>

      <p className="text-xs text-text-dim text-center">
        By continuing, you agree to our Terms of Service and Privacy Policy.
      </p>
    </div>
  );
};

export default StripePaymentForm;