import React, { lazy, Suspense } from 'react';
import { useAuthStore } from '../stores/authStore';
import { trackCTAClick } from '../lib/analytics';

// Lazy load Stripe Elements to reduce bundle size
const Elements = lazy(() => import('@stripe/react-stripe-js').then(m => ({ default: m.Elements })));
const loadStripe = lazy(() => import('@stripe/stripe-js').then(m => ({ default: m.loadStripe })));

const CheckoutPage: React.FC = () => {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Checkout</h1>
        <p className="text-text_dim mb-4">Please log in to continue with checkout.</p>
        <button
          onClick={() => {
            trackCTAClick('login_to_checkout', 'checkout_page');
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
    <Suspense fallback={<div className="skeleton h-96 w-full"></div>}>
      <Elements stripe={loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)}>
        <CheckoutForm />
      </Elements>
    </Suspense>
  );
};

// Lazy load CheckoutForm to enable code splitting
const CheckoutForm = lazy(() => import('../components/Checkout/CheckoutForm'));

export default CheckoutPage;