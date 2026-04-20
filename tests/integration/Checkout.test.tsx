import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Checkout from '../../src/pages/Checkout';

describe('Checkout', () => {
  it('renders checkout steps correctly', () => {
    render(<Checkout />);
    
    expect(screen.getByText('Checkout')).toBeInTheDocument();
    expect(screen.getByText('Shipping Address')).toBeInTheDocument();
    expect(screen.getByText('Delivery Options')).toBeInTheDocument();
    expect(screen.getByText('Payment Method')).toBeInTheDocument();
    expect(screen.getByText('Order Review')).toBeInTheDocument();
  });

  it('displays address selector component', () => {
    render(<Checkout />);
    
    expect(screen.getByText('Select Address')).toBeInTheDocument();
    expect(screen.getByText('Add New Address')).toBeInTheDocument();
  });

  it('renders delivery options component', () => {
    render(<Checkout />);
    
    expect(screen.getByText('Delivery Speed')).toBeInTheDocument();
    expect(screen.getByLabelText('Standard Delivery')).toBeInTheDocument();
    expect(screen.getByLabelText('Express Delivery')).toBeInTheDocument();
  });

  it('displays payment methods component', () => {
    render(<Checkout />);
    
    expect(screen.getByText('Payment Method')).toBeInTheDocument();
    expect(screen.getByLabelText('Credit/Debit Card')).toBeInTheDocument();
    expect(screen.getByLabelText('UPI')).toBeInTheDocument();
  });

  it('shows order review component', () => {
    render(<Checkout />);
    
    expect(screen.getByText('Order Summary')).toBeInTheDocument();
    expect(screen.getByText('Subtotal')).toBeInTheDocument();
    expect(screen.getByText('Total')).toBeInTheDocument();
  });

  it('renders place order button', () => {
    render(<Checkout />);
    
    const placeOrderButton = screen.getByRole('link', { name: /place order/i });
    expect(placeOrderButton).toBeInTheDocument();
    expect(placeOrderButton).toHaveAttribute('href', '/order-confirmation');
  });
});