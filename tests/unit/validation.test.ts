import { describe, it, expect } from 'vitest';
import { passwordSchema, emailSchema } from '../../server/src/utils/validation';

describe('passwordSchema', () => {
  it('validates strong password', () => {
    const result = passwordSchema.safeParse('StrongPass123!');
    expect(result.success).toBe(true);
  });

  it('rejects short password', () => {
    const result = passwordSchema.safeParse('weak');
    expect(result.success).toBe(false);
  });

  it('rejects password without uppercase', () => {
    const result = passwordSchema.safeParse('weakpass123!');
    expect(result.success).toBe(false);
  });

  it('rejects password without lowercase', () => {
    const result = passwordSchema.safeParse('WEAKPASS123!');
    expect(result.success).toBe(false);
  });

  it('rejects password without number', () => {
    const result = passwordSchema.safeParse('WeakPass!');
    expect(result.success).toBe(false);
  });

  it('rejects password without special character', () => {
    const result = passwordSchema.safeParse('WeakPass123');
    expect(result.success).toBe(false);
  });

  it('rejects password with spaces', () => {
    const result = passwordSchema.safeParse('Weak Pass 123!');
    expect(result.success).toBe(false);
  });
});

describe('emailSchema', () => {
  it('validates valid email', () => {
    const result = emailSchema.safeParse('user@example.com');
    expect(result.success).toBe(true);
  });

  it('rejects invalid email format', () => {
    const result = emailSchema.safeParse('invalid-email');
    expect(result.success).toBe(false);
  });

  it('rejects disposable email providers', () => {
    const result = emailSchema.safeParse('user@mailinator.com');
    expect(result.success).toBe(false);
  });
});