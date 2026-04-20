import React from 'react';
import { useCheckoutStore } from '../../stores/checkoutStore';
import { useCartStore } from '../../stores/cartStore';
import { formatCurrency } from '../../lib/utils';

const OrderReview: React.FC = () => {
  const { selectedAddress, deliveryOption } = useCheckoutStore();
  const { items, total } = useCartStore();

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-medium mb-3">Shipping Address</h3>
        <div className="p-4 bg-muted/30 rounded-lg border">
          <div className="font-medium capitalize">{selectedAddress?.type} Address</div>
          <div>{selectedAddress?.line1}</div>
          {selectedAddress?.line2 && <div>{selectedAddress.line2}</div>}
          <div>
            {selectedAddress?.city}, {selectedAddress?.state} {selectedAddress?.postal_code}
          </div>
          <div>{selectedAddress?.country}</div>
        </div>
      </div>

      <div>
        <h3 className="font-medium mb-3">Delivery Method</h3>
        <div className="p-4 bg-muted/30 rounded-lg border">
          <div className="font-medium">{deliveryOption?.label}</div>
          <div className="text-text_dim text-sm">{deliveryOption?.estimated}</div>
          <div className="mt-1 font-medium">
            {deliveryOption?.price === 0 ? 'Free' : formatCurrency(deliveryOption?.price)}
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-medium mb-3">Payment Method</h3>
        <div className="p-4 bg-muted/30 rounded-lg border">
          <div className="font-medium">Card ending in {useCheckoutStore.getState().paymentMethod?.last4}</div>
          <div className="text-text_dim text-sm">{useCheckoutStore.getState().paymentMethod?.brand.toUpperCase()}</div>
        </div>
      </div>

      <div>
        <h3 className="font-medium mb-3">Order Items</h3>
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="flex items-center space-x-4 p-3 border rounded-lg">
              <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
              <div className="flex-1">
                <div className="font-medium">{item.name}</div>
                <div className="text-text_dim text-sm">Qty: {item.quantity}</div>
              </div>
              <div className="font-medium">{formatCurrency(item.price * item.quantity)}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t pt-4">
        <div className="flex justify-between">
          <span className="text-text_dim">Subtotal</span>
          <span>{formatCurrency(total)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-text_dim">Delivery</span>
          <span>{deliveryOption?.price === 0 ? 'Free' : formatCurrency(deliveryOption?.price)}</span>
        </div>
        <div className="flex justify-between font-bold text-lg mt-2">
          <span>Total</span>
          <span>
            {formatCurrency(total + (deliveryOption?.price || 0))}
          </span>
        </div>
      </div>
    </div>
  );
};

export default OrderReview;