import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Button } from '../ui/button';
import { useCheckoutStore } from '../../stores/checkoutStore';
import { useCartStore } from '../../stores/cartStore';
import { api } from '../../lib/api';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

// Initialize Stripe with publishable key from environment
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const { address, deliverySpeed } = useCheckoutStore();
  const { items, getTotal, clearCart } = useCartStore();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      toast.error('Payment system not loaded');
      return;
    }

    if (!address) {
      toast.error('Please select a delivery address');
      return;
    }

    setLoading(true);

    try {
      // Create order on backend first (pre-payment)
      const orderData = {
        items: items.map(item => ({
          product_id: item.productId,
          quantity: item.quantity,
          price: item.price,
        })),
        address,
        delivery_speed: deliverySpeed,
        subtotal: getTotal(),
        payment_method: 'stripe',
      };

      const orderResponse = await api('/orders', {
        method: 'POST',
        body: JSON.stringify(orderData),
      });

      const orderId = orderResponse._id;

      // Create Stripe Checkout Session
      const sessionResponse = await api('/stripe/create-checkout-session', {
        method: 'POST',
        body: JSON.stringify({
          orderId,
          customerEmail: useCheckoutStore.getState().user?.email,
          amount: Math.round(getTotal() * 100), // in cents
          currency: 'usd',
        }),
      });

      const { sessionId } = sessionResponse;

      // Redirect to Stripe Checkout
      const { error } = await stripe.redirectToCheckout({
        sessionId,
      });

      if (error) {
        toast.error(error.message);
      }
    } catch (error) {
      toast.error(error.message || 'Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="border rounded-lg p-4">
        <CardElement
          options={{
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
          }}
        />
      </div>
      <Button type="submit" disabled={!stripe || loading} className="w-full">
        {loading ? 'Processing...' : `Pay $${getTotal().toFixed(2)}`}
      </Button>
    </form>
  );
};

export const StripePaymentForm = () => {
  return (
    <div className="bg-surface border border-border rounded-lg p-6">
      <h3 className="text-xl font-semibold mb-4">Credit/Debit Card</h3>
      <Elements stripe={stripePromise}>
        <CheckoutForm />
      </Elements>
    </div>
  );
};