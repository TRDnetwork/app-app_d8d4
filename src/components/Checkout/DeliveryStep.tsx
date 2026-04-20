import React from 'react';
import { Button } from '../ui/button';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';
import { useCheckoutStore } from '../../stores/checkoutStore';

const deliveryOptions = [
  {
    id: 'standard',
    label: 'Standard Delivery',
    description: '5-7 business days',
    price: 0,
  },
  {
    id: 'express',
    label: 'Express Delivery',
    description: '2-3 business days',
    price: 9.99,
  },
  {
    id: 'same_day',
    label: 'Same Day Delivery',
    description: 'Order within 3 hours',
    price: 19.99,
  },
];

const DeliveryStep = ({ onBack, onNext }: { onBack: () => void; onNext: () => void }) => {
  const { deliverySpeed, setDeliverySpeed } = useCheckoutStore();

  const handleContinue = (speed: 'standard' | 'express' | 'same_day') => {
    setDeliverySpeed(speed);
    onNext();
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Delivery Options</h2>
      <RadioGroup
        defaultValue={deliverySpeed}
        onValueChange={(value) => setDeliverySpeed(value as any)}
        className="space-y-4"
      >
        {deliveryOptions.map((option) => (
          <div
            key={option.id}
            className="flex items-start justify-between p-4 border border-border rounded-lg hover:bg-surface cursor-pointer"
            onClick={() => handleContinue(option.id as any)}
          >
            <div className="flex items-center space-x-3">
              <RadioGroupItem value={option.id} id={option.id} />
              <div className="space-y-1">
                <Label htmlFor={option.id} className="font-medium">
                  {option.label}
                </Label>
                <p className="text-text_dim text-sm">{option.description}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-medium">
                {option.price === 0 ? 'Free' : `$${option.price.toFixed(2)}`}
              </p>
            </div>
          </div>
        ))}
      </RadioGroup>
      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Back to Address
        </Button>
        <Button onClick={() => handleContinue(deliverySpeed)}>
          Continue to Payment
        </Button>
      </div>
    </div>
  );
};

export default DeliveryStep;