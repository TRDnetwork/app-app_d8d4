
```
import { describe, it, expect } from 'vitest';
import { formatCurrency, formatDate, truncate } from '../../src/lib/formatters';

describe('formatCurrency', () => {
  it('formats positive numbers with USD currency symbol', () => {
    expect(formatCurrency(100)).toBe('$100.00');
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
  it('formats date to short format', () => {
    expect(formatDate('2023-10-15')).toBe('Oct 15, 2023');
  });

  it('handles Date object input', () => {
    expect(formatDate(new Date('2023-10-15'))).toBe('Oct 15, 2023');
  });
});

describe('truncate', () => {
  it('returns original string if shorter than limit', () => {
    expect(truncate('short', 10)).toBe('short');
  });

  it('truncates string and adds ellipsis', () => {
    expect(truncate('this is a long string', 10)).toBe('this is a...');
  });

  it('handles exact length match', () => {
    expect(truncate('exact', 5)).toBe('exact');
  });
});
```