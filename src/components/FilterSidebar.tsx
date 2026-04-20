import React from 'react';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import { Slider } from './ui/slider';

const FilterSidebar: React.FC = () => {
  const [priceRange, setPriceRange] = React.useState([0, 1000]);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-medium mb-3">Price Range</h3>
        <Slider
          defaultValue={[0, 1000]}
          max={1000}
          step={10}
          value={priceRange}
          onValueChange={setPriceRange}
          className="mb-2"
        />
        <div className="flex justify-between text-sm text-text_dim">
          <span>{formatCurrency(priceRange[0])}</span>
          <span>{formatCurrency(priceRange[1])}</span>
        </div>
      </div>

      <div>
        <h3 className="font-medium mb-3">Category</h3>
        <ul className="space-y-2">
          {['Electronics', 'Clothing', 'Home & Kitchen', 'Books', 'Toys'].map((cat) => (
            <li key={cat}>
              <label className="flex items-center space-x-2 cursor-pointer">
                <Checkbox id={`cat-${cat}`} />
                <span className="text-text_dim">{cat}</span>
              </label>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="font-medium mb-3">Brand</h3>
        <ul className="space-y-2">
          {['Apple', 'Samsung', 'Nike', 'Sony', 'Dell'].map((brand) => (
            <li key={brand}>
              <label className="flex items-center space-x-2 cursor-pointer">
                <Checkbox id={`brand-${brand}`} />
                <span className="text-text_dim">{brand}</span>
              </label>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="font-medium mb-3">Rating</h3>
        <ul className="space-y-2">
          {[5, 4, 3, 2, 1].map((rating) => (
            <li key={rating}>
              <label className="flex items-center space-x-2 cursor-pointer">
                <Checkbox id={`rating-${rating}`} />
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        'h-4 w-4',
                        i < rating ? 'fill-yellow-500 text-yellow-500' : 'text-text_dim'
                      )}
                    />
                  ))}
                  <span className="text-text_dim ml-1">& up</span>
                </div>
              </label>
            </li>
          ))}
        </ul>
      </div>

      <Button className="w-full bg-accent hover:bg-orange-600">Apply Filters</Button>
    </div>
  );
};

export default FilterSidebar;