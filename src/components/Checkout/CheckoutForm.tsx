import React from 'react';
import { useCheckoutStore } from '../../stores/checkoutStore';
import AddressSelector from '../AddressSelector';
import DeliveryOptions from '../DeliveryOptions';
import PaymentMethods from '../PaymentMethods';
import OrderReview from '../OrderReview';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { useCartStore } from '../../stores/cartStore';
import { useNavigate } from 'react-router-dom';
import { analytics } from '../../lib/analytics';

const steps = ['Address', 'Delivery', 'Payment', 'Review'];

const CheckoutForm: React.FC = () => {
  const { currentStep, goToNextStep, goToPreviousStep } = useCheckoutStore();
  const { itemCount, total } = useCartStore();
  const navigate = useNavigate();

  const handleNext = () => {
    if (currentStep < steps.length) {
      goToNextStep();
      // Track checkout step
      analytics.trackCheckoutStep(currentStep + 1);
    } else {
      // Final step: create order
      navigate('/order-confirmation');
    }
  };

  const handleBack = () => {
    if (currentStep > 1) goToPreviousStep();
  };

  if (itemCount === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>

      {/* Progress Steps */}
      <div className="flex justify-between mb-8">
        {steps.map((step, index) => (
          <div
            key={step}
            className={`flex-1 text-center p-2 relative ${
              index + 1 <= currentStep ? 'text-accent' : 'text-text_dim'
            }`}
          >
            <div
              className={`inline-flex items-center justify-center w-8 h-8 rounded-full mb-2 ${
                index + 1 <= currentStep ? 'bg-accent text-background' : 'bg-border text-text_dim'
              }`}
            >
              {index + 1}
            </div>
            <span className="text-sm font-medium">{step}</span>
            {index < steps.length - 1 && (
              <div
                className={`absolute top-4 left-1/2 w-full h-0.5 -translate-x-1/2 ${
                  index + 1 < currentStep ? 'bg-accent' : 'bg-border'
                }`}
                style={{ width: 'calc(100% + 4rem)' }}
              />
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>{steps[currentStep - 1]}</CardTitle>
            </CardHeader>
            <CardContent>
              {currentStep === 1 && <AddressSelector />}
              {currentStep === 2 && <DeliveryOptions />}
              {currentStep === 3 && <PaymentMethods />}
              {currentStep === 4 && <OrderReview />}
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-text_dim">Subtotal</span>
                <span>{formatCurrency(total)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text_dim">Delivery</span>
                <span>{useCheckoutStore.getState().deliveryOption?.price === 0 ? 'Free' : formatCurrency(useCheckoutStore.getState().deliveryOption?.price || 0)}</span>
              </div>
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>
                  {formatCurrency(
                    total + (useCheckoutStore.getState().deliveryOption?.price || 0)
                  )}
                </span>
              </div>
              <div className="flex space-x-4">
                {currentStep > 1 && (
                  <Button variant="outline" onClick={handleBack} className="flex-1">
                    Back
                  </Button>
                )}
                <Button onClick={handleNext} className="flex-1 bg-accent hover:bg-orange-600">
                  {currentStep === steps.length ? 'Place Order' : 'Continue'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CheckoutForm;