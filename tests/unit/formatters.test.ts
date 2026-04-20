
```
import { describe, it, expect } from 'vitest';
import { formatCurrency, formatDate, truncate } from '../../src/lib/formatters';

describe('formatCurrency', () => {
  it('formats positive numbers with USD currency symbol', () => {
    expect(formatCurrency(100)).toBe('$100.00');
    expect(formatCurrency(99.99)).toBe('$99.99');
    expect(formatCurrency(0)).toBe('$0.00');
  });

  it('formats negative numbers with minus sign', () => {
    expect(formatCurrency(-50)).toBe('-$50.00');
    expect(formatCurrency(-10.5)).toBe('-$10.50');
  });

  it('handles decimal precision correctly', () => {
    expect(formatCurrency(10.555)).toBe('$10.56');
    expect(formatCurrency(10.554)).toBe('$10.55');
  });
});

describe('formatDate', () => {
  it('formats date string to readable format', () => {
    expect(formatDate('2024-01-15')).toBe('Jan 15, 2024');
    expect(formatDate(new Date('2024-01-15'))).toBe('Jan 15, 2024');
  });

  it('handles different date formats', () => {
    expect(formatDate('2024-12-25T10:30:00Z')).toBe('Dec 25, 2024');
  });
});

describe('truncate', () => {
  it('returns original string if within length limit', () => {
    expect(truncate('Hello', 10)).toBe('Hello');
    expect(truncate('Short', 5)).toBe('Short');
  });

  it('truncates string and adds ellipsis when exceeding limit', () => {
    expect(truncate('Hello World', 5)).toBe('Hello...');
    expect(truncate('This is a long string', 10)).toBe('This is a...');
  });

  it('handles empty string', () => {
    expect(truncate('', 5)).toBe('');
  });
});
```