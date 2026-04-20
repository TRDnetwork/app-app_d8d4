
```
import { describe, it, expect } from 'vitest';
import { loginSchema, registerSchema, addressSchema } from '../../src/lib/validators';

describe('loginSchema', () => {
  it('validates correct email and password', () => {
    const result = loginSchema.safeParse({
      email: 'user@example.com',
      password: 'password123'
    });
    expect(result.success).toBe(true);
  });

  it('rejects invalid email format', () => {
    const result = loginSchema.safeParse({
      email: 'invalid-email',
      password: 'password123'
    });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe('Invalid email address');
  });

  it('rejects short password', () => {
    const result = loginSchema.safeParse({
      email: 'user@example.com',
      password: 'pass'
    });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe('Password must be at least 6 characters');
  });

  it('requires both fields', () => {
    const result = loginSchema.safeParse({
      email: '',
      password: ''
    });
    expect(result.success).toBe(false);
    expect(result.error?.issues.length).toBe(2);
  });
});

describe('registerSchema', () => {
  it('validates complete registration data', () => {
    const result = registerSchema.safeParse({
      name: 'John Doe',
      email: 'user@example.com',
      password: 'Password123!',
      confirmPassword: 'Password123!'
    });
    expect(result.success).toBe(true);
  });

  it('rejects short name', () => {
    const result = registerSchema.safeParse({
      name: 'J',
      email: 'user@example.com',
      password: 'Password123!',
      confirmPassword: 'Password123!'
    });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe('Name is required');
  });

  it('validates email format', () => {
    const result = registerSchema.safeParse({
      name: 'John Doe',
      email: 'invalid-email',
      password: 'Password123!',
      confirmPassword: 'Password123!'
    });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe('Invalid email address');
  });

  it('requires password confirmation to match', () => {
    const result = registerSchema.safeParse({
      name: 'John Doe',
      email: 'user@example.com',
      password: 'Password123!',
      confirmPassword: 'Different123!'
    });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe("Passwords don't match");
  });
});

describe('addressSchema', () => {
  it('validates complete address', () => {
    const result = addressSchema.safeParse({
      type: 'home',
      line1: '123 Main St',
      city: 'San Francisco',
      state: 'CA',
      postal_code: '94107',
      country: 'US'
    });
    expect(result.success).toBe(true);
  });

  it('rejects invalid address type', () => {
    const result = addressSchema.safeParse({
      type: 'invalid',
      line1: '123 Main St',
      city: 'San Francisco',
      state: 'CA',
      postal_code: '94107',
      country: 'US'
    });
    expect(result.success).toBe(false);
  });

  it('requires all required fields', () => {
    const result = addressSchema.safeParse({
      type: 'home',
      line1: '',
      city: '',
      state: '',
      postal_code: '',
      country: ''
    });
    expect(result.success).toBe(false);
    expect(result.error?.issues.length).toBe(5);
  });
});
```