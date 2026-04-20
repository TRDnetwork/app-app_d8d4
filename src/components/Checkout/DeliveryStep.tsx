import React from 'react';
import { Button } from '../ui/button';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';
import { useCheckoutStore } from '../../stores/checkoutStore';

const deliveryOptions = [
  {
    id: 'standard',
    label: 'Standard Delivery',
    description: '3-5 business days',
    price: 0,
  },
  {
    id: 'express',
    label: 'Express Delivery',
    description: '1-2 business days',
    price: 9.99,
  },
  {
    id: 'same-day',
    label: 'Same Day Delivery',
    description: 'Delivery today',
    price: 19.99,
  },
];

export const DeliveryStep: React.FC<{ onNext: () => void; onBack: () => void }> = ({ onNext, onBack }) => {
  const { deliveryOption, setDeliveryOption } = useCheckoutStore();

  const handleSelect = (value: string) => {
    const option = deliveryOptions.find(opt => opt.id === value);
    if (option) {
      setDeliveryOption(option);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Delivery Method</h2>
      
      <RadioGroup
        value={deliveryOption?.id}
        onValueChange={handleSelect}
        className="space-y-4"
      >
        {deliveryOptions.map((option) => (
          <div
            key={option.id}
            className={`flex items-start space-x-3 p-4 border rounded-lg cursor-pointer transition-colors ${
              deliveryOption?.id === option.id ? 'border-accent bg-accent/5' : 'border-border hover:border-accent/50'
            }`}
            onClick={() => handleSelect(option.id)}
          >
            <RadioGroupItem value={option.id} id={option.id} className="mt-1" />
            <div className="flex-1">
              <Label htmlFor={option.id} className="font-medium cursor-pointer">
                {option.label}
              </Label>
              <p className="text-text_dim text-sm">{option.description}</p>
              <p className="text-text font-medium mt-1">
                {option.price === 0 ? 'Free' : `₹${option.price.toFixed(2)}`}
              </p>
            </div>
          </div>
        ))}
      </RadioGroup>

      <div className="flex justify-between pt-6">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button onClick={onNext} disabled={!deliveryOption}>
          Continue to Payment
        </Button>
      </div>
    </div>
  );
};