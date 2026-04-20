import React, { useState } from 'react';
import { Button } from './ui/button';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';
import { Plus, Edit } from 'lucide-react';

interface Address {
  id: string;
  label: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  phone: string;
}

interface AddressSelectorProps {
  addresses: Address[];
  selected: string | null;
  onSelect: (id: string) => void;
  onAddNew: () => void;
  onEdit?: (id: string) => void;
}

const AddressSelector: React.FC<AddressSelectorProps> = ({
  addresses,
  selected,
  onSelect,
  onAddNew,
  onEdit,
}) => {
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newAddress, setNewAddress] = useState({
    label: '',
    street: '',
    city: '',
    state: '',
    zip: '',
    country: 'India',
    phone: '',
  });

  const handleAddNew = () => {
    setIsAddingNew(true);
  };

  const handleSaveNew = () => {
    // In a real app, this would save to the server
    console.log('Saving new address:', newAddress);
    setIsAddingNew(false);
    onAddNew();
  };

  const handleCancelNew = () => {
    setIsAddingNew(false);
    setNewAddress({
      label: '',
      street: '',
      city: '',
      state: '',
      zip: '',
      country: 'India',
      phone: '',
    });
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Shipping Address</h3>
      
      {isAddingNew ? (
        <div className="space-y-4 p-4 border border-border rounded-lg">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="label">Label</Label>
              <input
                id="label"
                type="text"
                value={newAddress.label}
                onChange={(e) => setNewAddress({ ...newAddress, label: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded bg-background text-foreground"
                placeholder="Home, Work, etc."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <input
                id="phone"
                type="tel"
                value={newAddress.phone}
                onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded bg-background text-foreground"
                placeholder="+91 XXXXX XXXXX"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="street">Street Address</Label>
            <input
              id="street"
              type="text"
              value={newAddress.street}
              onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
              className="w-full px-3 py-2 border border-border rounded bg-background text-foreground"
              placeholder="123 Main St"
            />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <input
                id="city"
                type="text"
                value={newAddress.city}
                onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded bg-background text-foreground"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">State</Label>
              <input
                id="state"
                type="text"
                value={newAddress.state}
                onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded bg-background text-foreground"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="zip">ZIP Code</Label>
              <input
                id="zip"
                type="text"
                value={newAddress.zip}
                onChange={(e) => setNewAddress({ ...newAddress, zip: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded bg-background text-foreground"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="country">Country</Label>
            <select
              id="country"
              value={newAddress.country}
              onChange={(e) => setNewAddress({ ...newAddress, country: e.target.value })}
              className="w-full px-3 py-2 border border-border rounded bg-background text-foreground"
            >
              <option value="India">India</option>
              <option value="United States">United States</option>
              <option value="Canada">Canada</option>
              <option value="United Kingdom">United Kingdom</option>
            </select>
          </div>
          
          <div className="flex space-x-4 pt-4">
            <Button onClick={handleSaveNew}>Save Address</Button>
            <Button variant="outline" onClick={handleCancelNew}>Cancel</Button>
          </div>
        </div>
      ) : (
        <RadioGroup
          value={selected || ''}
          onValueChange={onSelect}
          className="space-y-3"
        >
          {addresses.map((addr) => (
            <div
              key={addr.id}
              className={cn(
                "flex items-start space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-muted/50",
                selected === addr.id ? "border-accent bg-muted/30" : "border-border"
              )}
              onClick={() => onSelect(addr.id)}
              role="button"
              tabIndex={0}
              aria-label={`${addr.label}: ${addr.street}, ${addr.city}, ${addr.state} ${addr.zip}, ${addr.country}`}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  onSelect(addr.id);
                }
              }}
            >
              <RadioGroupItem value={addr.id} id={addr.id} className="mt-0.5" />
              <div className="flex-1">
                <div className="flex justify-between">
                  <Label htmlFor={addr.id} className="font-medium cursor-pointer">
                    {addr.label}
                  </Label>
                  {onEdit && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit(addr.id);
                      }}
                      className="text-accent hover:text-accent-foreground p-1"
                      aria-label={`Edit ${addr.label} address`}
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                  )}
                </div>
                <div className="text-text_dim text-sm mt-1">
                  {addr.street}, {addr.city}, {addr.state} {addr.zip}, {addr.country}
                </div>
                <div className="text-text_dim text-sm mt-1">
                  Phone: {addr.phone}
                </div>
              </div>
            </div>
          ))}
          
          <Button
            type="button"
            variant="outline"
            onClick={handleAddNew}
            className="w-full mt-2 flex items-center justify-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Add New Address</span>
          </Button>
        </RadioGroup>
      )}
    </div>
  );
};

export default AddressSelector;