import React, { useEffect, useState } from 'react';
import { ProductCard } from '../components/product/ProductCard';
import { fetchWithAuth } from '../lib/api';

const Home: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [sponsoredProducts, setSponsoredProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const [featuredRes, sponsoredRes] = await Promise.all([
          fetchWithAuth('/api/products?is_featured=true&limit=8'),
          fetchWithAuth('/api/products?is_sponsored=true&limit=4'),
        ]);
        setFeaturedProducts(featuredRes.data || []);
        setSponsoredProducts(sponsoredRes.data || []);
      } catch (err) {
        console.error('Failed to load products:', err);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Banner */}
      <section className="relative h-64 md:h-80 rounded-lg mb-12 overflow-hidden">
        <img
          src="https://via.placeholder.com/1200x320/1E293B/FF9900?text=Free+Shipping+on+Orders+Over+$50"
          alt="Hero Banner"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white text-center font-display">
            Welcome to ShopSphere
          </h1>
        </div>
      </section>

      {/* Deals of the Day */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6 font-display">Deals of the Day</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="skeleton h-64 rounded-lg"></div>
            ))
          ) : (
            featuredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))
          )}
        </div>
      </section>

      {/* Featured Categories */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6 font-display">Featured Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {['Electronics', 'Fashion', 'Home & Kitchen', 'Beauty', 'Sports', 'Books'].map((cat) => (
            <div key={cat} className="relative group rounded-lg overflow-hidden h-32 bg-muted">
              <img
                src={`https://via.placeholder.com/200x120/1E293B/FFFFFF?text=${cat}`}
                alt={cat}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
              />
              <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                <span className="text-white font-semibold">{cat}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Sponsored Products */}
      <section>
        <h2 className="text-2xl font-bold mb-6 font-display">Sponsored Products</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {sponsoredProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;