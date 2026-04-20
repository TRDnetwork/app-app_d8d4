import React from 'react';
import { useCheckoutStore } from '../../stores/checkoutStore';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';
import { Clock, Truck } from 'lucide-react';

const DeliveryOptions: React.FC = () => {
  const { deliveryOption, selectDeliveryOption } = useCheckoutStore();

  const options = [
    { 
      id: 'standard', 
      label: 'Standard Delivery', 
      price: 0, 
      estimated: '5-7 business days',
      icon: Truck,
      description: 'Free shipping on all orders'
    },
    { 
      id: 'express', 
      label: 'Express Delivery', 
      price: 9.99, 
      estimated: '2-3 business days',
      icon: Clock,
      description: 'Faster delivery for time-sensitive orders'
    },
    { 
      id: 'same_day', 
      label: 'Same Day Delivery', 
      price: 19.99, 
      estimated: 'Delivered today',
      icon: Clock,
      description: 'Order by 2PM for same-day delivery'
    },
  ];

  return (
    <RadioGroup
      value={deliveryOption?.id || ''}
      onValueChange={(id) => selectDeliveryOption(id)}
      className="space-y-4"
    >
      {options.map((option) => {
        const Icon = option.icon;
        return (
          <div
            key={option.id}
            className={cn(
              'flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors',
              deliveryOption?.id === option.id ? 'border-accent bg-muted/30' : 'border-border'
            )}
            onClick={() => selectDeliveryOption(option.id)}
          >
            <div className="flex items-start space-x-3">
              <div className="mt-0.5">
                <RadioGroupItem value={option.id} id={option.id} />
              </div>
              <div className="flex-1 min-w-0">
                <Label htmlFor={option.id} className="flex items-start space-x-3 cursor-pointer">
                  <Icon className="h-5 w-5 text-text_dim mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="font-medium">{option.label}</div>
                    <div className="text-text_dim text-sm mt-1">{option.description}</div>
                  </div>
                </Label>
              </div>
            </div>
            <div className="text-right">
              <div className="font-medium">
                {option.price === 0 ? 'Free' : formatCurrency(option.price)}
              </div>
              <div className="text-text_dim text-sm mt-1">{option.estimated}</div>
            </div>
          </div>
        );
      })}
    </RadioGroup>
  );
};

export default DeliveryOptions;
```

```typescript