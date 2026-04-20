import React, { useState } from 'react';
import { useAuth } from '../stores/authStore';
import { useCart } from '../stores/cartStore';
import AddressSelector from '../components/AddressSelector';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { useNavigate } from 'react-router-dom';

const Checkout: React.FC = () => {
  const { user } = useAuth();
  const { items, total } = useCart();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [address, setAddress] = useState('');
  const [deliverySpeed, setDeliverySpeed] = useState('standard');
  const [paymentMethod, setPaymentMethod] = useState('card');

  const handleNext = () => setStep((prev) => prev + 1);
  const handlePrev = () => setStep((prev) => prev - 1);

  const handleSubmit = () => {
    // In real app, call Stripe API
    navigate('/order-confirmation');
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
        <Button asChild>
          <a href="/cart">Go to Cart</a>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="mb-8">
            <div className="flex justify-between mb-4">
              <span className={step >= 1 ? 'font-bold' : ''}>1. Address</span>
              <span className={step >= 2 ? 'font-bold' : ''}>2. Delivery</span>
              <span className={step >= 3 ? 'font-bold' : ''}>3. Payment</span>
              <span className={step >= 4 ? 'font-bold' : ''}>4. Review</span>
            </div>
            <hr />
          </div>

          {step === 1 && (
            <div className="space-y-6">
              <AddressSelector selected={address} onSelect={setAddress} />
              <Button onClick={handleNext}>Continue to Delivery</Button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Choose Delivery Speed</h2>
              <div className="space-y-2">
                <label className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="delivery"
                    value="standard"
                    checked={deliverySpeed === 'standard'}
                    onChange={(e) => setDeliverySpeed(e.target.value)}
                  />
                  Standard Delivery - $5.99 (3-5 business days)
                </label>
                <label className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="delivery"
                    value="express"
                    checked={deliverySpeed === 'express'}
                    onChange={(e) => setDeliverySpeed(e.target.value)}
                  />
                  Express Delivery - $12.99 (1-2 business days)
                </label>
              </div>
              <div className="flex justify-between">
                <Button variant="outline" onClick={handlePrev}>
                  Back to Address
                </Button>
                <Button onClick={handleNext}>Continue to Payment</Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Payment Method</h2>
              <div className="space-y-2">
                <label className="flex items-center gap-3">
                  <