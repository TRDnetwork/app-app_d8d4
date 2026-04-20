import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CheckoutForm from '../../client/src/components/CheckoutForm';

describe('CheckoutForm', () => {
  const mockOnAddressSubmit = vi.fn();

  beforeEach(() => {
    mockOnAddressSubmit.mockClear();
  });

  it('renders all form fields correctly', () => {
    render(<CheckoutForm onAddressSubmit={mockOnAddressSubmit} />);

    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/apartment/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/city/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/state/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/zip/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/save this information/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /continue to delivery/i })).toBeInTheDocument();
  });

  it('submits form with valid data', async () => {
    render(<CheckoutForm onAddressSubmit={mockOnAddressSubmit} />);

    fireEvent.change(screen.getByLabelText(/first name/i), {
      target: { value: 'John' },
    });
    fireEvent.change(screen.getByLabelText(/last name/i), {
      target: { value: 'Doe' },
    });
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'john@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/address/i), {
      target: { value: '123 Main St' },
    });
    fireEvent.change(screen.getByLabelText(/city/i), {
      target: { value: 'Anytown' },
    });
    fireEvent.change(screen.getByLabelText(/state/i), {
      target: { value: 'CA' },
    });
    fireEvent.change(screen.getByLabelText(/zip/i), {
      target: { value: '12345' },
    });

    fireEvent.click(screen.getByRole('button', { name: /continue to delivery/i }));

    await waitFor(() => {
      expect(mockOnAddressSubmit).toHaveBeenCalledWith({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        address: '123 Main St',
        apartment: '',
        city: 'Anytown',
        state: 'CA',
        zip: '12345',
        saveAddress: false,
      });
    });
  });

  it('shows validation errors for missing required fields', async () => {
    render(<CheckoutForm onAddressSubmit={mockOnAddressSubmit} />);

    fireEvent.click(screen.getByRole('button', { name: /continue to delivery/i }));

    await waitFor(() => {
      expect(screen.getByText(/first name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/last name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
      expect(screen.getByText(/address is required/i)).toBeInTheDocument();
      expect(screen.getByText(/city is required/i)).toBeInTheDocument();
      expect(screen.getByText(/state is required/i)).toBeInTheDocument();
      expect(screen.getByText(/zip code is required/i)).toBeInTheDocument();
    });

    expect(mockOnAddressSubmit).not.toHaveBeenCalled();
  });

  it('shows validation error for invalid email', async () => {
    render(<CheckoutForm onAddressSubmit={mockOnAddressSubmit} />);

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'not-an-email' },
    });

    fireEvent.click(screen.getByRole('button', { name: /continue to delivery/i }));

    await waitFor(() => {
      expect(screen.getByText(/email is invalid/i)).toBeInTheDocument();
    });

    expect(mockOnAddressSubmit).not.toHaveBeenCalled();
  });

  it('handles apartment field correctly', () => {
    render(<CheckoutForm onAddressSubmit={mockOnAddressSubmit} />);

    const apartmentInput = screen.getByLabelText(/apartment/i);
    expect(apartmentInput).toBeInTheDocument();
    
    fireEvent.change(apartmentInput, {
      target: { value: 'Apt 101' },
    });

    fireEvent.click(screen.getByRole('button', { name: /continue to delivery/i }));

    expect(mockOnAddressSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        apartment: 'Apt 101',
      })
    );
  });

  it('handles save address checkbox correctly', async () => {
    render(<CheckoutForm onAddressSubmit={mockOnAddressSubmit} />);

    const saveAddressCheckbox = screen.getByLabelText(/save this information/i);
    expect(saveAddressCheckbox).not.toBeChecked();

    fireEvent.click(saveAddressCheckbox);
    expect(saveAddressCheckbox).toBeChecked();

    fireEvent.click(screen.getByRole('button', { name: /continue to delivery/i }));

    expect(mockOnAddressSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        saveAddress: true,
      })
    );
  });

  it('displays toast notification on validation error', async () => {
    const mockToast = vi.fn();
    vi.mock('@/components/ui/use-toast', () => ({
      useToast: () => ({ toast: mockToast })
    }));

    render(<CheckoutForm onAddressSubmit={mockOnAddressSubmit} />);

    fireEvent.click(screen.getByRole('button', { name: /continue to delivery/i }));

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Validation Error',
          description: 'Please fill in all required fields.',
          variant: 'destructive',
        })
      );
    });
  });
});