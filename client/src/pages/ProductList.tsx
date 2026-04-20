import React, { useState } from 'react';
import ProductGrid from '../components/product/ProductGrid';
import ProductFilters from '../components/product/ProductFilters';
import ProductSort from '../components/product/ProductSort';

const ProductList: React.FC = () => {
  const [filters, setFilters] = useState({
    priceRange: [0, 1000],
    brand: '',
    rating: 0,
    category: '',
  });
  const [sort, setSort] = useState('featured');

  const mockProducts = Array(12).fill(null).map((_, i) => ({
    id: `p${i}`,
    title: `Product ${i + 1}`,
    price: 99.99 + i * 10,
    originalPrice: 149.99 + i * 10,
    image: `https://via.placeholder.com/300?text=Product${i+1}`,
    rating: 4 + Math.random(),
    reviews: Math.floor(Math.random() * 200),
  }));

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Products</h1>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Filters Sidebar */}
        <aside className="md:w-64 flex-shrink-0">
          <ProductFilters filters={filters} setFilters={setFilters} />
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <p className="text-gray-600">
              Showing <strong>1-12</strong> of <strong>147</strong> products
            </p>
            <ProductSort value={sort} onChange={setSort} />
          </div>

          <ProductGrid products={mockProducts} />
        </main>
      </div>
    </div>
  );
};

export default ProductList;
```

```typescript