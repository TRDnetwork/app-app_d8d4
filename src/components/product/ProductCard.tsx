import React from 'react';
import { Button } from '../ui/button';
import { Link } from 'react-router-dom';

interface ProductCardProps {
  product: {
    id: string;
    title: string;
    price: number;
    original_price?: number;
    image: string;
    rating?: number;
  };
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <div className="card group hover:shadow-lg transition-shadow">
      <div className="relative overflow-hidden rounded-t-lg">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
        />
        <Button
          variant="secondary"
          size="sm"
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          ♥
        </Button>
      </div>
      <div className="card-content">
        <h3 className="font-semibold line-clamp-2 mb-2">{product.title}</h3>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-primary font-bold">${product.price}</span>
          {product.original_price && product.original_price > product.price && (
            <span className="text-text-dim line-through text-sm">${product.original_price}</span>
          )}
        </div>
        {product.rating && (
          <div className="flex items-center gap-1 mb-2">
            <span className="text-yellow-400">★</span>
            <span className="text-sm text-text-dim">{product.rating}</span>
          </div>
        )}
        <Button asChild className="w-full">
          <Link to={`/product/${product.id}`}>View Details</Link>
        </Button>
      </div>
    </div>
  );
};