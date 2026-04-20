import { ProductCard } from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { FilterIcon, SlidersHorizontalIcon } from 'lucide-react';

const products = [
  {
    id: '1',
    title: 'Wireless Noise-Cancelling Headphones',
    price: 199.99,
    discountedPrice: 149.99,
    image: 'https://via.placeholder.com/300x300?text=Headphones',
    rating: 4.7,
    reviews: 124,
  },
  {
    id: '2',
    title: 'Smart Fitness Watch',
    price: 249.99,
    discountedPrice: 199.99,
    image: 'https://via.placeholder.com/300x300?text=Watch',
    rating: 4.5,
    reviews: 89,
  },
  {
    id: '3',
    title: 'Ultra HD 4K Streaming Box',
    price: 89.99,
    discountedPrice: 69.99,
    image: 'https://via.placeholder.com/300x300?text=Streaming+Box',
    rating: 4.8,
    reviews: 203,
  },
  {
    id: '4',
    title: 'Professional DSLR Camera',
    price: 1299.99,
    discountedPrice: 999.99,
    image: 'https://via.placeholder.com/300x300?text=Camera',
    rating: 4.9,
    reviews: 156,
  },
];

export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col gap-6">
          {/* Mobile Filter Button */}
          <div className="flex items-center justify-between md:hidden">
            <h1 className="text-2xl font-bold text-gray-900">Products</h1>
            <Button variant="outline" size="sm">
              <SlidersHorizontalIcon className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Filters Sidebar */}
            <aside className="md:col-span-1">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sticky top-4">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <SlidersHorizontalIcon className="h-5 w-5 mr-2" />
                  Filters
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price Range
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        placeholder="Min"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                      />
                      <input
                        type="number"
                        placeholder="Max"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Brand
                    </label>
                    {['Apple', 'Samsung', 'Sony', 'Nike'].map((brand) => (
                      <div key={brand} className="flex items-center mt-1">
                        <input
                          type="checkbox"
                          id={brand}
                          className="rounded border-gray-300 text-orange-500 focus:ring-orange-500 h-4 w-4"
                        />
                        <label
                          htmlFor={brand}
                          className="ml-2 text-sm text-gray-700"
                        >
                          {brand}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                <Button className="w-full mt-6">Apply Filters</Button>
              </div>
            </aside>

            {/* Product Grid */}
            <main className="md:col-span-3">
              {/* Desktop Header */}
              <div className="hidden md:flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Products</h1>
                <div className="flex items-center gap-2">
                  <FilterIcon className="h-5 w-5 text-gray-500" />
                  <select className="border border-gray-300 rounded-md px-3 py-2 text-sm min-w-[180px]">
                    <option>Sort by: Featured</option>
                    <option>Price: Low to High</option>
                    <option>Price: High to Low</option>
                    <option>Best Selling</option>
                    <option>Customer Rating</option>
                  </select>
                </div>
              </div>

              {/* Mobile Sort */}
              <div className="flex items-center gap-2 mb-6 md:hidden">
                <FilterIcon className="h-5 w-5 text-gray-500" />
                <select className="border border-gray-300 rounded-md px-3 py-2 text-sm flex-1">
                  <option>Sort by: Featured</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Best Selling</option>
                  <option>Customer Rating</option>
                </select>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-2 gap-4 sm:gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              <div className="flex justify-center mt-8">
                <Button variant="outline">Load More</Button>
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}