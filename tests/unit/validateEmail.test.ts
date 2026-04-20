import { describe, it, expect } from 'vitest';
import { validateEmail } from '../../src/lib/validation';

describe('Email Validation', () => {
  it('validates valid email addresses', () => {
    expect(validateEmail('test@example.com')).toBe(true);
    expect(validateEmail('user.name@domain.co.uk')).toBe(true);
    expect(validateEmail('test+tag@example.org')).toBe(true);
  });

  it('rejects invalid email addresses', () => {
    expect(validateEmail('')).toBe(false);
    expect(validateEmail('invalid')).toBe(false);
    expect(validateEmail('invalid@')).toBe(false);
    expect(validateEmail('@invalid.com')).toBe(false);
    expect(validateEmail('test@invalid')).toBe(false);
  });

  it('handles edge cases', () => {
    expect(validateEmail('a@b.co')).toBe(true);
    expect(validateEmail('test@sub.domain.com')).toBe(true);
    expect(validateEmail('test@domain..com')).toBe(false);
  });
});
```