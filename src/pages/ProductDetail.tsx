import React from 'react';
import { ImageGallery } from '../components/product/ImageGallery';
import { VariantSelector } from '../components/product/VariantSelector';
import { ReviewList } from '../components/product/ReviewList';
import { QASection } from '../components/product/QASection';
import { ProductRecommendations } from '../components/product/ProductRecommendations';

const ProductDetail = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <ImageGallery />
        <div>
          <h1 className="text-display text-3xl font-bold mb-4">Premium Wireless Headphones</h1>
          <p className="text-text-dim mb-4">by SoundMaster</p>
          <div className="flex items-center gap-4 mb-4">
            <span className="text-2xl font-bold text-accent">$199.99</span>
            <span className="text-text-dim line-through">$299.99</span>
            <span className="text-success font-medium">33% off</span>
          </div>
          <p className="mb-6">High-fidelity sound with active noise cancellation and 30-hour battery life.</p>
          <VariantSelector />
          <div className="flex gap-4 my-6">
            <button className="btn btn-primary px-8">Add to Cart</button>
            <button className="btn btn-secondary px-8">Buy Now</button>
          </div>
          <div className="mb-6">
            <span className="text-success">In Stock</span>
          </div>
        </div>
      </div>
      <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div>
          <h2 className="text-display text-2xl font-bold mb-6">Frequently Bought Together</h2>
          {/* FBT component */}
        </div>
        <div>
          <h2 className="text-display text-2xl font-bold mb-6">Customers Also Viewed</h2>
          <ProductRecommendations type="alsoViewed" />
        </div>
      </div>
      <div className="mt-16">
        <ReviewList productId="prod_123" />
      </div>
      <div className="mt-16">
        <QASection productId="prod_123" />
      </div>
    </div>
  );
};

export default ProductDetail;