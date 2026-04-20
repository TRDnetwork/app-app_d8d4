import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ProductSort } from '../../src/components/product/ProductSort';

describe('ProductSort', () => {
  const mockOnChange = vi.fn();

  it('renders sort dropdown with correct options', () => {
    render(<ProductSort value="newest" onChange={mockOnChange} />);
    
    const select = screen.getByRole('combobox');
    expect(select).toHaveValue('newest');
    
    expect(screen.getByText('Price: Low to High')).toBeInTheDocument();
    expect(screen.getByText('Price: High to Low')).toBeInTheDocument();
    expect(screen.getByText('Newest')).toBeInTheDocument();
    expect(screen.getByText('Best Selling')).toBeInTheDocument();
    expect(screen.getByText('Avg Rating')).toBeInTheDocument();
  });

  it('calls onChange when sort option is changed', () => {
    render(<ProductSort value="newest" onChange={mockOnChange} />);
    
    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'price-asc' } });
    
    expect(mockOnChange).toHaveBeenCalledWith('price-asc');
  });

  it('displays correct label for each sort option', () => {
    render(<ProductSort value="newest" onChange={mockOnChange} />);
    
    const select = screen.getByRole('combobox');
    expect(select).toHaveValue('newest');
    
    fireEvent.change(select, { target: { value: 'price-desc' } });
    expect(select).toHaveValue('price-desc');
  });
});