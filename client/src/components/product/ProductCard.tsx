import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/button';
import { Heart } from 'lucide-react';
import { useWishlistStore } from '../../stores/wishlistStore';
import { formatCurrency } from '../../lib/formatters';
import { trackCTAClick } from '../../lib/analytics';

interface ProductCardProps {
  id: string;
  title: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating?: number;
  reviewCount?: number;
}

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  title,
  price,
  originalPrice,
  image,
  rating = 0,
  reviewCount = 0,
}) => {
  const { has, toggle } = useWishlistStore();

  const discountPercent = originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    toggle(id);
    trackCTAClick('wishlist_toggle', 'product_card');
  };

  const handleAddToCart = () => {
    trackCTAClick('add_to_cart', 'product_card');
    // In real app: add to cart logic
  };

  return (
    <div className="card group overflow-hidden transition-all hover:shadow-lg">
      <div className="relative">
        <img
          src={image}
          alt={title}
          className="w-full h-64 object-cover transition-transform group-hover:scale-105"
          loading="lazy"
        />
        {discountPercent > 0 && (
          <span className="absolute top-2 left-2 bg-accent text-primary-foreground text-xs px-2 py-1 rounded">
            -{discountPercent}%
          </span>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 bg-white/80 hover:bg-white"
          onClick={handleWishlistToggle}
        >
          <Heart className={`h-5 w-5 ${has(id) ? 'fill-current text-accent' : 'text-text'}`} />
        </Button>
      </div>
      <div className="card-content">
        <Link to={`/product/${id}`} className="block">
          <h3 className="font-semibold text-text line-clamp-2 mb-2">{title}</h3>
          <div className="flex items-center mb-1">
            <span className="text-primary font-bold text-lg">{formatCurrency(price)}</span>
            {originalPrice && (
              <span className="text-text_dim line-through ml-2 text-sm">
                {formatCurrency(originalPrice)}
              </span>
            )}
          </div>
          <div className="flex items-center text-sm text-text_dim">
            <span>{rating.toFixed(1)}</span>
            <div className="flex ml-1">
              {[...Array(5)].map((_, i) => (
                <span key={i} className={i < Math.round(rating) ? 'text-warning' : 'text-text_dim'}>
                  ★
                </span>
              ))}
            </div>
            <span className="ml-1">({reviewCount})</span>
          </div>
        </Link>
        <Button className="w-full mt-4" onClick={handleAddToCart}>Add to Cart</Button>
      </div>
    </div>
  );
};

export default ProductCard;