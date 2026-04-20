import React, { lazy, Suspense } from 'react';
import { ProductCard } from '../components/ProductCard';
import { Skeleton } from '../components/ui/skeleton';
import { useAuth } from '../lib/auth';
import { PullToRefresh } from '../components/PullToRefresh';

// PERF: Lazy load non-critical components
const FeaturedCategories = lazy(() => import('./Home/FeaturedCategories'));
const DealsBanner = lazy(() => import('./Home/DealsBanner'));

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

  const handleRefresh = async () => {
    // Refresh logic here
    window.location.reload();
  };

  if (isLoading) {
    return <HomeSkeleton />;
  }

  return (
    <PullToRefresh onRefresh={handleRefresh}>
      <div className="container mx-auto px-4 py-8">
        {/* Hero Banner */}
        <Suspense fallback={<div className="h-64 md:h-80 rounded-lg bg-muted mb-8 animate-pulse"></div>}>
          <DealsBanner />
        </Suspense>

        {/* Featured Categories */}
        <Suspense fallback={<FeaturedCategoriesSkeleton />}>
          <FeaturedCategories />
        </Suspense>

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
    </PullToRefresh>
  );
};

// Separate component for featured categories
const FeaturedCategoriesSkeleton = () => (
  <div className="mb-12">
    <Skeleton className="h-8 w-48 mb-6" />
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => (
        <Skeleton key={i} className="h-32 rounded-lg" />
      ))}
    </div>
  </div>
);

const HomeSkeleton = () => (
  <div className="container mx-auto px-4 py-8">
    <div className="h-64 md:h-80 rounded-lg bg-muted mb-8 animate-pulse"></div>
    <FeaturedCategoriesSkeleton />
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