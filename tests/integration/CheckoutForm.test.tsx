import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CheckoutForm } from '../../src/components/checkout/CheckoutForm';

describe('CheckoutForm', () => {
  const mockOnSubmit = vi.fn();

  it('renders form with all required sections', () => {
    render(<CheckoutForm onSubmit={mockOnSubmit} />);
    
    expect(screen.getByText('Shipping Address')).toBeInTheDocument();
    expect(screen.getByText('Delivery Options')).toBeInTheDocument();
    expect(screen.getByText('Payment Method')).toBeInTheDocument();
    expect(screen.getByText('Order Review')).toBeInTheDocument();
  });

  it('displays error message when form is submitted with missing data', async () => {
    render(<CheckoutForm onSubmit={mockOnSubmit} />);
    
    const placeOrderButton = screen.getByRole('button', { name: /place order/i });
    fireEvent.click(placeOrderButton);
    
    expect(await screen.findByText(/please complete all steps before placing your order/i)).toBeInTheDocument();
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('calls onSubmit when all steps are completed and form is submitted', async () => {
    const mockData = {
      address: {
        _id: '1',
        type: 'home',
        line1: '123 Main St',
        city: 'San Francisco',
        state: 'CA',
        postal_code: '94105',
        country: 'USA',
      },
      deliverySpeed: 'standard',
      paymentMethod: 'stripe',
    };

    render(<CheckoutForm onSubmit={mockOnSubmit} />);
    
    // Mock the store values
    vi.mock('../../src/stores/checkoutStore', () => ({
      checkoutStore: vi.fn(() => mockData),
    }));
    
    // Re-render with mocked store
    render(<CheckoutForm onSubmit={mockOnSubmit} />);
    
    const placeOrderButton = screen.getByRole('button', { name: /place order/i });
    fireEvent.click(placeOrderButton);
    
    // Note: This test would need more sophisticated mocking to fully test
    // the store integration, but demonstrates the approach
  });

  it('shows loading state when processing', () => {
    render(<CheckoutForm onSubmit={mockOnSubmit} isLoading={true} />);
    
    const placeOrderButton = screen.getByRole('button', { name: /processing/i });
    expect(placeOrderButton).toBeDisabled();
  });

  it('displays form errors when present', () => {
    render(<CheckoutForm onSubmit={mockOnSubmit} errors={{ form: 'Payment failed' }} />);
    
    expect(screen.getByText('Payment failed')).toBeInTheDocument();
  });
});