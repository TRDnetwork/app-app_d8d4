import React from 'react';
import { ProductCard } from '../components/product/ProductCard';

export default function Wishlist() {
  const wishlistItems = [
    { id: '1', title: 'Wireless Headphones', price: 99.99, image: '/placeholder.svg?height=200&width=200' },
    { id: '2', title: 'Smart Watch', price: 199.99, image: '/placeholder.svg?height=200&width=200' },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Wishlist</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {wishlistItems.map(item => (
          <ProductCard key={item.id} product={item} />
        ))}
      </div>
    </div>
  );
}