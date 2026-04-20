import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ProductCard } from '../../src/components/ProductCard';

describe('ProductCard', () => {
  const mockProduct = {
    id: '1',
    name: 'Test Product',
    price: 99.99,
    originalPrice: 129.99,
    discountPercent: 23,
    image: 'https://via.placeholder.com/300',
    rating: 4.5,
    reviewCount: 124,
  };

  it('renders product name and price', () => {
    render(<ProductCard product={mockProduct} />);
    
    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('$99.99')).toBeInTheDocument();
  });

  it('displays original price with strikethrough', () => {
    render(<ProductCard product={mockProduct} />);
    
    const originalPrice = screen.getByText('$129.99');
    expect(originalPrice).toBeInTheDocument();
    expect(originalPrice).toHaveClass('line-through');
  });

  it('shows discount percentage', () => {
    render(<ProductCard product={mockProduct} />);
    
    expect(screen.getByText('23% off')).toBeInTheDocument();
  });

  it('renders product image with correct src', () => {
    render(<ProductCard product={mockProduct} />);
    
    const image = screen.getByAltText('Test Product');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'https://via.placeholder.com/300');
  });

  it('displays rating stars', () => {
    render(<ProductCard product={mockProduct} />);
    
    const ratingElement = screen.getByText('4.5');
    expect(ratingElement).toBeInTheDocument();
  });

  it('shows review count', () => {
    render(<ProductCard product={mockProduct} />);
    
    expect(screen.getByText('124 reviews')).toBeInTheDocument();
  });

  it('applies correct styling for high rating', () => {
    const highRatingProduct = { ...mockProduct, rating: 4.8 };
    render(<ProductCard product={highRatingProduct} />);
    
    const ratingElement = screen.getByText('4.8');
    expect(ratingElement).toHaveClass('text-green-500');
  });

  it('applies correct styling for medium rating', () => {
    const mediumRatingProduct = { ...mockProduct, rating: 3.5 };
    render(<ProductCard product={mediumRatingProduct} />);
    
    const ratingElement = screen.getByText('3.5');
    expect(ratingElement).toHaveClass('text-yellow-500');
  });

  it('applies correct styling for low rating', () => {
    const lowRatingProduct = { ...mockProduct, rating: 2.0 };
    render(<ProductCard product={lowRatingProduct} />);
    
    const ratingElement = screen.getByText('2.0');
    expect(ratingElement).toHaveClass('text-red-500');
  });
});