import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/button';
import { Star, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Product } from '../../types';
import { wishlistStore } from '../../stores/wishlistStore';
import { formatCurrency } from '../../lib/formatters';

interface ProductCardProps {
  product: Product;
  loading?: boolean;
}

// Mobile-optimized ProductCard with touch-friendly elements
const ProductCard = React.memo(function ProductCard({ product, loading = false }: ProductCardProps) {
  const navigate = useNavigate();
  const toggleWishlist = wishlistStore((state) => state.toggle);
  const isInWishlist = wishlistStore((state) => state.has(product._id));
  const [isWishlistLoading, setIsWishlistLoading] = useState(false);

  // Memoized discount calculation
  const discount = useMemo(() => {
    if (product.original_price && product.price) {
      return Math.round(((product.original_price - product.price) / product.original_price) * 100);
    }
    return 0;
  }, [product.original_price, product.price]);

  const handleWishlistToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlistLoading(true);
    try {
      toggleWishlist(product);
    } catch (error) {
      console.error('Failed to update wishlist:', error);
    } finally {
      setIsWishlistLoading(false);
    }
  };

  const handleCardClick = () => {
    navigate(`/product/${product.slug}`);
  };

  // Mobile-optimized skeleton loader
  if (loading) {
    return (
      <div className="bg-card rounded-lg overflow-hidden shadow-sm animate-pulse">
        <div className="aspect-square bg-muted"></div>
        <div className="p-3 space-y-2">
          <div className="h-4 bg-muted rounded"></div>
          <div className="h-4 bg-muted rounded w-3/4"></div>
          <div className="h-4 bg-muted rounded w-1/2"></div>
          <div className="flex items-center justify-between">
            <div className="h-5 bg-muted rounded w-1/3"></div>
            <div className="h-5 bg-muted rounded w-8"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="bg-card rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
      onClick={handleCardClick}
      role="link"
      tabIndex={0}
      aria-label={`View details for ${product.title}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleCardClick();
        }
      }}
    >
      <div className="relative aspect-square">
        <picture>
          <source srcSet={`${product.images[0]}?format=webp&quality=80`} type="image/webp" />
          <img
            src={`${product.images[0]}?quality=80`}
            alt={product.title}
            width={300}
            height={300}
            loading="lazy"
            className="w-full h-full object-cover"
            fetchPriority="high"
            aria-describedby={`product-description-${product._id}`}
          />
        </picture>
        
        {/* Mobile-optimized discount badge */}
        {discount > 0 && (
          <div 
            className="absolute top-2 left-2 bg-accent text-primary-foreground text-xs font-bold px-2 py-1 rounded min-h-6 flex items-center"
            aria-label={`${discount}% off discount`}
          >
            {discount}% OFF
          </div>
        )}
        
        {/* Mobile-optimized wishlist button with larger tap target */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 bg-background/80 hover:bg-background min-h-11 min-w-11"
          onClick={handleWishlistToggle}
          disabled={isWishlistLoading}
          aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
          tabIndex={0}
        >
          {isWishlistLoading ? (
            <div 
              className="h-5 w-5 border-2 border-current border-t-transparent rounded-full animate-spin"
              role="status"
              aria-label="Loading"
            />
          ) : (
            <Heart
              className={`h-5 w-5 ${isInWishlist ? 'fill-accent text-accent' : 'text-muted-foreground'}`}
              aria-hidden="true"
            />
          )}
        </Button>
      </div>
      
      <div className="p-3">
        <h3 
          className="font-semibold text-text line-clamp-2 mb-1 text-sm"
          id={`product-description-${product._id}`}
        >
          {product.title}
        </h3>
        
        {/* Mobile-optimized price display */}
        <div className="flex items-center gap-2 mb-2">
          <span 
            className="text-base font-bold text-accent"
            aria-label={`Price: ${formatCurrency(product.price)}`}
          >
            {formatCurrency(product.price)}
          </span>
          {product.original_price > product.price && (
            <span 
              className="text-sm text-text-dim line-through"
              aria-label={`Was ${formatCurrency(product.original_price)}`}
            >
              {formatCurrency(product.original_price)}
            </span>
          )}
        </div>
        
        {/* Mobile-optimized rating */}
        <div className="flex items-center gap-1 mb-3">
          <div 
            className="sr-only"
            aria-label={`Rating: ${product.rating || 0} out of 5 stars, based on ${product.reviews || 0} reviews`}
          >
            {product.rating || 0} out of 5 stars, {product.reviews || 0} reviews
          </div>
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`h-4 w-4 ${i < Math.floor(product.rating || 0) ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground'}`}
              aria-hidden="true"
            />
          ))}
          <span 
            className="text-xs text-text-dim"
            aria-label={`${product.reviews || 0} reviews`}
          >
            ({product.reviews || 0})
          </span>
        </div>
        
        {/* Mobile-optimized Add to Cart button */}
        <Button 
          className="w-full bg-accent hover:bg-orange-600 min-h-11 text-base"
          onClick={(e) => {
            e.stopPropagation();
            // Add to cart logic would go here
          }}
        >
          Add to Cart
        </Button>
      </div>
    </div>
  );
});

ProductCard.displayName = 'ProductCard';

export default ProductCard;