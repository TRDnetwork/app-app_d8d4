import { describe, it, expect } from 'vitest';
import { formatCurrency } from '../../client/src/lib/formatCurrency';

describe('formatCurrency', () => {
  it('formats positive numbers with dollar sign and two decimal places', () => {
    expect(formatCurrency(100)).toBe('$100.00');
    expect(formatCurrency(99.99)).toBe('$99.99');
  });

  it('formats zero correctly', () => {
    expect(formatCurrency(0)).toBe('$0.00');
  });

  it('formats negative numbers with minus sign', () => {
    expect(formatCurrency(-50)).toBe('-$50.00');
    expect(formatCurrency(-99.99)).toBe('-$99.99');
  });

  it('handles decimal numbers correctly', () => {
    expect(formatCurrency(10.5)).toBe('$10.50');
    expect(formatCurrency(0.99)).toBe('$0.99');
  });

  it('rounds to two decimal places', () => {
    expect(formatCurrency(10.555)).toBe('$10.56');
    expect(formatCurrency(10.554)).toBe('$10.55');
  });

  it('handles large numbers with commas', () => {
    expect(formatCurrency(1000)).toBe('$1,000.00');
    expect(formatCurrency(1000000)).toBe('$1,000,000.00');
  });
});