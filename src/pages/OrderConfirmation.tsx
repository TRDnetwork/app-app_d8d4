import React from 'react';
import { OrderTimeline } from '../components/order/OrderTimeline';
import { InvoiceDownload } from '../components/order/InvoiceDownload';
import { Button } from '../components/ui/button';
import { Link } from 'react-router-dom';

const OrderConfirmation = () => {
  return (
    <div className="container mx-auto px-4 py-8 text-center">
      <div className="card mx-auto max-w-2xl p-8">
        <h1 className="mb-4 text-3xl font-bold">Thank you for your order!</h1>
        <p className="mb-6 text-text_dim">Your order has been confirmed and is being processed.</p>
        <p className="mb-8 text-lg">
          Order ID: <span className="font-mono font-bold">ORD-12345678</span>
        </p>
        <OrderTimeline status="confirmed" />
        <div className="mt-8">
          <InvoiceDownload orderId="123" />
        </div>
        <Button asChild className="mt-6">
          <Link to="/orders">View Order History</Link>
        </Button>
      </div>
    </div>
  );
};

export default OrderConfirmation;