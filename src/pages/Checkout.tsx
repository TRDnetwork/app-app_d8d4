import React, { useState, useEffect } from 'react';
import { useCartStore } from '../stores/cart';
import { useAuth } from '../lib/auth';
import { apiClient } from '../lib/api';
import AddressStep from '../components/Checkout/AddressStep';
import DeliveryStep from '../components/Checkout/DeliveryStep';
import PaymentStep from '../components/Checkout/PaymentStep';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

// Load Stripe publishable key from environment
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '');

interface Address {
  _id: string;
  label: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  is_default: boolean;
}

const CheckoutPage = () => {
  const [step, setStep] = useState(1);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);
  const [selectedDelivery, setSelectedDelivery] = useState<string>('');
  const [deliveryCost, setDeliveryCost] = useState(0);

  const { items: cartItems } = useCartStore();
  const { user } = useAuth();

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = subtotal + deliveryCost;

  useEffect(() => {
    const fetchAddresses = async () => {
      if (!user) return;
      try {
        const data = await apiClient('/users/me/addresses');
        setAddresses(data.addresses);
        const defaultAddr = data.addresses.find((addr: Address) => addr.is_default);
        if (defaultAddr) {
          setSelectedAddress(defaultAddr._id);
        }
      } catch (err) {
        console.error('Failed to load addresses:', err);
      }
    };
    fetchAddresses();
  }, [user]);

  const handleSelectAddress = (id: string) => {
    setSelectedAddress(id);
  };

  const handleAddNewAddress = () => {
    // Handled in AddressStep
  };

  const handleContinueToDelivery = () => {
    if (!selectedAddress) return;
    setStep(2);
  };

  const handleSelectDelivery = (id: string) => {
    setSelectedDelivery(id);
    const option = [
      { id: 'standard', price: 0 },
      { id: 'express', price: 9.99 },
      { id: 'same-day', price: 19.99 },
    ].find(opt => opt.id === id);
    setDeliveryCost(option?.price || 0);
  };

  const handleContinueToPayment = () => {
    if (!selectedDelivery) return;
    setStep(3);
  };

  const handleBackToAddress = () => {
    setStep(1);
  };

  const handleBackToDelivery = () => {
    setStep(2);
  };

  if (!user) {
    return <div>Please log in to continue checkout.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {step === 1 && (
            <AddressStep
              addresses={addresses}
              selectedAddress={selectedAddress}
              onSelectAddress={handleSelectAddress}
              onAddNew={handleAddNewAddress}
              onContinue={handleContinueToDelivery}
            />
          )}
          {step === 2 && (
            <DeliveryStep
              selectedDelivery={selectedDelivery}
              onSelectDelivery={handleSelectDelivery}
              onBack={handleBackToAddress}
              onContinue={handleContinueToPayment}
            />
          )}
          {step === 3 && (
            <Elements stripe={stripePromise}>
              <PaymentStep
                onBack={handleBackToDelivery}
                onContinue={() => {}} // Final step handled by Stripe redirect
                amount={total}
              />
            </Elements>
          )}
        </div>
        <div className="lg:col-span-1">
          <div className="sticky top-24 bg-card p-6 rounded-lg border">
            <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
            <div className="space-y-2 mb-4">
              {cartItems.map((item) => (
                <div key={item._id} className="flex justify-between text-sm">
                  <span>{item.title} × {item.quantity}</span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="border-t pt-2 space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery</span>
                <span>{deliveryCost === 0 ? 'Free' : `$${deliveryCost.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between font-semibold text-base pt-2">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;