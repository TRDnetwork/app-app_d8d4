import React from 'react';
import { Button } from '../components/ui/button';
import { useNavigate } from 'react-router-dom';

const OrderConfirmation = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <div className="max-w-2xl mx-auto">
        <div className="text-6xl mb-4">🎉</div>
        <h1 className="text-3xl font-bold mb-4">Thank you for your order!</h1>
        <p className="text-text-dim mb-8">
          Your order has been confirmed and is being processed. You will receive an email confirmation shortly.
        </p>
        <p className="mb-8">
          <strong>Order ID:</strong> <span className="text-accent">ORD-7XK9P2</span>
        </p>
        <div className="flex gap-4 justify-center">
          <Button asChild>
            <a href="/orders">View Order History</a>
          </Button>
          <Button variant="secondary" onClick={() => navigate('/')}>
            Continue Shopping
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;