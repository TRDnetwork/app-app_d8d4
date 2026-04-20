import React, { useState, useEffect } from 'react';
import { apiClient } from '../lib/api';
import ProductCard from '../components/ProductCard';
import FilterSidebar from '../components/FilterSidebar';
import { Skeleton } from '../components/ui/skeleton';

const ProductListing: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [filters, setFilters] = useState({
    category: '',
    brand: '',
    minPrice: 0,
    maxPrice: 10000,
    rating: 0,
  });
  const [sort, setSort] = useState('created_at');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          category: filters.category,
          brand: filters.brand,
          min_price: filters.minPrice.toString(),
          max_price: filters.maxPrice.toString(),
          min_rating: filters.rating.toString(),
          sort,
          limit: '20',
        });
        const data = await apiClient(`/products?${params}`);
        setProducts(data.products);
      } catch (err) {
        // ignore
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [filters, sort]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Products</h1>
      <div className="flex flex-col md:flex-row gap-8">
        <aside className="md:w-64 flex-shrink-0">
          <FilterSidebar filters={filters} setFilters={setFilters} />
        </aside>
        <main className="flex-1">
          <div className="flex justify-between items-center mb-6">
            <span>{products.length} products found</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="border border-border rounded px-3 py-1 bg-surface text-text"
            >
              <option value="created_at">Newest</option>
              <option value="price">Price: Low to High</option>
              <option value="-price">Price: High to Low</option>
              <option value="avg_rating">Avg Rating</option>
              <option value="best_seller">Best Seller</option>
            </select>
          </div>
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="card">
                  <div className="p-4">
                    <Skeleton className="h-48 w-full shimmer" />
                    <Skeleton className="h-6 w-3/4 mt-4 shimmer" />
                    <Skeleton className="h-4 w-1/2 mt-2 shimmer" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
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

export default ProductListing;