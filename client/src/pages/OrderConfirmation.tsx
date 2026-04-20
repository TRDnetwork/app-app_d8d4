import React, { useEffect } from 'react';
import { Button } from '../components/ui/button';
import { CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { trackPurchase, trackCTAClick } from '../lib/analytics';

const OrderConfirmation: React.FC = () => {
  const navigate = useNavigate();
  
  // Track purchase when component mounts
  useEffect(() => {
    // In a real app, we'd get the order details from the URL or state
    trackPurchase('ORDER_12345', 299.99, {
      item_count: 3,
      payment_method: 'stripe',
      delivery_speed: 'express'
    });
  }, []);

  const handleContinueShopping = () => {
    trackCTAClick('continue_shopping', 'order_confirmation');
    navigate('/products');
  };

  const handleViewOrder = () => {
    trackCTAClick('view_order', 'order_confirmation');
    navigate('/orders/12345');
  };

  return (
    <div className="container mx-auto px-4 py-8 text-center">
      <div className="max-w-2xl mx-auto">
        <CheckCircle className="h-16 w-16 text-success mx-auto mb-4" />
        
        <h1 className="text-3xl font-bold mb-4">Thank you for your order!</h1>
        
        <p className="text-text-dim mb-8">
          Your order has been confirmed and will be processed shortly. 
          You'll receive an email with your order details and tracking information.
        </p>
        
        <div className="bg-muted p-6 rounded-lg mb-8">
          <p className="text-sm text-text-dim mb-2">Order Number</p>
          <p className="text-2xl font-bold">ORDER-12345</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={handleViewOrder}
            className="bg-accent hover:bg-orange-600"
          >
            View Order Details
          </Button>
          
          <Button
            variant="outline"
            onClick={handleContinueShopping}
          >
            Continue Shopping
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;