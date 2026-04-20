import React from 'react';
import { Button } from '../ui/button';
import { useCheckoutStore } from '../../stores/checkoutStore';

export const ReviewStep: React.FC<{ onPlaceOrder: () => void; onBack: () => void }> = ({ onPlaceOrder, onBack }) => {
  const { address, deliveryOption, paymentMethod, cartItems, cartTotal } = useCheckoutStore();

  const totalAmount = cartTotal + (deliveryOption?.price || 0);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Review Order</h2>
      
      <div className="space-y-6">
        {/* Shipping Address */}
        <div className="border border-border rounded-lg p-4">
          <h3 className="font-semibold mb-2">Shipping Address</h3>
          <p>{address?.street}</p>
          <p>{address?.city}, {address?.state} {address?.zip}</p>
          <p>{address?.country}</p>
          <p>Phone: {address?.phone}</p>
        </div>

        {/* Delivery Method */}
        <div className="border border-border rounded-lg p-4">
          <h3 className="font-semibold mb-2">Delivery Method</h3>
          <p>{deliveryOption?.label}</p>
          <p className="text-text_dim text-sm">{deliveryOption?.description}</p>
          <p className="font-medium mt-1">
            {deliveryOption?.price === 0 ? 'Free' : `₹${deliveryOption?.price.toFixed(2)}`}
          </p>
        </div>

        {/* Payment Method */}
        <div className="border border-border rounded-lg p-4">
          <h3 className="font-semibold mb-2">Payment Method</h3>
          <p>
            {paymentMethod === 'card' && 'Credit/Debit Card'}
            {paymentMethod === 'upi' && 'UPI'}
            {paymentMethod === 'cod' && 'Cash on Delivery'}
          </p>
        </div>

        {/* Order Items */}
        <div className="border border-border rounded-lg p-4">
          <h3 className="font-semibold mb-4">Order Items ({cartItems.length})</h3>
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div key={item._id} className="flex items-center space-x-4">
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-16 w-16 object-cover rounded"
                />
                <div className="flex-1">
                  <p className="font-medium">{item.title}</p>
                  <p className="text-text_dim text-sm">Qty: {item.quantity}</p>
                </div>
                <p className="font-medium">₹{(item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Order Total */}
        <div className="border border-border rounded-lg p-4">
          <div className="flex justify-between mb-2">
            <span className="text-text_dim">Subtotal</span>
            <span>₹{cartTotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-text_dim">Delivery</span>
            <span>{deliveryOption?.price === 0 ? 'Free' : `₹${deliveryOption?.price.toFixed(2)}`}</span>
          </div>
          <div className="flex justify-between text-lg font-bold pt-2 border-t border-border">
            <span>Total</span>
            <span>₹{totalAmount.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="flex justify-between pt-6">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button onClick={onPlaceOrder}>Place Order</Button>
      </div>
    </div>
  );
};