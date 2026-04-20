import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/button';
import { Product } from '../../types';
import { analytics } from '../../lib/analytics';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Track add to cart event
    analytics.trackAddToCart(
      product._id,
      product.title,
      product.price,
      1
    );
  };

  const handleClick = () => {
    // Track product click
    analytics.trackEvent({
      category: 'ecommerce',
      action: 'select_item',
      label: product._id,
      items: [{
        item_id: product._id,
        item_name: product.title,
        price: product.price
      }]
    });
  };

  return (
    <Link 
      to={`/product/${product.slug}`}
      className="block group"
      onClick={handleClick}
    >
      <div className="bg-surface rounded-lg overflow-hidden border border-border hover:shadow-lg transition-all duration-200">
        <div className="relative pb-[100%]">
          <img
            src={product.images[0] || 'https://via.placeholder.com/300'}
            alt={product.title}
            className="absolute h-full w-full object-cover group-hover:scale-105 transition-transform duration-200"
          />
          {product.discount_percent > 0 && (
            <div className="absolute top-2 left-2 bg-warning text-primary-foreground px-2 py-1 rounded text-xs font-bold">
              {product.discount_percent}% OFF
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-text line-clamp-2 mb-2 group-hover:text-accent transition-colors">
            {product.title}
          </h3>
          <p className="text-text-dim text-sm mb-3">{product.brand}</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-accent font-bold">${product.price}</span>
              {product.original_price > product.price && (
                <span className="text-text-dim line-through text-sm">
                  ${product.original_price}
                </span>
              )}
            </div>
            <div className="flex items-center">
              <span className="text-warning text-sm">★★★★★</span>
              <span className="text-text-dim text-xs ml-1">({product.reviews_count})</span>
            </div>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full mt-3 border-border hover:bg-muted"
            onClick={handleAddToCart}
          >
            Add to Cart
          </Button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;