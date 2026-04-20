import React, { useState } from 'react';
import { useAuth } from '../stores/authStore';
import { useCart } from '../stores/cartStore';
import AddressSelector from '../components/AddressSelector';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { apiClient } from '../lib/api';

// Load Stripe with publishable key from environment
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '');

const CheckoutForm = () => {
  const { user } = useAuth();
  const { items, total, fetchCart } = useCart();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [selectedAddress, setSelectedAddress] = useState<string>('');
  const [deliverySpeed, setDeliverySpeed] = useState<'standard' | 'express'>('standard');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cod'>('card');
  const [coupon, setCoupon] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [discount, setDiscount] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const stripe = useStripe();
  const elements = useElements();

  const deliveryFees = {
    standard: 5.99,
    express: 12.99,
  };

  const subtotal = total;
  const deliveryFee = deliveryFees[deliverySpeed];
  const grandTotal = subtotal + deliveryFee - discount;

  const handleNext = () => setStep((prev) => prev + 1);
  const handlePrev = () => setStep((prev) => prev - 1);

  const applyCoupon = async () => {
    if (!coupon.trim()) return;
    try {
      const data = await apiClient('/cart/apply-coupon', {
        method: 'POST',
        body: JSON.stringify({ code: coupon }),
      });
      if (data.valid) {
        setAppliedCoupon(data.coupon);
        const discountAmount =
          data.coupon.discount_type === 'percent'
            ? (subtotal * data.coupon.discount_value) / 100
            : data.coupon.discount_value;
        setDiscount(discountAmount);
      }
    } catch (err) {
      setError('Invalid or expired coupon');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    if (!selectedAddress) {
      setError('Please select a delivery address');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // Create Stripe Checkout Session
      const response = await apiClient('/stripe/create-checkout-session', {
        method: 'POST',
        body: JSON.stringify({
          items: items.map((item) => ({
            product_id: item.product_id,
            variant_id: item.variant_id,
            quantity: item.quantity,
            price: item.price_snapshot,
          })),
          addressId: selectedAddress,
          deliverySpeed,
          couponCode: appliedCoupon?.code,
        }),
      });

      const { sessionId } = response;

      // Redirect to Stripe Checkout
      const { error } = await stripe.redirectToCheckout({
        sessionId,
      });

      if (error) {
        setError(error.message || 'An error occurred during payment');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to process payment');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!user) {
    navigate('/login');
    return null;
  }

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
    <form onSubmit={handleSubmit}>
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
              <AddressSelector selected={selectedAddress} onSelect={setSelectedAddress} />
              {error && <p className="text-error text-sm">{error}</p>}
              <Button type="button" onClick={handleNext} disabled={!selectedAddress}>
                Continue to Delivery
              </Button>
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
                    onChange={(e) => setDeliverySpeed(e.target.value as 'standard')}
                  />
                  Standard Delivery - ${deliveryFees.standard} (3-5 business days)
                </label>
                <label className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="delivery"
                    value="express"
                    checked={deliverySpeed === 'express'}
                    onChange={(e) => setDeliverySpeed(e.target.value as 'express')}
                  />
                  Express Delivery - ${deliveryFees.express} (1-2 business days)
                </label>
              </div>
              <div className="flex justify-between">
                <Button variant="outline" type="button" onClick={handlePrev}>
                  Back to Address
                </Button>
                <Button type="button" onClick={handleNext}>
                  Continue to Payment
                </Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Payment Method</h2>
              <div className="space-y-4">
                <label className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="payment"
                    value="card"
                    checked={paymentMethod === 'card'}
                    onChange={(e) => setPaymentMethod(e.target.value as 'card')}
                  />
                  Credit/Debit Card
                </label>
                {paymentMethod === 'card' && (
                  <Card className="p-4">
                    <CardElement
                      options={{
                        style: {
                          base: {
                            fontSize: '16px',
                            color: '#F8FAFC',
                            '::placeholder': {
                              color: '#94A3B8',
                            },
                          },
                          invalid: {
                            color: '#EF4444',
                          },
                        },
                      }}
                    />
                  </Card>
                )}

                <label className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={(e) => setPaymentMethod(e.target.value as 'cod')}
                  />
                  Cash on Delivery (COD)
                </label>
              </div>

              <div className="flex justify-between">
                <Button variant="outline" type="button" onClick={handlePrev}>
                  Back to Delivery
                </Button>
                <Button type="submit" disabled={isProcessing}>
                  {isProcessing ? 'Processing...' : 'Place Order'}
                </Button>
              </div>
            </div>
          )}
        </div>

        <div>
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              {items.map((item) => (
                <div key={item._id} className="flex justify-between text-text-dim text-sm mb-2">
                  <span>
                    {item.title} x{item.quantity}
                  </span>
                  <span>${(item.price_snapshot * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="border-t border-border pt-2 mt-2">
                <div className="flex justify-between mb-1">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between mb-1">
                  <span>Delivery</span>
                  <span>${deliveryFee.toFixed(2)}</span>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between mb-1 text-success">
                    <span>Discount ({appliedCoupon.code})</span>
                    <span>-${discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-lg mt-2 pt-2 border-t">
                  <span>Total</span>
                  <span>${grandTotal.toFixed(2)}</span>
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium mb-2">Coupon Code</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value)}
                    placeholder="Enter code"
                    className="flex-1 px-3 py-2 border border-border rounded bg-surface text-text text-sm"
                  />
                  <Button type="button" size="sm" onClick={applyCoupon} disabled={!coupon.trim()}>
                    Apply
                  </Button>
                </div>
                {error && <p className="text-error text-xs mt-1">{error}</p>}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  );
};

const Checkout: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <Elements stripe={stripePromise}>
        <CheckoutForm />
      </Elements>
    </div>
  );
};

export default Checkout;