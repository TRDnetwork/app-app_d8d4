import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ProductCard } from '../../src/components/ProductCard';
import { useCartStore } from '../../src/stores/cart';

describe('Cart Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('ProductCard', () => {
    const mockProduct = {
      _id: 'prod123',
      title: 'Test Product',
      price: 99.99,
      image: 'https://example.com/product.jpg',
      rating: 4.5,
      review_count: 124
    };

    it('adds product to cart when Add to Cart button is clicked', async () => {
      const mockAddItem = vi.fn();
      vi.mock('../../src/stores/cart', () => ({
        useCartStore: vi.fn().mockReturnValue({
          addItem: mockAddItem,
          items: [],
          getTotalItems: vi.fn().mockReturnValue(0),
          getTotalPrice: vi.fn().mockReturnValue(0)
        })
      }));

      render(<ProductCard product={mockProduct} />);

      fireEvent.click(screen.getByRole('button', { name: /add to cart/i }));

      await waitFor(() => {
        expect(mockAddItem).toHaveBeenCalledWith({
          product_id: 'prod123',
          variant_id: undefined,
          quantity: 1,
          price: 99.99,
          title: 'Test Product',
          image: 'https://example.com/product.jpg'
        });
      });
    });

    it('shows discount badge when original price is higher than current price', () => {
      const discountedProduct = {
        ...mockProduct,
        original_price: 149.99
      };

      render(<ProductCard product={discountedProduct} />);

      expect(screen.getByText(/33% off/i)).toBeInTheDocument();
    });

    it('does not show discount badge when no discount', () => {
      render(<ProductCard product={mockProduct} />);

      expect(screen.queryByText(/% off/i)).not.toBeInTheDocument();
    });

    it('displays product information correctly', () => {
      render(<ProductCard product={mockProduct} />);

      expect(screen.getByText('Test Product')).toBeInTheDocument();
      expect(screen.getByText('$99.99')).toBeInTheDocument();
      expect(screen.getByText('124 reviews')).toBeInTheDocument();
    });
  });
});