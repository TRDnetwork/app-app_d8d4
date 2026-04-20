import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { useCheckoutStore } from '../stores/checkoutStore';
import { useCartStore } from '../stores/cartStore';
import { formatCurrency } from '../lib/utils';
import { trackPurchase, trackCTAClick } from '../lib/analytics';

const OrderConfirmation: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const session_id = searchParams.get('session_id');
  const { selectedAddress, deliveryOption } = useCheckoutStore();
  const { items, total, clearCart } = useCartStore();

  // In production, verify session with backend
  React.useEffect(() => {
    if (session_id) {
      // Clear cart after successful order
      clearCart();
      
      // Track purchase event
      trackPurchase(
        `ORD-${Date.now().toString().slice(-6).toUpperCase()}`,
        total + (deliveryOption?.price || 0)
      );
    }
  }, [session_id, clearCart, total, deliveryOption]);

  const handleViewOrderStatus = () => {
    trackCTAClick('view_order_status', 'order_confirmation');
    navigate('/orders');
  };

  const handleContinueShopping = () => {
    trackCTAClick('continue_shopping', 'order_confirmation');
    navigate('/');
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <Card className="border-accent shadow-lg">
        <CardHeader className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-success/20 rounded-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <CardTitle className="text-2xl">Thank you for your order!</CardTitle>
          <CardDescription>
            Your order has been confirmed and will be processed shortly.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-medium mb-2">Order Number</h3>
            <p className="text-2xl font-bold text-accent">ORD-{Date.now().toString().slice(-6).toUpperCase()}</p>
          </div>

          <div>
            <h3 className="font-medium mb-2">Delivery Address</h3>
            <p>{selectedAddress?.line1}</p>
            {selectedAddress?.line2 && <p>{selectedAddress.line2}</p>}
            <p>
              {selectedAddress?.city}, {selectedAddress?.state} {selectedAddress?.postal_code}
            </p>
            <p>{selectedAddress?.country}</p>
          </div>

          <div>
            <h3 className="font-medium mb-2">Estimated Delivery</h3>
            <p>{deliveryOption?.estimated}</p>
          </div>

          <div>
            <h3 className="font-medium mb-2">Order Summary</h3>
            <div className="space-y-2">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between">
                  <span>
                    {item.name} x{item.quantity}
                  </span>
                  <span>{formatCurrency(item.price * item.quantity)}</span>
                </div>
              ))}
              <div className="border-t pt-2 flex justify-between">
                <span>Subtotal</span>
                <span>{formatCurrency(total)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery</span>
                <span>{deliveryOption?.price === 0 ? 'Free' : formatCurrency(delivery