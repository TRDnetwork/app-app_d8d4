import React from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { useAuthStore } from '../../stores/authStore';
import { useCheckoutStore } from '../../stores/checkoutStore';

const AddressStep = ({ onNext }: { onNext: () => void }) => {
  const { user } = useAuthStore();
  const { address, setAddress } = useCheckoutStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const data = new FormData(form);
    const newAddress = {
      id: 'temp-' + Date.now(),
      type: data.get('type') as 'home' | 'work' | 'other',
      line1: data.get('line1') as string,
      line2: data.get('line2') as string,
      city: data.get('city') as string,
      state: data.get('state') as string,
      postalCode: data.get('postalCode') as string,
      country: data.get('country') as string,
      isDefault: !!data.get('isDefault'),
    };
    setAddress(newAddress);
    onNext();
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Shipping Address</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="type">Address Type</Label>
            <select
              id="type"
              name="type"
              defaultValue="home"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="home">Home</option>
              <option value="work">Work</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="country">Country</Label>
            <Input id="country" name="country" defaultValue="United States" required />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="line1">Street Address</Label>
          <Input id="line1" name="line1" placeholder="123 Main St" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="line2">Apartment, suite, etc. (optional)</Label>
          <Input id="line2" name="line2" placeholder="Apt 4B" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Input id="city" name="city" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="state">State</Label>
            <Input id="state" name="state" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="postalCode">ZIP Code</Label>
            <Input id="postalCode" name="postalCode" required />
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="isDefault"
            name="isDefault"
            className="rounded border-gray-300 text-primary focus:ring-primary"
          />
          <Label htmlFor="isDefault">Make this my default address</Label>
        </div>
        <Button type="submit" className="w-full">
          Continue to Delivery
        </Button>
      </form>
    </div>
  );
};

export default AddressStep;