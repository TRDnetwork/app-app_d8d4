import { describe, it, expect } from 'vitest';
import { 
  calculateSubtotal, 
  calculateTax, 
  calculateShipping, 
  calculateTotal, 
  formatCartItems 
} from '../../client/src/lib/cartUtils';

describe('cartUtils', () => {
  const mockProducts = [
    { id: '1', price: 100, discount_percent: 10 },
    { id: '2', price: 200, discount_percent: 0 },
    { id: '3', price: 50, discount_percent: 20 }
  ];

  const mockCartItems = [
    { product_id: '1', quantity: 2 },
    { product_id: '2', quantity: 1 },
    { product_id: '3', quantity: 3 }
  ];

  describe('calculateSubtotal', () => {
    it('calculates subtotal correctly with discounts', () => {
      const subtotal = calculateSubtotal(mockCartItems, mockProducts);
      // Product 1: $100 * 0.9 = $90 * 2 = $180
      // Product 2: $200 * 1 = $200 * 1 = $200
      // Product 3: $50 * 0.8 = $40 * 3 = $120
      // Total: $180 + $200 + $120 = $500
      expect(subtotal).toBe(500);
    });

    it('returns 0 for empty cart', () => {
      expect(calculateSubtotal([], mockProducts)).toBe(0);
    });

    it('handles missing products gracefully', () => {
      const itemsWithMissingProduct = [...mockCartItems, { product_id: '4', quantity: 1 }];
      expect(calculateSubtotal(itemsWithMissingProduct, mockProducts)).toBe(500);
    });
  });

  describe('calculateTax', () => {
    it('calculates tax at 8% of subtotal', () => {
      expect(calculateTax(100)).toBe(8);
      expect(calculateTax(500)).toBe(40);
      expect(calculateTax(0)).toBe(0);
    });
  });

  describe('calculateShipping', () => {
    it('returns free shipping for orders over $50', () => {
      expect(calculateShipping(50)).toBe(0);
      expect(calculateShipping(100)).toBe(0);
    });

    it('returns $9.99 shipping for orders under $50', () => {
      expect(calculateShipping(49.99)).toBe(9.99);
      expect(calculateShipping(0)).toBe(9.99);
    });
  });

  describe('calculateTotal', () => {
    it('calculates total with tax and shipping', () => {
      // Subtotal: $500, Tax: $40, Shipping: $0 = $540
      expect(calculateTotal(500, 40, 0)).toBe(540);
      // Subtotal: $40, Tax: $3.20, Shipping: $9.99 = $53.19
      expect(calculateTotal(40, 3.20, 9.99)).toBeCloseTo(53.19, 2);
    });
  });

  describe('formatCartItems', () => {
    it('formats cart items with product details', () => {
      const formatted = formatCartItems(mockCartItems, mockProducts);
      expect(formatted).toHaveLength(3);
      expect(formatted[0]).toEqual({
        id: '1',
        title: undefined,
        price: 90, // $100 * 0.9 discount
        quantity: 2,
        total: 180
      });
      expect(formatted[1]).toEqual({
        id: '2',
        title: undefined,
        price: 200,
        quantity: 1,
        total: 200
      });
      expect(formatted[2]).toEqual({
        id: '3',
        title: undefined,
        price: 40, // $50 * 0.8 discount
        quantity: 3,
        total: 120
      });
    });

    it('returns empty array for empty cart', () => {
      expect(formatCartItems([], mockProducts)).toEqual([]);
    });
  });
});