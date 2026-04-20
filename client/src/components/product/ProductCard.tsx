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

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <div className="card group hover:shadow-lg transition-shadow touch-manipulation">
      <div className="relative overflow-hidden rounded-t-lg">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
          loading="lazy"
          width={300}
          height={200}
        />
        <Button
          variant="secondary"
          size="sm"
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity min-h-8 min-w-8 p-2"
          aria-label={`Add ${product.title} to wishlist`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </Button>
      </div>
      <div className="card-content p-4">
        <h3 className="font-semibold line-clamp-2 mb-2 text-sm md:text-base">{product.title}</h3>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-primary font-bold text-sm md:text-base">${product.price}</span>
          {product.original_price && product.original_price > product.price && (
            <span className="text-text-dim line-through text-xs md:text-sm">${product.original_price}</span>
          )}
        </div>
        {product.rating && (
          <div className="flex items-center gap-1 mb-2">
            <span className="text-yellow-400 text-sm">★</span>
            <span className="text-xs text-text-dim">{product.rating}</span>
          </div>
        )}
        <Button asChild className="w-full min-h-10 text-sm md:text-base">
          <Link to={`/product/${product.id}`}>View Details</Link>
        </Button>
      </div>
    </div>
  );
};

export default React.memo(ProductCard);
```

```typescript