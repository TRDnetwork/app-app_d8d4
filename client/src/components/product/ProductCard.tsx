import React, { memo, useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Heart, Star } from 'lucide-react';
import { formatCurrency } from '../../lib/formatters';
import { Skeleton } from '../ui/skeleton';
import { useWishlist } from '../../hooks/useWishlist';
import { trackProductView, trackCTAClick, trackWishlistAdd, trackWishlistRemove } from '../../lib/analytics';

// PERF: Added memoization to prevent unnecessary re-renders when parent re-renders
const ProductCard = memo(({ product, isLoading = false }) => {
  const { has, toggle } = useWishlist();
  const [isImageLoading, setIsImageLoading] = useState(true);
  const isInWishlist = has(product?._id);

  // Track product view when the card becomes visible
  useEffect(() => {
    if (!isLoading && product) {
      trackProductView(product._id, {
        product_name: product.title,
        price: product.price,
        category: product.category?.name,
        brand: product.brand
      });
    }
  }, [isLoading, product]);

  // PERF: Debounce image loading state to prevent flickering
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsImageLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="card group overflow-hidden">
        <Skeleton className="mb-4 h-48 w-full" />
        <Skeleton className="mb-2 h-4 w-3/4" />
        <Skeleton className="mb-2 h-4 w-1/2" />
        <Skeleton className="h-8 w-20" />
      </div>
    );
  }

  if (!product) return null;

  // PERF: Calculate discount percentage only when needed
  const getDiscountPercent = () => {
    if (!product.original_price || product.original_price <= product.price) return 0;
    return Math.round(((product.original_price - product.price) / product.original_price) * 100);
  };

  const discountPercent = getDiscountPercent();

  const handleCardClick = () => {
    trackCTAClick('product_card', 'product_list', {
      product_id: product._id,
      product_name: product.title,
      position: product.position // if available from parent
    });
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const action = isInWishlist ? 'remove' : 'add';
    toggle(product);
    
    if (action === 'add') {
      trackWishlistAdd(product._id, {
        product_name: product.title,
        price: product.price
      });
    } else {
      trackWishlistRemove(product._id, {
        product_name: product.title
      });
    }
  };

  return (
    // PERF: Added key prop for React list optimization
    <div 
      key={product._id} 
      className="card group overflow-hidden cursor-pointer" 
      data-testid="product-card"
      onClick={handleCardClick}
    >
      <div className="relative">
        {/* PERF: Optimized image loading with WebP format and lazy loading */}
        <img
          srcSet={`
            ${product.images?.[0]?.replace('.jpg', '.webp')} 1x,
            ${product.images?.[0]?.replace('.jpg', '@2x.webp')} 2x
          `}
          src={product.images?.[0]?.replace('.jpg', '.webp')}
          alt={product.title}
          loading="lazy"
          width={300}
          height={300}
          // PERF: Added onLoad handler to manage loading state
          onLoad={() => setIsImageLoading(false)}
          className={`h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105 ${isImageLoading ? 'opacity-0' : 'opacity-100'}`}
        />
        {isImageLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Skeleton className="h-full w-full" />
          </div>
        )}
        
        {/* PERF: Optimized conditional rendering with logical operators */}
        {discountPercent > 0 && (
          <span className="absolute left-2 top-2 rounded bg-warning px-2 py-1 text-xs font-bold text-white">
            -{discountPercent}%
          </span>
        )}
        
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-2 rounded-full bg-white/80 p-2 hover:bg-white"
          onClick={handleWishlistToggle}
          aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart className={`h-5 w-5 ${isInWishlist ? 'fill-current text-error' : 'text-error'}`} />
        </Button>
      </div>
      
      <div className="mt-4">
        <h3 className="line-clamp-2 text-sm font-medium" title={product.title}>
          {product.title}
        </h3>
        
        <div className="mt-2 flex items-center">
          <span className="text-lg font-bold text-accent">{formatCurrency(product.price)}</span>
          {product.original_price > product.price && (
            <span className="ml-2 text-sm text-text-dim line-through">{formatCurrency(product.original_price)}</span>
          )}
        </div>
        
        {product.rating && (
          <div className="mt-1 flex items-center">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${i < Math.round(product.rating) ? 'fill-current text-warning' : 'text-muted'}`}
                />
              ))}
            </div>
            <span className="ml-1 text-sm text-text-dim">({product.review_count || 0})</span>
          </div>
        )}
      </div>
    </div>
  );
});

// PERF: Added display name for better debugging
ProductCard.displayName = 'ProductCard';

export default ProductCard;