import React, { useState } from 'react';
import { Button } from '../ui/button';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { useCheckoutStore } from '../../stores/checkoutStore';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const paymentMethods = [
  { id: 'card', label: 'Credit/Debit Card', icon: '💳' },
  { id: 'upi', label: 'UPI', icon: '📱' },
  { id: 'cod', label: 'Cash on Delivery', icon: '💵' },
];

export const PaymentStep: React.FC<{ onNext: () => void; onBack: () => void }> = ({ onNext, onBack }) => {
  const { paymentMethod, setPaymentMethod, cartTotal, deliveryOption } = useCheckoutStore();
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [nameOnCard, setNameOnCard] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePaymentMethodChange = (value: string) => {
    setPaymentMethod(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    if (paymentMethod === 'card') {
      try {
        const stripe = await stripePromise;
        const response = await fetch('/api/stripe/create-checkout-session', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            items: JSON.parse(localStorage.getItem('checkoutItems') || '[]'),
            deliveryOption,
            paymentMethod: 'card',
          }),
        });

        const session = await response.json();
        if (stripe) {
          const result = await stripe.redirectToCheckout({
            sessionId: session.id,
          });
          
          if (result.error) {
            console.error(result.error.message);
          }
        }
      } catch (error) {
        console.error('Payment error:', error);
      } finally {
        setIsProcessing(false);
      }
    } else {
      // For UPI and COD, proceed to order confirmation
      onNext();
    }
  };

  const totalAmount = cartTotal + (deliveryOption?.price || 0);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-2xl font-bold">Payment Method</h2>
      
      <RadioGroup
        value={paymentMethod}
        onValueChange={handlePaymentMethodChange}
        className="space-y-4"
      >
        {paymentMethods.map((method) => (
          <div
            key={method.id}
            className={`flex items-start space-x-3 p-4 border rounded-lg cursor-pointer transition-colors ${
              paymentMethod === method.id ? 'border-accent bg-accent/5' : 'border-border hover:border-accent/50'
            }`}
            onClick={() => handlePaymentMethodChange(method.id)}
          >
            <RadioGroupItem value={method.id} id={method.id} className="mt-1" />
            <div className="flex-1">
              <Label htmlFor={method.id} className="font-medium cursor-pointer flex items-center space-x-2">
                <span>{method.icon}</span>
                <span>{method.label}</span>
              </Label>
            </div>
          </div>
        ))}
      </RadioGroup>

      {paymentMethod === 'card' && (
        <div className="space-y-4 p-4 bg-surface/30 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nameOnCard">Name on Card</Label>
              <Input
                id="nameOnCard"
                value={nameOnCard}
                onChange={(e) => setNameOnCard(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cardNumber">Card Number</Label>
              <Input
                id="cardNumber"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                placeholder="1234 5678 9012 3456"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="expiry">Expiry Date</Label>
              <Input
                id="expiry"
                value={expiry}
                onChange={(e) => setExpiry(e.target.value)}
                placeholder="MM/YY"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cvv">CVV</Label>
              <Input
                id="cvv"
                value={cvv}
                onChange={(e) => setCvv(e.target.value)}
                placeholder="123"
                required
              />
            </div>
          </div>
        </div>
      )}

      {paymentMethod === 'upi' && (
        <div className="space-y-4 p-4 bg-surface/30 rounded-lg">
          <div className="space-y-2">
            <Label htmlFor="upiId">UPI ID</Label>
            <Input
              id="upiId"
              placeholder="yourname@upi"
              required
            />
          </div>
        </div>
      )}

      <div className="bg-surface/30 rounded-lg p-4">
        <div className="flex justify-between mb-2">
          <span className="text-text_dim">Subtotal</span>
          <span>₹{cartTotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span className="text-text_dim">Delivery</span>
          <span>{deliveryOption?.price === 0 ? 'Free' : `₹${deliveryOption?.price.toFixed(2)}`}</span>
        </div>
        <div className="flex justify-between text-lg font-bold pt-2 border-t border-border">
          <span>Total</span>
          <span>₹{totalAmount.toFixed(2)}</span>
        </div>
      </div>

      <div className="flex justify-between pt-6">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button type="submit" disabled={isProcessing || !paymentMethod}>
          {isProcessing ? 'Processing...' : paymentMethod === 'card' ? 'Pay Now' : 'Continue'}
        </Button>
      </div>
    </form>
  );
};