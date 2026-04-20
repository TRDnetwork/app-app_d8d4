import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { useCartStore } from '../stores/cartStore';
import { analytics } from '../lib/analytics';
import ImageGallery from '../components/product/ImageGallery';
import VariantSelector from '../components/product/VariantSelector';

const mockProduct = {
  id: '1',
  title: 'Premium Wireless Headphones',
  price: 199.99,
  originalPrice: 299.99,
  description: 'High-quality wireless headphones with noise cancellation and 30-hour battery life.',
  images: [
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&h=600&fit=crop'
  ],
  variants: [
    { name: 'Color', values: ['Black', 'White', 'Blue'] },
    { name: 'Size', values: ['Regular', 'Large'] }
  ],
  rating: 4.5,
  reviewCount: 124,
  inStock: true
};

const ProductDetail = () => {
  const { slug } = useParams();
  const [selected, setSelected] = useState<Record<string, string>>({});
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCartStore();

  // Track product view
  React.useEffect(() => {
    analytics.viewProduct(mockProduct.id, mockProduct.price);
  }, []);

  const handleVariantChange = (name: string, value: string) => {
    setSelected(prev => ({ ...prev, [name]: value }));
    analytics.ctaClick(`variant_${name}_${value}`, 'product_detail');
  };

  const handleAddToCart = () => {
    addToCart({
      id: mockProduct.id,
      title: mockProduct.title,
      price: mockProduct.price,
      image: mockProduct.images[0],
      quantity,
      selectedVariants: selected
    });
    
    analytics.addToCart(mockProduct.id, mockProduct.price, quantity);
    analytics.ctaClick('add_to_cart', 'product_detail');
  };

  const handleWishlistClick = () => {
    analytics.addWishlist(mockProduct.id);
    analytics.ctaClick('add_to_wishlist', 'product_detail');
  };

  const discountPercent = Math.round(((mockProduct.originalPrice - mockProduct.price) / mockProduct.originalPrice) * 100);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ImageGallery images={mockProduct.images} />
        
        <div>
          <h1 className="text-3xl font-bold text-text mb-2">{mockProduct.title}</h1>
          <p className="text-text_dim mb-4">{mockProduct.description}</p>
          
          <div className="flex items-center mb-4">
            <span className="text-primary text-2xl font-bold">{mockProduct.price.toFixed(2)}</span>
            {mockProduct.originalPrice && (
              <span className="text-text_dim line-through ml-2">
                {mockProduct.originalPrice.toFixed(2)}
              </span>
            )}
            {discountPercent > 0 && (
              <span className="ml-2 bg-accent text-primary-foreground text-xs px-2 py-1 rounded">
                Save {discountPercent}%
              </span>
            )}
          </div>

          <div className="flex items-center mb-6">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <span key={i} className={i < Math.round(mockProduct.rating) ? 'text-warning' : 'text-text_dim'}>
                  ★
                </span>
              ))}
            </div>
            <span className="ml-2 text-text_dim">({mockProduct.reviewCount} reviews)</span>
          </div>

          <VariantSelector 
            variants={mockProduct.variants} 
            selected={selected} 
            onChange={handleVariantChange} 
          />

          <div className="flex items-center space-x-4 my-6">
            <label className="text-text_dim">Quantity:</label>
            <div className="flex border border-border rounded">
              <button 
                className="px-3 py-1 border-r border-border"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                -
              </button>
              <span className="px-4 py-1">{quantity}</span>
              <button 
                className="px-3 py-1 border-l border-border"
                onClick={() => setQuantity(quantity + 1)}
              >
                +
              </button>
            </div>
          </div>

          <div className="flex space-x-4 mb-6">
            <Button 
              className="flex-1 bg-accent hover:bg-accent/90 text-primary-foreground"
              onClick={handleAddToCart}
              disabled={!mockProduct.inStock}
            >
              {mockProduct.inStock ? 'Add to Cart' : 'Out of Stock'}
            </Button>
            <Button 
              variant="outline" 
              size="icon"
              onClick={handleWishlistClick}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </Button>
          </div>

          <div className="border-t border-border pt-6">
            <h3 className="font-semibold mb-2">Product Features</h3>
            <ul className="text-text_dim text-sm space-y-1">
              <li>• 30-hour battery life</li>
              <li>• Active noise cancellation</li>
              <li>• Bluetooth 5.0 connectivity</li>
              <li>• Built-in microphone</li>
              <li>• 1-year warranty</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;