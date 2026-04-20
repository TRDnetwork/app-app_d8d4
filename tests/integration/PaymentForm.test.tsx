import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import PaymentForm from '../../client/src/components/PaymentForm';

describe('PaymentForm', () => {
  const mockOnBack = vi.fn();
  const mockOnPaymentSuccess = vi.fn();

  beforeEach(() => {
    mockOnBack.mockClear();
    mockOnPaymentSuccess.mockClear();
  });

  it('renders payment form with back button and Stripe checkout', () => {
    render(
      <PaymentForm 
        clientSecret="client_secret_123" 
        onBack={mockOnBack} 
        onPaymentSuccess={mockOnPaymentSuccess} 
      />
    );

    expect(screen.getByText(/← back to delivery options/i)).toBeInTheDocument();
    expect(screen.getByText(/payment/i)).toBeInTheDocument();
    expect(screen.getByText(/secure payment powered by stripe/i)).toBeInTheDocument();
  });

  it('calls onBack when back button is clicked', () => {
    render(
      <PaymentForm 
        clientSecret="client_secret_123" 
        onBack={