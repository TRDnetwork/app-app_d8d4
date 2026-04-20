import React from 'react';
import { AddressSelector } from '../components/checkout/AddressSelector';
import { DeliveryOptions } from '../components/checkout/DeliveryOptions';
import { PaymentMethods } from '../components/checkout/PaymentMethods';
import { OrderReview } from '../components/checkout/OrderReview';
import { checkoutStore } from '../stores/checkoutStore';
import { Button } from '../components/ui/button';
import { useNavigate } from 'react-router-dom';

const steps = ['Address', 'Delivery', 'Payment', 'Review'];

const Checkout = () => {
  const [currentStep, setCurrentStep] = React.useState(0);
  const { address, deliverySpeed, paymentMethod } = checkoutStore();
  const navigate = useNavigate();

  const nextStep = () => {
    if (currentStep < steps.length - 1) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const handlePlaceOrder = () => {
    // Finalize order
    navigate('/order-confirmation');
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <AddressSelector />;
      case 1:
        return <DeliveryOptions />;
      case 2:
        return <PaymentMethods />;
      case 3:
        return <OrderReview onPlaceOrder={handlePlaceOrder} />;
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="flex justify-center mb-8">
        <div className="flex items-center">
          {steps.map((step, i) => (
            <React.Fragment key={step}>
              <div className={`px-4 py-2 rounded-full text-sm font-medium ${i <= currentStep ? 'bg-primary text-primary-foreground' : 'bg-muted text-text-dim'}`}>
                {step}
              </div>
              {i < steps.length - 1 && <div className="w-8 h-0.5 bg-border mx-2"></div>}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        {renderStep()}
      </div>

      <div className="flex justify-between mt-8">
        <Button variant="secondary" onClick={prevStep} disabled={currentStep === 0}>
          Previous
        </Button>
        {currentStep < steps.length - 1 ? (
          <Button onClick={nextStep} disabled={!address || !deliverySpeed || !paymentMethod}>
            Next
          </Button>
        ) : (
          <Button onClick={handlePlaceOrder}>Place Order</Button>
        )}
      </div>
    </div>
  );
};

export default Checkout;