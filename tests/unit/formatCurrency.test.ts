import { describe, it, expect } from 'vitest';
import { formatCurrency } from '../../src/lib/format';

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
    expect(formatCurrency(1000000)).toBe('$1,000,000.00');
  });
});
```