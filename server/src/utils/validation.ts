import validator from 'validator';

// Input validation utilities
export const validateEmail = (email: string): boolean => {
  return validator.isEmail(email);
};

export const validatePassword = (password: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const validatePhoneNumber = (phone: string): boolean => {
  return validator.isMobilePhone(phone, 'any', { strictMode: false });
};

export const sanitizeInput = (input: string): string => {
  return validator.escape(validator.trim(input));
};

export const validateAddress = (address: any): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!address.name || address.name.trim().length === 0) {
    errors.push('Name is required');
  }
  
  if (!address.phone || !validatePhoneNumber(address.phone)) {
    errors.push('Valid phone number is required');
  }
  
  if (!address.street || address.street.trim().length === 0) {
    errors.push('Street address is required');
  }
  
  if (!address.city || address.city.trim().length === 0) {
    errors.push('City is required');
  }
  
  if (!address.state || address.state.trim().length === 0) {
    errors.push('State is required');
  }
  
  if (!address.zip || address.zip.trim().length === 0) {
    errors.push('ZIP code is required');
  } else if (!/^\d{5}(-\d{4})?$/.test(address.zip)) {
    errors.push('Invalid ZIP code format');
  }
  
  if (!address.country || address.country.trim().length === 0) {
    errors.push('Country is required');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};
```

```typescript