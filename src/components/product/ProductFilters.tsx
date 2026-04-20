import React from 'react';
import { Input } from '../ui/input';

interface ProductFiltersProps {
  onFilter: (filters: Record<string, any>) => void;
}

export const ProductFilters: React.FC<ProductFiltersProps> = ({ onFilter }) => {
  const [priceRange, setPriceRange] = React.useState({ min: '', max: '' });

  React.useEffect(() => {
    onFilter({ price_min: priceRange.min, price_max: priceRange.max });
  }, [priceRange, onFilter]);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-medium mb-3">Price Range</h3>
        <div className="space-y-2">
          <Input
            type="number"
            placeholder="Min"
            value={priceRange.min}
            onChange={e => setPriceRange({ ...priceRange, min: e.target.value })}
          />
          <Input
            type="number"
            placeholder="Max"
            value={priceRange.max}
            onChange={e => setPriceRange({ ...priceRange, max: e.target.value })}
          />
        </div>
      </div>
      <div>
        <h3 className="font-medium mb-3">Brand</h3>
        <div className="space-y-2">
          {['Apple', 'Samsung', 'Sony', 'Nike'].map(brand => (
            <