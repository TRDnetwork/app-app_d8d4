'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAppSelector } from '@/store';

export default function AddressForm({ onNext }) {
  const { user } = useAppSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    zip: '',
    country: 'United States',
    isDefault: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, this would save to backend and call onNext()
    console.log('Address saved:', formData);
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="text-sm font-medium">Full Name</label>
          <Input
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="sm:col-span-2">
          <label className="text-sm font-medium">Phone Number</label>
          <Input
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </div>
        <div className="sm:col-span-2">
          <label className="text-sm font-medium">Address Line 1</label>
          <Input
            name="addressLine1"
            value={formData.addressLine1}
            onChange={handleChange}
            required
          />
        </div>
        <div className="sm:col-span-2">
          <label className="text-sm font-medium">Address Line 2 (Optional)</label>
          <Input
            name="addressLine2"
            value={formData.addressLine2}
            onChange={handleChange}
          />
        </div>
        <div>
          <label className="text-sm font-medium">City</label>
          <Input
            name="city"
            value={formData.city}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label className="text-sm font-medium">State</label>
          <Input
            name="state"
            value={formData.state}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label className="text-sm font-medium">ZIP Code</label>
          <Input
            name="zip"
            value={formData.zip}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label className="text-sm font-medium">Country</label>
          <Input
            name="country"
            value={formData.country}
            onChange={handleChange}
            required
          />
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            id="isDefault"
            name="isDefault"
            checked={formData.isDefault}
            onChange={handleChange}
            className="h-4 w-4 rounded border-text_dim text-accent focus:ring-accent"
          />
          <label htmlFor="isDefault" className="ml-2 text-sm">
            Make this my default address
          </label>
        </div>
      </div>
      <div className="flex justify-end">
        <Button type="submit">Continue to Delivery</Button>
      </div>
    </form>
  );
}