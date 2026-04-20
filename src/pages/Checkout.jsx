import React from 'react';
import { useNavigate } from 'react-router-dom';
import { checkoutStore } from '../stores/checkoutStore';
import { cartStore } from '../stores/cartStore';
import { useToast } from '../components/ui/use-toast';
import { AddressSelector } from '../components/checkout/AddressSelector';
import { DeliveryOptions } from '../components/checkout/DeliveryOptions';
import { PaymentMethods } from '../components/checkout/PaymentMethods';
import { OrderReview } from '../components/checkout/OrderReview';
import { CheckoutForm } from '../components/checkout/CheckoutForm';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Skeleton } from '../components/ui/skeleton';

const Checkout = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { address, deliverySpeed, paymentMethod, reset } = checkoutStore();
  const { getSubtotal, couponCode, discount, getTotalItems } = cartStore();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const steps = [
    { id: 1, name: 'Address', complete: !!address },
    { id: 2, name: 'Delivery', complete: !!deliverySpeed },
    { id: 3, name: 'Payment', complete: !!paymentMethod },
    { id: 4, name: 'Review', complete: false },
  ];

  const handleNext = () => {
    if (step === 1 && !address) {
      toast({
        title: 'Address Required',
        description: 'Please select or add a delivery address.',
        variant: 'destructive',
      });
      return;
    }
    if (step === 2 && !deliverySpeed) {
      toast({
        title: 'Delivery Option Required',
        description: 'Please select a delivery speed.',
        variant: 'destructive',
      });
      return;
    }
    if (step === 3 && !paymentMethod) {
      toast({
        title: 'Payment Method Required',
        description: 'Please select a payment method.',
        variant: 'destructive',
      });
      return;
    }
    setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleReset = () => {
    reset();
    setStep(1);
    navigate('/cart');
  };

  if (getTotalItems() === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 font-display">Checkout</h1>

        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-8">
          {steps.map((s) => (
            <React.Fragment key={s.id}>
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                    s.id < step
                      ? 'bg-success text-primary-foreground'
                      : s.id === step
                      ? 'bg-accent text-primary-foreground'
                      : 'bg-muted text-text-dim'
                  }`}
                >
                  {s.id < step ? '✓' : s.id}
                </div>
                <span
                  className={`text-xs mt-2 ${
                    s.id <= step ? 'text-text' : 'text-text-dim'
                  }`}
                >
                  {s.name}
                </span>
              </div>
              {s.id < steps.length && (
                <div
                  className={`flex-1 h-0.5 mx-4 ${
                    s.id < step ? 'bg-success' : 'bg-border'
                  }`}
                />
              )}
            </React.Fragment>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {step === 1 && <AddressSelector />}
            {step === 2 && <DeliveryOptions />}
            {step === 3 && <PaymentMethods />}
            {step === 4 && <CheckoutForm />}
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <OrderReview onEditStep={setStep} />
                {step < 4 && (
                  <div className="flex space-x-4 pt-6">
                    {step > 1 && (
                      <Button variant="outline" onClick={handleBack} className="flex-1">
                        Back
                      </Button>
                    )}
                    <Button onClick={handleNext} className="flex-1">
                      {step === 3 ? 'Continue to Payment' : 'Next'}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;