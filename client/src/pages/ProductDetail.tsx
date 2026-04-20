import React, { useState } from 'react';
import { Button } from '../components/ui/button';
import ImageGallery from '../components/product/ImageGallery';
import VariantSelector from '../components/product/VariantSelector';
import ReviewList from '../components/product/ReviewList';
import QASection from '../components/product/QASection';
import { useCart } from '../context/CartContext';

const ProductDetail: React.FC = () => {
  const [selectedVariant, setSelectedVariant] = useState('');
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  const mockProduct = {
    id: 'p1',
    title: 'Premium Wireless Headphones',
    description: 'Experience crystal-clear audio with our premium wireless headphones. Featuring active noise cancellation, 30-hour battery life, and comfortable over-ear design.',
    price: 199.99,
    originalPrice: 299.99,
    discountPercent: 33,
    brand: 'AudioPro',
    category: 'Electronics',
    images: [
      'https://via.placeholder.com/600x600?text=Main+Image',
      'https://via.placeholder.com/600x600?text=Side+View',
      'https://via.placeholder.com/600x600?text=Detail+Shot',
      'https://via.placeholder.com/600x600?text=In+Use',
    ],
    variants: [
      { name: 'Color', values: ['Black', 'White', 'Blue'] },
      { name: 'Size', values: ['Small', 'Medium', 'Large'] },
    ],
    stockQuantity: 15,
    rating: 4.5,
    reviewCount: 125,
    frequentlyBoughtTogether: [
      { id: 'p2', title: 'AudioPro Case', price: 29.99, image: 'https://via.placeholder.com/300' },
      { id: 'p3', title: 'Cleaning Kit', price: 19.99, image: 'https://via.placeholder.com/300' },
    ],
    customersAlsoViewed: [
      { id: 'p4', title: 'Wireless Earbuds', price: 149.99, image: 'https://via.placeholder.com/300' },
      { id: 'p5', title: 'Bluetooth Speaker', price: 89.99, image: 'https://via.placeholder.com/300' },
    ],
  };

  const mockReviews = Array(5).fill(null).map((_, i) => ({
    id: `r${i}`,
    rating: 5 - (i % 3),
    title: `Great product! ${i + 1}`,
    comment: 'This product exceeded my expectations. The quality is excellent and it arrived quickly.',
    author: `User ${i + 1}`,
    date: new Date(Date.now() - i * 86400000).toISOString().split('T')[0],
    helpfulVotes: Math.floor(Math.random() * 10),
    images: i % 2 === 0 ? [`https://via.placeholder.com/200?text=Review+${i+1}`] : [],
  }));

  const mockQuestions = Array(3).fill(null).map((_, i) => ({
    id: `q${i}`,
    question: `Does this work with Android devices? ${i + 1}`,
    answer: 'Yes, this product is compatible with all Android devices running version 8.0 and above.',
    author: `User ${i + 1}`,
    date: new Date(Date.now() - i * 86400000).toISOString().split('T')[0],
  }));

  const handleAddToCart = () => {
    addToCart({
      id: mockProduct.id,
      title: mockProduct.title,
      price: mockProduct.price,
      image: mockProduct.images[0],
      quantity,
      variant: selectedVariant,
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Image Gallery */}
        <div>
          <ImageGallery images={mockProduct.images} />
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{mockProduct.title}</h1>

          <div className="flex items-center gap-2 mb-4">
            <div className="flex text-orange-500">
              {'★'.repeat(Math.floor(mockProduct.rating))}{'☆'.repeat(5 - Math.floor(mockProduct.rating))}
            </div>
            <span className="text-gray-600">
              {mockProduct.rating} ({mockProduct.reviewCount} reviews)
            </span>
          </div>

          <div className="flex items-center gap-4 mb-6">
            <span className="text-3xl font-bold text-orange-500">${mockProduct.price}</span>
            {mockProduct.originalPrice > mockProduct.price && (
              <span className="text-xl text-gray-500 line-through">${mockProduct.originalPrice}</span>
            )}
            {mockProduct.discountPercent > 0 && (
              <span className="text-lg text-green-600 font-medium">Save {mockProduct.discountPercent}%</span>
            )}
          </div>

          <div className="mb-6">
            <p className={`mb-4 ${mockProduct.stockQuantity > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {mockProduct.stockQuantity > 0 
                ? `In stock (${mockProduct.stockQuantity} available)`
                : 'Out of stock'
              }
            </p>
            
            {mockProduct.variants && mockProduct.variants.length > 0 && (
              <VariantSelector 
                variants={mockProduct.variants} 
                selected={selectedVariant}
                onSelect={setSelectedVariant}
              />
            )}
          </div>

          <div className="flex items-center gap-4 mb-8">
            <div className="flex items-center border border-gray-300 rounded">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={mockProduct.stockQuantity === 0}
              >
                -
              </Button>
              <span className="w-12 text-center">{quantity}</span>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setQuantity(quantity + 1)}
                disabled={mockProduct.stockQuantity === 0}
              >
                +
              </Button>
            </div>
            
            <Button 
              onClick={handleAddToCart}
              disabled={mockProduct.stockQuantity === 0}
              className="flex-1 bg-orange-500 hover:bg-orange-600"
            >
              Add to Cart
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <Button variant="outline">
              Share
            </Button>
            <Button variant="outline">
              Compare
            </Button>
          </div>

          <div className="prose prose-sm max-w-none">
            <h3 className="text-lg font-medium mb-2">Product Description</h3>
            <p className="text-gray-600">{mockProduct.description}</p>
          </div>
        </div>
      </div>

      {/* Frequently Bought Together */}
      <section className="mt-16">
        <h2 className="text-2xl font-bold mb-6">Frequently Bought Together</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {mockProduct.frequentlyBoughtTogether.map((product) => (
            <div key={product.id} className="border border-gray-200 rounded-lg p-4">
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-40 object-cover rounded mb-4"
              />
              <h3 className="font-medium mb-2">{product.title}</h3>
              <p className="text-orange-500 font-bold">${product.price}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Customers Also Viewed */}
      <section className="mt-16">
        <h2 className="text-2xl font-bold mb-6">Customers Also Viewed</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {mockProduct.customersAlsoViewed.map((product) => (
            <div key={product.id} className="border border-gray-200 rounded-lg p-4">
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-40 object-cover rounded mb-4"
              />
              <h3 className="font-medium mb-2">{product.title}</h3>
              <p className="text-orange-500 font-bold">${product.price}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Reviews */}
      <section className="mt-16">
        <ReviewList reviews={mockReviews} />
      </section>

      {/* Q&A */}
      <section className="mt-16">
        <QASection questions={mockQuestions} />
      </section>
    </div>
  );
};

export default ProductDetail;
```

```typescript