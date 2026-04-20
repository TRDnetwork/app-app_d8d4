import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ProductDetail from '../../src/pages/ProductDetail';

describe('ProductDetail', () => {
  const mockProduct = {
    _id: '123',
    title: 'Wireless Headphones',
    slug: 'wireless-headphones',
    description: 'Premium wireless headphones with noise cancellation.',
    price: 99.99,
    original_price: 149.99,
    discount_percent: 33,
    images: ['headphones-1.jpg', 'headphones-2.jpg'],
    brand: 'SoundMax',
    category_id: 'electronics',
    stock_quantity: 50,
    variants: [
      {
        name: 'Color',
        values: ['Black', 'White', 'Blue'],
        price_modifier: 0,
      },
    ],
    tags: ['audio', 'wireless', 'premium'],
    is_featured: true,
    status: 'active',
  };

  it('renders product title and brand', () => {
    render(<ProductDetail product={mockProduct} />);
    
    expect(screen.getByText('Wireless Headphones')).toBeInTheDocument();
    expect(screen.getByText('SoundMax')).toBeInTheDocument();
  });

  it('displays product price and discount information', () => {
    render(<ProductDetail product={mockProduct} />);
    
    expect(screen.getByText('$99.99')).toBeInTheDocument();
    expect(screen.getByText('$149.99')).toBeInTheDocument();
    expect(screen.getByText('-33%')).toBeInTheDocument();
  });

  it('shows product description', () => {
    render(<ProductDetail product={mockProduct} />);
    
    expect(screen.getByText('Premium wireless headphones with noise cancellation.')).toBeInTheDocument();
  });

  it('renders image gallery with product images', () => {
    render(<ProductDetail product={mockProduct} />);
    
    const mainImage = screen.getByAltText('Wireless Headphones');
    expect(mainImage).toBeInTheDocument();
    expect(mainImage).toHaveAttribute('src', 'headphones-1.jpg');
    
    // Check for thumbnails
    expect(screen.getAllByRole('img')).toHaveLength(3); // main image + 2 thumbnails
  });

  it('displays variant selector when variants are available', () => {
    render(<ProductDetail product={mockProduct} />);
    
    expect(screen.getByText('Select Options')).toBeInTheDocument();
    expect(screen.getByText('Color')).toBeInTheDocument();
    
    // Check for color options
    expect(screen.getByText('Black')).toBeInTheDocument();
    expect(screen.getByText('White')).toBeInTheDocument();
    expect(screen.getByText('Blue')).toBeInTheDocument();
  });

  it('shows stock status indicator', () => {
    render(<ProductDetail product={mockProduct} />);
    
    const stockIndicator = screen.getByText('In Stock');
    expect(stockIndicator).toBeInTheDocument();
    expect(stockIndicator).toHaveClass('bg-success');
  });

  it('renders add to cart and wishlist buttons', () => {
    render(<ProductDetail product={mockProduct} />);
    
    expect(screen.getByRole('button', { name: /add to cart/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /save to wishlist/i })).toBeInTheDocument();
  });

  it('displays product details section', () => {
    render(<ProductDetail product={mockProduct} />);
    
    expect(screen.getByText('Product Details')).toBeInTheDocument();
    expect(screen.getByText('SKU')).toBeInTheDocument();
    expect(screen.getByText('Category')).toBeInTheDocument();
  });
});