import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { ImageGallery } from '../components/product/ImageGallery';
import { VariantSelector } from '../components/product/VariantSelector';
import { ReviewList } from '../components/product/ReviewList';
import { QASection } from '../components/product/QASection';
import { Product } from '../types';
import { cartStore } from '../stores/cartStore';
import { wishlistStore } from '../stores/wishlistStore';
import { trackProductView, trackAddToCart, trackWishlistAdd, trackWishlistRemove, trackCTAClick } from '../lib/analytics';

// Mock data for product detail
const mockProduct = {
  _id: '123',
  title: 'Wireless Headphones Pro',
  slug: 'wireless-headphones-pro',
  description: 'Premium wireless headphones with active noise cancellation, 30-hour battery life, and crystal clear audio quality. Perfect for music lovers and professionals alike.',
  price: 129.99,
  original_price: 199.99,
  discount_percent: 35,
  images: [
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&h=600&fit=crop'
  ],
  brand: 'SoundMax',
  category: { name: 'Electronics', slug: 'electronics' },
  stock_quantity: 15,
  variants: [
    {
      name: 'Color',
      values: ['Black', 'White', 'Blue'],
      price_modifier: 0
    },
    {
      name: 'Storage',
      values: ['128GB', '256GB'],
      price_modifier: 0
    }
  ],
  tags: ['audio', 'wireless', 'premium'],
  is_featured: true,
  status: 'active',
  rating: 4.5,
  reviews: 128
};

const mockReviews = [
  {
    _id: '1',
    user: { name: 'John D.' },
    rating: 5,
    title: 'Excellent sound quality',
    comment: 'These headphones exceed my expectations. The noise cancellation is amazing and the battery life is impressive.',
    helpful_votes: 24,
    verified_purchase: true,
    created_at: '2024-01-15'
  },
  {
    _id: '2',
    user: { name: 'Sarah M.' },
    rating: 4,
    title: 'Great value for money',
    comment: 'Very comfortable to wear for long periods. Sound quality is excellent for the price point.',
    helpful_votes: 18,
    verified_purchase: true,
    created_at: '2024-01-10'
  }
];

const mockQuestions = [
  {
    _id: '1',
    user: { name: 'Mike R.' },
    question: 'Does this support Bluetooth 5.0?',
    answer: 'Yes, these headphones support Bluetooth 5.0 with extended range and improved connectivity.',
    answered_by: { name: 'ShopSphere Support' },
    created_at: '2024-01-20',
    answered_at: '2024-01-20'
  },
  {
    _id: '2',
    user: { name: 'Lisa T.' },
    question: 'What\'s the warranty period?',
    answer: 'These headphones come with a 2-year manufacturer warranty.',
    answered_by: { name: 'ShopSphere Support' },
    created_at: '2024-01-18',
    answered_at: '2024-01-18'
  }
];

const ProductDetail: React.FC = () => {
  const [selectedVariant, setSelectedVariant] = useState<string[]>([]);
  const [quantity, setQuantity] = useState(1);
  const addToCart = cartStore((state) => state.add);
  const toggleWishlist = wishlistStore((state) => state.toggle);
  const isInWishlist = wishlistStore((state) => state.has(mockProduct._id));

  // Track product view when component mounts
  useEffect(() => {
    trackProductView(mockProduct._id, {
      product_name: mockProduct.title,
      price: mockProduct.price,
      category: mockProduct.category?.name,
      brand: mockProduct.brand,
      in_stock: mockProduct.stock_quantity > 0
    });
  }, []);

  const handleAddToCart = () => {
    addToCart(mockProduct, selectedVariant.join('-'), quantity);
    
    trackAddToCart(mockProduct._id, quantity, mockProduct.price, {
      product_name: mockProduct.title,
      variant: selectedVariant.join('-'),
      quantity,
      price: mockProduct.price
    });
  };

  const handleWishlistToggle = () => {
    const action = isInWishlist ? 'remove' : 'add';
    toggleWishlist(mockProduct);
    
    if (action === 'add') {
      trackWishlistAdd(mockProduct._id, {
        product_name: mockProduct.title,
        price: mockProduct.price
      });
    } else {
      trackWishlistRemove(mockProduct._id, {
        product_name: mockProduct.title
      });
    }
  };

  const handleShare = () => {
    trackCTAClick('share', 'product_detail', {
      product_id: mockProduct._id,
      product_name: mockProduct.title
    });
  };

  const handleAskQuestion = () => {
    trackCTAClick('ask_question', 'product_detail', {
      product_id: mockProduct._id,
      product_name: mockProduct.title
    });
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="grid grid-cols-1 gap-6">
        {/* Mobile-optimized image gallery */}
        <div>
          <ImageGallery images={mockProduct.images} />
        </div>

        {/* Mobile-optimized product info */}
        <div className="space-y-4">
          <div className="flex flex-col">
            <h1 
              className="text-xl font-bold text-text mb-2"
              id="product-title"
            >
              {mockProduct.title}
            </h1>
            <p className="text-text-dim text-sm">by {mockProduct.brand}</p>
          </div>

          <div className="flex items-center gap-2">
            <div 
              className="flex text-accent"
              aria-label="4.5 out of 5 stars"
            >
              {'★'.repeat(4)}{'☆'.repeat(1)}
            </div>
            <span 
              className="text-text-dim text-sm"
              aria-label="128 reviews"
            >
              4.5 (128 reviews)
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span 
              className="text-2xl font-bold text-accent"
              aria-label={`Price: $${mockProduct.price}`}
            >
              ${mockProduct.price}
            </span>
            {mockProduct.original_price > mockProduct.price && (
              <span 
                className="text-lg text-text-dim line-through"
                aria-label={`Was $${mockProduct.original_price}`}
              >
                ${mockProduct.original_price}
              </span>
            )}
            {mockProduct.discount_percent > 0 && (
              <span 
                className="text-base text-success font-medium bg-success/20 px-2 py-1 rounded"
                aria-label={`Save ${mockProduct.discount_percent}%`}
              >
                Save {mockProduct.discount_percent}%
              </span>
            )}
          </div>

          <div>
            <p 
              className="text-sm text-text-dim mb-2"
              id="stock-status"
            >
              {mockProduct.stock_quantity > 0 
                ? `In stock (${mockProduct.stock_quantity} available)`
                : 'Out of stock'
              }
            </p>
            
            {mockProduct.variants && mockProduct.variants.length > 0 && (
              <VariantSelector 
                variants={mockProduct.variants} 
                selected={selectedVariant}
                onSelect={setSelectedVariant}
              />
            )}
          </div>

          <div className="flex items-center gap-3">
            <div 
              className="flex items-center border border-border rounded min-h-12"
              role="group"
              aria-label="Quantity selector"
            >
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={mockProduct.stock_quantity === 0}
                aria-label="Decrease quantity"
                aria-disabled={mockProduct.stock_quantity === 0}
                className="min-h-12 min-w-12"
              >
                -
              </Button>
              <span 
                className="w-12 text-center text-lg"
                id="quantity-value"
              >
                {quantity}
              </span>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setQuantity(quantity + 1)}
                disabled={mockProduct.stock_quantity === 0}
                aria-label="Increase quantity"
                aria-disabled={mockProduct.stock_quantity === 0}
                className="min-h-12 min-w-12"
              >
                +
              </Button>
            </div>
            
            <Button 
              onClick={handleAddToCart}
              disabled={mockProduct.stock_quantity === 0}
              className="flex-1 bg-accent hover:bg-orange-600 min-h-12 text-base"
              aria-describedby="stock-status"
            >
              Add to Cart
            </Button>
          </div>

          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              onClick={handleShare}
              className="flex-1 min-h-12"
              aria-label="Share this product"
            >
              Share
            </Button>
            <Button 
              variant="outline"
              className="flex-1 min-h-12"
              aria-label="Compare this product"
            >
              Compare
            </Button>
          </div>

          <div className="border-t border-border pt-4">
            <h3 
              className="text-lg font-medium mb-2"
              id="product-description-heading"
            >
              Product Description
            </h3>
            <p 
              className="text-text-dim text-sm leading-relaxed"
              aria-labelledby="product-description-heading"
            >
              {mockProduct.description}
            </p>
          </div>
        </div>
      </div>

      {/* Mobile-optimized sections */}
      <div className="mt-8 space-y-8">
        {/* Frequently Bought Together */}
        <section aria-labelledby="frequently-bought-heading">
          <h2 
            id="frequently-bought-heading"
            className="text-xl font-bold mb-4"
          >
            Frequently Bought Together
          </h2>
          {/* Product cards would go here */}
        </section>

        {/* Customers Also Viewed */}
        <section aria-labelledby="also-viewed-heading">
          <h2 
            id="also-viewed-heading"
            className="text-xl font-bold mb-4"
          >
            Customers Also Viewed
          </h2>
          {/* Product cards would go here */}
        </section>

        {/* Reviews */}
        <section aria-labelledby="reviews-heading">
          <ReviewList 
            reviews={mockReviews} 
            onHelpfulVote={(reviewId) => console.log('Helpful vote for', reviewId)}
            headingId="reviews-heading"
          />
        </section>

        {/* Q&A */}
        <section aria-labelledby="qa-heading">
          <QASection 
            questions={mockQuestions} 
            onAskQuestion={handleAskQuestion}
            headingId="qa-heading"
          />
        </section>
      </div>
    </div>
  );
};

export default ProductDetail;