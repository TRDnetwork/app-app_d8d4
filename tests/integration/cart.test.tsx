import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Cart } from '../../client/src/pages/Cart';
import { useCart } from '../../client/src/stores/cartStore';

// Mock dependencies
vi.mock('../../client/src/stores/cartStore', () => ({
  useCart: vi.fn(),
  CartProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>
}));

describe('Cart Component', () => {
  const mockCartItems = [
    {
      _id: 'item1',
      product_id: 'prod1',
      variant_id: 'v1',
      quantity: 2,
      price_snapshot: 29.99,
      title: 'Wireless Headphones',
      image: 'https://example.com/headphones.jpg'
    },
    {
      _id: 'item2',
      product_id: 'prod2',
      variant_id: 'v2',
      quantity: 1,
      price_snapshot: 19.99,
      title: 'Charging Cable',
      image: 'https://example.com/cable.jpg'
    }
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('displays empty cart message when cart is empty', () => {
    (useCart as vi.Mock).mockReturnValue({
      items: [],
      total: 0,
      loading: false,
      addItem: vi.fn(),
      updateItem: vi.fn(),
      removeItem: vi.fn(),
      fetchCart: vi.fn()
    });

    render(<Cart />);

    expect(screen.getByText(/your cart is empty/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /continue shopping/i })).toBeInTheDocument();
  });

  it('displays loading skeleton when cart is loading', () => {
    (useCart as vi.Mock).mockReturnValue({
      items: [],
      total: 0,
      loading: true,
      addItem: vi.fn(),
      updateItem: vi.fn(),
      removeItem: vi.fn(),
      fetchCart: vi.fn()
    });

    render(<Cart />);

    expect(screen.getAllByTestId('skeleton')).toHaveLength(3);
  });

  it('displays cart items with correct information', () => {
    (useCart as vi.Mock).mockReturnValue({
      items: mockCartItems,
      total: 79.97,
      loading: false,
      addItem: vi.fn(),
      updateItem: vi.fn(),
      removeItem: vi.fn(),
      fetchCart: vi.fn()
    });

    render(<Cart />);

    expect(screen.getByText(/wireless headphones/i)).toBeInTheDocument();
    expect(screen.getByText(/charging cable/i)).toBeInTheDocument();
    expect(screen.getByText(/\$59.98/i)).toBeInTheDocument(); // 2 * 29.99
    expect(screen.getByText(/\$19.99/i)).toBeInTheDocument();
    expect(screen.getByText(/\$79.97/i)).toBeInTheDocument(); // subtotal
    expect(screen.getByText(/\$85.96/i)).toBeInTheDocument(); // total with delivery
  });

  it('updates item quantity when quantity input changes', async () => {
    const mockUpdateItem = vi.fn();
    (useCart as vi.Mock).mockReturnValue({
      items: mockCartItems,
      total: 79.97,
      loading: false,
      addItem: vi.fn(),
      updateItem: mockUpdateItem,
      removeItem: vi.fn(),
      fetchCart: vi.fn()
    });

    render(<Cart />);

    const quantityInput = screen.getAllByLabelText(/quantity/i)[0];
    fireEvent.change(quantityInput, { target: { value: '3' } });

    await waitFor(() => {
      expect(mockUpdateItem).toHaveBeenCalledWith('item1', 3);
    });
  });

  it('removes item when remove button is clicked', async () => {
    const mockRemoveItem = vi.fn();
    (useCart as vi.Mock).mockReturnValue({
      items: mockCartItems,
      total: 79.97,
      loading: false,
      addItem: vi.fn(),
      updateItem: vi.fn(),
      removeItem: mockRemoveItem,
      fetchCart: vi.fn()
    });

    render(<Cart />);

    const removeButtons = screen.getAllByRole('button', { name: /remove/i });
    fireEvent.click(removeButtons[0]);

    await waitFor(() => {
      expect(mockRemoveItem).toHaveBeenCalledWith('item1');
    });
  });

  it('navigates to checkout when proceed button is clicked', () => {
    (useCart as vi.Mock).mockReturnValue({
      items: mockCartItems,
      total: 79.97,
      loading: false,
      addItem: vi.fn(),
      updateItem: vi.fn(),
      removeItem: vi.fn(),
      fetchCart: vi.fn()
    });

    render(<Cart />);

    const proceedButton = screen.getByRole('link', { name: /proceed to checkout/i });
    expect(proceedButton).toHaveAttribute('href', '/checkout');
  });
});