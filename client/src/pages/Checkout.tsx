import React, { useState } from 'react';
import { useAuth } from '../stores/authStore';
import { useCart } from '../stores/cartStore';
import AddressSelector from '../components/AddressSelector';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { useNavigate } from 'react-router-dom';
import { useAnalytics } from '../lib/analytics';

const Checkout: React.FC = () => {
  const { user } = useAuth();
  const { items, total } = useCart();
  const navigate = useNavigate();
  const { trackFormSubmit, trackPurchase } = useAnalytics();

  const [step, setStep] = useState(1);
  const [address, setAddress] = useState('');
  const [deliverySpeed, setDeliverySpeed] = useState('standard');
  const [paymentMethod, setPaymentMethod] = useState('card');

  const handleNext = () => setStep((prev) => prev + 1);
  const handlePrev = () => setStep((prev) => prev - 1);

  const handleSubmit = () => {
    trackFormSubmit('checkout_complete');
    trackPurchase('ORDER123', total + 5.99, 'USD');
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
                  <input
                    type="radio"
                    name="payment"
                    value="card"
                    checked={paymentMethod === 'card'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  Credit/Debit Card
                </label>
                <label className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="payment"
                    value="upi"
                    checked={paymentMethod === 'upi'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  UPI
                </label>
                <label className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  Cash on Delivery
                </label>
              </div>
              <div className="flex justify-between">
                <Button variant="outline" onClick={handlePrev}>
                  Back to Delivery
                </Button>
                <Button onClick={() => setStep(4)}>Review Order</Button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Review Order</h2>
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Delivery</span>
                      <span>${deliverySpeed === 'standard' ? '5.99' : '12.99'}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold pt-2 border-t">
                      <span>Total</span>
                      <span>${(total + (deliverySpeed === 'standard' ? 5.99 : 12.99)).toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <div className="flex justify-between">
                <Button variant="outline" onClick={handlePrev}>
                  Back to Payment
                </Button>
                <Button onClick={handleSubmit}>Place Order</Button>
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4">Order Summary</h3>
              {items.map((item) => (
                <div key={item._id} className="flex justify-between text-sm mb-2">
                  <span>{item.title} (x{item.quantity})</span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>${(total + (deliverySpeed === 'standard' ? 5.99 : 12.99)).toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
```

```typescript