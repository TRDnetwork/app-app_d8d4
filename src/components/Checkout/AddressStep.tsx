import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { useAuth } from '../../lib/auth';
import { useCheckoutStore } from '../../stores/checkoutStore';

export const AddressStep: React.FC<{ onNext: () => void }> = ({ onNext }) => {
  const { user } = useAuth();
  const { address, setAddress } = useCheckoutStore();
  const [isAddingNew, setIsAddingNew] = useState(!address);
  const [formData, setFormData] = useState(address || {
    street: '',
    city: '',
    state: '',
    zip: '',
    country: 'India',
    phone: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    setAddress(formData);
    onNext();
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Shipping Address</h2>
      
      {user?.addresses?.length > 0 && !isAddingNew ? (
        <div className="space-y-4">
          {user.addresses.map((addr) => (
            <div
              key={addr._id}
              className="border border-border p-4 rounded-lg cursor-pointer hover:bg-surface/50"
              onClick={() => {
                setAddress(addr);
                onNext();
              }}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium">{addr.label || 'Home'}</p>
                  <p className="text-text_dim">{addr.street}, {addr.city}, {addr.state} {addr.zip}</p>
                  <p className="text-text_dim">{addr.country}</p>
                  <p className="text-text_dim">Phone: {addr.phone}</p>
                </div>
                {address?._id === addr._id && (
                  <div className="text-accent">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
            </div>
          ))}
          <Button variant="outline" onClick={() => setIsAddingNew(true)}>
            Add New Address
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="street">Street Address</Label>
              <Input
                id="street"
                name="street"
                value={formData.street}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">State</Label>
              <Input
                id="state"
                name="state"
                value={formData.state}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="zip">ZIP Code</Label>
              <Input
                id="zip"
                name="zip"
                value={formData.zip}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                name="country"
                value={formData.country}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="flex space-x-4">
            <Button onClick={handleSave}>Save & Continue</Button>
            {!address && (
              <Button variant="outline" onClick={() => setIsAddingNew(false)}>
                Cancel
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};