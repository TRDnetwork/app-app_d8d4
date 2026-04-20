import React from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useProducts } from '@/hooks/useProducts';

const HomePage: React.FC = () => {
  const { products, loading } = useProducts({ limit: 8 });

  return (
    <div className="container px-4 py-8">
      {/* Hero Banner */}
      <section className="relative h-64 md:h-80 rounded-lg mb-8 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1607082350899-7e105aa886ae?auto=format&fit=crop&w=1200"
          alt="Summer Sale"
          className="object-cover w-full h-full"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/20 flex items-center">
          <div className="container px-4">
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-2">
              Summer Sale Up to 60% Off
            </h1>
            <p className="text-white/90 text-lg mb-4">Limited time offer on top brands</p>
            <Button size="lg" className="bg-accent hover:bg-accent/90 text-black">
              Shop Now
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-text mb-6">Featured Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {['Electronics', 'Fashion', 'Home & Kitchen', 'Beauty'].map((category) => (
            <Link
              key={category}
              to={`/categories/${category.toLowerCase().replace(' & ', '-')}`}
              className="group relative h-32 rounded-lg overflow-hidden"
            >
              <img
                src={`https://source.unsplash.com/random/300x300?${category}`}
                alt={category}
                className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <span className="text-white text-lg font-semibold">{category}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Deals of the Day */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-text">Deals of the Day</h2>
          <Button variant="link" asChild>
            <Link to="/deals">View All</Link>
          </Button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-48 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))
            : products.slice(0, 4).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
        </div>
      </section>

      {/* Sponsored Products */}
      <section>
        <h2 className="text-2xl font-bold text-text mb-6">Sponsored Products</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-48 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))
            : products.slice(4, 8).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;