import { describe, it, expect } from 'vitest';
import { validateEmail, validatePassword, validateAddress } from '../../src/lib/validation';

describe('validateEmail', () => {
  it('validates valid email addresses', () => {
    expect(validateEmail('test@example.com')).toBe(true);
    expect(validateEmail('user.name@domain.co.uk')).toBe(true);
  });

  it('rejects invalid email addresses', () => {
    expect(validateEmail('invalid-email')).toBe(false);
    expect(validateEmail('test@')).toBe(false);
    expect(validateEmail('@example.com')).toBe(false);
    expect(validateEmail('')).toBe(false);
  });
});

describe('validatePassword', () => {
  it('validates strong passwords', () => {
    expect(validatePassword('Password123!')).toBe(true);
    expect(validatePassword('SecurePass99@')).toBe(true);
  });

  it('rejects weak passwords', () => {
    expect(validatePassword('password')).toBe(false);
    expect(validatePassword('12345678')).toBe(false);
    expect(validatePassword('short')).toBe(false);
    expect(validatePassword('')).toBe(false);
  });
});

describe('validateAddress', () => {
  it('validates complete address', () => {
    const address = {
      name: 'John Doe',
      phone: '+1234567890',
      street: '123 Main St',
      city: 'Anytown',
      state: 'CA',
      zip: '12345',
      country: 'USA'
    };
    expect(validateAddress(address)).toBe(true);
  });

  it('rejects incomplete address', () => {
    const incompleteAddress = {
      name: 'John Doe',
      street: '123 Main St',
      city: 'Anytown'
    };
    expect(validateAddress(incompleteAddress)).toBe(false);
  });

  it('validates US and international zip codes', () => {
    const usAddress = { zip: '12345', country: 'USA' };
    const ukAddress = { zip: 'SW1A 1AA', country: 'UK' };
    expect(validateAddress({ ...usAddress, name: 'x', phone: 'x', street: 'x', city: 'x', state: 'x' })).toBe(true);
    expect(validateAddress({ ...ukAddress, name: 'x', phone: 'x', street: 'x', city: 'x', state: 'x' })).toBe(true);
  });
});