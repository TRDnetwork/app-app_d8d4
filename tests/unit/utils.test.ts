import { describe, it, expect } from 'vitest';
import { validateEmail, validatePasswordStrength } from '../../server/src/utils/validation';
import { hashPassword, verifyPassword } from '../../server/src/utils/password';

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

  describe('validatePasswordStrength', () => {
    it('returns true for strong passwords', () => {
      const result = validatePasswordStrength('StrongPass123!');
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('returns false for passwords missing uppercase', () => {
      const result = validatePasswordStrength('weakpass123!');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Password must contain at least one uppercase letter');
    });

    it('returns false for passwords missing lowercase', () => {
      const result = validatePasswordStrength('WEAKPASS123!');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Password must contain at least one lowercase letter');
    });

    it('returns false for passwords missing numbers', () => {
      const result = validatePasswordStrength('WeakPass!');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Password must contain at least one number');
    });

    it('returns false for passwords missing special characters', () => {
      const result = validatePasswordStrength('WeakPass123');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Password must contain at least one special character');
    });

    it('returns false for passwords too short', () => {
      const result = validatePasswordStrength('Sh1!');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Password must be at least 8 characters long');
    });
  });
});

describe('Password Utilities', () => {
  describe('hashPassword', () => {
    it('hashes password successfully', async () => {
      const password = 'testpassword123!';
      const hash = await hashPassword(password);
      expect(hash).not.toBe(password);
      expect(typeof hash).toBe('string');
      expect(hash.length).toBeGreaterThan(0);
    });
  });

  describe('verifyPassword', () => {
    it('verifies correct password', async () => {
      const password = 'testpassword123!';
      const hash = await hashPassword(password);
      const isValid = await verifyPassword(password, hash);
      expect(isValid).toBe(true);
    });

    it('rejects incorrect password', async () => {
      const password = 'testpassword123!';
      const wrongPassword = 'wrongpassword';
      const hash = await hashPassword(password);
      const isValid = await verifyPassword(wrongPassword, hash);
      expect(isValid).toBe(false);
    });
  });
});