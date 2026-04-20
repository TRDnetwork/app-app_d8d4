import React, { useEffect, useState } from 'react';
import { CartItem } from '../components/cart/CartItem';
import { CartSummary } from '../components/cart/CartSummary';
import { cartStore } from '../stores/cartStore';
import { fetchWithAuth } from '../lib/api';
import { Button } from '../components/ui/button';

const Cart = () => {
  const { items, clearCart } = cartStore();
  const [couponCode, setCouponCode] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCart = async () => {
      setLoading(true);
      try {
        const data = await fetchWithAuth('/api/cart');
        cartStore.setState({ items: data.items || [] });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadCart();
  }, []);

  const handleApplyCoupon = () => {
    if (!couponCode.trim()) return;
    cartStore.getState().applyCoupon(couponCode);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex gap-4 p-4 border border-border rounded">
                <div className="w-20 h-20 bg-muted rounded"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-4 bg-muted rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
          <div className="space-y-4">
            <div className="h-32 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
        <Button asChild>
          <a href="/">Continue Shopping</a>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <CartItem key={item.product_id} item={item} />
          ))}
        </div>
        <div>
          <CartSummary onProceedToCheckout={() => {}} />
          <div className="mt-6">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter coupon code"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className="flex-1 px-3 py-2 border border-border rounded-l focus:outline-none"
              />
              <Button onClick={handleApplyCoupon} className="rounded-l-none">
                Apply
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;