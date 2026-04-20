import React, { useState } from 'react';
import { useCheckoutStore } from '../../stores/checkoutStore';
import { Button } from '../ui/button';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';
import { CreditCard, Wallet, Smartphone, Lock } from 'lucide-react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { formatCurrency } from '../../lib/utils';

const PaymentMethods: React.FC = () => {
  const { paymentMethod, selectPaymentMethod } = useCheckoutStore();
  const stripe = useStripe();
  const elements = useElements();
  const [cardError, setCardError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [savedCards] = useState([
    { id: 'card_1', last4: '4242', brand: 'visa', is_default: true },
    { id: 'card_2', last4: '5555', brand: 'mastercard', is_default: false },
  ]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setProcessing(true);
    setCardError(null);

    const cardElement = elements.getElement(CardElement);
    const { error, paymentMethod: pm } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement!,
    });

    if (error) {
      setCardError(error.message || 'An error occurred');
      setProcessing(false);
      return;
    }

    useCheckoutStore.getState().setPaymentMethod({
      id: pm.id,
      type: 'card',
      last4: pm.card?.last4 || '',
      brand: pm.card?.brand || 'card',
      is_default: false,
    });

    setProcessing(false);
  };

  return (
    <RadioGroup
      value={paymentMethod?.type || ''}
      onValueChange={(type) => selectPaymentMethod(type)}
      className="space-y-4"
    >
      {/* Credit/Debit Card */}
      <div
        className={cn(
          'flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:bg-muted/50',
          paymentMethod?.type === 'card' ? 'border-accent bg-muted/30' : 'border-border'
        )}
        onClick={() => selectPaymentMethod('card')}
      >
        <div className="flex items-center space-x-3">
          <RadioGroupItem value="card" id="card" />
          <Label htmlFor="card" className="cursor-pointer">
            <div className="flex items-center space-x-2">
              <CreditCard className="h-5 w-5 text-text_dim" />
              <span className="font-medium">Credit/Debit Card</span>
            </div>
            <div className="text-text_dim text-sm mt-1">Pay securely with your card</div>
          </Label>
        </div>
      </div>

      {/* Saved Cards */}
      {paymentMethod?.type === 'card' && savedCards.length > 0 && (
        <div className="ml-8 space-y-2">
          <p className="text-sm text-text_dim mb-2">Saved Cards</p>
          {savedCards.map((card) => (
            <div
              key={card.id}
              className={cn(
                'flex items-center justify-between p-3 border rounded cursor-pointer hover:bg-muted/50',
                paymentMethod?.id === card.id ? 'border-accent bg-muted/30' : 'border-border'
              )}
              onClick={(e) => {
                e.stopPropagation();
                useCheckoutStore.getState().setPaymentMethod({
                  id: card.id,
                  type: 'card',
                  last4: card.last4,
                  brand: card.brand,
                  is_default: card.is_default,
                });
              }}
            >
              <div className="flex items-center space-x-3">
                <RadioGroupItem 
                  value={card.id} 
                  id={card.id} 
                  className="mt-0.5" 
                  onClick={(e) => e.stopPropagation()}
                />
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-5 bg-muted rounded flex items-center justify-center text-xs font-medium text-text_dim uppercase">
                    {card.brand}
                  </div>
                  <span>•••• {card.last4}</span>
                  {card.is_default && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-accent/20 text-accent">
                      Default
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add New Card */}
      {paymentMethod?.type === 'card' && (
        <form onSubmit={handleSubmit} className="ml-8 mt-4 space-y-4 p-4 border rounded-lg bg-muted/30">
          <h4 className="font-medium flex items-center space-x-2">
            <Lock className="h-4 w-4 text-text_dim" />
            <span>Secure Card Details</span>
          </h4>
          <div className="p-3 bg-background border border-border rounded">
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: '16px',
                    color: '#F8FAFC',
                    fontFamily: 'Inter, sans-serif',
                    '::placeholder': {
                      color: '#94A3B8',
                    },
                  },
                  invalid: {
                    color: '#EF4444',
                  },
                },
                hidePostalCode: true,
              }}
            />
          </div>
          {cardError && <div className="text-destructive text-sm">{cardError}</div>}
          <Button
            type="submit"
            disabled={!stripe || processing}
            className="bg-accent hover:bg-orange-600"
          >
            {processing ? 'Processing...' : 'Add Card'}
          </Button>
        </form>
      )}

      {/* UPI */}
      <div
        className={cn(
          'flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:bg-muted/50',
          paymentMethod?.type === 'upi' ? 'border-accent bg-muted/30' : 'border-border'
        )}
        onClick={() => selectPaymentMethod('upi')}
      >
        <div className="flex items-center space-x-3">
          <RadioGroupItem value="upi" id="upi" />
          <Label htmlFor="upi" className="cursor-pointer">
            <div className="flex items-center space-x-2">
              <Wallet className="h-5 w-5 text-text_dim" />
              <span className="font-medium">UPI</span>
            </div>
            <div className="text-text_dim text-sm mt-1">Pay via UPI apps</div>
          </Label>
        </div>
      </div>

      {/* Cash on Delivery */}
      <div
        className={cn(
          'flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:bg-muted/50',
          paymentMethod?.type === 'cod' ? 'border-accent bg-muted/30' : 'border-border'
        )}
        onClick={() => selectPaymentMethod('cod')}
      >
        <div className="flex items-center space-x-3">
          <RadioGroupItem value="cod" id="cod" />
          <Label htmlFor="cod" className="cursor-pointer">
            <div className="flex items-center space-x-2">
              <Smartphone className="h-5 w-5 text-text_dim" />
              <span className="font-medium">Cash on Delivery</span>
            </div>
            <div className="text-text_dim text-sm mt-1">Pay when you receive the order</div>
          </Label>
        </div>
      </div>
    </RadioGroup>
  );
};

export default PaymentMethods;
```

```typescript