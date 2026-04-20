import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ImageGallery } from '../components/product/ImageGallery';
import { VariantSelector } from '../components/product/VariantSelector';
import { ReviewList } from '../components/product/ReviewList';
import { QASection } from '../components/product/QASection';
import { ProductRecommendations } from '../components/product/ProductRecommendations';
import { fetchWithAuth } from '../lib/api';
import { Button } from '../components/ui/button';
import { formatCurrency } from '../lib/formatters';
import { Skeleton } from '../components/ui/skeleton';

const ProductDetail = () => {
  const { slug } = useParams();
  const [product, setProduct] = useState<any>(null);
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true);
      try {
        const data = await fetchWithAuth(`/api/products/${slug}`);
        setProduct(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadProduct();
  }, [slug]);

  const handleAddToCart = () => {
    // Add to cart logic
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Skeleton className="h-96" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) return <div>Product not found</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ImageGallery images={product.images} />

        <div>
          <h1 className="text-3xl font-bold mb-2">{product.title}</h1>
          <p className="text-text-dim mb-4">{product.brand}</p>

          <div className="flex items-center gap-4 mb-4">
            <span className="text-2xl font-bold text-accent">{formatCurrency(product.price)}</span>
            {product.original_price > product.price && (
              <span className="text-text-dim line-through">{formatCurrency(product.original_price)}</span>
            )}
            {product.discount_percent > 0 && (
              <span className="bg-warning text-background px-2 py-1 rounded text-sm">
                {product.discount_percent}% off
              </span>
            )}
          </div>

          <p className="mb-6">{product.description}</p>

          {product.variants && product.variants.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold mb-2">Select Options</h3>
              <VariantSelector variants={product.variants} selected={selectedVariant} onSelect={setSelectedVariant} />
            </div>
          )}

          <div className="flex items-center gap-4 mb-6">
            <label className="font-medium">Quantity:</label>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value))}
              className="w-20 px-3 py-1 border border-border rounded"
            />
          </div>

          <Button onClick={handleAddToCart} className="w-full mb-4">
            Add to Cart
          </Button>

          <Button variant="secondary" className="w-full">
            Save to Wishlist
          </Button>
        </div>
      </div>

      <div className="mt-16 space-y-16">
        <ReviewList productId={product._id} />
        <QASection productId={product._id} />
        <ProductRecommendations productId={product._id} />
      </div>
    </div>
  );
};

export default ProductDetail;