import React from 'react';
import { CartItem } from '../components/cart/CartItem';
import { CartSummary } from '../components/cart/CartSummary';
import { cartStore } from '../stores/cartStore';
import { Button } from '../components/ui/button';
import { Link } from 'react-router-dom';

const Cart = () => {
  const items = cartStore((s) => s.items);
  const subtotal = cartStore((s) => s.subtotal());
  const total = cartStore((s) => s.total());

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="mb-4 text-2xl font-bold">Your cart is empty</h2>
        <Button asChild>
          <Link to="/">Continue Shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Shopping Cart</h1>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        <div className="md:col-span-2">
          <ul className="space-y-4">
            {items.map((item) => (
              <CartItem key={item.product._id} item={item} />
            ))}
          </ul>
        </div>
        <div>
          <CartSummary subtotal={subtotal} total={total} />
          <Button asChild className="mt-4 w-full">
            <Link to="/checkout">Proceed to Checkout</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Cart;