'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';

export default function FilterSidebar() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-4 text-lg font-medium">Price Range</h3>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Input type="number" placeholder="Min" className="w-1/2" />
            <span>-</span>
            <Input type="number" placeholder="Max" className="w-1/2" />
          </div>
          <Slider defaultValue={[25, 75]} max={100} step={1} />
        </div>
      </div>

      <div>
        <h3 className="mb-4 text-lg font-medium">Category</h3>
        <div className="space-y-2">
          {['Electronics', 'Fashion', 'Home & Kitchen', 'Beauty', 'Sports'].map((category) => (
            <div key={category} className="flex items-center space-x-2">
              <Checkbox id={category} />
              <Label htmlFor={category} className="text-sm font-normal">
                {category}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-4 text-lg font-medium">Brand</h3>
        <div className="space-y-2">
          {['Apple', 'Samsung', 'Nike', 'Adidas', 'Sony'].map((brand) => (
            <div key={brand} className="flex items-center space-x-2">
              <Checkbox id={brand} />
              <Label htmlFor={brand} className="text-sm font-normal">
                {brand}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-4 text-lg font-medium">Rating</h3>
        <div className="space-y-2">
          {[5, 4, 3, 2, 1].map((rating) => (
            <div key={rating} className="flex items-center space-x-2">
              <Checkbox id={`rating-${rating}`} />
              <Label htmlFor={`rating-${rating}`} className="flex items-center text-sm font-normal">
                {rating} Star{rating > 1 ? 's' : ''} & Up
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Button className="w-full">Apply Filters</Button>
    </div>
  );
}