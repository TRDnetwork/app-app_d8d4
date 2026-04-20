import React from 'react';
import { CartItem } from '../components/cart/CartItem';
import { CartSummary } from '../components/cart/CartSummary';
import { useCartStore } from '../stores/cartStore';
import { Button } from '../components/ui/button';
import { Link } from 'react-router-dom';
import { usePageViewTracking } from '../hooks/useAnalytics';
import analytics from '../lib/analytics';
import { ANALYTICS_EVENTS } from '../lib/analyticsEvents';

export default function Cart() {
  const items = useCartStore(state => state.items);
  const total = useCartStore(state => state.getTotal());
  
  // Track page view
  usePageViewTracking('CART');

  // Track cart view event
  useEffect(() => {
    analytics.track(ANALYTICS_EVENTS.CART_VIEWED, {
      itemCount: items.length,
      totalValue: total,
      items: items.map(item => ({
        productId: item.productId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      })),
    });
  }, [items, total]);

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
        <Button asChild>
          <Link to="/">Continue Shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {items.map(item => (
            <CartItem key={item.id} item={item} />
          ))}
        </div>
        <div>
          <CartSummary total={total} />
          <Button asChild className="w-full mt-4">
            <Link to="/checkout">Proceed to Checkout</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}