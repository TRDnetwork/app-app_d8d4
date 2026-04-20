import React from 'react';
import { useCheckoutStore } from '../../stores/checkoutStore';
import { useAuthStore } from '../../stores/authStore';
import { useEffect } from 'react';
import { apiClient } from '../../lib/api';
import { Button } from '../ui/button';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';
import { Address } from '../../types';

const AddressSelector: React.FC = () => {
  const { addresses, selectedAddress, selectAddress, addAddress } = useCheckoutStore();
  const { user } = useAuthStore();

  useEffect(() => {
    const loadAddresses = async () => {
      if (!user) return;
      try {
        const data = await apiClient('/users/addresses');
        useCheckoutStore.getState().setAddresses(data.addresses);
      } catch (err) {
        console.error('Failed to load addresses:', err);
      }
    };
    loadAddresses();
  }, [user]);

  const handleAddNew = () => {
    const newAddress: Address = {
      id: 'new',
      type: 'home',
      line1: '',
      line2: '',
      city: '',
      state: '',
      postal_code: '',
      country: 'US',
      is_default: false,
      created_at: new Date().toISOString(),
    };
    addAddress(newAddress);
    selectAddress('new');
  };

  return (
    <RadioGroup
      value={selectedAddress?.id || ''}
      onValueChange={(id) => selectAddress(id)}
      className="space-y-3"
    >
      {addresses.map((addr) => (
        <div
          key={addr.id}
          className={cn(
            'flex items-start space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-muted/50',
            selectedAddress?.id === addr.id ? 'border-accent bg-muted/30' : 'border-border'
          )}
          onClick={() => selectAddress(addr.id)}
        >
          <RadioGroupItem value={addr.id} id={addr.id} className="mt-0.5" />
          <Label htmlFor={addr.id} className="flex-1 cursor-pointer">
            <div className="font-medium capitalize">{addr.type} Address</div>
            <div className="text-text_dim text-sm">
              {addr.line1}, {addr.line2 && `${addr.line2}, `} {addr.city}, {addr.state} {addr.postal_code}, {addr.country}
            </div>
          </Label>
        </div>
      ))}
      <Button type="button" variant="outline" onClick={handleAddNew} className="mt-2">
        + Add New Address
      </Button>
    </RadioGroup>
  );
};

export default AddressSelector;