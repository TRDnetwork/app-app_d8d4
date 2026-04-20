import React from 'react';
import { Button } from './ui/button';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';
import { Plus } from 'lucide-react';

interface Address {
  id: string;
  label: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

interface AddressSelectorProps {
  addresses: Address[];
  selected: string | null;
  onSelect: (id: string) => void;
  onAddNew: () => void;
}

const AddressSelector: React.FC<AddressSelectorProps> = ({
  addresses,
  selected,
  onSelect,
  onAddNew,
}) => {
  return (
    <div className="space-y-3">
      <RadioGroup value={selected || ''} onValueChange={onSelect} className="space-y-3">
        {addresses.map((addr) => (
          <div
            key={addr.id}
            className={`
              flex items-start space-x-3 p-4 border rounded-lg cursor-pointer
              transition-all duration-200
              ${selected === addr.id 
                ? 'border-accent bg-accent/5 shadow-sm' 
                : 'border-border hover:border-accent/50 hover:bg-muted/30'
              }
            `}
            onClick={() => onSelect(addr.id)}
            role="radio"
            aria-checked={selected === addr.id}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                onSelect(addr.id);
              }
            }}
          >
            <RadioGroupItem 
              value={addr.id} 
              id={addr.id} 
              className="mt-1"
              aria-label={`Select address: ${addr.label}`}
            />
            <div className="flex-1 min-w-0">
              <Label 
                htmlFor={addr.id} 
                className="font-medium cursor-pointer block"
              >
                {addr.label}
              </Label>
              <p className="text-text_dim text-sm mt-1">
                {addr.street}, {addr.city}, {addr.state} {addr.zip}, {addr.country}
              </p>
            </div>
          </div>
        ))}
      </RadioGroup>
      
      <Button 
        type="button" 
        variant="outline" 
        onClick={onAddNew}
        className="w-full flex items-center justify-center space-x-2 py-3"
        aria-label="Add new address"
      >
        <Plus className="h-4 w-4" />
        <span>Add New Address</span>
      </Button>
    </div>
  );
};

export default AddressSelector;