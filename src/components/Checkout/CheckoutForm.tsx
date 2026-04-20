import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { api } from '@/lib/api';
import { useNavigate } from 'react-router-dom';

interface Address {
  id: string;
  label: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  is_default: boolean;
}

const CheckoutForm: React.FC = () => {
  const [step, setStep] = useState<'address' | 'delivery' | 'payment'>('address');
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);
  const [newAddress, setNewAddress] = useState({
    label: '',
    street: '',
    city: '',
    state: '',
    zip: '',
    country: 'India',
  });
  const [deliverySpeed, setDeliverySpeed] = useState<'standard' | 'express' | 'same-day'>('standard');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const [addresses, setAddresses] = useState<Address[]>([
    {
      id: '1',
      label: 'Home',
      street: '123 Main St',
      city: 'Mumbai',
      state: 'Maharashtra',
      zip: '400001',
      country: 'India',
      is_default: true,
    },
    {
      id: '2',
      label: 'Office',
      street: '456 Business Ave',
      city: 'Mumbai',
      state: 'Maharashtra',
      zip: '400002',
      country: 'India',
      is_default: false,
    },
  ]);

  const handleAddNewAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // In real app: await api.user.addAddress(newAddress);
      const id = (addresses.length + 1).toString();
      const address = { ...newAddress, id, is_default: addresses.length === 0 };
      setAddresses([...addresses, address]);
      setSelectedAddress(id);
      setNewAddress({
        label: '',
        street: '',
        city: '',
        state: '',
        zip: '',
        country: 'India',
      });
      setStep('delivery');
      toast({
        title: 'Success',
        description: 'New address added.',
      });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to add address',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleContinueToDelivery = () => {
    if (!selectedAddress) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Please select an address',
      });
      return;
    }
    setStep('delivery');
  };

  const handleContinueToPayment = () => {
    setStep('payment');
  };

  const handlePlaceOrder = async () => {
    setLoading(true);
    try {
      // In real app: call /api/orders to create order
      // Then call /api/stripe/create-checkout-session
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify({
          deliverySpeed,
          addressId: selectedAddress,
        }),
      });

      if (!response.ok) throw new Error('Failed to create checkout session');

      const { sessionId } = await response.json();
      // Redirect to Stripe Checkout
      const stripe = (window as any).Stripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
      const { error } = await stripe.redirectToCheckout({ sessionId });

      if (error) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: error.message,
        });
      }
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to process payment',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Checkout</CardTitle>
      </CardHeader>
      <CardContent>
        {step === 'address' && (
          <div className="space-y-6">
            <h3 className="text-lg font-medium">Select Shipping Address</h3>
            <div className="space-y-4">
              {addresses.map((address) => (
                <div
                  key={address.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedAddress === address.id ? 'border-accent bg-accent/5' : 'border-border hover:bg-muted'
                  }`}
                  onClick={() => setSelectedAddress(address.id)}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium">{address.label}</p>
                      <p className="text-text-dim text-sm">
                        {address.street}, {address.city}, {address.state} {address.zip}
                      </p>
                      <p className="text-text-dim text-sm">{address.country}</p>
                    </div>
                    {address.is_default && (
                      <span className="text-xs bg-accent text-black px-2 py-1 rounded-full">Default</span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <Button
              variant="outline"
              className="w-full"
              onClick={() => setStep('address-new')}
            >
              + Add New Address
            </Button>

            {step === 'address-new' && (
              <form onSubmit={handleAddNewAddress} className="space-y-4 mt-6 p-4 border border-border rounded-lg">
                <h4 className="font-medium">Add New Address</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="label">Label</Label>
                    <Input
                      id="label"
                      value={newAddress.label}
                      onChange={(e) => setNewAddress({ ...newAddress, label: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zip">ZIP Code</Label>
                    <Input
                      id="zip"
                      value={newAddress.zip}
                      onChange={(e) => setNewAddress({ ...newAddress, zip: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="street">Street</Label>
                  <Input
                    id="street"
                    value={newAddress.street}
                    onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                    required
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={newAddress.city}
                      onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      value={newAddress.state}
                      onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Input id="country" value={newAddress.country} disabled />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button type="submit" disabled={loading}>
                    {loading ? 'Saving...' : 'Save Address'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep('address')}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            )}

            <div className="flex justify-between">
              <div />
              <Button onClick={handleContinueToDelivery}>Continue</Button>
            </div>
          </div>
        )}

        {step === 'delivery' && (
          <div className="space-y-6">
            <h3 className="text-lg font-medium">Choose Delivery Speed</h3>
            <div className="space-y-4">
              {[
                { id: 'standard', label: 'Standard Delivery', time: '3-5 business days', price: 'Free' },
                { id: 'express', label: 'Express Delivery', time: '1-2 business days', price: '₹99' },
                { id: 'same-day', label: 'Same Day Delivery', time: 'Today', price: '₹199' },
              ].map((option) => (
                <div
                  key={option.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    deliverySpeed === option.id ? 'border-accent bg-accent/5' : 'border-border hover:bg-muted'
                  }`}
                  onClick={() => setDeliverySpeed(option.id as any)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{option.label}</p>
                      <p className="text-text-dim text-sm">{option.time}</p>
                    </div>
                    <span className="font-medium">{option.price}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep('address')}>
                Back
              </Button>
              <Button onClick={handleContinueToPayment}>Continue to Payment</Button>
            </div>
          </div>
        )}

        {step === 'payment' && (
          <div className="space-y-6">
            <h3 className="text-lg font-medium">Payment Method</h3>
            <div className="space-y-4">
              <div className="p-4 border border-border rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <input
                      type="radio"
                      id="card"
                      name="payment"
                      defaultChecked
                      className="h-4 w-4 text-accent"
                    />
                    <label htmlFor="card" className="font-medium">Credit/Debit Card</label>
                  </div>
                  <div className="flex space-x-2">
                    <div className="h-6 w-10 bg-muted rounded"></div>
                    <div className="h-6 w-10 bg-muted rounded"></div>
                    <div className="h-6 w-16 bg-muted rounded"></div>
                  </div>
                </div>
              </div>

              <div className="p-4 border border-border rounded-lg">
                <div className="flex items-center space-x-3">
                  <input type="radio" id="upi" name="payment" className="h-4 w-4 text-accent" />
                  <label htmlFor="upi" className="font-medium">UPI</label>
                </div>
              </div>

              <div className="p-4 border border-border rounded-lg">
                <div className="flex items-center space-x-3">
                  <input type="radio" id="cod" name="payment" className="h-4 w-4 text-accent" />
                  <label htmlFor="cod" className="font-medium">Cash on Delivery</label>
                </div>
              </div>
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep('delivery')}>
                Back
              </Button>
              <Button onClick={handlePlaceOrder} disabled={loading}>
                {loading ? 'Processing...' : 'Place Order'}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CheckoutForm;