import React, { useState } from 'react';
import { useCheckoutStore } from '../../stores/checkoutStore';
import AddressSelector from './AddressSelector';
import DeliveryOptions from './DeliveryOptions';
import PaymentMethods from './PaymentMethods';
import OrderReview from './OrderReview';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { useCartStore } from '../../stores/cartStore';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const steps = [
  { id: 'address', title: 'Shipping Address', description: 'Select or add your delivery address' },
  { id: 'delivery', title: 'Delivery Method', description: 'Choose your preferred delivery speed' },
  { id: 'payment', title: 'Payment Method', description: 'Select how you want to pay' },
  { id: 'review', title: 'Review Order', description: 'Check your order details before placing' },
];

const CheckoutForm: React.FC = () => {
  const { currentStep, goToNextStep, goToPreviousStep, validateStep } = useCheckoutStore();
  const { itemCount, total } = useCartStore();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNext = async () => {
    const isValid = validateStep(currentStep);
    if (!isValid) return;

    if (currentStep < steps.length) {
      goToNextStep();
    } else {
      // Final step: create order
      setIsSubmitting(true);
      try {
        // In a real app, this would call the API to create the order
        await new Promise(resolve => setTimeout(resolve, 2000));
        navigate('/order-confirmation');
      } catch (error) {
        console.error('Order creation failed:', error);
      } finally {
        setIsSubmitting(false);
      }
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
            key={step.id}
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
            <span className="text-sm font-medium hidden md:inline">{step.title}</span>
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
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{steps[currentStep - 1].title}</CardTitle>
                  <p className="text-text_dim text-sm mt-1">{steps[currentStep - 1].description}</p>
                </div>
                <div className="text-sm text-text_dim">
                  Step {currentStep} of {steps.length}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  {currentStep === 1 && <AddressSelector />}
                  {currentStep === 2 && <DeliveryOptions />}
                  {currentStep === 3 && <PaymentMethods />}
                  {currentStep === 4 && <OrderReview />}
                </motion.div>
              </AnimatePresence>
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
                <span>
                  {useCheckoutStore.getState().deliveryOption?.price === 0 
                    ? 'Free' 
                    : formatCurrency(useCheckoutStore.getState().deliveryOption?.price || 0)
                  }
                </span>
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
                  <Button 
                    variant="outline" 
                    onClick={handleBack} 
                    className="flex-1"
                    disabled={isSubmitting}
                  >
                    Back
                  </Button>
                )}
                <Button 
                  onClick={handleNext} 
                  className="flex-1 bg-accent hover:bg-orange-600"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Processing...' : currentStep === steps.length ? 'Place Order' : 'Continue'}
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
```

```typescript