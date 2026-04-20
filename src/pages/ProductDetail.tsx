import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { ImageGallery } from '../components/ImageGallery';
import { useCartStore } from '../stores/cartStore';
import { useWishlistStore } from '../stores/wishlistStore';
import { Skeleton } from '../components/ui/skeleton';

const mockProduct = {
  _id: '1',
  title: 'Premium Wireless Headphones',
  description: 'Experience crystal-clear sound with our premium noise-canceling headphones. Perfect for travel, work, or relaxation.',
  price: 199.99,
  original_price: 299.99,
  discount_percent: 33,
  images: [
    'https://via.placeholder.com/600x600?text=Headphones+Front',
    'https://via.placeholder.com/600x600?text=Headphones+Side',
    'https://via.placeholder.com/600x600?text=Headphones+Back',
  ],
  variants: [
    { size: '', color: 'Black', sku: 'HDB-001', stock: 15 },
    { size: '', color: 'Silver', sku: 'HDS-001', stock: 8 },
    { size: '', color: 'Rose Gold', sku: 'HDR-001', stock: 3 },
  ],
  stock_total: 26,
  avg_rating: 4.7,
  review_count: 124,
  brand: 'SoundMax',
  category: 'Electronics',
  subcategory: 'Headphones',
};

export const ProductDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCartStore();
  const { toggleWishlist, productIds } = useWishlistStore();
  const [selectedVariant, setSelectedVariant] = useState(mockProduct.variants[0]);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const isInWishlist = productIds.includes(id || '');

  const handleAddToCart = () => {
    addToCart(mockProduct._id, selectedVariant.sku, quantity);
    navigate('/cart');
  };

  const handleBuyNow = () => {
    addToCart(mockProduct._id, selectedVariant.sku, quantity);
    navigate('/checkout');
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Skeleton className="h-96 rounded-lg" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-12 w-1/3" />
            <Skeleton className="h-10 w-40" />
            <Skeleton className="h-10 w-40" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ImageGallery images={mockProduct.images} />

        <div>
          <h1 className="text-3xl font-bold mb-2">{mockProduct.title}</h1>
          <p className="text-text_dim mb-4">{mockProduct.brand} • {mockProduct.category}</p>

          <div className="flex items-center mb-4">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <svg
                  key