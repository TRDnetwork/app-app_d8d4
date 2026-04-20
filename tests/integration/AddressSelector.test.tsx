import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { AddressSelector } from '../../src/components/checkout/AddressSelector';

describe('AddressSelector', () => {
  const mockAddresses = [
    {
      _id: '1',
      type: 'home',
      line1: '123 Main St',
      city: 'San Francisco',
      state: 'CA',
      postal_code: '94105',
      country: 'USA',
      is_default: true,
    },
    {
      _id: '2',
      type: 'work',
      line1: '456 Business Ave',
      city: 'San Francisco',
      state: 'CA',
      postal_code: '94105',
      country: 'USA',
      is_default: false,
    },
  ];

  it('renders address options correctly', () => {
    render(<AddressSelector addresses={mockAddresses} onSelect={vi.fn()} />);
    
    expect(screen.getByText('123 Main St')).toBeInTheDocument();
    expect(screen.getByText('San Francisco, CA 94105')).toBeInTheDocument();
    expect(screen.getByText('456 Business Ave')).toBeInTheDocument();
  });

  it('displays default address badge', () => {
    render(<AddressSelector addresses={mockAddresses} onSelect={vi.fn()} />);
    expect(screen.getByText('Default')).toBeInTheDocument();
  });

  it('calls onSelect when address is selected', () => {
    const onSelect = vi.fn();
    render(<AddressSelector addresses={mockAddresses} onSelect={onSelect} />);
    
    const addressElement = screen.getByText('123 Main St');
    fireEvent.click(addressElement);
    
    expect(onSelect).toHaveBeenCalledWith(mockAddresses[0]);
  });

  it('handles empty addresses array', () => {
    render(<AddressSelector addresses={[]} onSelect={vi.fn()} />);
    expect(screen.getByText('No addresses found')).toBeInTheDocument();
  });

  it('renders add new address button', () => {
    render(<AddressSelector addresses={mockAddresses} onSelect={vi.fn()} onAddNew={vi.fn()} />);
    expect(screen.getByText('Add New Address')).toBeInTheDocument();
  });

  it('calls onAddNew when add button is clicked', () => {
    const onAddNew = vi.fn();
    render(<AddressSelector addresses={mockAddresses} onSelect={vi.fn()} onAddNew={onAddNew} />);
    
    const addButton = screen.getByText('Add New Address');
    fireEvent.click(addButton);
    
    expect(onAddNew).toHaveBeenCalled();
  });
});