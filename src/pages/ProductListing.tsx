import React, { useState } from 'react';
import { ProductCard } from '../components/ProductCard';
import { FilterSidebar } from '../components/FilterSidebar';
import { SortDropdown } from '../components/SortDropdown';

const mockProducts = Array(12).fill(null).map((_, i) => ({
  _id: `prod-${i}`,
  title: `Wireless Headphones Model ${i + 1}`,
  price: 89.99 + i * 5,
  original_price: 129.99,
  image: `https://via.placeholder.com/300x300?text=Headphones+${i + 1}`,
  rating: 4 + Math.random() * 1,
  review_count: Math.floor(Math.random() * 200),
}));

const ProductListing = () => {
  const [sortBy, setSortBy] = useState('price-low');
  const [filters, setFilters] = useState({
    category: '',
    brand: '',
    minPrice: 0,
    maxPrice: 1000,
    rating: 0,
  });

  const sortedProducts = [...mockProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low': return a.price - b.price;
      case 'price-high': return b.price - a.price;
      case 'newest': return 0; // mock
      case 'best-seller': return 0; // mock
      case 'rating': return b.rating - a.rating;
      default: return 0;
    }
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Products</h1>
      
      <div className="flex flex-col md:flex-row gap-8">
        <aside className="md:w-64 flex-shrink-0">
          <FilterSidebar filters={filters} setFilters={setFilters} />
        </aside>
        
        <main className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <p className="text-muted-foreground">
              Showing {sortedProducts.length} products
            </p>
            <SortDropdown value={sortBy} onChange={setSortBy} />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {sortedProducts.map((