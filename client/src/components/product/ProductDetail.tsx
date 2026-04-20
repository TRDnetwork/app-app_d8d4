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
              onClick={handleWishlistToggle}
              className={isInWishlist ? 'text-accent' : ''}
              aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
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
            <span className="text-text-dim">4.0 (128 reviews)</span>
          </div>

          <div className="flex items-center gap-4 mb-6">
            <span className="text-3xl font-bold text-accent">${mockProduct.price}</span>
            {mockProduct.original_price > mockProduct.price && (
              <span className="text-xl text-text-dim line-through">${mockProduct.original_price}</span>
            )}
            {mockProduct.discount_percent > 0 && (
              <span className="text-lg text-success font-medium">Save {mockProduct.discount_percent}%</span>
            )}
          </div>

          <div className="mb-6">
            <p className="text-text-dim mb-4">
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

          <div className="flex items-center gap-4 mb-8">
            <div className="flex items-center border border-border rounded">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={mockProduct.stock_quantity === 0}
              >
                -
              </Button>
              <span className="w-12 text-center">{quantity}</span>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setQuantity(quantity + 1)}
                disabled={mockProduct.stock_quantity === 0}
              >
                +
              </Button>
            </div>
            
            <Button 
              onClick={handleAddToCart}
              disabled={mockProduct.stock_quantity === 0}
              className="flex-1 bg-accent hover:bg-orange-600"
            >
              Add to Cart
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <Button variant="outline" onClick={handleShare}>
              Share
            </Button>
            <Button variant="outline">
              Compare
            </Button>
          </div>

          <div className="prose prose-sm max-w-none">
            <h3 className="text-lg font-medium mb-2">Product Description</h3>
            <p className="text-text-dim">{mockProduct.description}</p>
          </div>
        </div>
      </div>

      {/* Frequently Bought Together */}
      <section className="mt-16">
        <h2 className="text-2xl font-bold mb-6">Frequently Bought Together</h2>
        {/* Product cards would go here */}
      </section>

      {/* Customers Also Viewed */}
      <section className="mt-16">
        <h2 className="text-2xl font-bold mb-6">Customers Also Viewed</h2>
        {/* Product cards would go here */}
      </section>

      {/* Reviews */}
      <section className="mt-16">
        <ReviewList 
          reviews={mockReviews} 
          onHelpfulVote={(reviewId) => console.log('Helpful vote for', reviewId)}
        />
      </section>

      {/* Q&A */}
      <section className="mt-16">
        <QASection 
          questions={mockQuestions} 
          onAskQuestion={handleAskQuestion}
        />
      </section>
    </div>
  );
};

export default ProductDetail;