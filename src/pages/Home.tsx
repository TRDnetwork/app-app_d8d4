import React from 'react';
import { ProductCard } from '../components/ProductCard';
import { Skeleton } from '../components/ui/skeleton';
import { useAuth } from '../lib/auth';

const featuredProducts = Array(8).fill(null).map((_, i) => ({
  _id: `prod-${i}`,
  title: `Premium Wireless Headphones ${i + 1}`,
  price: 99.99,
  original_price: 149.99,
  image: `https://via.placeholder.com/300x300?text=Product+${i + 1}`,
  rating: 4.5,
  review_count: 124,
}));

const Home = () => {
  const { isLoading } = useAuth();

  if (isLoading) {
    return <HomeSkeleton />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Banner */}
      <div className="relative h-64 md:h-80 rounded-lg overflow-hidden mb-8">
        <img
          src="https://via.placeholder.com/1200x400?text=Deals+of+the+Day"
          alt="Hero Banner"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex items-center">
          <div className="text-white ml-8">
            <h1 className="text-3xl md:text-5xl font-bold mb-2">Deals of the Day</h1>
            <p className="text-lg mb-4">Up to 50% off on selected items</p>
            <button className="bg-primary text-primary-foreground px-6 py-2 rounded-md hover:bg-primary/90 transition-colors">
              Shop Now
            </button>
          </div>
        </div>
      </div>

      {/* Featured Categories */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Featured Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {['Electronics', 'Clothing', 'Home & Kitchen', 'Books'].map((cat) => (
            <div
              key={cat}
              className="relative h-32 rounded-lg overflow-hidden group cursor-pointer"
            >
              <img
                src={`https://via.placeholder.com/300x200?text=${cat}`}
                alt={cat}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <span className="text-white font-semibold">{cat}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Products Grid */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Featured Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
};

const HomeSkeleton = () => (
  <div className="container mx-auto px-4 py-8">
    <div className="h-64 md:h-80 rounded-lg bg-muted mb-8 animate-pulse"></div>
    <div className="mb-12">
      <Skeleton className="h-8 w-48 mb-6" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-32 rounded-lg" />
        ))}
      </div>
    </div>
    <div>
      <Skeleton className="h-8 w-48 mb-6" />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="h-64 w-full rounded-lg" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default Home;