import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { useAuth } from '../../lib/auth';
import { apiClient } from '../../lib/api';

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

interface AddressStepProps {
  addresses: Address[];
  selectedAddress: string | null;
  onSelectAddress: (id: string) => void;
  onAddNew: () => void;
  onContinue: () => void;
}

const AddressStep: React.FC<AddressStepProps> = ({
  addresses,
  selectedAddress,
  onSelectAddress,
  onAddNew,
  onContinue,
}) => {
  const { user } = useAuth();
  const [isAdding, setIsAdding] = useState(false);
  const [newAddress, setNewAddress] = useState({
    label: 'Home',
    street: '',
    city: '',
    state: '',
    zip: '',
    country: 'India',
  });

  const handleSaveNew = async () => {
    try {
      const data = await apiClient('/users/me/addresses', {
        method: 'POST',
        body: JSON.stringify(newAddress),
      });
      onSelectAddress(data.address._id);
      setIsAdding(false);
      onContinue();
    } catch (err) {
      console.error('Failed to save address:', err);
    }
  };

  if (isAdding) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Add New Address</h3>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <Label>Label</Label>
            <Input value={newAddress.label} onChange={(e) => setNewAddress({ ...newAddress, label: e.target.value })} />
          </div>
          <div>
            <Label>Street</Label>
            <Input value={newAddress.street} onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>City</Label>
              <Input value={newAddress.city} onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })} />
            </div>
            <div>
              <Label>State</Label>
              <Input value={newAddress.state} onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>ZIP</Label>
              <Input value={newAddress.zip} onChange={(e) => setNewAddress({ ...newAddress, zip: e.target.value })} />
            </div>
            <div>
              <Label>Country</Label>
              <Input value={newAddress.country} onChange={(e) => setNewAddress({ ...newAddress, country: e.target.value })} />
            </div>
          </div>
        </div>
        <div className="flex space-x-4">
          <Button variant="outline" onClick={() => setIsAdding(false)}>Cancel</Button>
          <Button onClick={handleSaveNew}>Save & Continue</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Shipping Address</h2>
      <div className="space-y-4">
        {addresses.map((addr) => (
          <div
            key={addr._id}
            className={`p-4 border rounded-lg cursor-pointer transition-colors ${
              selectedAddress === addr._id ? 'border-primary bg-primary/5' : 'border-border hover:bg-muted'
            }`}
            onClick={() => onSelectAddress(addr._id)}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="font-medium">{addr.label}</p>
                <p className="text-sm text-muted-foreground">{addr.street}, {addr.city}, {addr.state} {addr.zip}</p>
                <p className="text-sm text-muted-foreground">{addr.country}</p>
              </div>
              {addr.is_default && (
                <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded-full">Default</span>
              )}
            </div>
          </div>
        ))}
        <Button variant="outline" className="w-full" onClick={onAddNew}>
          + Add New Address
        </Button>
      </div>
      <div className="flex justify-between">
        <div></div>
        <Button onClick={onContinue} disabled={!selectedAddress}>
          Continue to Delivery
        </Button>
      </div>
    </div>
  );
};

export default AddressStep;