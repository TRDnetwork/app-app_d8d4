import * as React from "react"

import { cn } from "../lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

// Enhanced Input with analytics tracking
const TrackedInput = React.forwardRef<HTMLInputElement, InputProps & { 
  fieldName?: string;
  formName?: string;
}>(({ className, type, fieldName, formName, ...props }, ref) => {
  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    import('../lib/analytics').then(({ analytics }) => {
      analytics.track('form_field_focus', {
        field: fieldName || e.target.name,
        form: formName,
        fieldType: type,
      });
    });
    
    if (props.onFocus) {
      props.onFocus(e);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    import('../lib/analytics').then(({ analytics }) => {
      analytics.track('form_field_change', {
        field: fieldName || e.target.name,
        form: formName,
        fieldType: type,
        valueLength: e.target.value.length,
      });
    });
    
    if (props.onChange) {
      props.onChange(e);
    }
  };

  return (
    <Input
      ref={ref}
      type={type}
      className={className}
      {...props}
      onFocus={handleFocus}
      onChange={handleChange}
    />
  );
});

TrackedInput.displayName = "TrackedInput";

export { Input, TrackedInput }