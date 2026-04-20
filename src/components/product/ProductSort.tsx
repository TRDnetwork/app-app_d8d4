import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

interface ProductSortProps {
  sort: string;
  setSort: (sort: string) => void;
}

const ProductSort: React.FC<ProductSortProps> = ({ sort, setSort }) => {
  return (
    <div className="flex items-center space-x-2">
      <label htmlFor="sort" className="text-text_dim text-sm">Sort by:</label>
      <Select value={sort} onValueChange={setSort}>
        <SelectTrigger id="sort" className="w-48 bg-muted">
          <SelectValue placeholder="Relevance" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="relevance">Relevance</SelectItem>
          <SelectItem value="price-asc">Price: Low to High</SelectItem>
          <SelectItem value="price-desc">Price: High to Low</SelectItem>
          <SelectItem value="newest">Newest</SelectItem>
          <SelectItem value="best-seller">Best Seller</SelectItem>
          <SelectItem value="rating">Average Rating</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default ProductSort;