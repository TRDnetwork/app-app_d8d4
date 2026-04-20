import React from 'react';
import ProductCard from './ProductCard';

const mockProducts = [
  {
    id: '1',
    title: 'Premium Wireless Headphones',
    price: 199.99,
    originalPrice: 299.99,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop',
    rating: 4.5,
    reviewCount: 124,
  },
  {
    id: '2',
    title: 'Smart Watch Series 5',
    price: 299.99,
    image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=300&h=300&fit=crop',
    rating: 4.7,
    reviewCount: 89,
  },
  {
    id: '3',
    title: 'Bluetooth Speaker Pro',
    price: 129.99,
    originalPrice: 179.99,
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=300&h=300&fit=crop',
    rating: 4.3,
    reviewCount: 67,
  },
  {
    id: '4',
    title: 'Gaming Laptop 15"',
    price: 1299.99,
    image: 'https://images.unsplash.com/photo-1595174119495-9d79b03ac5c4?w=300&h=300&fit=crop',
    rating: 4.8,
    reviewCount: 156,
  },
];

const ProductGrid: React.FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {mockProducts.map((product) => (
        <ProductCard key={product.id} {...product} />
      ))}
    </div>
  );
};

export default ProductGrid;