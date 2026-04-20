import * as React from "react"
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group"
import { Circle } from "lucide-react"

import { cn } from "../lib/utils"

const RadioGroup = RadioGroupPrimitive.Root

const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Item
      ref={ref}
      className={cn(
        "aspect-square h-4 w-4 rounded-full border border-primary text-primary ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
        <Circle className="h-2.5 w-2.5 fill-current text-current" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  )
})
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName

// Enhanced RadioGroup with analytics tracking
const TrackedRadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root> & {
    fieldName?: string;
    formName?: string;
  }
>(({ className, fieldName, formName, onValueChange, ...props }, ref) => {
  const handleValueChange = (value: string) => {
    import('../lib/analytics').then(({ analytics }) => {
      analytics.track('form_field_change', {
        field: fieldName || props.name,
        form: formName,
        fieldType: 'radio',
        value: value,
      });
    });
    
    if (onValueChange) {
      onValueChange(value);
    }
  };

  return (
    <RadioGroup
      ref={ref}
      className={className}
      {...props}
      onValueChange={handleValueChange}
    />
  );
});

TrackedRadioGroup.displayName = "TrackedRadioGroup";

export { RadioGroup, RadioGroupItem