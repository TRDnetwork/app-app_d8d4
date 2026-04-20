import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FilterSidebar } from '../components/FilterSidebar';
import { ProductCard } from '../components/ProductCard';
import { Button } from '../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Skeleton } from '../components/ui/skeleton';

const mockProducts = Array.from({ length: 12 }, (_, i) => ({
  _id: (i + 1).toString(),
  title: `Product ${i + 1}`,
  price: Math.floor(Math.random() * 500) + 50,
  image: `https://via.placeholder.com/300x300?text=Product+${i + 1}`,
  rating: (Math.random() * 2 + 3).toFixed(1),
}));

export const ProductListing: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'relevance');
  const [isLoading, setIsLoading] = useState(false);

  const handleSortChange = (value: string) => {
    setSortBy(value);
    setSearchParams({ ...Object.fromEntries(searchParams), sort: value });
  };

  const handleFilterChange = (filters: Record<string, string>) => {
    setSearchParams({ ...filters, sort: sortBy });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Products</h1>

      <div className="flex flex-col md:flex-row gap-6">
        <aside className="md:w-64 flex-shrink-0">
          <FilterSidebar onFilterChange={handleFilterChange} />
        </aside>

        <main className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <p className="text-text_dim">
              Showing <span className="text-text">1-12</span> of <span className="text-text">147</span> products
            </p>
            <div className="flex items-center space-x-2">
              <span className="text-text_dim text-sm">Sort by:</span>
              <Select value={sortBy} onValueChange={handleSortChange}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevance">Relevance</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="rating">Avg. Rating</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-48 w-full rounded-lg" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {mockProducts.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  onAddToCart={() => console.log('Added to cart', product._id)}
                />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};