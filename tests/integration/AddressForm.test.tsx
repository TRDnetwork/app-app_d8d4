import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AddressForm } from '../../src/components/AddressForm';

describe('AddressForm', () => {
  it('submits with valid address data', async () => {
    const onSubmit = vi.fn();
    render(<AddressForm onSubmit={onSubmit} />);

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
    fireEvent.change(screen.getByLabelText(/country/i), {
      target: { value: 'USA' },
    });
    fireEvent.click(screen.getByRole('button', { name: /save address/i }));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        name: 'John Doe',
        phone: '+1234567890',
        street: '123 Main St',
        city: 'Anytown',
        state: 'CA',
        zip: '12345',
        country: 'USA',
      });
    });
  });

  it('shows validation error for invalid phone number', async () => {
    render(<AddressForm onSubmit={vi.fn()} />);
    fireEvent.change(screen.getByLabelText(/phone number/i), {
      target: { value: 'invalid-phone' },
    });
    fireEvent.click(screen.getByRole('button', { name: /save address/i }));

    expect(await screen.findByText(/valid phone/i)).toBeInTheDocument();
  });

  it('shows validation error for short zip code', async () => {
    render(<AddressForm onSubmit={vi.fn()} />);
    fireEvent.change(screen.getByLabelText(/zip code/i), {
      target: { value: '123' },
    });
    fireEvent.click(screen.getByRole('button', { name: /save address/i }));

    expect(await screen.findByText(/valid zip/i)).toBeInTheDocument();
  });

  it('shows validation error for empty required fields', async () => {
    render(<AddressForm onSubmit={vi.fn()} />);
    fireEvent.click(screen.getByRole('button', { name: /save address/i }));

    expect(await screen.findByText(/required/i)).toBeInTheDocument();
  });

  it('submits with UK address format', async () => {
    const onSubmit = vi.fn();
    render(<AddressForm onSubmit={onSubmit} />);

    fireEvent.change(screen.getByLabelText(/country/i), {
      target: { value: 'UK' },
    });
    fireEvent.change(screen.getByLabelText(/zip code/i), {
      target: { value: 'SW1A 1AA' },
    });
    fireEvent.click(screen.getByRole('button', { name: /save address/i }));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          country: 'UK',
          zip: 'SW1A 1AA',
        })
      );
    });
  });
});