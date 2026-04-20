import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { fetchWithAuth } from '../lib/api';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { formatCurrency } from '../lib/formatters';
import { cartStore } from '../stores/cartStore';
import { Skeleton } from '../components/ui/skeleton';

const OrderConfirmation = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const sessionId = searchParams.get('session_id');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const { clearCart } = cartStore();

  useEffect(() => {
    const fetchOrder = async () => {
      if (!sessionId) {
        navigate('/cart');
        return;
      }

      try {
        const data = await fetchWithAuth(`/api/stripe/session/${sessionId}`);
        setOrder(data.order);
        clearCart(); // Clear cart after successful order
      } catch (err) {
        console.error('Failed to fetch order:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [sessionId, navigate, clearCart]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <Skeleton className="h-12 w-64 mb-8" />
          <Skeleton className="h-64 w-full mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Skeleton className="h-20" />
            <Skeleton className="h-20" />
          </div>
          <Skeleton className="h-12 w-32 mt-8" />
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Order Not Found</h1>
        <p className="text-text-dim mb-8">We couldn't find your order. Please contact support.</p>
        <Button onClick={() => navigate('/')}>Go to Home</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto text-center">
        <div className="bg-success bg-opacity-10 border border-success rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-10 h-10 text-success"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <h1 className="text-3xl font-bold mb-4 font-display">Thank You!</h1>
        <p className="text-text-dim mb-8">
          Your order has been confirmed and is being processed.
        </p>

        <Card>
          <CardHeader>
            <CardTitle>Order #{order.order_number}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="text-text-dim">Subtotal:</span>
              <span>{formatCurrency(order.subtotal)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between">
                <span className="text-text-dim">Discount:</span>
                <span>-{formatCurrency(order.discount)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-text-dim">Delivery:</span>
              <span>{formatCurrency(order.delivery_charge)}</span>
            </div>
            <div className="flex justify-between text-lg font-semibold pt-2 border-t border-border">
              <span>Total:</span>
              <span>{formatCurrency(order.total)}</span>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 space-x-4">
          <Button onClick={() => navigate('/orders')}>View Order History</Button>
          <Button variant="outline" onClick={() => navigate('/')}>
            Continue Shopping
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;