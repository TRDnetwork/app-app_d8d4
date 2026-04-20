import React from 'react';
import { ProductGrid } from '../components/product/ProductGrid';
import { Banner } from '../components/layout/Banner';

const Home = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <Banner />
      <section className="my-12">
        <h2 className="text-display text-3xl font-bold mb-6">Deals of the Day</h2>
        <ProductGrid endpoint="/api/products?sort=-discount_percent&limit=10" />
      </section>
      <section className="my-12">
        <h2 className="text-display text-3xl font-bold mb-6">Featured Categories</h2>
        {/* Category grid would go here */}
      </section>
      <section className="my-12">
        <h2 className="text-display text-3xl font-bold mb-6">Sponsored Products</h2>
        <ProductGrid endpoint="/api/products?is_sponsored=true&limit=8" />
      </section>
    </div>
  );
};

export default Home;