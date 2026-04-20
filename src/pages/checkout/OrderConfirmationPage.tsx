import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { api } from '@/lib/api';

interface Order {
  id: string;
  orderNumber: string;
  totalAmount: number;
  items: Array<{
    product: {
      title: string;
      images: string[];
    };
    quantity: number;
    price: number;
  }>;
  address: {
    label: string;
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  deliverySpeed: string;
  createdAt: string;
}

const OrderConfirmationPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!sessionId) {
      navigate('/cart');
      return;
    }

    const fetchOrder = async () => {
      try {
        // In real app: call /api/stripe/payment-status/:sessionId
        // For demo, mock order data
        setTimeout(() => {
          setOrder({
            id: '1',
            orderNumber: 'ORD-1234567890-123',
            totalAmount: 2999,
            items: [
              {
                product: {
                  title: 'Wireless Earbuds Pro',
                  images: ['https://source.unsplash.com/random/300x300?earbuds'],
                },
                quantity: 1,
                price: 2499,
              },
              {
                product: {
                  title: 'Phone Case',
                  images: ['https://source.unsplash.com/random/300x300?phone-case'],
                },
                quantity: 2,
                price: 250,
              },
            ],
            address: {
              label: 'Home',
              street: '123 Main St',
              city: 'Mumbai',
              state: 'Maharashtra',
              zip: '400001',
              country: 'India',
            },
            deliverySpeed: 'standard',
            createdAt: new Date().toISOString(),
          });
          setLoading(false);
        }, 1000);
      } catch (error: any) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: error.message || 'Failed to load order details',
        });
        setLoading(false);
      }
    };

    fetchOrder();
  }, [sessionId, navigate, toast]);

  if (loading) {
    return (
      <div className="container px-4 py-8">
        <div className="flex flex-col space-y-3 max-w-2xl mx-auto">
          <div className="h-8 bg-muted rounded w-1/4"></div>
          <div className="h-4 bg-muted rounded w-3/4"></div>
          <div className="h-64 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container px-4 py-8">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Order Not Found</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-text-dim mb-4">We couldn't find your order. Please contact support.</p>
            <Button onClick={() => navigate('/')}>Go to Home</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container px-4 py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Thank You for Your Order!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center py-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-success/20 mb-4">
              <svg
                className="w-8 h-8 text-success"
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
            <h2 className="text-2xl font-bold">Order Confirmed</h2>
            <p className="text-text-dim">Your order has been successfully placed</p>
          </div>

          <div>
            <h3 className="font-medium mb-2">Order Number</h3>
            <p className="text-2xl font-bold text-accent">{order.orderNumber}</p>
          </div>

          <div>
            <h3 className="font-medium mb-2">Order Summary</h3>
            <div className="space-y-2">
              {order.items.map((item, index) => (
                <div key={index} className="flex justify-between">
                  <span>
                    {item.product.title} × {item.quantity}
                  </span>
                  <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="border-t pt-2 flex justify-between font-medium">
                <span>Total</span>
                <span>₹{order.totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-2">Delivery Address</h3>
            <p>
              {order.address.label}
              <br />
              {order.address.street}
              <br />
              {order.address.city}, {order.address.state} {order.address.zip}
              <br />
              {order.address.country}
            </p>
          </div>

          <div>
            <h3 className="font-medium mb-2">Delivery Speed</h3>
            <p>
              {order.deliverySpeed === 'standard'
                ? 'Standard Delivery (3-5 business days)'
                : order.deliverySpeed === 'express'
                ? 'Express Delivery (1-2 business days)'
                : 'Same Day Delivery'}
            </p>
          </div>

          <div className="flex gap-4">
            <Button onClick={() => navigate('/')}>Continue Shopping</Button>
            <Button variant="outline" onClick={() => navigate('/orders')}>
              View Order History
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderConfirmationPage;