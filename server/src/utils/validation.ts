// Validate email format
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate phone number (basic validation)
export const validatePhoneNumber = (phone: string): boolean => {
  const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
  return phoneRegex.test(phone);
};

// Validate address
export const validateAddress = (address: any): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!address.name || address.name.trim() === '') {
    errors.push('Name is required');
  }
  
  if (!address.phone || !validatePhoneNumber(address.phone)) {
    errors.push('Valid phone number is required');
  }
  
  if (!address.street || address.street.trim() === '') {
    errors.push('Street address is required');
  }
  
  if (!address.city || address.city.trim() === '') {
    errors.push('City is required');
  }
  
  if (!address.state || address.state.trim() === '') {
    errors.push('State is required');
  }
  
  if (!address.zip || address.zip.trim() === '') {
    errors.push('ZIP code is required');
  } else {
    // Basic ZIP code validation
    const zipRegex = /^\d{5}(-\d{4})?$/;
    if (!zipRegex.test(address.zip)) {
      errors.push('Invalid ZIP code format');
    }
  }
  
  if (!address.country || address.country.trim() === '') {
    errors.push('Country is required');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};
```

```typescript