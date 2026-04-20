import React, { useState } from 'react';
import { ProductCard } from '../components/product/ProductCard';
import { ProductFilters } from '../components/product/ProductFilters';
import { ProductSort } from '../components/product/ProductSort';
import { ProductGrid } from '../components/product/ProductGrid';
import { fetchWithAuth } from '../lib/api';

const ProductList = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [filters, setFilters] = useState({});
  const [sort, setSort] = useState('newest');
  const [loading, setLoading] = useState(true);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const res = await fetchWithAuth(`/products?${new URLSearchParams({ ...filters, sort })}`);
      setProducts(res.data || []);
    } catch (err) {
      console.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    loadProducts();
  }, [filters, sort]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Products</h1>
      <div className="flex flex-col gap-8 md:flex-row">
        <aside className="md:w-64">
          <ProductFilters onFilter={setFilters} />
        </aside>
        <main className="flex-1">
          <div className="mb-6 flex items-center justify-between">
            <span>{products.length} products</span>
            <ProductSort value={sort} onChange={setSort} />
          </div>
          <ProductGrid products={products} loading={loading} />
        </main>
      </div>
    </div>
  );
};

export default ProductList;