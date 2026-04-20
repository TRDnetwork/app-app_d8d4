import React from 'react';
import { useCartStore } from '../stores/cartStore';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { analytics } from '../lib/analytics';

const Cart = () => {
  const { items, removeFromCart, updateQuantity, clearCart } = useCartStore();
  const navigate = useNavigate();

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  const handleRemove = (id: string) => {
    removeFromCart(id);
    analytics.removeFromCart(id);
  };

  const handleQuantityChange = (id: string, quantity: number) => {
    updateQuantity(id, quantity);
    analytics.addToCart(id, 
      items.find(item => item.id === id)?.price || 0, 
      quantity
    );
  };

  const handleCheckout = () => {
    analytics.initiateCheckout(total, items.length);
    analytics.ctaClick('proceed_to_checkout', 'cart_page');
    navigate('/checkout');
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-bold text-text mb-4">Your cart is empty</h2>
        <p className="text-text_dim mb-6">Looks like you haven't added any items to your cart yet.</p>
        <Button asChild>
          <a href="/products">Continue Shopping</a>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-text mb-8">Shopping Cart</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {items.map((item) => (
            <div key={item.id} className="flex items-center space-x-4 bg-surface p-4 rounded-lg mb-4">
              <img src={item.image} alt={item.title} className="w-20 h-20 object-cover rounded" />
              <div className="flex-1">
                <h3 className="font-semibold text-text">{item.title}</h3>
                <p className="text-primary font-bold">${item.price.toFixed(2)}</p>
                {item.selectedVariants && Object.keys(item.selectedVariants).length > 0 && (
                  <p className="text-text_dim text-sm">
                    {Object.entries(item.selectedVariants).map(([key, value]) => 
                      `${key}: ${value}`
                    ).join(', ')}
                  </p>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <label className="text-text_dim">Qty:</label>
                <select 
                  value={item.quantity} 
                  onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value))}
                  className="border border-border rounded px-2 py-1"
                >
                  {[1,2,3,4,5,6,7,8,9,10].map(num => (
                    <option key={num} value={num}>{num}</option>
                  ))}
                </select>
              </div>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => handleRemove(item.id)}
              >
                Remove
              </Button>
            </div>
          ))}
        </div>

        <div className="bg-surface p-6 rounded-lg border border-border">
          <h2 className="text-xl font-bold mb-4">Order Summary</h2>
          
          <div className="space-y-2 mb-4">
            <div className="flex justify-between">
              <span className="text-text_dim">Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text_dim">Tax</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold border-t border-border pt-2">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>

          <Button 
            className="w-full bg-accent hover:bg-accent/90 text-primary-foreground"
            onClick={handleCheckout}
          >
            Proceed to Checkout
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Cart;