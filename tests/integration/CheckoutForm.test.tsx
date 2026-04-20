import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { CheckoutForm } from '../../src/components/CheckoutForm';

describe('CheckoutForm', () => {
  const mockCart = {
    items: [
      {
        id: '1',
        name: 'Test Product',
        price: 99.99,
        quantity: 2,
        image: 'https://via.placeholder.com/100',
      },
    ],
  };

  const mockOnSubmit = vi.fn();

  it('renders all checkout steps', () => {
    render(<CheckoutForm cart={mockCart} onSubmit={mockOnSubmit} />);
    
    expect(screen.getByText('Checkout')).toBeInTheDocument();
    expect(screen.getByText('Shipping Address')).toBeInTheDocument();
    expect(screen.getByText('Delivery Speed')).toBeInTheDocument();
    expect(screen.getByText('Payment Method')).toBeInTheDocument();
    expect(screen.getByText('Review Your Order')).toBeInTheDocument();
  });

  it('calculates correct order total', () => {
    render(<CheckoutForm cart={mockCart} onSubmit={mockOnSubmit} />);
    
    const subtotal = screen.getByText('$199.98');
    const shipping = screen.getByText('$0.00');
    const total = screen.getByText('$199.98');
    
    expect(subtotal).toBeInTheDocument();
    expect(shipping).toBeInTheDocument();
    expect(total).toBeInTheDocument();
  });

  it('navigates to next step when Next button is clicked', async () => {
    render(<CheckoutForm cart={mockCart} onSubmit={mockOnSubmit} />);
    
    const nextButton = screen.getByRole('button', { name: /next/i });
    fireEvent.click(nextButton);
    
    await waitFor(() => {
      expect(screen.getByText('Delivery Speed')).toBeInTheDocument();
    });
  });

  it('navigates to previous step when Previous button is clicked', async () => {
    render(<CheckoutForm cart={mockCart} onSubmit={mockOnSubmit} />);
    
    // First go to step 2
    fireEvent.click(screen.getByRole('button', { name: /next/i }));
    await waitFor(() => {
      expect(screen.getByText('Delivery Speed')).toBeInTheDocument();
    });
    
    // Then go back to step 1
    const prevButton = screen.getByRole('button', { name: /previous/i });
    fireEvent.click(prevButton);
    
    await waitFor(() => {
      expect(screen.getByText('Shipping Address')).toBeInTheDocument();
    });
  });

  it('updates delivery speed selection', () => {
    render(<CheckoutForm cart={mockCart} onSubmit={mockOnSubmit} />);
    
    // Go to delivery speed step
    fireEvent.click(screen.getByRole('button', { name: /next/i }));
    
    const expressOption = screen.getByLabelText('Express Delivery');
    fireEvent.click(expressOption);
    
    expect(expressOption).toBeChecked();
  });

  it('updates payment method selection', () => {
    render(<CheckoutForm cart={mockCart} onSubmit={mockOnSubmit} />);
    
    // Go to payment method step
    fireEvent.click(screen.getByRole('button', { name: /next/i }));
    fireEvent.click(screen.getByRole('button', { name: /next/i }));
    
    const upiOption = screen.getByLabelText('UPI');
    fireEvent.click(upiOption);
    
    expect(upiOption).toBeChecked();
  });

  it('displays order summary with correct details', () => {
    render(<CheckoutForm cart={mockCart} onSubmit={mockOnSubmit} />);
    
    // Go to review step
    fireEvent.click(screen.getByRole('button', { name: /next/i }));
    fireEvent.click(screen.getByRole('button', { name: /next/i }));
    fireEvent.click(screen.getByRole('button', { name: /next/i }));
    
    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('$199.98')).toBeInTheDocument();
  });

  it('submits form with complete order data', async () => {
    render(<CheckoutForm cart={mockCart} onSubmit={mockOnSubmit} />);
    
    // Fill address form
    fireEvent.change(screen.getByLabelText(/full name/i), {
      target: { value: 'John Doe' },
    });
    fireEvent.change(screen.getByLabelText(/phone number/i), {
      target: { value: '+1234567890' },
    });
    fireEvent.change(screen.getByLabelText(/street address/i), {
      target: { value: '123 Main St' },
    });
    fireEvent.change(screen.getByLabelText(/city/i), {
      target: { value: 'Anytown' },
    });
    fireEvent.change(screen.getByLabelText(/state/i), {
      target: { value: 'CA' },
    });
    fireEvent.change(screen.getByLabelText(/zip code/i), {
      target: { value: '12345' },
    });
    
    // Go through steps
    fireEvent.click(screen.getByRole('button', { name: /next/i }));
    fireEvent.click(screen.getByRole('button', { name: /next/i }));
    fireEvent.click(screen.getByRole('button', { name: /next/i }));
    
    // Submit
    const submitButton = screen.getByRole('button', { name: /place order/i });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          shippingAddress: expect.objectContaining({
            name: 'John Doe',
            phone: '+1234567890',
            street: '123 Main St',
            city: 'Anytown',
            state: 'CA',
            zip: '12345',
          }),
          items: expect.arrayContaining([
            expect.objectContaining({
              id: '1',
              name: 'Test Product',
              price: 99.99,
              quantity: 2,
            })
          ]),
          subtotal: 199.98,
          shippingFee: 0,
          total: 199.98,
        })
      );
    });
  });

  it('disables submit button when loading', () => {
    render(<CheckoutForm cart={mockCart} onSubmit={mockOnSubmit} loading={true} />);
    
    const submitButton = screen.getByRole('button', { name: /processing/i });
    expect(submitButton).toBeDisabled();
  });
});