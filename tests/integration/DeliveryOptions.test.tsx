import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import DeliveryOptions from '../../client/src/components/DeliveryOptions';

describe('DeliveryOptions', () => {
  const mockOnDeliverySelect = vi.fn();

  beforeEach(() => {
    mockOnDeliverySelect.mockClear();
  });

  it('renders all delivery options correctly', () => {
    render(<DeliveryOptions onDeliverySelect={mockOnDeliverySelect} />);

    expect(screen.getByText(/standard delivery/i)).toBeInTheDocument();
    expect(screen.getByText(/arrives in 5-7 business days/i)).toBeInTheDocument();
    expect(screen.getByText(/free/i)).toBeInTheDocument();

    expect(screen.getByText(/express delivery/i)).toBeInTheDocument();
    expect(screen.getByText(/arrives in 2-3 business days/i)).toBeInTheDocument();
    expect(screen.getByText(/\$9.99/i)).toBeInTheDocument();

    expect(screen.getByText(/same-day delivery/i)).toBeInTheDocument();
    expect(screen.getByText(/delivery today if ordered within 2 hours/i)).toBeInTheDocument();
    expect(screen.getByText(/\$19.99/i)).toBeInTheDocument();
  });

  it('allows selection of delivery option', () => {
    render(<DeliveryOptions onDeliverySelect={mockOnDeliverySelect} />);

    const expressOption = screen.getByText(/express delivery/i).closest('div');
    expect(expressOption).not.toHaveClass('border-orange-500');

    fireEvent.click(expressOption!);

    expect(expressOption).toHaveClass('border-orange-500');
    expect(screen.getByLabelText(/express delivery/i)).toBeChecked();
  });

  it('calls onDeliverySelect with correct option when continue button is clicked', () => {
    render(<DeliveryOptions onDeliverySelect={mockOnDeliverySelect} />);

    // Select Express Delivery
    const expressOption = screen.getByText(/express delivery/i).closest('div');
    fireEvent.click(expressOption!);

    // Click Continue
    fireEvent.click(screen.getByRole('button', { name: /continue to payment/i }));

    expect(mockOnDeliverySelect).toHaveBeenCalledWith({
      id: 'express',
      name: 'Express Delivery',
      description: 'Arrives in 2-3 business days',
      price: 9.99,
    });
  });

  it('defaults to standard delivery', () => {
    render(<DeliveryOptions onDeliverySelect={mockOnDeliverySelect} />);

    const standardOption = screen.getByText(/standard delivery/i).closest('div');
    expect(standardOption).toHaveClass('border-orange-500');
    expect(screen.getByLabelText(/standard delivery/i)).toBeChecked();
  });

  it('updates selected option when different option is clicked', () => {
    render(<DeliveryOptions onDeliverySelect={mockOnDeliverySelect} />);

    const standardOption = screen.getByText(/standard delivery/i).closest('div');
    const expressOption = screen.getByText(/express delivery/i).closest('div');

    expect(standardOption).toHaveClass('border-orange-500');
    expect(expressOption).not.toHaveClass('border-orange-500');

    fireEvent.click(expressOption!);

    expect(standardOption).not.toHaveClass('border-orange-500');
    expect(expressOption).toHaveClass('border-orange-500');
  });
});