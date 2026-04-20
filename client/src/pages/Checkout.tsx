import React, { useState } from 'react';
import { Button } from '../components/ui/button';
import AddressSelector from '../components/checkout/AddressSelector';
import DeliveryOptions from '../components/checkout/DeliveryOptions';
import PaymentMethods from '../components/checkout/PaymentMethods';
import OrderReview from '../components/checkout/OrderReview';
import { useCart } from '../context/CartContext';

const Checkout: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const { cart } = useCart();
  const [address, setAddress] = useState('');
  const [deliverySpeed, setDeliverySpeed] = useState('standard');
  const [paymentMethod, setPaymentMethod] = useState('card');

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
          <Button onClick={() => window.location.href = '/products'}>
            Continue Shopping
          </Button>
        </div>
      </div>
    );
  }

  const handleNext = () => {
    if (currentStep === 1 && !address) return;
    if (currentStep === 2 && !deliverySpeed) return;
    if (currentStep === 3 && !paymentMethod) return;
    
    setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* Progress Steps */}
          <div className="flex items-center justify-between mb-8">
            {['Address', 'Delivery', 'Payment', 'Review'].map((step, index) => (
              <div key={step} className={`flex items-center ${index < currentStep - 1 ? 'text-orange-500' : 'text-gray-500'}`}>
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center border-2 mr-2 ${
                    index < currentStep - 1
                      ? 'border-orange-500 bg-orange-500 text-white'
                      : index === currentStep - 1
                      ? 'border-orange-500 bg-transparent'