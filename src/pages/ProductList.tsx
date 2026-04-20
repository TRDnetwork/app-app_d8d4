import React, { useState, useEffect } from 'react';
import { ProductCard } from '../components/product/ProductCard';
import { ProductFilters } from '../components/product/ProductFilters';
import { ProductSort } from '../components/product/ProductSort';
import { fetchWithAuth } from '../lib/api';

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [filters, setFilters] = useState({
    category: '',
    brand: '',
    minPrice: 0,
    maxPrice: 10000,
    rating: 0,
  });
  const [sort, setSort] = useState('newest');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        const query = new URLSearchParams({
          category: filters.category,
          brand: filters.brand,
          min_price: filters.minPrice.toString(),
          max_price: filters.maxPrice.toString(),
          min_rating: filters.rating.toString(),
          sort,
          limit: '20',
        }).toString();

        const res = await fetchWithAuth(`/api/products?${query}`);
        setProducts(res.data || []);
      } catch (err) {
        console.error('Failed to load products:', err);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, [filters, sort]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 font-display">Products</h1>
      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="lg:w-64 flex-shrink-0">
          <ProductFilters filters={filters} setFilters={setFilters} />
        </aside>
        <main className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <p className="text-text-dim">{products.length} products found</p>
            <ProductSort value={sort} onChange={setSort} />
          </div>
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="skeleton h-80 rounded-lg"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ProductList;