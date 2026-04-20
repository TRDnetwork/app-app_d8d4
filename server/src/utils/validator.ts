import validator from 'validator';

// Input validation utility
export const validate = (data: any, rules: { [key: string]: string }): { [key: string]: string } => {
  const errors: { [key: string]: string } = {};
  
  for (const [field, ruleString] of Object.entries(rules)) {
    const rules = ruleString.split('|');
    let value = data;
    
    // Handle nested fields (e.g., items.*.product_id)
    if (field.includes('.')) {
      const keys = field.split('.');
      for (const key of keys) {
        if (key === '*') continue; // Skip array index placeholder
        if (value && typeof value === 'object') {
          value = value[key];
        } else {
          value = undefined;
          break;
        }
      }
    } else {
      value = data[field];
    }
    
    for (const rule of rules) {
      const [ruleName, ruleValue] = rule.split(':');
      
      switch (ruleName) {
        case 'required':
          if (value === undefined || value === null || value === '') {
            errors[field] = `${field} is required`;
          }
          break;
          
        case 'string':
          if (value !== undefined && value !== null && typeof value !== 'string') {
            errors[field] = `${field} must be a string`;
          }
          break;
          
        case 'integer':
          if (value !== undefined && value !== null && !Number.isInteger(value)) {
            errors[field] = `${field} must be an integer`;
          }
          break;
          
        case 'number':
          if (value !== undefined && value !== null && typeof value !== 'number') {
            errors[field] = `${field} must be a number`;
          }
          break;
          
        case 'array':
          if (value !== undefined && value !== null && !Array.isArray(value)) {
            errors[field] = `${field} must be an array`;
          }
          break;
          
        case 'min':
          if (value !== undefined && value !== null) {
            if (typeof value === 'string' && value.length < parseInt(ruleValue)) {
              errors[field] = `${field} must be at least ${ruleValue} characters`;
            } else if (typeof value === 'number' && value < parseInt(ruleValue)) {
              errors[field] = `${field} must be at least ${ruleValue}`;
            } else if (Array.isArray(value) && value.length < parseInt(ruleValue)) {
              errors[field] = `${field} must have at least ${ruleValue} items`;
            }
          }
          break;
          
        case 'max':
          if (value !== undefined && value !== null) {
            if (typeof value === 'string' && value.length > parseInt(ruleValue)) {
              errors[field] = `${field} must be at most ${ruleValue} characters`;
            } else if (typeof value === 'number' && value > parseInt(ruleValue)) {
              errors[field] = `${field} must be at most ${ruleValue}`;
            } else if (Array.isArray(value) && value.length > parseInt(ruleValue)) {
              errors[field] = `${field} must have at most ${ruleValue} items`;
            }
          }
          break;
          
        case 'email':
          if (value !== undefined && value !== null && !validator.isEmail(value)) {
            errors[field] = `${field} must be a valid email`;
          }
          break;
          
        case 'in':
          if (value !== undefined && value !== null) {
            const allowedValues = ruleValue.split(',');
            if (!allowedValues.includes(value)) {
              errors[field] = `${field} must be one of: ${allowedValues.join(', ')}`;
            }
          }
          break;
          
        case 'url':
          if (value !== undefined && value !== null && !validator.isURL(value)) {
            errors[field] = `${field} must be a valid URL`;
          }
          break;
      }
    }
  }
  
  return errors;
};
```

```typescript