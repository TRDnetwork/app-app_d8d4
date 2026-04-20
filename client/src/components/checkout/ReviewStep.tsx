import React from 'react';
import { Button } from '../ui/button';
import { useCartStore } from '../../stores/cartStore';
import { useCheckoutStore } from '../../stores/checkoutStore';
import { formatCurrency } from '../../lib/formatters';
import { trackEvent, trackPurchase } from '../../lib/analytics';

const ReviewStep = ({ onBack, onPlaceOrder }: { onBack: () => void; onPlaceOrder: () => void }) => {
  const { items, coupon } = useCartStore();
  const { address, deliverySpeed, paymentMethod } = useCheckoutStore();

  const deliveryOption = {
    standard: { label: 'Standard Delivery', price: 0 },
    express: { label: 'Express Delivery', price: 9.99 },
    same_day: { label: 'Same Day Delivery', price: 19.99 },
  }[deliverySpeed];

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryCharge = deliveryOption.price;
  const discount = coupon ? coupon.discount : 0;
  const total = subtotal + deliveryCharge - discount;

  const handlePlaceOrder = () => {
    // Generate a mock order ID
    const orderId = `ORD-${Date.now()}`;
    
    // Track the purchase
    trackPurchase(orderId, total, items.map(item => ({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity
    })));
    
    // Track the CTA click
    trackCTAClick('place_order', 'review_step');
    
    // Call the original onPlaceOrder function
    onPlaceOrder();
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Review Your Order</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-surface p-6 rounded-lg border border-border">
            <h3 className="font-semibold mb-4">Shipping Address</h3>
            <div className="text-text_dim space-y-1">
              <p>{address?.line1}</p>
              {address?.line2 && <p>{address.line2}</p>}
              <p>{address?.city}, {address?.state} {address?.postalCode}</p>
              <p>{address?.country}</p>
            </div>
          </div>

          <div className="bg-surface p-6 rounded-lg border border-border">
            <h3 className="font-semibold mb-4">Delivery Method</h3>
            <div className="flex justify-between">
              <span>{deliveryOption.label}</span>
              <span>{deliveryCharge === 0 ? 'Free' : formatCurrency(deliveryCharge)}</span>
            </div>
          </div>

          <div className="bg-surface p-6 rounded-lg border border-border">
            <h3 className="font-semibold mb-4">Payment Method</h3>
            <p className="text-text_dim capitalize">
              {paymentMethod === 'stripe' && 'Credit/Debit Card'}
              {paymentMethod === 'upi' && 'UPI'}
              {paymentMethod === 'cod' && 'Cash on Delivery'}
            </p>
          </div>

          <div className="bg-surface p-6 rounded-lg border border-border">
            <h3 className="font-semibold mb-4">Order Items</h3>
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex items-center space-x-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="flex-1">
                    <p className="font-medium">{item.name}</p>
                    {item.variant && <p className="text-text_dim text-sm">{item.variant}</p>}
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{formatCurrency(item.price)}</p>
                    <p className="text-text_dim text-sm">Qty: {item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-surface p-6 rounded-lg border border-border sticky top-24">
          <h3 className="font-semibold mb-4">Order Summary</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery</span>
              <span>{deliveryCharge === 0 ? 'Free' : formatCurrency(deliveryCharge)}</span>
            </div>
            {coupon && (
              <div className="flex justify-between text-success">
                <span>Discount ({coupon.code})</span>
                <span>-{formatCurrency(discount)}</span>
              </div>
            )}
          </div>
          <div className="border-t border-border my-4 pt-4 font-semibold flex justify-between">
            <span>Total</span>
            <span>{formatCurrency(total)}</span>
          </div>
          <Button className="w-full" onClick={handlePlaceOrder}>
            Place Order
          </Button>
          <p className="text-xs text-text_dim text-center mt-2">
            By placing your order, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>

      <Button variant="outline" onClick={onBack} className="w-full">
        Back to Payment
      </Button>
    </div>
  );
};

export default ReviewStep;