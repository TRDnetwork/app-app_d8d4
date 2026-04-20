import { describe, it, expect } from 'vitest';
import { checkPasswordStrength } from '../../src/lib/validation';

describe('Password Strength Checker', () => {
  it('returns weak for short password', () => {
    const result = checkPasswordStrength('abc123');
    expect(result.score).toBe(0);
    expect(result.feedback).toContain('at least 8 characters');
  });

  it('returns weak for missing uppercase', () => {
    const result = checkPasswordStrength('password123');
    expect(result.score).toBe(1);
    expect(result.feedback).toContain('uppercase letter');
  });

  it('returns weak for missing lowercase', () => {
    const result = checkPasswordStrength('PASSWORD123');
    expect(result.score).toBe(1);
    expect(result.feedback).toContain('lowercase letter');
  });

  it('returns weak for missing number', () => {
    const result = checkPasswordStrength('Password');
    expect(result.score).toBe(1);
    expect(result.feedback).toContain('number');
  });

  it('returns medium for password with uppercase, lowercase, and number', () => {
    const result = checkPasswordStrength('Password1');
    expect(result.score).toBe(2);
    expect(result.feedback).toContain('special character');
  });

  it('returns strong for password with all requirements', () => {
    const result = checkPasswordStrength('Password1!');
    expect(result.score).toBe(3);
    expect(result.feedback).toBe('Strong password!');
  });
});
```