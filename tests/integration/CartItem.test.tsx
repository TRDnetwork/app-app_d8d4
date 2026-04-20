import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CartItem } from '../../src/components/CartItem';

describe('CartItem', () => {
  const mockItem = {
    id: '1',
    name: 'Test Product',
    price: 99.99,
    quantity: 2,
    image: 'https://via.placeholder.com/100',
    onRemove: vi.fn(),
    onUpdateQuantity: vi.fn(),
  };

  it('renders product name, price, and quantity', () => {
    render(<CartItem {...mockItem} />);
    
    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('$99.99')).toBeInTheDocument();
    expect(screen.getByDisplayValue('2')).toBeInTheDocument();
  });

  it('displays correct total price', () => {
    render(<CartItem {...mockItem} />);
    
    expect(screen.getByText('$199.98')).toBeInTheDocument();
  });

  it('renders product image with correct src', () => {
    render(<CartItem {...mockItem} />);
    
    const image = screen.getByAltText('Test Product');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'https://via.placeholder.com/100');
  });

  it('calls onRemove when remove button is clicked', () => {
    render(<CartItem {...mockItem} />);
    
    const removeButton = screen.getByRole('button', { name: /remove/i });
    fireEvent.click(removeButton);
    
    expect(mockItem.onRemove).toHaveBeenCalledWith('1');
  });

  it('calls onUpdateQuantity when quantity is changed', () => {
    render(<CartItem {...mockItem} />);
    
    const quantityInput = screen.getByDisplayValue('2');
    fireEvent.change(quantityInput, { target: { value: '3' } });
    
    expect(mockItem.onUpdateQuantity).toHaveBeenCalledWith('1', 3);
  });

  it('prevents quantity from being less than 1', () => {
    render(<CartItem {...mockItem} />);
    
    const quantityInput = screen.getByDisplayValue('2');
    fireEvent.change(quantityInput, { target: { value: '0' } });
    
    expect(quantityInput).toHaveValue(1);
    expect(mockItem.onUpdateQuantity).toHaveBeenCalledWith('1', 1);
  });

  it('formats price with two decimal places', () => {
    const itemWithDecimalPrice = { ...mockItem, price: 10.5 };
    render(<CartItem {...itemWithDecimalPrice} />);
    
    expect(screen.getByText('$10.50')).toBeInTheDocument();
  });

  it('displays loading state when updating quantity', () => {
    render(<CartItem {...mockItem} isUpdating={true} />);
    
    const updateButton = screen.getByRole('button', { name: /updating/i });
    expect(updateButton).toBeDisabled();
    expect(updateButton).toHaveTextContent('Updating...');
  });
});