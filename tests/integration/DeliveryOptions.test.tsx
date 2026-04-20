import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { DeliveryOptions } from '../../src/components/checkout/DeliveryOptions';

describe('DeliveryOptions', () => {
  it('renders delivery options correctly', () => {
    render(<DeliveryOptions onSelect={vi.fn()} />);
    
    expect(screen.getByLabelText('Standard Delivery')).toBeInTheDocument();
    expect(screen.getByLabelText('Express Delivery')).toBeInTheDocument();
    expect(screen.getByLabelText('Same Day Delivery')).toBeInTheDocument();
  });

  it('displays delivery details for each option', () => {
    render(<DeliveryOptions onSelect={vi.fn()} />);
    
    expect(screen.getByText('Free')).toBeInTheDocument();
    expect(screen.getByText('$9.99')).toBeInTheDocument();
    expect(screen.getByText('$19.99')).toBeInTheDocument();
    
    expect(screen.getByText('5-7 business days')).toBeInTheDocument();
    expect(screen.getByText('2-3 business days')).toBeInTheDocument();
    expect(screen.getByText('Same day')).toBeInTheDocument();
  });

  it('calls onSelect with correct delivery speed when selected', () => {
    const onSelect = vi.fn();
    render(<DeliveryOptions onSelect={onSelect} />);
    
    const expressOption = screen.getByLabelText('Express Delivery');
    fireEvent.click(expressOption);
    
    expect(onSelect).toHaveBeenCalledWith('express');
  });

  it('updates selection when different option is chosen', () => {
    const onSelect = vi.fn();
    render(<DeliveryOptions onSelect={onSelect} />);
    
    const expressOption = screen.getByLabelText('Express Delivery');
    fireEvent.click(expressOption);
    
    const standardOption = screen.getByLabelText('Standard Delivery');
    fireEvent.click(standardOption);
    
    expect(onSelect).toHaveBeenCalledTimes(2);
    expect(onSelect).toHaveBeenCalledWith('standard');
  });

  it('has standard delivery selected by default', () => {
    render(<DeliveryOptions onSelect={vi.fn()} />);
    
    const standardOption = screen.getByLabelText('Standard Delivery');
    expect(standardOption).toBeChecked();
  });
});