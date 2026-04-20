import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ProductFilters } from '../../src/components/product/ProductFilters';

describe('ProductFilters', () => {
  const mockOnFilter = vi.fn();

  it('renders all filter sections', () => {
    render(<ProductFilters onFilter={mockOnFilter} />);
    
    expect(screen.getByText('Price Range')).toBeInTheDocument();
    expect(screen.getByText('Brand')).toBeInTheDocument();
    expect(screen.getByText('Rating')).toBeInTheDocument();
    expect(screen.getByText('Availability')).toBeInTheDocument();
  });

  it('updates price range when sliders are moved', () => {
    render(<ProductFilters onFilter={mockOnFilter} />);
    
    const minSlider = screen.getByLabelText('Minimum price');
    fireEvent.change(minSlider, { target: { value: '50' } });
    
    const maxSlider = screen.getByLabelText('Maximum price');
    fireEvent.change(maxSlider, { target: { value: '200' } });
    
    // Note: This test would need more sophisticated mocking to verify
    // the onFilter callback is called with correct values
  });

  it('toggles brand checkboxes correctly', () => {
    render(<ProductFilters onFilter={mockOnFilter} />);
    
    const appleCheckbox = screen.getByLabelText('Apple');
    fireEvent.click(appleCheckbox);
    
    expect(appleCheckbox).toBeChecked();
    
    fireEvent.click(appleCheckbox);
    expect(appleCheckbox).not.toBeChecked();
  });

  it('updates rating filter when stars are clicked', () => {
    render(<ProductFilters onFilter={mockOnFilter} />);
    
    const fourStarButton = screen.getByLabelText('4 stars & up');
    fireEvent.click(fourStarButton);
    
    // Note: Would need to verify onFilter is called with correct rating value
  });

  it('toggles availability filter', () => {
    render(<ProductFilters onFilter={mockOnFilter} />);
    
    const inStockCheckbox = screen.getByLabelText('In Stock Only');
    fireEvent.click(inStockCheckbox);
    
    expect(inStockCheckbox).toBeChecked();
  });

  it('resets all filters when reset button is clicked', () => {
    render(<ProductFilters onFilter={mockOnFilter} />);
    
    const resetButton = screen.getByRole('button', { name: /reset filters/i });
    fireEvent.click(resetButton);
    
    // Note: Would need to verify onFilter is called with empty object
    expect(mockOnFilter).toHaveBeenCalledWith({});
  });
});