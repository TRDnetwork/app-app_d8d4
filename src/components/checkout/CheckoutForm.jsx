import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Button } from '../ui/button';
import { useToast } from '../ui/use-toast';

// Public key is exposed to frontend
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const CheckoutForm = ({ orderData, onPaymentSuccess, onPaymentError }) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);
    
    try {
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      const session = await response.json();

      if (!response.ok) {
        throw new Error(session.error || 'Failed to create checkout session');
      }

      // Redirect to Stripe Checkout
      const stripe = await stripePromise;
      const { error } = await stripe.redirectToCheckout({
        sessionId: session.id,
      });

      if (error) {
        toast({
          title: 'Payment Error',
          description: error.message,
          variant: 'destructive',
        });
        onPaymentError?.(error.message);
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast({
        title: 'Checkout Failed',
        description: error.message || 'Unable to process payment at this time.',
        variant: 'destructive',
      });
      onPaymentError?.(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-surface p-6 rounded-lg border border-border">
        <h3 className="text-xl font-bold mb-4">Secure Checkout</h3>
        <p className="text-text-dim mb-6">
          Your payment is secured via Stripe. We never store your card details.
        </p>
        <Button 
          onClick={handleCheckout} 
          disabled={loading}
          className="w-full bg-accent hover:bg-accent/90 text-primary-foreground"
        >
          {loading ? 'Processing...' : `Pay $${orderData.total?.toFixed(2) || 0}`}
        </Button>
      </div>
      
      <div className="flex items-center justify-center space-x-2 text-sm text-text-dim">
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
        </svg>
        <span>Secure SSL Encryption • No card data stored</span>
      </div>
    </div>
  );
};

export default CheckoutForm;