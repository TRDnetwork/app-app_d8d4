import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { useCartStore } from '../stores/cartStore';
import { formatCurrency } from '../lib/formatters';
import { useTranslation } from 'react-i18next';
import { trackCTAClick } from '../lib/analytics';

const Cart: React.FC = () => {
  const { t } = useTranslation();
  const { items, total, removeItem, updateQuantity, clearCart } = useCartStore();

  const handleCheckout = () => {
    trackCTAClick('proceed_to_checkout', 'cart_page');
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <div className="w-24 h-24 mx-auto mb-6 text-text-dim">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5 6m0 0h9" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold mb-2">{t('cart.empty')}</h2>
        <p className="text-text-dim mb-6">{t('cart.continueShopping')}</p>
        <Button asChild className="bg-accent hover:bg-orange-600">
          <Link to="/products">{t('cart.continueShopping')}</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 font-display">{t('cart.title')}</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {items.map((item) => (
            <div key={item.id} className="flex items-center space-x-4 py-4 border-b border-border">
              <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded" />
              <div className="flex-1">
                <h3 className="font-medium">{item.name}</h3>
                <p className="text-accent font-bold">{formatCurrency(item.price)}</p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                  className="w-8 h-8 rounded-full border border-border flex items-center justify-center hover:bg-muted"
                >
                  -
                </button>
                <span className="w-8 text-center">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="w-8 h-8 rounded-full border border-border flex items-center justify-center hover:bg-muted"
                >
                  +
                </button>
              </div>
              <div className="text-right">
                <p className="font-bold">{formatCurrency(item.price * item.quantity)}</p>
              </div>
              <button
                onClick={() => removeItem(item.id)}
                className="text-text-dim hover:text-error"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none"