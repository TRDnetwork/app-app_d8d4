import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { ProductCard } from '../components/ProductCard';
import { Skeleton } from '../components/ui/skeleton';
import { useCartStore } from '../stores/cartStore';

const mockProducts = [
  { _id: '1', title: 'Wireless Noise-Canceling Headphones', price: 199.99, image: 'https://via.placeholder.com/300x300?text=Headphones', rating: 4.5 },
  { _id: '2', title: 'Smart Watch Series 5', price: 299.99, image: 'https://via.placeholder.com/300x300?text=Watch', rating: 4.7 },
  { _id: '3', title: 'Ultra HD 4K Television', price: 899.99, image: 'https://via.placeholder.com/300x300?text=TV', rating: 4.8 },
  { _id: '4', title: 'Stainless Steel Kitchen Knife Set', price: 149.99, image: 'https://via.placeholder.com/300x300?text=Knives', rating: 4.6 },
];

export const Home: React.FC = () => {
  const { addToCart } = useCartStore();
  const isLoading = false; // Replace with actual loading state from API

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Banner */}
      <section className="relative h-64 md:h-80 rounded-lg overflow-hidden mb-8">
        <img
          src="https://via.placeholder.com/1200x400?text=Deals+of+the+Day"
          alt="Hero Banner"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex items-center">
          <div className="text-white ml-8 md:ml-16">
            <h1 className="text-3xl md:text-5xl font-bold mb-2">Deals of the Day</h1>
            <p className="text-lg mb-4">Up to 50% off on top brands</p>
            <Button className="bg-accent hover:bg-accent/90 text-black">Shop Now</Button>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Featured Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {['Electronics', 'Home & Kitchen', 'Fashion', 'Beauty'].map((category) => (
            <Link
              key={category}
              to={`/products?category=${category}`}
              className="relative group rounded-lg overflow-hidden h-32 md:h-40 bg-muted flex items-center justify-center"
            >
              <span className="text-lg font-semibold text-text group-hover:text-accent transition-colors">
                {category}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Trending Products */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Trending Products</h2>
          <Link to="/products" className="text-accent text-sm font-medium hover:underline">
            View All
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-48 w-full rounded-lg" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))
            : mockProducts.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  onAddToCart={() => addToCart(product._id)}
                />
              ))}
        </div>
      </section>
    </div>
  );
};