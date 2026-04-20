import { describe, it, expect } from 'vitest';
import { formatCurrency, formatDate } from '../../src/lib/format';

describe('formatCurrency', () => {
  it('formats positive integers with currency symbol', () => {
    expect(formatCurrency(100)).toBe('$100.00');
  });

  it('handles zero correctly', () => {
    expect(formatCurrency(0)).toBe('$0.00');
  });

  it('formats negative amounts with minus sign', () => {
    expect(formatCurrency(-50)).toBe('-$50.00');
  });

  it('rounds to 2 decimal places', () => {
    expect(formatCurrency(10.555)).toBe('$10.56');
  });

  it('handles large numbers with commas', () => {
    expect(formatCurrency(1000000)).toBe('$1,000,000.00');
  });
});

describe('formatDate', () => {
  it('formats date in MM/DD/YYYY format', () => {
    const date = new Date('2023-01-15');
    expect(formatDate(date)).toBe('01/15/2023');
  });

  it('handles different date formats', () => {
    const date = new Date('2023-12-05');
    expect(formatDate(date)).toBe('12/05/2023');
  });

  it('returns empty string for invalid date', () => {
    expect(formatDate(new Date('invalid'))).toBe('');
  });
});