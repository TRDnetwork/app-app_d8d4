import React, { useState } from 'react';
import { Button } from '../components/ui/button';
import { ImageGallery } from '../components/product/ImageGallery';
import { VariantSelector } from '../components/product/VariantSelector';
import { ReviewList } from '../components/product/ReviewList';
import { QASection } from '../components/product/QASection';
import { Product } from '../types';
import { cartStore } from '../stores/cartStore';
import { wishlistStore } from '../stores/wishlistStore';

const mockProduct: Product = {
  _id: 'p1',
  seller_id: 's1',
  title: 'Premium Wireless Headphones',
  slug: 'premium-wireless-headphones',
  description: 'Experience crystal-clear audio with our premium wireless headphones. Featuring active noise cancellation, 30-hour battery life, and comfortable over-ear design.',
  category_id: 'c1',
  brand: 'AudioPro',
  price: 199.99,
  original_price: 299.99,
  discount_percent: 33,
  sku: 'AP-WH100',
  stock_quantity: 15,
  images: [
    'https://via.placeholder.com/600x600?text=Main+Image',
    'https://via.placeholder.com/600x600?text=Side+View',
    'https://via.placeholder.com/600x600?text=Detail+Shot',
    'https://via.placeholder.com/600x600?text=In+Use',
  ],
  variants: [
    {
      name: 'Color',
      values: ['Black', 'White', 'Blue'],
      price_modifier: 0,
    },
  ],
  tags: ['audio', 'wireless', 'headphones'],
  is_featured: true,
  is_sponsored: true,
  status: 'active',
  views: 1250,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-15T00:00:00Z',
};

const ProductDetail: React.FC = () => {
  const [selectedVariant, setSelectedVariant] = useState<string[]>([]);
  const [quantity, setQuantity] = useState(1);
  const addToCart = cartStore((state) => state.add);
  const toggleWishlist = wishlistStore((state) => state.toggle);
  const isInWishlist = wishlistStore((state) => state.has(mockProduct._id));

  const handleAddToCart = () => {
    addToCart(mockProduct, selectedVariant.join('-'), quantity);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Image Gallery */}
        <div>
          <ImageGallery images={mockProduct.images} />
        </div>

        {/* Product Info */}
        <div>
          <div className="flex items-center gap-4 mb-4">
            <h1 className="text-3xl font-bold text-text">{mockProduct.title}</h1>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => toggleWishlist(mockProduct)}
              className={isInWishlist ? 'text-accent' : ''}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill={isInWishlist ? 'currentColor' : 'none'}
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
            </Button>
          </div>

          <div className="flex items-center gap-2 mb-4">
            <div className="flex text-accent">
              {'★'.repeat(4)}{'☆'.repeat(1)}
            </div>
            <