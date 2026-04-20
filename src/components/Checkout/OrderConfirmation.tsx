import React from 'react';
import { Button } from '../ui/button';
import { useNavigate } from 'react-router-dom';

export const OrderConfirmation: React.FC<{ orderId: string; amount: number }> = ({ orderId, amount }) => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold mb-2">Thank you for your order!</h1>
        <p className="text-text_dim mb-6">Your order has been confirmed and will be processed shortly.</p>
        
        <div className="bg-surface/30 rounded-lg p-6 mb-6 text-left">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-text_dim">Order Number:</span>
              <span className="font-mono">{orderId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text_dim">Order Date:</span>
              <span>{new Date().toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text_dim">Total Amount:</span>
              <span className="font-bold">₹{amount.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <Button size="lg" className="w-full" onClick={() => navigate('/orders')}>
            View Order Status
          </Button>
          <Button size="lg" variant="outline" className="w-full" onClick={() => navigate('/')}>
            Continue Shopping
          </Button>
        </div>

        <div className="mt-8 text-sm text-text_dim">
          <p>A confirmation email has been sent to your registered email address.</p>
          <p className="mt-2">You can track your order status in your account.</p>
        </div>
      </div>
    </div>
  );
};