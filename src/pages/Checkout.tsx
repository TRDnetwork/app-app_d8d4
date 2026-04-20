import React from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import CheckoutForm from '../components/Checkout/CheckoutForm';
import { useAuthStore } from '../stores/authStore';
import { analytics } from '../lib/analytics';

// Load Stripe publishable key from environment
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const CheckoutPage: React.FC = () => {
  const { isAuthenticated } = useAuthStore();

  // Track checkout initiation
  useEffect(() => {
    if (isAuthenticated) {
      analytics.trackEvent({
        category: 'ecommerce',
        action: 'begin_checkout',
        label: 'checkout_initiated'
      });
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Checkout</h1>
        <p className="text-text_dim mb-4">Please log in to continue with checkout.</p>
        <button
          onClick={() => {
            // Track login CTA click
            analytics.trackCTAClick('login', 'checkout');
            window.location.href = '/login';
          }}
          className="px-6 py-2 bg-accent text-background rounded hover:bg-orange-600"
        >
          Log In
        </button>
      </div>
    );
  }

  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  );
};

export default CheckoutPage;