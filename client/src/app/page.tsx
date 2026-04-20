import { ProductCard } from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SearchIcon } from 'lucide-react';

export default function HomePage() {
  const featuredProducts = [
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
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Banner */}
      <section className="bg-gradient-to-r from-orange-500 to-blue-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Welcome to ShopSphere
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            Premium Products. Trusted Sellers. Fast Delivery.
          </p>
          <div className="max-w-2xl mx-auto relative">
            <Input
              type="text"
              placeholder="Search for products..."
              className="pl-12 pr-4 py-6 text-lg rounded-full border-none shadow-lg"
            />
            <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-500" />
          </div>
        </div>
      </section>

      {/* Deals of the Day */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Deals of the Day
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="text-center mt-12">
            <Button size="lg" variant="secondary">
              View All Deals
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Shop by Category
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['Electronics', 'Fashion', 'Home & Kitchen', 'Sports'].map(
              (category) => (
                <div
                  key={category}
                  className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center hover:shadow-md transition cursor-pointer"
                >
                  <span className="text-xl font-medium text-gray-700">
                    {category}
                  </span>
                </div>
              )
            )}
          </div>
        </div>
      </section>
    </div>
  );
}