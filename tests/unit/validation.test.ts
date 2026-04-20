import { describe, it, expect } from 'vitest';
import { validateEmail, validatePassword, validatePhoneNumber, validateAddress } from '../../server/src/utils/validation';

describe('Validation Utilities', () => {
  describe('validateEmail', () => {
    it('returns true for valid email addresses', () => {
      expect(validateEmail('user@example.com')).toBe(true);
      expect(validateEmail('test+tag@domain.co.uk')).toBe(true);
      expect(validateEmail('user.name@sub.domain.com')).toBe(true);
    });

    it('returns false for invalid email addresses', () => {
      expect(validateEmail('')).toBe(false);
      expect(validateEmail('invalid')).toBe(false);
      expect(validateEmail('user@')).toBe(false);
      expect(validateEmail('@domain.com')).toBe(false);
      expect(validateEmail('user@domain')).toBe(false);
    });
  });

  describe('validatePassword', () => {
    it('returns true for strong passwords', () => {
      const result = validatePassword('StrongPass123!');
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('returns false for passwords missing uppercase', () => {
      const result = validatePassword('weakpass123!');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Password must contain at least one uppercase letter');
    });

    it('returns false for passwords missing lowercase', () => {
      const result = validatePassword('WEAKPASS123!');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Password must contain at least one lowercase letter');
    });

    it('returns false for passwords missing numbers', () => {
      const result = validatePassword('WeakPass!');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Password must contain at least one number');
    });

    it('returns false for passwords missing special characters', () => {
      const result = validatePassword('WeakPass123');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Password must contain at least one special character');
    });

    it('returns false for passwords too short', () => {
      const result = validatePassword('Sh1!');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Password must be at least 8 characters long');
    });
  });

  describe('validatePhoneNumber', () => {
    it('returns true for valid phone numbers', () => {
      expect(validatePhoneNumber('+1234567890')).toBe(true);
      expect(validatePhoneNumber('1234567890')).toBe(true);
      expect(validatePhoneNumber('+1-800-555-1234')).toBe(true);
    });

    it('returns false for invalid phone numbers', () => {
      expect(validatePhoneNumber('')).toBe(false);
      expect(validatePhoneNumber('invalid')).toBe(false);
      expect(validatePhoneNumber('123')).toBe(false);
    });
  });

  describe('validateAddress', () => {
    it('returns true for valid address', () => {
      const address = {
        name: 'John Doe',
        phone: '+1234567890',
        street: '123 Main St',
        city: 'Mumbai',
        state: 'Maharashtra',
        zip: '400001',
        country: 'India'
      };

      const result = validateAddress(address);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('returns false for missing required fields', () => {
      const address = {
        name: '',
        phone: '',
        street: '',
        city: '',
        state: '',
        zip: '',
        country: ''
      };

      const result = validateAddress(address);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Name is required');
      expect(result.errors).toContain('Valid phone number is required');
      expect(result.errors).toContain('Street address is required');
      expect(result.errors).toContain('City is required');
      expect(result.errors).toContain('State is required');
      expect(result.errors).toContain('ZIP code is required');
      expect(result.errors).toContain('Country is required');
    });

    it('returns false for invalid ZIP code format', () => {
      const address = {
        name: 'John Doe',
        phone: '+1234567890',
        street: '123 Main St',
        city: 'Mumbai',
        state: 'Maharashtra',
        zip: 'invalid',
        country: 'India'
      };

      const result = validateAddress(address);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Invalid ZIP code format');
    });
  });
});