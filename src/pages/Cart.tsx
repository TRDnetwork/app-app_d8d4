import React from 'react';
import { CartItem } from '../components/cart/CartItem';
import { CartSummary } from '../components/cart/CartSummary';

const Cart = () => {
  const items = [
    { id: '1', name: 'Wireless Headphones', price: 199.99, quantity: 1, image: '/placeholder.svg' },
    { id: '2', name: 'Phone Case', price: 29.99, quantity: 2, image: '/placeholder.svg' },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-display text-4xl font-bold mb-8">Shopping Cart</h1>
      {items.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {items.map((item) => (
              <CartItem key={item.id} item={item} />
            ))}
            <button className="text-accent hover:underline mt-4">Save for Later</button>
          </div>
          <div>
            <CartSummary items={items} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;