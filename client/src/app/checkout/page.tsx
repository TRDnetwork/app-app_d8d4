'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import CheckoutForm from '@/components/CheckoutForm';
import DeliveryOptions from '@/components/DeliveryOptions';
import PaymentForm from '@/components/PaymentForm';
import { useToast } from '@/components/ui/use-toast';

const steps = ['Address', 'Delivery', 'Payment', 'Review'];

export default function CheckoutPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [address, setAddress] = useState(null);
  const [delivery, setDelivery] = useState(null);
  const [clientSecret, setClientSecret] = useState('');

  const handleAddressSubmit = async (formData) => {
    setAddress(formData);
    setCurrentStep(1);
  };

  const handleDeliverySelect = async (deliveryOption) => {
    setDelivery(deliveryOption);
    // Create Stripe Checkout Session
    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: [
            { id: '1', quantity: 1 },
            { id: '2', quantity: 2 },
          ],
          customerDetails: {
            name: `${address.firstName} ${address.lastName}`,
            email: address.email,
            address: {
              line1: address.address,
              line2: address.apartment,
              city: address.city,
              state: address.state,
              postal_code: address.zip,
              country: 'US',
            },
          },
          shippingCost: deliveryOption.price,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }

      const { clientSecret } = await response.json();
      setClientSecret(clientSecret);
      setCurrentStep(2);
    } catch (error) {
      toast({
        title: 'Payment Error',
        description: 'Failed to initialize payment. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handlePaymentSuccess = () => {
    router.push('/order-confirmation?session_id=' + new URLSearchParams(window.location.search).get('session_id'));
  };

  const handleBack = () => {
    if (currentStep === 2) {
      setCurrentStep(1);
    } else if (currentStep === 1) {
      setCurrentStep(0);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

        {/* Progress Steps */}
        <div className="flex items-center mb-8">
          {steps.map((step, i) => (
            <div
              key={step}
              className={`flex items-center ${
                i < steps.length - 1 ? 'flex-1' : ''
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  i <= currentStep
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {i + 1}
              </div>
              <span
                className={`ml-2 text-sm ${
                  i <= currentStep ? 'text-orange-500' : 'text-gray-500'
                }`}
              >
                {step}
              </span>
              {i < steps.length - 1 && (
                <div
                  className={`flex-1 h-px mx-4 ${
                    i < currentStep ? 'bg-orange-500' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              {currentStep === 0 && (
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-6">
                    Shipping Address
                  </h2>
                  <CheckoutForm onAddressSubmit={handleAddressSubmit} />
                </div>
              )}

              {currentStep === 1 && (
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-6">
                    Delivery Options
                  </h2>
                  <DeliveryOptions onDeliverySelect={handleDeliverySelect} />
                </div>
              )}

              {currentStep === 2 && clientSecret && (
                <PaymentForm
                  clientSecret={clientSecret}
                  onBack={handleBack}
                  onPaymentSuccess={handlePaymentSuccess}
                />
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-4">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Order Summary
              </h2>
              <div className="space-y-2 mb-4 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>$209.97</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>
                    {delivery?.price === 0
                      ? 'FREE'
                      : delivery
                      ? `$${delivery.price}`
                      : '$9.99'}
                  </span>
                </div>
                <div className="border-t pt-2 flex justify-between font-medium">
                  <span>Total</span>
                  <span>
                    $
                    {(
                      209.97 +
                      (delivery?.price || 9.99)
                    ).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}