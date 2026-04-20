import { describe, it, expect } from 'vitest';
import { formatCurrency, formatDate } from '../../src/lib/formatters';

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

  it('formats large numbers with commas', () => {
    expect(formatCurrency(1234567.89)).toBe('$1,234,567.89');
  });
});

describe('formatDate', () => {
  it('formats date string correctly', () => {
    expect(formatDate('2024-01-15')).toBe('Jan 15, 2024');
  });

  it('formats Date object correctly', () => {
    expect(formatDate(new Date('2024-01-15'))).toBe('Jan 15, 2024');
  });

  it('handles different date formats', () => {
    expect(formatDate('2024-12-25T10:30:00Z')).toBe('Dec 25, 2024');
  });

  it('returns correct format for edge cases', () => {
    expect(formatDate('2000-01-01')).toBe('Jan 1, 2000');
  });
});