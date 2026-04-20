import React from 'react';
import { Button } from './ui/button';
import { Star, Heart } from 'lucide-react';
import { useWishlistStore } from '../stores/wishlist';
import { useAnalytics } from '../lib/analytics';

interface ProductCardProps {
  product: {
    _id: string;
    title: string;
    price: number;
    original_price?: number;
    image: string;
    rating?: number;
    review_count?: number;
    category?: string;
  };
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { isInWishlist, toggle } = useWishlistStore();
  const { trackCTAClick, trackAddToCart } = useAnalytics();

  // Calculate discount percentage
  const discountPercent = product.original_price 
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0;

  const handleAddToCart = () => {
    trackAddToCart({
      _id: product._id,
      name: product.title,
      price: product.price,
      category: product.category || 'Uncategorized',
    });
    // Add to cart logic would go here
  };

  const handleCardClick = () => {
    trackCTAClick('product_card_click', 'product_grid');
  };

  return (
    <div 
      className="group relative bg-card rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
      onClick={handleCardClick}
    >
      {/* Image with lazy loading */}
      <div className="relative aspect-square bg-muted">
        {/* PERF: Added loading="lazy" and width/height attributes */}
        <img 
          src={product.image} 
          alt={product.title}
          loading="lazy"
          width={300}
          height={300}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Wishlist button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 rounded-full bg-background/80 hover:bg-background"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggle(product._id);
          }}
        >
          <Heart 
            className={`h-4 w-4 transition-colors ${
              isInWishlist(product._id) ? 'fill-current text-destructive' : 'text-muted-foreground'
            }`} 
          />
        </Button>
        
        {/* Discount badge */}
        {discountPercent > 0 && (
          <div className="absolute top-2 left-2 bg-destructive text-destructive-foreground text-xs font-bold px-2 py-1 rounded">
            {discountPercent}% OFF
          </div>
        )}
      </div>
      
      {/* Product info */}
      <div className="p-4">
        <h3 className="font-medium text-foreground line-clamp-2 mb-2">
          {product.title}
        </h3>
        
        <div className="flex items-center gap-2 mb-2">
          {/* Price */}
          <span className="text-lg font-bold text-primary">
            ${product.price.toFixed(2)}
          </span>
          
          {/* Original price */}
          {product.original_price && (
            <span className="text-sm text-muted-foreground line-through">
              ${product.original_price.toFixed(2)}
            </span>
          )}
        </div>
        
        {/* Rating */}
        {product.rating && (
          <div className="flex items-center gap-1 mb-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < Math.floor(product.rating!) 
                      ? 'text-yellow-400 fill-current' 
                      : 'text-muted-foreground'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-muted-foreground">
              {product.review_count ? `${product.review_count} reviews` : 'No reviews'}
            </span>
          </div>
        )}
        
        {/* Add to cart button */}
        <Button 
          className="w-full"
          onClick={(e) => {
            e.stopPropagation();
            handleAddToCart();
          }}
        >
          Add to Cart
        </Button>
      </div>
    </div>
  );
};

export default ProductCard;
```

```typescript