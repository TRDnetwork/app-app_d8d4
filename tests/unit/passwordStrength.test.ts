import { describe, it, expect } from 'vitest';
import { checkPasswordStrength } from '../../client/src/lib/passwordStrength';

describe('checkPasswordStrength', () => {
  it('returns "weak" for passwords with less than 8 characters', () => {
    expect(checkPasswordStrength('123')).toBe('weak');
    expect(checkPasswordStrength('abc')).toBe('weak');
  });

  it('returns "weak" for passwords with only letters', () => {
    expect(checkPasswordStrength('password')).toBe('weak');
    expect(checkPasswordStrength('abcdefgh')).toBe('weak');
  });

  it('returns "weak" for passwords with only numbers', () => {
    expect(checkPasswordStrength('12345678')).toBe('weak');
  });

  it('returns "medium" for passwords with letters and numbers', () => {
    expect(checkPasswordStrength('password123')).toBe('medium');
    expect(checkPasswordStrength('abc123def')).toBe('medium');
  });

  it('returns "medium" for passwords with letters and special characters', () => {
    expect(checkPasswordStrength('password!@#')).toBe('medium');
  });

  it('returns "strong" for passwords with letters, numbers, and special characters', () => {
    expect(checkPasswordStrength('Password123!')).toBe('strong');
    expect(checkPasswordStrength('SecurePass123@')).toBe('strong');
  });

  it('returns "strong" for passwords with mixed case, numbers, and special characters', () => {
    expect(checkPasswordStrength('SecurePass123!@#')).toBe('strong');
    expect(checkPasswordStrength('MyPass123$%^')).toBe('strong');
  });

  it('handles edge cases', () => {
    expect(checkPasswordStrength('')).toBe('weak');
    expect(checkPasswordStrength('   ')).toBe('weak');
  });
});