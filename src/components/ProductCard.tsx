import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { Star, Heart } from 'lucide-react';
import { useWishlistStore } from '../stores/wishlistStore';
import { cn } from '../lib/utils';

interface ProductCardProps {
  id: string;
  title: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating?: number;
  reviewCount?: number;
  className?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  title,
  price,
  originalPrice,
  image,
  rating = 0,
  reviewCount = 0,
  className,
}) => {
  const { isInWishlist, toggleWishlist } = useWishlistStore();

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    toggleWishlist(id);
  };

  return (
    <div
      className={cn(
        'bg-card rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col',
        className
      )}
    >
      <div className="relative">
        <Link to={`/product/${id}`}>
          <img src={image} alt={title} className="w-full h-48 object-cover" />
        </Link>
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 rounded-full bg-background/80 hover:bg-background"
          onClick={handleWishlistClick}
        >
          <Heart
            className={cn('h-5 w-5', isInWishlist(id) ? 'fill-accent text-accent' : 'text-text_dim')}
          />
        </Button>
      </div>
      <div className="p-4 flex-1 flex flex-col">
        <Link to={`/product/${id}`} className="font-medium text-text hover:underline line-clamp-2">
          {title}
        </Link>
        <div className="mt-2 flex items-center">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={cn(
                  'h-4 w-4',
                  i < Math.floor(rating) ? 'fill-yellow-500 text-yellow-500' : 'text-text_dim'
                )}
              />
            ))}
          </div>
          <span className="text-sm text-text_dim ml-1">({reviewCount})</span>
        </div>
        <div className="mt-2 flex items-center space-x-2">
          <span className="font-semibold">{formatCurrency(price)}</span>
          {originalPrice && originalPrice > price && (
            <span className="text-sm text-text_dim line-through">{formatCurrency(originalPrice)}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;