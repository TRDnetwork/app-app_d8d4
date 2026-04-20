'use client';

import { cn } from '@/lib/utils';

const steps = [
  { id: 1, name: 'Shipping Address' },
  { id: 2, name: 'Delivery Options' },
  { id: 3, name: 'Payment Method' },
  { id: 4, name: 'Order Review' },
];

export default function CheckoutSteps({ currentStep }) {
  return (
    <div className="flex items-center justify-center">
      {steps.map((step, index) => (
        <div
          key={step.id}
          className={cn(
            'flex flex-1 items-center',
            index !== steps.length - 1 && 'pr-8'
          )}
        >
          <div className="relative flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors duration-200',
            currentStep >= step.id
              ? 'border-accent bg-accent text-white'
              : 'border-text_dim text-text_dim'
          )}
        >
          {currentStep > step.id ? (
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          ) : (
            <span className="text-sm font-medium">{step.id}</span>
          )}
        </div>
        <div
          className={cn(
            'ml-2 text-sm font-medium md:block',
            currentStep >= step.id ? 'text-accent' : 'text-text_dim'
          )}
        >
          {step.name}
        </div>
      ))}
    </div>
  );
}