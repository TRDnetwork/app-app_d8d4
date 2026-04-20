import React from 'react';
import { ProductGrid } from '../components/product/ProductGrid';
import { ProductFilters } from '../components/product/ProductFilters';
import { ProductSort } from '../components/product/ProductSort';
import { useProducts } from '../hooks/useProducts';

export default function ProductList() {
  const [filters, setFilters] = React.useState({});
  const [sort, setSort] = React.useState('created_at_desc');
  const { data: products, isLoading } = useProducts({ ...filters, sort });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Products</h1>
      <div className="flex flex-col md:flex-row gap-6">
        <aside className="md:w-64 flex-shrink-0">
          <ProductFilters onFilter={setFilters} />
        </aside>
        <main className="flex-1">
          <div className="flex justify-between items-center mb-6">
            <span className="text-text-dim">{products?.length || 0} products</span>
            <ProductSort onSort={setSort} />
          </div>
          {isLoading ? <div>Loading...</div> : <ProductGrid products={products} />}
        </main>
      </div>
    </div>
  );
}