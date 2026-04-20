import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Cart from '../../src/pages/Cart';

describe('Cart', () => {
  it('displays empty cart message when cart is empty', () => {
    // Mock empty cart
    vi.mock('../../src/stores/cartStore', () => ({
      cartStore: vi.fn(() => ({
        items: [],
        subtotal: () => 0,
        total: () => 0,
      })),
    }));

    render(<Cart />);
    
    expect(screen.getByText('Your cart is empty')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /continue shopping/i })).toBeInTheDocument();
  });

  it('renders cart items when items are present', () => {
    const mockItems = [
      {
        product: {
          _id: '123',
          title: 'Wireless Headphones',
          price: 99.99,
          image: 'headphones.jpg',
        },
        quantity: 1,
        price: 99.99,
      },
      {
        product: {
          _id: '456',
          title: 'Phone Case',
          price: 29.99,
          image: 'case.jpg',
        },
        quantity: 2,
        price: 29.99,
      },
    ];

    // Mock cart with items
    vi.mock('../../src/stores/cartStore', () => ({
      cartStore: vi.fn(() => ({
        items: mockItems,
        subtotal: () => 159.97,
        total: () => 159.97,
      })),
    }));

    render(<Cart />);
    
    expect(screen.getByText('Wireless Headphones')).toBeInTheDocument();
    expect(screen.getByText('Phone Case')).toBeInTheDocument();
    expect(screen.getByText('Qty: 2')).toBeInTheDocument();
  });

  it('displays cart summary with correct calculations', () => {
    const mockItems = [
      {
        product: {
          _id: '123',
          title: 'Wireless Headphones',
          price: 99.99,
          image: 'headphones.jpg',
        },
        quantity: 1,
        price: 99.99,
      },
    ];

    // Mock cart with items and coupon
    vi.mock('../../src/stores/cartStore', () => ({
      cartStore: vi.fn(() => ({
        items: mockItems,
        subtotal: () => 99.99,
        discount: 10,
        total: () => 89.99,
        couponCode: 'SAVE10',
      })),
    }));

    render(<Cart />);
    
    expect(screen.getByText('Subtotal')).toBeInTheDocument();
    expect(screen.getByText('Discount')).toBeInTheDocument();
    expect(screen.getByText('Total')).toBeInTheDocument();
    
    expect(screen.getByText('$99.99')).toBeInTheDocument();
    expect(screen.getByText('-$10.00')).toBeInTheDocument();
    expect(screen.getByText('$89.99')).toBeInTheDocument();
  });

  it('shows proceed to checkout button', () => {
    // Mock cart with items
    vi.mock('../../src/stores/cartStore', () => ({
      cartStore: vi.fn(() => ({
        items: [{ product: { _id: '123', title: 'Test' }, quantity: 1, price: 99.99 }],
        subtotal: () => 99.99,
        total: () => 99.99,
      })),
    }));

    render(<Cart />);
    
    const checkoutButton = screen.getByRole('link', { name: /proceed to checkout/i });
    expect(checkoutButton).toBeInTheDocument();
    expect(checkoutButton).toHaveAttribute('href', '/checkout');
  });
});