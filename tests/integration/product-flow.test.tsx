
```
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useCartStore } from '../../src/stores/cartStore';
import { useWishlistStore } from '../../src/stores/wishlistStore';
import ProductDetail from '../../src/pages/ProductDetail';
import { productApi } from '../../src/lib/api';

// Mock API calls
vi.mock('../../src/lib/api', () => ({
  productApi: {
    getProductBySlug: vi.fn(),
    getReviews: vi.fn(),
    getQuestions: vi.fn(),
    askQuestion: vi.fn(),
  },
}));

// Mock router
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useParams: () => ({ slug: 'test-product' }),
  };
});

describe('Product Flow', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useCartStore.getState().clear();
    useWishlistStore.getState().items = [];
  });

  it('displays product details correctly', async () => {
    const mockProduct = {
      _id: '1',
      title: 'Test Product',
      price: 99.99,
      original_price: 129.99,
      description: 'This is a test product description.',
      images: ['https://example.com/image1.jpg', 'https://example.com/image2.jpg'],
      brand: 'Test Brand',
      discount_percent: 23,
      variants: [{ name: 'Color', values: ['Red', 'Blue'], price_modifier: 0 }],
      reviews: [],
      questions: [],
    };
    (productApi.getProductBySlug as any).mockResolvedValue({ product: mockProduct });
    
    render(<ProductDetail />);
    
    await waitFor(() => {
      expect(screen.getByText('Test Product')).toBeInTheDocument();
      expect(screen.getByText('Test Brand')).toBeInTheDocument();
      expect(screen.getByText('$99.99')).toBeInTheDocument();
      expect(screen.getByText('$129.99')).toBeInTheDocument();
      expect(screen.getByText('Save 23%')).toBeInTheDocument();
      expect(screen.getByText('This is a test product description.')).toBeInTheDocument();
      expect(screen.getAllByAltText('Product image')).toHaveLength(2);
    });
  });

  it('adds product to cart', async () => {
    const mockProduct = {
      _id: '1',
      title: 'Test Product',
      price: 99.99,
      images: ['https://example.com/image1.jpg'],
    };
    (productApi.getProductBySlug as any).mockResolvedValue({ product: mockProduct });
    
    render(<ProductDetail />);
    
    await waitFor(() => {
      expect(screen.getByText('Test Product')).toBeInTheDocument();
    });
    
    fireEvent.click(screen.getByText('Add to Cart'));
    
    expect(useCartStore.getState().items).toHaveLength(1);
    expect(useCartStore.getState().items[0].product_id).toBe('1');
    expect(useCartStore.getState().items[0].name).toBe('Test Product');
    expect(useCartStore.getState().items[0].price).toBe(99.99);
    expect(useCartStore.getState().items[0].quantity).toBe(1);
  });

  it('adds product to wishlist', async () => {
    const mockProduct = {
      _id: '1',
      title: 'Test Product',
      price: 99.99,
      images: ['https://example.com/image1.jpg'],
    };
    (productApi.getProductBySlug as any).mockResolvedValue({ product: mockProduct });
    
    render(<ProductDetail />);
    
    await waitFor(() => {
      expect(screen.getByText('Test Product')).toBeInTheDocument();
    });
    
    fireEvent.click(screen.getByText('Save to Wishlist'));
    
    expect(useWishlistStore.getState().items).toHaveLength(1);
    expect(useWishlistStore.getState().items[0].product_id).toBe('1');
    expect(useWishlistStore.getState().items[0].name).toBe('Test Product');
    expect(useWishlistStore.getState().items[0].price).toBe(99.99);
  });

  it('displays product reviews', async () => {
    const mockProduct = {
      _id: '1',
      title: 'Test Product',
      price: 99.99,
      images: ['https://example.com/image1.jpg'],
    };
    const mockReviews = {
      reviews: [
        { _id: '1', rating: 5, title: 'Great product!', comment: 'I love this product.', user: { name: 'John Doe' } },
        { _id: '2', rating: 4, title: 'Good value', comment: 'Worth the price.', user: { name: 'Jane Smith' } },
      ],
      stats: { average_rating: 4.5, total_reviews: 2 },
    };
    (productApi.getProductBySlug as any).mockResolvedValue({ product: mockProduct });
    (productApi.getReviews as any).mockResolvedValue(mockReviews);
    
    render(<ProductDetail />);
    
    await waitFor(() => {
      expect(screen.getByText('Customer Reviews')).toBeInTheDocument();
      expect(screen.getByText('Great product!')).toBeInTheDocument();
      expect(screen.getByText('I love this product.')).toBeInTheDocument();
      expect(screen.getByText('Good value')).toBeInTheDocument();
      expect(screen.getByText('Worth the price.')).toBeInTheDocument();
    });
  });

  it('displays product Q&A', async () => {
    const mockProduct = {
      _id: '1',
      title: 'Test Product',
      price: 99.99,
      images: ['https://example.com/image1.jpg'],
    };
    const mockQuestions = {
      questions: [
        { _id: '1', question: 'Does this work with Android?', answer: 'Yes, it works with all Android phones.', user: { name: 'User1' }, answered_by_user: { name: 'Seller' } },
        { _id: '2', question: 'What is the warranty?', answer: '1 year warranty included.', user: { name: 'User2' }, answered_by_user: { name: 'Seller' } },
      ],
    };
    (productApi.getProductBySlug as any).mockResolvedValue({ product: mockProduct });
    (productApi.getQuestions as any).mockResolvedValue(mockQuestions);
    
    render(<ProductDetail />);
    
    await waitFor(() => {
      expect(screen.getByText('Q&A')).toBeInTheDocument();
      expect(screen.getByText('Does this work with Android?')).toBeInTheDocument();
      expect(screen.getByText('Yes, it works with all Android phones.')).toBeInTheDocument();
      expect(screen.getByText('What is the warranty?')).toBeInTheDocument();
      expect(screen.getByText('1 year warranty included.')).toBeInTheDocument();
    });
  });
});
```