import React from 'react';
import { ProductFilters } from '../components/product/ProductFilters';
import { ProductSort } from '../components/product/ProductSort';
import { ProductGrid } from '../components/product/ProductGrid';

const ProductList = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-display text-4xl font-bold mb-8">Products</h1>
      <div className="flex flex-col md:flex-row gap-8">
        <aside className="md:w-1/4">
          <ProductFilters />
        </aside>
        <main className="md:w-3/4">
          <div className="flex justify-between items-center mb-6">
            <span className="text-text-dim">Showing 1–20 of 100+ results</span>
            <ProductSort />
          </div>
          <ProductGrid endpoint="/api/products" />
        </main>
      </div>
    </div>
  );
};

export default ProductList;