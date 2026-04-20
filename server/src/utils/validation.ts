import validator from 'validator';

/**
 * Validate email format
 */
export const validateEmail = (email: string): boolean => {
  return validator.isEmail(email);
};

/**
 * Validate password strength
 * Must contain:
 * - At least 8 characters
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one number
 * - At least one special character
 */
export const validatePasswordStrength = (password: string): { isValid: boolean; errors: string[] } => {
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
  
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Validate phone number
 */
export const validatePhone = (phone: string): boolean => {
  return validator.isMobilePhone(phone, 'any');
};

/**
 * Validate URL
 */
export const validateUrl = (url: string): boolean => {
  return validator.isURL(url);
};

/**
 * Sanitize user input
 */
export const sanitizeInput = (input: string): string => {
  return validator.escape(validator.trim(input));
};
```

```typescript