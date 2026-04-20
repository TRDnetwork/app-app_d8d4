import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ProductCard } from '../../client/src/components/ProductCard';

describe('ProductCard', () => {
  const mockProduct = {
    id: '1',
    name: 'Wireless Headphones',
    price: 99.99,
    originalPrice: 149.99,
    image: 'https://example.com/headphones.jpg',
    rating: 4.5,
    reviews: 124,
    discount: 33
  };

  const mockOnAddToCart = vi.fn();

  beforeEach(() => {
    mockOnAddToCart.mockClear();
  });

  it('renders product card with all information', () => {
    render(<ProductCard product={mockProduct} onAddToCart={mockOnAddToCart} />);

    expect(screen.getByAltText(mockProduct.name)).toBeInTheDocument();
    expect(screen.getByText(mockProduct.name)).toBeInTheDocument();
    expect(screen.getByText(`$${mockProduct.price}`)).toBeInTheDocument();
    expect(screen.getByText(`$${mockProduct.originalPrice}`)).toBeInTheDocument();
    expect(screen.getByText(`${mockProduct.discount}% OFF`)).toBeInTheDocument();
    expect(screen.getByText(`${mockProduct.reviews}`)).toBeInTheDocument();
  });

  it('displays correct number of filled stars based on rating', () => {
    render(<ProductCard product={mockProduct} onAddToCart={mockOnAddToCart} />);

    const stars = screen.getAllByRole('img', { hidden: true });
    expect(stars).toHaveLength(5);
    
    // First 4 stars should be filled (4.5 rounds to 4 full stars)
    for (let i = 0; i < 4; i++) {
      expect(stars[i]).toHaveAttribute('fill', 'currentColor');
    }
    
    // Last star should be empty
    expect(stars[4]).not.toHaveAttribute('fill');
  });

  it('calls onAddToCart when Add to Cart button is clicked', () => {
    render(<ProductCard product={mockProduct} onAddToCart={mockOnAddToCart} />);

    fireEvent.click(screen.getByRole('button', { name: /add to cart/i }));

    expect(mockOnAddToCart).toHaveBeenCalledWith(mockProduct);
  });

  it('does not show discount badge when no discount', () => {
    const productWithoutDiscount = { ...mockProduct, discount: undefined };
    render(<ProductCard product={productWithoutDiscount} onAddToCart={mockOnAddToCart} />);

    expect(screen.queryByText(/% off/i)).not.toBeInTheDocument();
  });

  it('does not show original price when no discount', () => {
    const productWithoutDiscount = { ...mockProduct, discount: undefined, originalPrice: undefined };
    render(<ProductCard product={productWithoutDiscount} onAddToCart={mockOnAddToCart} />);

    expect(screen.queryByText(`$${mockProduct.originalPrice}`)).not.toBeInTheDocument();
  });

  it('handles missing optional fields gracefully', () => {
    const minimalProduct = {
      id: '2',
      name: 'Basic Product',
      price: 49.99,
      image: 'https://example.com/product.jpg'
    };

    render(<ProductCard product={minimalProduct} onAddToCart={mockOnAddToCart} />);

    expect(screen.getByText(minimalProduct.name)).toBeInTheDocument();
    expect(screen.getByText(`$${minimalProduct.price}`)).toBeInTheDocument();
    expect(screen.queryByText(/% off/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/\(/)).not.toBeInTheDocument();
  });

  it('applies hover effects', () => {
    render(<ProductCard product={mockProduct} onAddToCart={mockOnAddToCart} />);

    const card = screen.getByTestId('product-card');
    
    // Initial state
    expect(card).not.toHaveClass('hover:shadow-lg');
    
    // Simulate hover
    fireEvent.mouseEnter(card);
    expect(card).toHaveClass('hover:shadow-lg');
  });
});