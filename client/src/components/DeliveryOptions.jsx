'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

export default function DeliveryOptions({ onDeliverySelect }) {
  const [selectedOption, setSelectedOption] = useState('standard');

  const deliveryOptions = [
    {
      id: 'standard',
      name: 'Standard Delivery',
      description: 'Arrives in 5-7 business days',
      price: 0,
    },
    {
      id: 'express',
      name: 'Express Delivery',
      description: 'Arrives in 2-3 business days',
      price: 9.99,
    },
    {
      id: 'same-day',
      name: 'Same-Day Delivery',
      description: 'Delivery today if ordered within 2 hours',
      price: 19.99,
    },
  ];

  const handleSelect = (optionId) => {
    setSelectedOption(optionId);
  };

  const handleContinue = () => {
    const selected = deliveryOptions.find((o) => o.id === selectedOption);
    onDeliverySelect(selected);
  };

  return (
    <div className="space-y-4">
      {deliveryOptions.map((option) => (
        <div
          key={option.id}
          className={`border rounded-lg p-4 cursor-pointer transition ${
            selectedOption === option.id
              ? 'border-orange-500 bg-orange-50'
              : 'border-gray-200 hover:border-gray-300'
          }`}
          onClick={() => handleSelect(option.id)}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center">
              <input
                type="radio"
                name="delivery"
                checked={selectedOption === option.id}
                onChange={() => handleSelect(option.id)}
                className="text-orange-500 focus:ring-orange-500"
              />
              <div className="ml-3">
                <p className="font-medium text-gray-900">{option.name}</p>
                <p className="text-sm text-gray-600">{option.description}</p>
              </div>
            </div>
            <p className="font-medium text-gray-900">
              {option.price === 0 ? 'FREE' : `$${option.price}`}
            </p>
          </div>
        </div>
      ))}
      <Button onClick={handleContinue} className="w-full mt-6">
        Continue to Payment
      </Button>
    </div>
  );
}