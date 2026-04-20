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
      setLoading(true);
      try {
        const [productRes, bannerRes] = await Promise.all([
          fetchWithAuth('/api/products?limit=8'),
          fetchWithAuth('/api/banners?active=true'),
        ]);
        setProducts(productRes.data || []);
        setBanners(bannerRes.data || []);
      } catch (err) {
        console.error(err);
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
        <div className="mb-12 rounded-lg overflow-hidden">
          <img
            src={banners[0].image_url}
            alt={banners[0].title}
            className="w-full h-64 object-cover"
          />
        </div>
      )}

      {/* Deals Section */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6">Deals of the Day</h2>
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-48 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Featured Categories */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6">Shop by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {['Electronics', 'Fashion', 'Home & Kitchen', 'Books', 'Sports'].map((cat) => (
            <div key={cat} className="relative group">
              <div className="aspect-square bg-muted rounded-lg flex items-center justify-center overflow-hidden">
                <span className="text-xl font-semibold">{cat}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;