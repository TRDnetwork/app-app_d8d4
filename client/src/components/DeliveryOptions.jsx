'use client';

import { Button } from '@/components/ui/button';

export default function DeliveryOptions({ onNext, onBack }) {
  const options = [
    {
      id: 'standard',
      name: 'Standard Delivery',
      description: '5-7 business days',
      price: 0,
    },
    {
      id: 'express',
      name: 'Express Delivery',
      description: '2-3 business days',
      price: 9.99,
    },
    {
      id: 'overnight',
      name: 'Overnight Delivery',
      description: 'Next business day',
      price: 24.99,
    },
  ];

  const [selectedOption, setSelectedOption] = useState('standard');

  const handleSelect = (optionId) => {
    setSelectedOption(optionId);
  };

  const handleContinue = () => {
    // In a real app, this would save selection to backend
    console.log('Selected delivery:', selectedOption);
    onNext();
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium">Choose Delivery Option</h2>
      {options.map((option) => (
        <div
          key={option.id}
          className={cn(
            'flex cursor-pointer items-center justify-between rounded-lg border p-4 transition-colors',
            selectedOption === option.id
              ? 'border-accent bg-accent/5'
              : 'border-border hover:bg-surface'
          )}
          onClick={() => handleSelect(option.id)}
        >
          <div className="flex items-center space-x-4">
            <div
              className={cn(
                'flex h-5 w-5 items-center justify-center rounded-full border-2',
                selectedOption === option.id
                  ? 'border-accent bg-accent'
                  : 'border-text_dim'
              )}
            >
              {selectedOption === option.id && (
                <div className="h-2 w-2 rounded-full bg-white"></div>
              )}
            </div>
            <div>
              <p className="font-medium">{option.name}</p>
              <p className="text-sm text-text_dim">{option.description}</p>
            </div>
          </div>
          <p className="font-medium">
            {option.price === 0 ? 'Free' : `$${option.price}`}
          </p>
        </div>
      ))}
      <div className="flex justify-between pt-6">
        <Button variant="outline" onClick={onBack}>
          Back to Address
        </Button>
        <Button onClick={handleContinue}>Continue to Payment</Button>
      </Button>
    </div>
  );
}