import React from 'react';
import { ProductGrid } from '../components/product/ProductGrid';
import { Banner } from '../components/home/Banner';
import { CategoryList } from '../components/home/CategoryList';
import { useProducts } from '../hooks/useProducts';

export default function Home() {
  const { data: featuredProducts, isLoading } = useProducts({ limit: 10, is_featured: true });

  return (
    <div className="container mx-auto px-4 py-8">
      <Banner />
      <CategoryList />
      <section className="mt-12">
        <h2 className="text-3xl font-bold mb-6">Featured Products</h2>
        {isLoading ? <div>Loading...</div> : <ProductGrid products={featuredProducts} />}
      </section>
    </div>
  );
}