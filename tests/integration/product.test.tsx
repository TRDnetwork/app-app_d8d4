
```
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ProductDetail } from '../../src/pages/ProductDetail';
import { useCartStore } from '../../src/stores/cartStore';

// Mock the cart store
vi.mock('../../src/stores/cartStore', () => ({
  useCartStore: vi.fn(),
}));

// Mock the api client
vi.mock('../../src/lib/api', () => ({
  default: vi.fn(),
}));

describe('Product Detail Page', () => {
  it('displays loading skeleton when product is loading', () => {
    render(<ProductDetail />);
    
    expect(screen.getByTestId('skeleton')).toBeInTheDocument();
  });

  it('displays product information when loaded', async () => {
    const mockProduct = {
      _id: '1',
      title: 'iPhone 15 Pro',
      brand: 'Apple',
      price: 999,
      original_price: 1099,
      discount_percent: 9,
      description: 'Latest Apple smartphone with A17 chip and titanium design.',
      images: ['https://example.com/iphone.jpg'],
      stock_quantity: 50,
      variants: []
    };

    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: mockProduct })
    });

    (useCartStore as any).mockReturnValue({
      addItem: vi.fn(),
      has: vi.fn().mockReturnValue(false)
    });

    render(<ProductDetail />);
    
    await waitFor(() => {
      expect(screen.getByText('iPhone 15 Pro')).toBeInTheDocument();
      expect(screen.getByText('by Apple')).toBeInTheDocument();
      expect(screen.getByText('$999.00')).toBeInTheDocument();
      expect(screen.getByText('$1,099.00')).toBeInTheDocument();
      expect(screen.getByText('Save 9%')).toBeInTheDocument();
      expect(screen.getByText('Latest Apple smartphone with A17 chip and titanium design.')).toBeInTheDocument();
      expect(screen.getByText('In stock: 50')).toBeInTheDocument();
    });
  });

  it('adds product to cart when Add to Cart button is clicked', async () => {
    const mockProduct = {
      _id: '1',
      title: 'iPhone 15 Pro',
      brand: 'Apple',
      price: 999,
      description: 'Latest Apple smartphone with A17 chip and titanium design.',
      images: ['https://example.com/iphone.jpg'],
      stock_quantity: 50,
      variants: []
    };

    const mockAddItem = vi.fn();

    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: mockProduct })
    });

    (useCartStore as any).mockReturnValue({
      addItem: mockAddItem,
      has: vi.fn().mockReturnValue(false)
    });

    render(<ProductDetail />);
    
    await waitFor(() => {
      expect(screen.getByText('iPhone 15 Pro')).toBeInTheDocument();
    });
    
    const addToCartButton = screen.getByRole('button', { name: /add to cart/i });
    fireEvent.click(addToCartButton);
    
    await waitFor(() => {
      expect(mockAddItem).toHaveBeenCalledWith({
        product_id: '1',
        title: 'iPhone 15 Pro',
        image: 'https://example.com/iphone.jpg',
        price: 999,
        quantity: 1
      });
    });
  });

  it('updates quantity when quantity input is changed', async () => {
    const mockProduct = {
      _id: '1',
      title: 'iPhone 15 Pro',
      brand: 'Apple',
      price: 999,
      description: 'Latest Apple smartphone with A17 chip and titanium design.',
      images: ['https://example.com/iphone.jpg'],
      stock_quantity: 50,
      variants: []
    };

    const mockAddItem = vi.fn();

    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: mockProduct })
    });

    (useCartStore as any).mockReturnValue({
      addItem: mockAddItem,
      has: vi.fn().mockReturnValue(false)
    });

    render(<ProductDetail />);
    
    await waitFor(() => {
      expect(screen.getByText('iPhone 15 Pro')).toBeInTheDocument();
    });
    
    const quantityInput = screen.getByLabelText(/quantity/i);
    fireEvent.change(quantityInput, { target: { value: '3' } });
    
    const addToCartButton = screen.getByRole('button', { name: /add to cart/i });
    fireEvent.click(addToCartButton);
    
    await waitFor(() => {
      expect(mockAddItem).toHaveBeenCalledWith({
        product_id: '1',
        title: 'iPhone 15 Pro',
        image: 'https://example.com/iphone.jpg',
        price: 999,
        quantity: 3
      });
    });
  });

  it('toggles wishlist when heart button is clicked', async () => {
    const mockProduct = {
      _id: '1',
      title: 'iPhone 15 Pro',
      brand: 'Apple',
      price: 999,
      description: 'Latest Apple smartphone with A17 chip and titanium design.',
      images: ['https://example.com/iphone.jpg'],
      stock_quantity: 50,
      variants: []
    };

    const mockAddItem = vi.fn();
    const mockToggle = vi.fn();

    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: mockProduct })
    });

    (useCartStore as any).mockReturnValue({
      addItem: mockAddItem,
      has: vi.fn().mockReturnValue(false)
    });

    vi.mock('../../src/stores/wishlistStore', () => ({
      wishlistStore: {
        toggle: mockToggle,
        has: vi.fn().mockReturnValue(false)
      }
    }));

    render(<ProductDetail />);
    
    await waitFor(() => {
      expect(screen.getByText('iPhone 15 Pro')).toBeInTheDocument();
    });
    
    const wishlistButton = screen.getByRole('button');
    fireEvent.click(wishlistButton);
    
    await waitFor(() => {
      expect(mockToggle).toHaveBeenCalledWith('1');
    });
  });
});
```