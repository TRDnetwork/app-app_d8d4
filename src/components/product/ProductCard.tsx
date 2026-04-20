import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/button';
import { useCartStore } from '../../stores/cartStore';
import { useWishlistStore } from '../../stores/wishlistStore';
import { Heart, ShoppingCart } from 'lucide-react';

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
  const { add } = useCartStore();
  const { add: addToWishlist, remove: removeFromWishlist, has } = useWishlistStore();

  const isInWishlist = has(id);

  const handleAddToCart = () => {
    add({
      product_id: id,
      name: title,
      price,
      quantity: 1,
      image,
    });
  };

  const toggleWishlist = () => {
    if (isInWishlist) {
      removeFromWishlist(id);
    } else {
      addToWishlist({
        product_id: id,
        name: title,
        price,
        image,
      });
    }
  };

  const discountPercent = originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;

  return (
    <div className="group bg-surface rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col">
      <div className="relative">
        <Link to={`/product/${id}`}>
          <img src={image} alt={title} className="w-full h-48 object-cover" />
        </Link>
        {discountPercent > 0 && (
          <span className="absolute top-2 left-2 bg-accent text-primary-foreground text-xs font-bold px-2 py-1 rounded">
            -{discountPercent}%
          </span>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={toggleWishlist}
        >
          <Heart className={`h-5 w-5 ${isInWishlist ? 'fill-current text-accent' : 'text-text'}`} />
        </Button>
      </div>
      <div className="p-4 flex-1 flex flex-col">
        <Link to={`/product/${id}`} className="font-medium text-text hover:text-accent line-clamp-2 mb-2">
          {title}
        </Link>
        <div className="flex items-center mb-2">
          <div className="text-sm text-warning">
            {'★'.repeat(Math.floor(rating)) + '☆'.repeat(5 - Math.floor(rating))}
          </div>
          <span className="text-text_dim text-sm ml-1">({reviewCount})</span>
        </div>
        <div className="flex items-center mb-4">
          <span className="text-lg font-bold text-accent">{formatCurrency(price)}</span>
          {originalPrice && (
            <span className="text-text_dim line-through ml-2 text-sm">{formatCurrency(originalPrice)}</span>
          )}
        </div>
        <Button onClick={handleAddToCart} className="mt-auto">
          <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
        </Button>
      </div>
    </div>
  );
};

import { formatCurrency } from '../../lib/formatters';

export default ProductCard;