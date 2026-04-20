'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { createCheckoutSession } from '@/lib/api';

export default function CheckoutForm({ orderSummary }) {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const successUrl = `${window.location.origin}/order-confirmation`;
      const cancelUrl = `${window.location.origin}/cart`;

      const response = await createCheckoutSession(successUrl, cancelUrl);
      
      // Redirect to Stripe Checkout
      router.push(`/api/checkout-session/${response.id}`);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to process payment',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded border p-6">
      <h2 className="mb-4 text-lg font-semibold">3. Review Order</h2>
      <div className="space-y-2">
        {orderSummary.items.map((item) => (
          <div key={item.id} className="flex justify-between">
            <span>{item.name}</span>
            <span>${item.price.toFixed(2)}</span>
          </div>
        ))}
        <div className="flex justify-between border-t pt-2 font-semibold">
          <span>Total</span>
          <span>${orderSummary.total.toFixed(2)}</span>
        </div>
      </div>
      <Button 
        onClick={handleCheckout}
        disabled={loading}
        className="mt-6 w-full bg-accent hover:bg-orange-600"
      >
        {loading ? 'Processing...' : 'Place Order'}
      </Button>
      <p className="mt-3 text-center text-xs text-text_dim">
        By placing your order, you agree to our Terms of Service
      </p>
    </div>
  );
}