import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { apiClient } from '../lib/api';

const OrderConfirmation = () => {
  const [searchParams] = useSearchParams();
  const session_id = searchParams.get('session_id');
  const navigate = useNavigate();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session_id) {
      navigate('/cart');
      return;
    }

    const fetchOrder = async () => {
      try {
        const data = await apiClient(`/stripe/payment-status/${session_id}`);
        if (data.status === 'complete') {
          setOrder(data.order);
        } else {
          throw new Error('Payment not completed');
        }
      } catch (err) {
        console.error('Failed to fetch order:', err);
        navigate('/cart');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [session_id, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p>Loading order confirmation...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-destructive mb-4">Order Not Found</h2>
        <p className="text-muted-foreground mb-6">We couldn't find your order. Please contact support.</p>
        <Button onClick={() => navigate('/')}>Go to Home</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Card className="border-success">
        <CardHeader>
          <CardTitle className="text-2xl text-success">Order Confirmed!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Thank you for your purchase, <span className="font-medium">{order.user.name}</span>!
          </p>
          <div className="bg-muted p-4 rounded-md">
            <p className="text-sm text-muted-foreground">Order Number</p>
            <p className="font-mono font-bold text-lg">{order.order_number}</p>
          </div>
          <p className="text-sm text-muted-foreground">
            We've sent a confirmation email to <span className="font-medium">{order.user.email}</span>.
          </p>
          <div className="flex space-x-4 pt-4">
            <Button onClick={() => navigate('/orders')}>View Order History</Button>
            <Button variant="outline" onClick={() => navigate('/')}>Continue Shopping</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderConfirmation;