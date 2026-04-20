'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Star, ShoppingCart } from 'lucide-react';
import Image from 'next/image';

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating?: number;
  reviews?: number;
  discount?: number;
}

export function ProductCard({ product }: { product: Product }) {
  const { name, price, originalPrice, image, rating = 0, reviews = 0, discount } = product;

  const renderStars = () => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < Math.floor(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative h-48">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {discount && (
          <div className="absolute top-2 left-2 bg-accent text-white text-xs font-bold px-2 py-1 rounded">
            {discount}% OFF
          </div>
        )}
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-sm mb-2 line-clamp-2">{name}</h3>
        <div className="flex items-center mb-2">
          {renderStars()}
          <span className="text-xs text-text_dim ml-1">({reviews})</span>
        </div>
        <div className="flex items-center mb-3">
          <span className="font-bold text-lg">${price}</span>
          {originalPrice && (
            <span className="text-sm text-text_dim line-through ml-2">${originalPrice}</span>
          )}
        </div>
        <Button variant="outline" size="sm" className="w-full">
          <ShoppingCart className="mr-2 h-4 w-4" />
          Add to Cart
        </Button>
      </CardContent>
    </Card>
  );
}