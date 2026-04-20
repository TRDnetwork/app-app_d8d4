import React from 'react';
import { Button } from '../components/ui/button';

const OrderConfirmation = () => {
  return (
    <div className="container mx-auto px-4 py-8 text-center">
      <div className="max-w-2xl mx-auto">
        <div className="text-success text-6xl mb-4">✓</div>
        <h1 className="text-display text-4xl font-bold mb-4">Thank You for Your Order!</h1>
        <p className="text-text-dim mb-6">Your order has been confirmed and will be processed shortly.</p>
        <p className="mb-8">
          <span className="font-bold">Order ID:</span> ORD-7X8K2M9N
        </p>
        <Button className="btn-primary">Continue Shopping</Button>
      </div>
    </div>
  );
};

export default OrderConfirmation;