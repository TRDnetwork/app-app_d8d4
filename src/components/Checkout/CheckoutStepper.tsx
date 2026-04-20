import React from 'react';
import { cn } from '../../lib/utils';

interface Step {
  id: number;
  title: string;
  description: string;
}

const steps: Step[] = [
  { id: 1, title: 'Address', description: 'Shipping details' },
  { id: 2, title: 'Delivery', description: 'Shipping speed' },
  { id: 3, title: 'Payment', description: 'Payment method' },
  { id: 4, title: 'Review', description: 'Review order' },
];

export const CheckoutStepper: React.FC<{ currentStep: number }> = ({ currentStep }) => {
  return (
    <div className="mb-8">
      <ol className="flex items-center w-full">
        {steps.map((step, index) => (
          <li
            key={step.id}
            className={cn(
              'flex w-full items-center text-sm font-medium text-text_dim md:text-base after:content-[""] after:w-full after:h-1 after:border-b after:border-border after:inline-block',
              currentStep > step.id && 'text-accent after:!border-accent',
              index === steps.length - 1 && 'after:hidden'
            )}
          >
            <span
              className={cn(
                'flex items-center justify-center w-8 h-8 rounded-full lg:h-10 lg:w-10 shrink-0 border-2 border-border',
                currentStep > step.id && 'border-accent bg-accent text-black',
                currentStep === step.id && 'border-accent bg-transparent text-accent'
              )}
            >
              {currentStep > step.id ? (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              ) : (
                step.id
              )}
            </span>
            <span className="ml-2 lg:ml-4">
              <span className="hidden md:block text-sm font-medium">{step.title}</span>
              <span className="hidden md:block text-xs text-text_dim">{step.description}</span>
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
};