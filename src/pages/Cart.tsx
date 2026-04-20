import React from 'react';
import { useCart } from '../stores/cartStore';
import CartItem from '../components/CartItem';
import { Button } from '../components/ui/button';
import { Skeleton } from '../components/ui/skeleton';

const Cart: React.FC = () => {
  const { items, total, loading, fetchCart } = useCart();

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex items-center gap-4 p-4 border-b border-border">
            <Skeleton className="h-20 w-20 shimmer" />
            <div className="flex-1">
              <Skeleton className="h-5 w-48 shimmer" />
              <Skeleton className="h-4 w-24 mt-2 shimmer" />
            </div>
            <Skeleton className="h-10 w-20 shimmer" />
          </div>
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
        <Button asChild>
          <a href="/">Continue Shopping</a>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <CartItem key={item._id} item={item} onUpdate={fetchCart} />
          ))}
        </div>
        <div className="card">
          <div className="card-content">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            <div className="flex justify-between mb-2">
              <span>Subtotal</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Delivery</span>
              <span>$5.99</span>
            </div>
            <div className="flex justify-between font-bold text-lg mt-4">
              <span>Total</span>
              <span>${(total + 5.99).toFixed(2)}</span>
            </div>
            <Button className="w-full mt-6" asChild>
              <a href="/checkout">Proceed to Checkout</a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;