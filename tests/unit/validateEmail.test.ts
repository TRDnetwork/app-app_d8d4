import { describe, it, expect } from 'vitest';
import { validateEmail } from '../../client/src/lib/validateEmail';

describe('validateEmail', () => {
  it('returns true for valid email addresses', () => {
    expect(validateEmail('user@example.com')).toBe(true);
    expect(validateEmail('test.email+tag@domain.co.uk')).toBe(true);
    expect(validateEmail('user123@sub.domain.com')).toBe(true);
  });

  it('returns false for invalid email addresses', () => {
    expect(validateEmail('')).toBe(false);
    expect(validateEmail('invalid')).toBe(false);
    expect(validateEmail('invalid@')).toBe(false);
    expect(validateEmail('@domain.com')).toBe(false);
    expect(validateEmail('user@')).toBe(false);
    expect(validateEmail('user@domain')).toBe(false);
    expect(validateEmail('user domain.com')).toBe(false);
  });

  it('handles edge cases', () => {
    expect(validateEmail('user@domain..com')).toBe(false);
    expect(validateEmail('user@.domain.com')).toBe(false);
    expect(validateEmail('user@domain.com.')).toBe(false);
    expect(validateEmail('user@-domain.com')).toBe(false);
    expect(validateEmail('user@domain-.com')).toBe(false);
  });
});