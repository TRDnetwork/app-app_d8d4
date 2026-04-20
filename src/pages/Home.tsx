import React, { useEffect, useState } from 'react';
import { ProductCard } from '../components/product/ProductCard';
import { fetchWithAuth } from '../lib/api';
import { Skeleton } from '../components/ui/skeleton';

const Home = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [banners, setBanners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        const [productRes, bannerRes] = await Promise.all([
          fetchWithAuth('/products?limit=8'),
          fetchWithAuth('/banners?active=true'),
        ]);
        setProducts(productRes.data || []);
        setBanners(bannerRes.data || []);
      } catch (err) {
        console.error('Failed to load home data');
      } finally {
        setLoading(false);
      }
    };
    loadHomeData();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Banner */}
      {banners.length > 0 && (
        <div className="relative mb-12 h-64 overflow-hidden rounded-lg md:h-80">
          <img
            src={banners[0].image_url}
            alt={banners[0].title}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-black/30" />
          <div className="absolute inset-0 flex items-center justify-center">
            <h1 className="text-4xl font-bold text-white md:text-5xl">{banners[0].title}</h1>
          </div>
        </div>
      )}

      {/* Featured Products */}
      <section>
        <h2 className="mb-6 text-2xl font-bold">Featured Products</h2>
        {loading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="card">
                <Skeleton className="mb-4 h-48 w-full" />
                <Skeleton className="mb-2 h-4 w-3/4" />
                <Skeleton className="mb-2 h-4 w-1/2" />
                <Skeleton className="h-8 w-20" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;