import React from 'react';
import { Button } from '../ui/button';

interface DeliveryOption {
  id: string;
  label: string;
  description: string;
  price: number;
  estimated_days: string;
}

const deliveryOptions: DeliveryOption[] = [
  {
    id: 'standard',
    label: 'Standard Delivery',
    description: '5-7 business days',
    price: 0,
    estimated_days: '5-7 days',
  },
  {
    id: 'express',
    label: 'Express Delivery',
    description: '2-3 business days',
    price: 9.99,
    estimated_days: '2-3 days',
  },
  {
    id: 'same-day',
    label: 'Same-Day Delivery',
    description: 'Order within 3 hours',
    price: 19.99,
    estimated_days: 'Today',
  },
];

interface DeliveryStepProps {
  selectedDelivery: string;
  onSelectDelivery: (id: string) => void;
  onBack: () => void;
  onContinue: () => void;
}

const DeliveryStep: React.FC<DeliveryStepProps> = ({
  selectedDelivery,
  onSelectDelivery,
  onBack,
  onContinue,
}) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Delivery Method</h2>
      <div className="space-y-4">
        {deliveryOptions.map((option) => (
          <div
            key={option.id}
            className={`p-4 border rounded-lg cursor-pointer transition-colors ${
              selectedDelivery === option.id ? 'border-primary bg-primary/5' : 'border-border hover:bg-muted'
            }`}
            onClick={() => onSelectDelivery(option.id)}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3">
                  <input
                    type="radio"
                    checked={selectedDelivery === option.id}
                    onChange={() => onSelectDelivery(option.id)}
                    className="text-primary"
                  />
                  <div>
                    <p className="font-medium">{option.label}</p>
                    <p className="text-sm text-muted-foreground">{option.description}</p>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium">{option.price === 0 ? 'Free' : `$${option.price}`}</p>
                <p className="text-sm text-muted-foreground">{option.estimated_days}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>Back</Button>
        <Button onClick={onContinue} disabled={!selectedDelivery}>
          Continue to Payment
        </Button>
      </div>
    </div>
  );
};

export default DeliveryStep;