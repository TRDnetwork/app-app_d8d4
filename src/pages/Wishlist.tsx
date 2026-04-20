import React from 'react';
import { ProductCard } from '../components/product/ProductCard';

const Wishlist = () => {
  const wishlistItems = [
    { id: '1', name: 'Wireless Headphones', price: 199.99, image: '/placeholder.svg', rating: 4.8 },
    { id: '2', name: 'Smart Watch', price: 299.99, image: '/placeholder.svg', rating: 4.6 },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-display text-4xl font-bold mb-8">Wishlist</h1>
      {wishlistItems.length === 0 ? (
        <p>Your wishlist is empty.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlistItems.map((item) => (
            <ProductCard key={item.id} product={item} showWishlistButton={false} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;