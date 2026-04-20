import { Button } from '@/components/ui/button';
import { StarIcon } from 'lucide-react';
import Link from 'next/link';

interface Product {
  id: string;
  title: string;
  price: number;
  discountedPrice: number;
  image: string;
  rating: number;
  reviews: number;
}

export function ProductCard({ product }: { product: Product }) {
  const discountPercent = Math.round(
    ((product.price - product.discountedPrice) / product.price) * 100
  );

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow group">
      <div className="relative">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-2 left-2 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded">
          -{discountPercent}%
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-medium text-gray-900 line-clamp-2 mb-2">
          {product.title}
        </h3>
        <div className="flex items-center mb-2">
          <div className="flex text-orange-500">
            {[...Array(5)].map((_, i) => (
              <StarIcon
                key={i}
                className={`h-4 w-4 ${
                  i < Math.floor(product.rating) ? 'fill-current' : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-600 ml-1">
            ({product.reviews})
          </span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <span className="font-bold text-lg text-gray-900">
              ${product.discountedPrice}
            </span>
            <span className="text-sm text-gray-500 line-through ml-1">
              ${product.price}
            </span>
          </div>
          <Button size="sm" variant="outline">
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
}