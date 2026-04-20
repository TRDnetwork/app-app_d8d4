'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { useAppDispatch, useAppSelector } from '@/store';
import { loadCart, updateCartItem, removeCartItem } from '@/store/cartSlice';

export default function CartPage() {
  const [promoCode, setPromoCode] = useState('');
  const { toast } = useToast();
  const dispatch = useAppDispatch();
  const { items, loading, error } = useAppSelector((state) => state.cart);

  useEffect(() => {
    dispatch(loadCart());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error,
      });
    }
  }, [error, toast]);

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity > 0) {
      dispatch(updateCartItem({ productId, quantity }));
    }
  };

  const removeItem = (productId: string) => {
    dispatch(removeCartItem(productId));
  };

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.1;
  const shipping = subtotal > 50 ? 0 : 5.99;
  const total = subtotal + tax + shipping;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

      {loading ? (
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex gap-4 p-4 border rounded">
              <div className="w-20 h-20 bg-gray-200 rounded"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl text-gray-500">Your cart is empty</p>
          <Button className="mt-4" asChild>
            <a href="/">Continue Shopping</a>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={item._id} className="flex gap-4 p-4 border rounded">
                <div className="relative w-20 h-20">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="object-cover rounded"
                    fill
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">{item.title}</h3>
                  <p className="text-gray-600">${item.price.toFixed(2)}</p>
                  <div className="flex items-center mt-2">
                    <label className="text-sm mr-2">Qty:</label>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => updateQuantity(item._id, item.quantity - 1)}
                      className="h-8 w-8"
                    >
                      -
                    </Button>
                    <Input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => updateQuantity(item._id, parseInt(e.target.value) || 1)}
                      className="h-8 w-16 text-center mx-2"
                      min="1"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => updateQuantity(item._id, item.quantity + 1)}
                      className="h-8 w-8"
                    >
                      +
                    </Button>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeItem(item._id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Remove
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
              </div>
            </div>
            <div className="border-t pt-2 mb-4">
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex gap-2 mb-4">
              <Input
                placeholder="Promo code"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                className="h-10"
              />
              <Button className="h-10">Apply</Button>
            </div>

            <Button className="w-full h-12 text-lg bg-orange-600 hover:bg-orange-700" asChild>
              <a href="/checkout">Proceed to Checkout</a>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}