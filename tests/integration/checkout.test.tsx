import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { CheckoutPage } from '../../src/pages/Checkout';
import { useCartStore } from '../../src/stores/cart';
import { useAuth } from '../../src/lib/auth';
import { apiClient } from '../../src/lib/api';

describe('Checkout Flow', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockCartItems = [
    {
      _id: 'item1',
      product_id: 'prod1',
      variant_id: 'var1',
      quantity: 1,
      price: 99.99,
      title: 'Test Product',
      image: 'https://example.com/product.jpg'
    }
  ];

  const mockUser = {
    _id: 'user123',
    name: 'Test User',
    email: 'test@example.com',
    role: 'customer'
  };

  it('displays order summary with correct totals', async () => {
    vi.mock('../../src/stores/cart', () => ({
      useCartStore: vi.fn().mockReturnValue({
        items: mockCartItems,
        getTotalItems: vi.fn().mockReturnValue(1),
        getTotalPrice: vi.fn().mockReturnValue(99.99)
      })
    }));

    vi.mock('../../src/lib/auth', () => ({
      useAuth: vi.fn().mockReturnValue({
        user: mockUser,
        isAuthenticated: true,
        isLoading: false
      })
    }));

    render(<CheckoutPage />);

    // Wait for component to render
    await waitFor(() => {
      expect(screen.getByText('Checkout')).toBeInTheDocument();
    });

    // Check order summary
    expect(screen.getByText('Test Product × 1')).toBeInTheDocument();
    expect(screen.getByText('$99.99')).toBeInTheDocument();
    expect(screen.getByText('Subtotal')).toBeInTheDocument();
    expect(screen.getByText('Delivery')).toBeInTheDocument();
    expect(screen.getByText('Total')).toBeInTheDocument();
  });

  it('navigates through checkout steps', async () => {
    vi.mock('../../src/stores/cart', () => ({
      useCartStore: vi.fn().mockReturnValue({
        items: mockCartItems,
        getTotalItems: vi.fn().mockReturnValue(1),
        getTotalPrice: vi.fn().mockReturnValue(99.99)
      })
    }));

    vi.mock('../../src/lib/auth', () => ({
      useAuth: vi.fn().mockReturnValue({
        user: mockUser,
        isAuthenticated: true,
        isLoading: false
      })
    }));

    // Mock API call for addresses
    const mockAddresses = [
      {
        _id: 'addr1',
        label: 'Home',
        street: '123 Main St',
        city: 'Mumbai',
        state: 'Maharashtra',
        zip: '400001',
        country: 'India',
        is_default: true
      }
    ];

    vi.mock('../../src/lib/api', () => ({
      apiClient: vi.fn().mockResolvedValue({
        addresses: mockAddresses
      })
    }));

    render(<CheckoutPage />);

    // Wait for component to render
    await waitFor(() => {
      expect(screen.getByText('Shipping Address')).toBeInTheDocument();
    });

    // Select address
    fireEvent.click(screen.getByText('Home'));

    // Continue to delivery
    fireEvent.click(screen.getByRole('button', { name: /continue to delivery/i }));

    // Wait for delivery step
    await waitFor(() => {
      expect(screen.getByText('Delivery Method')).toBeInTheDocument();
    });

    // Select delivery option
    fireEvent.click(screen.getByLabelText('Standard Delivery'));

    // Continue to payment
    fireEvent.click(screen.getByRole('button', { name: /continue to payment/i }));

    // Wait for payment step
    await waitFor(() => {
      expect(screen.getByText('Payment Method')).toBeInTheDocument();
    });
  });

  it('shows login prompt when user is not authenticated', () => {
    vi.mock('../../src/stores/cart', () => ({
      useCartStore: vi.fn().mockReturnValue({
        items: mockCartItems,
        getTotalItems: vi.fn().mockReturnValue(1),
        getTotalPrice: vi.fn().mockReturnValue(99.99)
      })
    }));

    vi.mock('../../src/lib/auth', () => ({
      useAuth: vi.fn().mockReturnValue({
        user: null,
        isAuthenticated: false,
        isLoading: false
      })
    }));

    render(<CheckoutPage />);

    expect(screen.getByText('Please log in to continue checkout.')).toBeInTheDocument();
  });
});