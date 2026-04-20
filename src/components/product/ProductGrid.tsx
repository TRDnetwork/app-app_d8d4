import React from 'react';
import ProductCard from './ProductCard';
import { Skeleton } from '../ui/skeleton';

interface ProductGridProps {
  products: any[];
  loading?: boolean;
}

const ProductGrid: React.FC<ProductGridProps> = ({ products, loading }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="bg-surface rounded-lg overflow-hidden shadow-sm">
            <Skeleton className="w-full h-48" />
            <div className="p-4 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-text_dim">No products found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard
          key={product._id}
          id={product.slug}
          title={product.title}
          price={product.price}
          originalPrice={product.original_price}
          image={product.images[0]}
          rating={product.average_rating || 0}
          reviewCount={product.review_count || 0}
        />
      ))}
    </div>
  );
};

export default ProductGrid;