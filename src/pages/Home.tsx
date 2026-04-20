import React from 'react';
import { Button } from '../components/ui/button';
import { ProductGrid } from '../components/product/ProductGrid';
import { useNavigate } from 'react-router-dom';

const Home: React.FC = () => {
  const navigate = useNavigate();

  const featuredProducts = [
    {
      _id: '1',
      title: 'Wireless Earbuds Pro',
      price: 129.99,
      original_price: 179.99,
      images: ['https://via.placeholder.com/300'],
      rating: 4.5,
      reviews: 128,
    },
    {
      _id: '2',
      title: 'Smart Watch Series 5',
      price: 299.99,
      original_price: 399.99,
      images: ['https://via.placeholder.com/300'],
      rating: 4.7,
      reviews: 256,
    },
    {
      _id: '3',
      title: 'Ultra HD 4K Monitor',
      price: 349.99,
      original_price: 449.99,
      images: ['https://via.placeholder.com/300'],
      rating: 4.8,
      reviews: 89,
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Banner */}
      <div className="relative h-64 md:h-80 rounded-lg overflow-hidden mb-8">
        <img
          src="https://via.placeholder.com/1200x400"
          alt="Hero Banner"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-black/20 flex items-center">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
              Summer Sale Up to 60% Off
            </h1>
            <Button size="lg" className="bg-accent hover:bg-accent/90">
              Shop Now
            </Button>
          </div>
        </div>
      </div>

      {/* Deals of the Day */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-text">Deals of the Day</h2>
          <Button variant="link" className="text-accent">
            View All
          </Button>
        </div>
        <ProductGrid products={featuredProducts} />
      </section>

      {/* Featured Categories */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text mb-6">Featured Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {['Electronics', 'Fashion', 'Home & Kitchen', 'Sports'].map((category) => (
            <div
              key={category}
              className="relative h-32 rounded-lg overflow-hidden cursor-pointer group"
              onClick={() => navigate(`/products?category=${category.toLowerCase()}`)}
            >
              <img
                src={`https://via.placeholder.com/300?text=${category}`}
                alt={category}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <span className="text-white font-medium">{category}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Sponsored Products */}
      <section>
        <h2 className="text-2xl font-bold text-text mb-6">Sponsored Products</h2>
        <ProductGrid products={featuredProducts} />
      </section>
    </div>
  );
};

export default Home;