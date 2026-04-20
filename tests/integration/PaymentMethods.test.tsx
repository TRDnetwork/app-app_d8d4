import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { PaymentMethods } from '../../src/components/checkout/PaymentMethods';

describe('PaymentMethods', () => {
  it('renders payment method options correctly', () => {
    render(<PaymentMethods onSelect={vi.fn()} />);
    
    expect(screen.getByLabelText('Credit/Debit Card')).toBeInTheDocument();
    expect(screen.getByLabelText('UPI')).toBeInTheDocument();
    expect(screen.getByLabelText('Cash on Delivery')).toBeInTheDocument();
  });

  it('displays payment method details', () => {
    render(<PaymentMethods onSelect={vi.fn()} />);
    
    expect(screen.getByText('Pay securely with your credit or debit card')).toBeInTheDocument();
    expect(screen.getByText('Pay using UPI apps like PhonePe, Google Pay, etc.')).toBeInTheDocument();
    expect(screen.getByText('Pay when your order is delivered')).toBeInTheDocument();
  });

  it('calls onSelect with correct payment method when selected', () => {
    const onSelect = vi.fn();
    render(<PaymentMethods onSelect={onSelect} />);
    
    const upiOption = screen.getByLabelText('UPI');
    fireEvent.click(upiOption);
    
    expect(onSelect).toHaveBeenCalledWith('upi');
  });

  it('updates selection when different payment method is chosen', () => {
    const onSelect = vi.fn();
    render(<PaymentMethods onSelect={onSelect} />);
    
    const upiOption = screen.getByLabelText('UPI');
    fireEvent.click(upiOption);
    
    const codOption = screen.getByLabelText('Cash on Delivery');
    fireEvent.click(codOption);
    
    expect(onSelect).toHaveBeenCalledTimes(2);
    expect(onSelect).toHaveBeenCalledWith('cod');
  });

  it('has credit card selected by default', () => {
    render(<PaymentMethods onSelect={vi.fn()} />);
    
    const cardOption = screen.getByLabelText('Credit/Debit Card');
    expect(cardOption).toBeChecked();
  });

  it('displays accepted card icons for credit card option', () => {
    render(<PaymentMethods onSelect={vi.fn()} />);
    
    expect(screen.getByAltText('Visa')).toBeInTheDocument();
    expect(screen.getByAltText('Mastercard')).toBeInTheDocument();
    expect(screen.getByAltText('American Express')).toBeInTheDocument();
  });
});