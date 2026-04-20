import React from 'react';
import { useCheckoutStore } from '../../stores/checkoutStore';
import { Button } from '../ui/button';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const PaymentMethods: React.FC = () => {
  const { paymentMethod, selectPaymentMethod } = useCheckoutStore();
  const stripe = useStripe();
  const elements = useElements();
  const [cardError, setCardError] = React.useState<string | null>(null);
  const [processing, setProcessing] = React.useState(false);

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
      type: 'stripe',
      last4: pm.card?.last4 || '',
      brand: pm.card?.brand || 'card',
    });

    setProcessing(false);
  };

  return (
    <RadioGroup
      value={paymentMethod?.type || ''}
      onValueChange={(type) => selectPaymentMethod(type)}
      className="space-y-4"
    >
      <div
        className={cn(
          'flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:bg-muted/50',
          paymentMethod?.type === 'stripe' ? 'border-accent bg-muted/30' : 'border-border'
        )}
        onClick={() => selectPaymentMethod('stripe')}
      >
        <div className="flex items-center space-x-3">
          <RadioGroupItem value="stripe" id="stripe" />
          <Label htmlFor="stripe" className="cursor-pointer">
            <div className="font-medium">Credit/Debit Card</div>
            <div className="text-text_dim text-sm">Pay securely with your card</div>
          </Label>
        </div>
      </div>

      {paymentMethod?.type === 'stripe' && (
        <form onSubmit={handleSubmit} className="mt-4 space-y-4 p-4 border rounded-lg">
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
            className="p-3 bg-background border border-border rounded"
          />
          {cardError && <div className="text-error text-sm">{cardError}</div>}
          <Button
            type="submit"
            disabled={!stripe || processing}
            className="bg-accent hover:bg-orange-600"
          >
            {processing ? 'Processing...' : 'Save Card'}
          </Button>
        </form>
      )}

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
            <div className="font-medium">UPI</div>
            <div className="text-text_dim text-sm">Pay via UPI apps</div>
          </Label>
        </div>
      </div>

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
            <div className="font-medium">Cash on Delivery</div>
            <div className="text-text_dim text-sm">Pay when you receive the order</div>
          </Label>
        </div>
      </div>
    </RadioGroup>
  );
};

export default PaymentMethods;