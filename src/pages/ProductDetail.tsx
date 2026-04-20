import React from 'react';
import { useParams } from 'react-router-dom';
import { ImageGallery } from '../components/product/ImageGallery';
import { VariantSelector } from '../components/product/VariantSelector';
import { ReviewList } from '../components/product/ReviewList';
import { QASection } from '../components/product/QASection';
import { useProduct } from '../hooks/useProduct';
import { Button } from '../components/ui/button';
import { useCartStore } from '../stores/cartStore';

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { data: product, isLoading } = useProduct(slug!);
  const [selectedVariant, setSelectedVariant] = React.useState<string | null>(null);
  const addToCart = useCartStore(state => state.addItem);

  if (isLoading) return <div>Loading...</div>;
  if (!product) return <div>Product not found</div>;

  const handleAddToCart = () => {
    addToCart({
      id: selectedVariant || product._id,
      productId: product._id,
      name: product.title,
      price: product.price,
      image: product.images[0],
      quantity: 1,
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ImageGallery images={product.images} />
        <div>
          <h1 className="text-3xl font-bold mb-2">{product.title}</h1>
          <p className="text-text-dim mb-4">{product.brand}</p>
          <div className="flex items-center gap-4 mb-4">
            <span className="text-2xl font-bold text-primary">${product.price}</span>
            {product.original_price > product.price && (
              <span className="text-lg text-text-dim line-through">${product.original_price}</span>
            )}
            {product.discount_percent > 0 && (
              <span className="text-success font-medium">Save {product.discount_percent}%</span>
            )}
          </div>
          <p className="mb-6">{product.description}</p>
          {product.variants && product.variants.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-2">Options</h3>
              <VariantSelector variants={product.variants} onSelect={setSelectedVariant} />
            </div>
          )}
          <Button onClick={handleAddToCart} className="w-full mb-4">
            Add to Cart
          </Button>
          <Button variant="secondary" className="w-full">
            Save to Wishlist
          </Button>
        </div>
      </div>
      <div className="mt-12">
        <ReviewList productId={product._id} />
      </div>
      <div className="mt-12">
        <QASection productId={product._id} />
      </div>
    </div>
  );
}