import React, { useState, useEffect, useCallback } from 'react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Filter, X } from 'lucide-react';

interface ProductFiltersProps {
  onFilter: (filters: Record<string, any>) => void;
  className?: string;
}

const ProductFilters: React.FC<ProductFiltersProps> = ({ onFilter, className = '' }) => {
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [brand, setBrand] = useState('');
  const [rating, setRating] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  // Debounce filter updates to reduce re-renders
  const debouncedFilter = useCallback(
    debounce((filters) => {
      onFilter(filters);
    }, 300),
    [onFilter]
  );

  useEffect(() => {
    debouncedFilter({
      price_min: priceRange.min,
      price_max: priceRange.max,
      brand,
      rating,
    });
  }, [priceRange, brand, rating, debouncedFilter]);

  const clearFilters = () => {
    setPriceRange({ min: '', max: '' });
    setBrand('');
    setRating('');
  };

  const toggleFilters = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={className}>
      {/* Mobile filter button */}
      <Button
        variant="outline"
        className="md:hidden w-full mb-4 flex items-center justify-between"
        onClick={toggleFilters}
      >
        <div className="flex items-center">
          <Filter className="h-4 w-4 mr-2" />
          <span>Filters</span>
        </div>
        <span className="text-xs bg-primary text-primary-foreground rounded-full h-5 w-5 flex items-center justify-center">
          {Object.values({ min: priceRange.min, max: priceRange.max, brand, rating }).filter(Boolean).length}
        </span>
      </Button>

      {/* Desktop filters */}
      <div className="hidden md:block space-y-6">
        <div>
          <h3 className="font-medium mb-3">Price Range</h3>
          <div className="space-y-2">
            <Input
              type="number"
              placeholder="Min"
              value={priceRange.min}
              onChange={e => setPriceRange({ ...priceRange, min: e.target.value })}
              className="h-10"
            />
            <Input
              type="number"
              placeholder="Max"
              value={priceRange.max}
              onChange={e => setPriceRange({ ...priceRange, max: e.target.value })}
              className="h-10"
            />
          </div>
        </div>
        <div>
          <h3 className="font-medium mb-3">Brand</h3>
          <div className="space-y-2">
            {['Apple', 'Samsung', 'Sony', 'Nike'].map(brandName => (
              <label key={brandName} className="flex items-center space-x-2 py-1">
                <input
                  type="checkbox"
                  checked={brand === brandName}
                  onChange={() => setBrand(brand === brandName ? '' : brandName)}
                  className="rounded border-gray-300 text-primary focus:ring-primary h-4 w-4"
                />
                <span className="text-sm">{brandName}</span>
              </label>
            ))}
          </div>
        </div>
        <div>
          <h3 className="font-medium mb-3">Rating</h3>
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map(star => (
              <label key={star} className="flex items-center space-x-2 py-1">
                <input
                  type="radio"
                  name="rating"
                  checked={rating === star.toString()}
                  onChange={() => setRating(rating === star.toString() ? '' : star.toString())}
                  className="rounded border-gray-300 text-primary focus:ring-primary h-4 w-4"
                />
                <span className="text-sm">
                  {star} star{star > 1 ? 's' : ''} & up
                </span>
              </label>
            ))}
          </div>
        </div>
        <Button
          variant="outline"
          className="w-full"
          onClick={clearFilters}
        >
          Clear Filters
        </Button>
      </div>

      {/* Mobile filters drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div 
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={toggleFilters}
          ></div>
          <div className="absolute bottom-0 left-0 right-0 bg-card rounded-t-lg p-4 max-h-96 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Filters</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleFilters}
                className="min-h-8 min-w-8 p-2"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            
            <div className="space-y-6">
              <div>
                <h3 className="font-medium mb-3">Price Range</h3>
                <div className="space-y-2">
                  <Input
                    type="number"
                    placeholder="Min"
                    value={priceRange.min}
                    onChange={e => setPriceRange({ ...priceRange, min: e.target.value })}
                    className="h-10"
                  />
                  <Input
                    type="number"
                    placeholder="Max"
                    value={priceRange.max}
                    onChange={e => setPriceRange({ ...priceRange, max: e.target.value })}
                    className="h-10"
                  />
                </div>
              </div>
              <div>
                <h3 className="font-medium mb-3">Brand</h3>
                <div className="space-y-2">
                  {['Apple', 'Samsung', 'Sony', 'Nike'].map(brandName => (
                    <label key={brandName} className="flex items-center space-x-2 py-1">
                      <input
                        type="checkbox"
                        checked={brand === brandName}
                        onChange={() => setBrand(brand === brandName ? '' : brandName)}
                        className="rounded border-gray-300 text-primary focus:ring-primary h-4 w-4"
                      />
                      <span className="text-sm">{brandName}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-medium mb-3">Rating</h3>
                <div className="space-y-2">
                  {[5, 4, 3, 2, 1].map(star => (
                    <label key={star} className="flex items-center space-x-2 py-1">
                      <input
                        type="radio"
                        name="rating"
                        checked={rating === star.toString()}
                        onChange={() => setRating(rating === star.toString() ? '' : star.toString())}
                        className="rounded border-gray-300 text-primary focus:ring-primary h-4 w-4"
                      />
                      <span className="text-sm">
                        {star} star{star > 1 ? 's' : ''} & up
                      </span>
                    </label>
                  ))}
                </div>
              </div>
              <Button
                variant="outline"
                className="w-full"
                onClick={clearFilters}
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Debounce utility function
function debounce<T extends (...args: any[]) => any>(func: T, wait: number): T {
  let timeout: ReturnType<typeof setTimeout>;
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  } as T;
}

export default ProductFilters;
```

```typescript