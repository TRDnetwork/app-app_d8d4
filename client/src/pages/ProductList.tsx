import React, { useState, useEffect } from 'react';
import { ProductCard } from '../components/product/ProductCard';
import { ProductFilters } from '../components/product/ProductFilters';
import { ProductSort } from '../components/product/ProductSort';
import { fetchWithAuth } from '../lib/api';
import { Skeleton } from '../components/ui/skeleton';

const ProductList = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [filters, setFilters] = useState({ category: '', brand: '', minPrice: 0, maxPrice: 10000 });
  const [sort, setSort] = useState('newest');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      const query = new URLSearchParams({
        ...filters,
        sort,
        limit: '20',
      }).toString();
      try {
        const res = await fetchWithAuth(`/api/products?${query}`);
        setProducts(res.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, [filters, sort]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Products</h1>
      <div className="flex flex-col md:flex-row gap-6">
        <aside className="md:w-64 flex-shrink-0">
          <ProductFilters filters={filters} setFilters={setFilters} />
        </aside>
        <main className="flex-1">
          <div className="flex justify-between items-center mb-6">
            <span className="text-text-dim">{products.length} products</span>
            <ProductSort sort={sort} setSort={setSort} />
          </div>
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-48 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
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