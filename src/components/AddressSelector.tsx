import React from 'react';
import { Button } from './ui/button';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';

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
    <RadioGroup value={selected || ''} onValueChange={onSelect} className="space-y-3">
      {addresses.map((addr) => (
        <div
          key={addr.id}
          className={cn(
            'flex items-start space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-muted/50',
            selected === addr.id ? 'border-accent bg-muted/30' : 'border-border'
          )}
          onClick={() => onSelect(addr.id)}
        >
          <RadioGroupItem value={addr.id} id={addr.id} className="mt-0.5" />
          <Label htmlFor={addr.id} className="flex-1 cursor-pointer">
            <div className="font-medium">{addr.label}</div>
            <div className="text-text_dim text-sm">
              {addr.street}, {addr.city}, {addr.state} {addr.zip}, {addr.country}
            </div>
          </Label>
        </div>
      ))}
      <Button type="button" variant="outline" onClick={onAddNew} className="mt-2">
        + Add New Address
      </Button>
    </RadioGroup>
  );
};

export default AddressSelector;