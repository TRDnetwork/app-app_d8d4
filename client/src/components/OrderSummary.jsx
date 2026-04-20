'use client';

import { useAppSelector } from '@/store';
import { Button } from '@/components/ui/button';

export default function OrderSummary() {
  const { items } = useAppSelector((state) => state.cart);
  
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping = 0; // Would be dynamic based on delivery option
  const tax = subtotal * 0.08; // 8% tax example
  const total = subtotal + shipping + tax;

  return (
    <div className="rounded-lg border p-6">
      <h2 className="text-lg font-medium">Order Summary</h2>
      <div className="mt-4 space-y-4">
        {items.slice(0, 3).map((item) => (
          <div key={item.id} className="flex items-center space-x-3">
            <img
              src={item.image}
              alt={item.name}
              className="h-12 w-12 rounded object-cover"
            />
            <div className="flex-1">
              <p className="text-sm">{item.name}</p>
              <p className="text-sm text-text_dim">
                {item.quantity} × ${item.price}
              </p>
            </div>
            <p className="text-sm font-medium">
              ${(item.price * item.quantity).toFixed(2)}
            </p>
          </div>
        ))}
        
        {items.length > 3 && (
          <p className="text-sm text-text_dim">
            +{items.length - 3} more item(s)
          </p>
        )}
      </div>

      <div className="mt-6 border-t pt-4">
        <div className="flex justify-between text-sm">
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Shipping</span>
          <span>${shipping.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Tax</span>
          <span>${tax.toFixed(2)}</span>
        </div>
        <div className="mt-2 flex justify-between font-medium">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>

      <Button className="mt-6 w-full">Place Order</Button>
    </div>
  );
}