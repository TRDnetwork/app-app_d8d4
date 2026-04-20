
```
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Cart } from '../../src/pages/Cart';
import { useCartStore } from '../../src/stores/cartStore';

// Mock the cart store
vi.mock('../../src/stores/cartStore', () => ({
  useCartStore: vi.fn(),
}));

describe('Cart Functionality', () => {
  it('displays empty cart message when no items', () => {
    (useCartStore as any).mockReturnValue({
      items: [],
      total: 0,
      removeItem: vi.fn(),
      updateQuantity: vi.fn(),
      clearCart: vi.fn(),
      applyCoupon: vi.fn(),
    });

    render(<Cart />);
    
    expect(screen.getByText('Your cart is empty')).toBeInTheDocument();
    expect(screen.getByText('Looks like you haven\'t added any items to your cart yet.')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /continue shopping/i })).toBeInTheDocument();
  });

  it('displays cart items with correct information', () => {
    const mockItems = [
      {
        product_id: '1',
        title: 'iPhone 15 Pro',
        image: 'https://example.com/iphone.jpg',
        price: 999,
        quantity: 1
      },
      {
        product_id: '2',
        title: 'MacBook Pro',
        image: 'https://example.com/macbook.jpg',
        price: 1999,
        quantity: 1
      }
    ];

    (useCartStore as any).mockReturnValue({
      items: mockItems,
      total: 2998,
      removeItem: vi.fn(),
      updateQuantity: vi.fn(),
      clearCart: vi.fn(),
      applyCoupon: vi.fn(),
    });

    render(<Cart />);
    
    expect(screen.getByText('Shopping Cart')).toBeInTheDocument();
    expect(screen.getAllByRole('img').length).toBe(2);
    expect(screen.getByText('iPhone 15 Pro')).toBeInTheDocument();
    expect(screen.getByText('MacBook Pro')).toBeInTheDocument();
    expect(screen.getByText('$2,998.00')).toBeInTheDocument();
  });

  it('updates quantity when buttons are clicked', async () => {
    const mockUpdateQuantity = vi.fn();
    const mockItems = [
      {
        product_id: '1',
        title: 'iPhone 15 Pro',
        image: 'https://example.com/iphone.jpg',
        price: 999,
        quantity: 1
      }
    ];

    (useCartStore as any).mockReturnValue({
      items: mockItems,
      total: 999,
      removeItem: vi.fn(),
      updateQuantity: mockUpdateQuantity,
      clearCart: vi.fn(),
      applyCoupon: vi.fn(),
    });

    render(<Cart />);
    
    const increaseButton = screen.getAllByText('+')[0];
    const decreaseButton = screen.getAllByText('-')[0];
    
    fireEvent.click(increaseButton);
    await waitFor(() => {
      expect(mockUpdateQuantity).toHaveBeenCalledWith('1', 2);
    });
    
    fireEvent.click(decreaseButton);
    await waitFor(() => {
      expect(mockUpdateQuantity).toHaveBeenCalledWith('1', 1);
    });
  });

  it('removes item when delete button is clicked', async () => {
    const mockRemoveItem = vi.fn();
    const mockItems = [
      {
        product_id: '1',
        title: 'iPhone 15 Pro',
        image: 'https://example.com/iphone.jpg',
        price: 999,
        quantity: 1
      }
    ];

    (useCartStore as any).mockReturnValue({
      items: mockItems,
      total: 999,
      removeItem: mockRemoveItem,
      updateQuantity: vi.fn(),
      clearCart: vi.fn(),
      applyCoupon: vi.fn(),
    });

    render(<Cart />);
    
    const deleteButton = screen.getAllByRole('button')[0];
    fireEvent.click(deleteButton);
    
    await waitFor(() => {
      expect(mockRemoveItem).toHaveBeenCalledWith('1');
    });
  });

  it('applies coupon when code is entered', async () => {
    const mockApplyCoupon = vi.fn();
    const mockItems = [
      {
        product_id: '1',
        title: 'iPhone 15 Pro',
        image: 'https://example.com/iphone.jpg',
        price: 999,
        quantity: 1
      }
    ];

    (useCartStore as any).mockReturnValue({
      items: mockItems,
      total: 999,
      removeItem: vi.fn(),
      updateQuantity: vi.fn(),
      clearCart: vi.fn(),
      applyCoupon: mockApplyCoupon,
    });

    render(<Cart />);
    
    fireEvent.change(screen.getByPlaceholderText(/enter coupon code/i), {
      target: { value: 'WELCOME10' }
    });
    
    fireEvent.click(screen.getByRole('button', { name: /apply/i }));
    
    await waitFor(() => {
      expect(mockApplyCoupon).toHaveBeenCalledWith('WELCOME10');
    });
  });
});
```