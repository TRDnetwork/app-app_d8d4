import React from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Slider } from '../ui/slider';
import { Checkbox } from '../ui/checkbox';
import { Label } from '../ui/label';

interface ProductFiltersProps {
  filters: {
    priceRange: [number, number];
    brands: string[];
    ratings: number[];
    categories: string[];
  };
  setFilters: (filters: any) => void;
  availableBrands: string[];
  availableCategories: string[];
  onApply: () => void;
}

const ProductFilters: React.FC<ProductFiltersProps> = ({
  filters,
  setFilters,
  availableBrands,
  availableCategories,
  onApply,
}) => {
  const toggleBrand = (brand: string) => {
    setFilters({
      ...filters,
      brands: filters.brands.includes(brand)
        ? filters.brands.filter((b) => b !== brand)
        : [...filters.brands, brand],
    });
  };

  const toggleRating = (rating: number) => {
    setFilters({
      ...filters,
      ratings: filters.ratings.includes(rating)
        ? filters.ratings.filter((r) => r !== rating)
        : [...filters.ratings, rating],
    });
  };

  const toggleCategory = (category: string) => {
    setFilters({
      ...filters,
      categories: filters.categories.includes(category)
        ? filters.categories.filter((c) => c !== category)
        : [...filters.categories, category],
    });
  };

  return (
    <div className="bg-surface rounded-lg p-4 space-y-6 shadow-sm">
      <h3 className="text-lg font-semibold">Filters</h3>

      <div>
        <h4 className="font-medium mb-2">Price Range</h4>
        <Slider
          min={0}
          max={1000}
          step={10}
          value={filters.priceRange}
          onValueChange={(value) => setFilters({ ...filters, priceRange: value as [number, number] })}
          className="mb-2"
        />
        <div className="flex justify-between text-sm text-text_dim">
          <span>{formatCurrency(filters.priceRange[0])}</span>
          <span>{formatCurrency(filters.priceRange[1])}</span>
        </div>
      </div>

      <div>
        <h4 className="font-medium mb-2">Brand</h4>
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {availableBrands.map((brand) => (
            <div key={brand} className="flex items-center space-x-2">
              <Checkbox
                id={`brand-${brand}`}
                checked={filters.brands.includes(brand)}
                onCheckedChange={() => toggleBrand(brand)}
              />
              <Label htmlFor={`brand-${brand}`}>{brand}</Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h4 className="font-medium mb-2">Customer Rating</h4>
        <div className="space-y-2">
          {[5, 4, 3, 2, 1].map((rating) => (
            <div key={rating} className="flex items-center space-x-2">
              <Checkbox
                id={`rating-${rating}`}
                checked={filters.ratings.includes(rating)}
                onCheckedChange={() => toggleRating(rating)}
              />
              <Label htmlFor={`rating-${rating}`}>
                {rating}+ Stars
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h4 className="font-medium mb-2">Category</h4>
        <div className="space-y-2">
          {availableCategories.map((category) => (
            <div key={category} className="flex items-center space-x-2">
              <Checkbox
                id={`category-${category}`}
                checked={filters.categories.includes(category)}
                onCheckedChange={() => toggleCategory(category)}
              />
              <Label htmlFor={`category-${category}`}>{category}</Label>
            </div>
          ))}
        </div>
      </div>

      <Button onClick={onApply} className="w-full">
        Apply Filters
      </Button>
    </div>
  );
};

import { formatCurrency } from '../../lib/formatters';

export default ProductFilters;