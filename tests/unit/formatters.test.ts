import { describe, it, expect } from 'vitest';
import { formatCurrency, formatDate, truncate } from '../../src/lib/formatters';

describe('formatCurrency', () => {
  it('formats positive numbers with currency symbol', () => {
    expect(formatCurrency(99.99)).toBe('$99.99');
  });

  it('formats zero correctly', () => {
    expect(formatCurrency(0)).toBe('$0.00');
  });

  it('formats negative numbers with minus sign', () => {
    expect(formatCurrency(-50)).toBe('-$50.00');
  });

  it('rounds to 2 decimal places', () => {
    expect(formatCurrency(10.555)).toBe('$10.56');
  });
});

describe('formatDate', () => {
  it('formats date string to readable format', () => {
    expect(formatDate('2023-06-15')).toBe('Jun 15, 2023');
  });

  it('formats Date object to readable format', () => {
    expect(formatDate(new Date('2023-06-15'))).toBe('Jun 15, 2023');
  });
});

describe('truncate', () => {
  it('returns original string if shorter than length', () => {
    expect(truncate('short', 10)).toBe('short');
  });

  it('truncates string and adds ellipsis', () => {
    expect(truncate('very long string', 8)).toBe('very lon...');
  });

  it('handles exact length match', () => {
    expect(truncate('exact', 5)).toBe('exact');
  });
});