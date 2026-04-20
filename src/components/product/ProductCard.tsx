import React, { useState, useMemo } from 'react';
import { Button } from '../ui/button';
import { Star, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Product } from '../../types';
import { wishlistStore } from '../../stores/wishlistStore';
import { formatCurrency } from '../../lib/formatters';
import { trackProductClick } from '../../lib/analytics';

interface ProductCardProps {
  product: Product;
  loading?: boolean;
}

// PERF: Added React.memo to prevent unnecessary re-renders when parent component updates
// PERF: Added displayName for better debugging in React DevTools
const ProductCard = React.memo(function ProductCard({ product, loading = false }: ProductCardProps) {
  const navigate = useNavigate();
  const toggleWishlist = wishlistStore((state) => state.toggle);
  const isInWishlist = wishlistStore((state) => state.has(product._id));
  const [isWishlistLoading, setIsWishlistLoading] = useState(false);

  // PERF: Memoized discount calculation to avoid recalculation on every render
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
    trackProductClick(product._id, product.title, product.price);
  };

  // Mobile-friendly tap targets (min 44x44px)
  const wishlistButtonSize = 'h-11 w-11';

  // PERF: Added skeleton loader for better perceived performance during loading
  if (loading) {
    return (
      <div className="bg-card rounded-lg overflow-hidden shadow-sm animate-pulse">
        <div className="aspect-square bg-muted"></div>
        <div className="p-4 space-y-3">
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
      className="bg-card rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
      onClick={handleCardClick}
      // PERF: Added proper ARIA attributes for accessibility
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
        {/* PERF: Added WebP format with JPEG fallback for better compression */}
        {/* PERF: Added width/height attributes to prevent layout shift */}
        {/* PERF: Added loading="lazy" to defer offscreen images */}
        <picture>
          <source srcSet={`${product.images[0]}?format=webp&quality=80`} type="image/webp" />
          <img
            src={`${product.images[0]}?quality=80`}
            alt={product.title}
            width={300}
            height={300}
            loading="lazy"
            className="w-full h-full object-cover"
            // PERF: Added fetchPriority="high" for above-the-fold images
            fetchPriority="high"
          />
        </picture>
        
        {/* Discount badge */}
        {discount > 0 && (
          <div className="absolute top-2 left-2 bg-accent text-primary-foreground text-xs font-bold px-2 py-1 rounded">
            {discount}% OFF
          </div>
        )}
        
        {/* Wishlist button - increased tap target size for mobile */}
        <Button
          variant="ghost"
          size="icon"
          className={`absolute top-2 right-2 bg-background/80 hover:bg-background ${wishlistButtonSize}`}
          onClick={handleWishlistToggle}
          disabled={isWishlistLoading}
          // PERF: Added proper ARIA attributes for accessibility
          aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
        >
          {isWishlistLoading ? (
            <div className="h-5 w-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
          ) : (
            <Heart
              className={`h-5 w-5 ${isInWishlist ? 'fill-accent text-accent' : 'text-muted-foreground'}`}
            />
          )}
        </Button>
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-text line-clamp-1 mb-1">{product.title}</h3>
        
        {/* Price */}
        <div className="flex items-center gap-2 mb-2">
          <span className="text-lg font-bold text-accent">
            {formatCurrency(product.price)}
          </span>
          {product.original_price > product.price && (
            <span className="text-sm text-text-dim line-through">
              {formatCurrency(product.original_price)}
            </span>
          )}
        </div>
        
        {/* Rating */}
        <div className="flex items-center gap-1 mb-3">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`h-4 w-4 ${i < Math.floor(product.rating || 0) ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground'}`}
            />
          ))}
          <span className="text-xs text-text-dim">({product.reviews || 0})</span>
        </div>
      </div>
    </div>
  );
});

ProductCard.displayName = 'ProductCard';

export default ProductCard;