import React from 'react';
import { useParams } from 'react-router-dom';
import { OrderTimeline } from '../components/order/OrderTimeline';
import { Button } from '../components/ui/button';
import { Link } from 'react-router-dom';

export default function OrderConfirmation() {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="container mx-auto px-4 py-8 text-center">
      <h1 className="text-3xl font-bold mb-4">Thank you for your order!</h1>
      <p className="text-xl mb-6">Order #{id}</p>
      <OrderTimeline status="placed" />
      <div className="mt-8 space-x-4">
        <Button asChild>
          <Link to="/orders">View Order History</Link>
        </Button>
        <Button variant="secondary" asChild>
          <Link to="/">Continue Shopping</Link>
        </Button>
      </div>
    </div>
  );
}