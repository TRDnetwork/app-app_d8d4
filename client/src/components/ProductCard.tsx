import React from 'react';
import { Button } from './ui/button';
import { Star, Heart } from 'lucide-react';
import { useWishlistStore } from '../stores/wishlist';
import { Link } from 'react-router-dom';
import { cn } from '../lib/utils';

interface ProductCardProps {
  product: {
    _id: string;
    title: string;
    price: number;
    original_price?: number;
    image: string;
    rating?: number;
    review_count?: number;
  };
  className?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, className }) => {
  const { isInWishlist, toggle } = useWishlistStore();

  // Calculate discount percentage
  const discountPercent = product.original_price 
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0;

  // a11y fix: Calculate proper aria-label for rating
  const ratingLabel = product.rating 
    ? `${product.rating} out of 5 stars, based on ${product.review_count || 0} reviews`
    : 'No reviews yet';

  // Ensure touch targets are at least 44x44px
  const touchTargetClass = "min-h-11 min-w-11 flex items-center justify-center";

  return (
    <article 
      className={cn(
        "group relative bg-card rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow",
        "touch-manipulation", // Enable touch events
        className
      )} 
      role="article"
    >
      {/* Image with lazy loading and proper dimensions */}
      <div className="relative aspect-square bg-muted">
        {/* a11y fix: Added proper alt text and ARIA attributes */}
        <Link to={`/product/${product._id}`}>
          <img 
            src={product.image} 
            alt={product.title}
            loading="lazy"
            width={300}
            height={300}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            aria-describedby={`product-rating-${product._id}`}
          />
        </Link>
        
        {/* Wishlist button - increased touch target */}
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "absolute top-2 right-2 rounded-full bg-background/80 hover:bg-background",
            touchTargetClass
          )}
          onClick={(e) => {
            e.preventDefault();
            toggle(product._id);
          }}
          aria-label={isInWishlist(product._id) ? `Remove ${product.title} from wishlist` : `Add ${product.title} to wishlist`}
        >
          <Heart 
            className={cn(
              "h-5 w-5 transition-colors",
              isInWishlist(product._id) ? 'fill-current text-destructive' : 'text-muted-foreground'
            )} 
            aria-hidden="true"
          />
        </Button>
        
        {/* Discount badge */}
        {discountPercent > 0 && (
          <div 
            className="absolute top-2 left-2 bg-destructive text-destructive-foreground text-xs font-bold px-2 py-1 rounded"
            role="status"
            aria-live="polite"
          >
            {discountPercent}% OFF
          </div>
        )}
      </div>
      
      {/* Product info */}
      <div className="p-3 sm:p-4">
        {/* a11y fix: Use proper heading hierarchy */}
        <h3 className="font-medium text-foreground line-clamp-2 mb-1 text-base sm:text-lg">
          <Link 
            to={`/product/${product._id}`} 
            className="hover:text-primary transition-colors block"
          >
            {product.title}
          </Link>
        </h3>
        
        <div className="flex items-center gap-1 sm:gap-2 mb-1">
          {/* Price */}
          <span className="text-base sm:text-lg font-bold text-primary" aria-label="Current price">
            ${product.price.toFixed(2)}
          </span>
          
          {/* Original price */}
          {product.original_price && (
            <span 
              className="text-xs sm:text-sm text-muted-foreground line-through"
              aria-label="Original price"
            >
              ${product.original_price.toFixed(2)}
            </span>
          )}
        </div>
        
        {/* Rating */}
        {product.rating && (
          <div className="flex items-center gap-1 mb-2" id={`product-rating-${product._id}`}>
            <div className="flex" role="img" aria-label={ratingLabel}>
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    "h-3 w-3 sm:h-4 sm:w-4",
                    i < Math.floor(product.rating!) 
                      ? 'text-yellow-400 fill-current' 
                      : 'text-muted-foreground'
                  )}
                  aria-hidden="true"
                />
              ))}
            </div>
            <span className="text-xs text-muted-foreground" aria-hidden="true">
              {product.review_count ? `${product.review_count} reviews` : 'No reviews'}
            </span>
          </div>
        )}
        
        {/* Add to cart button - increased touch target */}
        <Button 
          className={cn("w-full", touchTargetClass)}
          aria-label={`Add ${product.title} to cart`}
        >
          Add to Cart
        </Button>
      </div>
    </article>
  );
};

export default ProductCard;