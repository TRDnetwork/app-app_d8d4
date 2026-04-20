import React, { useState, useEffect, useCallback } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Button } from '../ui/button';
import { Filter } from 'lucide-react';

interface ProductSortProps {
  onSort: (sort: string) => void;
  className?: string;
}

const ProductSort: React.FC<ProductSortProps> = ({ onSort, className = '' }) => {
  const [sort, setSort] = useState('created_at_desc');

  // Debounce sort updates to reduce re-renders
  const debouncedSort = useCallback(
    debounce((sortValue) => {
      onSort(sortValue);
    }, 300),
    [onSort]
  );

  useEffect(() => {
    debouncedSort(sort);
  }, [sort, debouncedSort]);

  return (
    <div className={className}>
      {/* Desktop sort */}
      <div className="hidden md:block">
        <Select value={sort} onValueChange={setSort}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="price_asc">Price: Low to High</SelectItem>
            <SelectItem value="price_desc">Price: High to Low</SelectItem>
            <SelectItem value="created_at_desc">Newest</SelectItem>
            <SelectItem value="best_seller">Best Seller</SelectItem>
            <SelectItem value="rating_desc">Avg Rating</SelectItem>