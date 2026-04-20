import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ProductCard from '../../src/components/product/ProductCard';

describe('ProductCard', () => {
  const mockProduct = {
    _id: '123',
    title: 'Wireless Headphones',
    price: 99.99,
    original_price: 149.99,
    discount_percent: 33,
    images: ['headphones.jpg'],
    rating: 4.5,
  };

  it('renders product title and price correctly', () => {
    render(<ProductCard product={mockProduct} />);
    
    expect(screen.getByText('Wireless Headphones')).toBeInTheDocument();
    expect(screen.getByText('$99.99')).toBeInTheDocument();
  });

  it('displays original price with strikethrough when on sale', () => {
    render(<ProductCard product={mockProduct} />);
    
    const originalPrice = screen.getByText('$149.99');
    expect(originalPrice).toBeInTheDocument();
    expect(originalPrice).toHaveClass('line-through');
  });

  it('shows discount badge when product is on sale', () => {
    render(<ProductCard product={mockProduct} />);
    
    const discountBadge = screen.getByText('-33%');
    expect(discountBadge).toBeInTheDocument();
    expect(discountBadge).toHaveClass('bg-warning');
  });

  it('renders product image with correct alt text', () => {
    render(<ProductCard product={mockProduct} />);
    
    const image = screen.getByAltText('Wireless Headphones');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'headphones.jpg');
  });

  it('displays rating when available', () => {
    render(<ProductCard product={mockProduct} />);
    
    const rating = screen.getByText('4.5');
    expect(rating).toBeInTheDocument();
  });

  it('shows "Add to Cart" button', () => {
    render(<ProductCard product={mockProduct} />);
    
    const addButton = screen.getByRole('button', { name: /add to cart/i });
    expect(addButton).toBeInTheDocument();
  });
});