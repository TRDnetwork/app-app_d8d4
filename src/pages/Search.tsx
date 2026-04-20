import React from 'react';
import { ProductGrid } from '../components/product/ProductGrid';
import { useSearchParams } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';

export default function Search() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const { data: products, isLoading } = useProducts({ search: query });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Search Results for "{query}"</h1>
      {isLoading ? <div>Loading...</div> : <ProductGrid products={products} />}
    </div>
  );
}