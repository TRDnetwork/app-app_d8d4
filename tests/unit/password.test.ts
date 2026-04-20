import { describe, it, expect, vi } from 'vitest';
import bcrypt from 'bcryptjs';
import { hashPassword, verifyPassword, validatePasswordStrength } from '../../server/src/utils/password';

vi.mock('bcryptjs');

describe('Password Utilities', () => {
  describe('hashPassword', () => {
    it('hashes password using bcrypt with proper salt rounds', async () => {
      const mockHash = 'hashed-password';
      (bcrypt.genSalt as vi.Mock).mockResolvedValue('salt');
      (bcrypt.hash as vi.Mock).mockResolvedValue(mockHash);
      
      const result = await hashPassword('password123');
      
      expect(bcrypt.genSalt).toHaveBeenCalledWith(12);
      expect(bcrypt.hash).toHaveBeenCalledWith('password123', 'salt');
      expect(result).toBe(mockHash);
    });
  });

  describe('verifyPassword', () => {
    it('verifies password against hashed password', async () => {
      (bcrypt.compare as vi.Mock).mockResolvedValue(true);
      
      const result = await verifyPassword('password123', 'hashed-password');
      
      expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashed-password');
      expect(result).toBe(true);
    });

    it('returns false for incorrect password', async () => {
      (bcrypt.compare as vi.Mock).mockResolvedValue(false);
      
      const result = await verifyPassword('wrong-password', 'hashed-password');
      
      expect(result).toBe(false);
    });
  });

  describe('validatePasswordStrength', () => {
    it('validates strong passwords correctly', () => {
      const result = validatePasswordStrength('StrongPass123!');
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('detects missing uppercase letter', () => {
      const result = validatePasswordStrength('weakpass123!');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Password must contain at least one uppercase letter');
    });

    it('detects missing lowercase letter', () => {
      const result = validatePasswordStrength('STRONPASS123!');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Password must contain at least one lowercase letter');
    });

    it('detects missing number', () => {
      const result = validatePasswordStrength('StrongPass!');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Password must contain at least one number');
    });

    it('detects missing special character', () => {
      const result = validatePasswordStrength('StrongPass123');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Password must contain at least one special character');
    });

    it('detects short password', () => {
      const result = validatePasswordStrength('Short1!');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Password must be at least 8 characters long');
    });
  });
});