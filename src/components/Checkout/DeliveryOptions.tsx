import React from 'react';
import { useCheckoutStore } from '../../stores/checkoutStore';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';

const DeliveryOptions: React.FC = () => {
  const { deliveryOption, selectDeliveryOption } = useCheckoutStore();

  const options = [
    { id: 'standard', label: 'Standard Delivery', price: 0, estimated: '5-7 business days' },
    { id: 'express', label: 'Express Delivery', price: 9.99, estimated: '2-3 business days' },
    { id: 'same_day', label: 'Same Day Delivery', price: 19.99, estimated: 'Delivered today' },
  ];

  return (
    <RadioGroup
      value={deliveryOption?.id || ''}
      onValueChange={(id) => selectDeliveryOption(id)}
      className="space-y-4"
    >
      {options.map((option) => (
        <div
          key={option.id}
          className={cn(
            'flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:bg-muted/50',
            deliveryOption?.id === option.id ? 'border-accent bg-muted/30' : 'border-border'
          )}
          onClick={() => selectDeliveryOption(option.id)}
        >
          <div className="flex items-center space-x-3">
            <RadioGroupItem value={option.id} id={option.id} />
            <Label htmlFor={option.id} className="cursor-pointer">
              <div className="font-medium">{option.label}</div>
              <div className="text-text_dim text-sm">{option.estimated}</div>
            </Label>
          </div>
          <div className="text-right">
            <div className="font-medium">
              {option.price === 0 ? 'Free' : formatCurrency(option.price)}
            </div>
          </div>
        </div>
      ))}
    </RadioGroup>
  );
};

export default DeliveryOptions;