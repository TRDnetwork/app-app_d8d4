import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchWithAuth } from '../lib/api';
import { ImageGallery } from '../components/product/ImageGallery';
import { VariantSelector } from '../components/product/VariantSelector';
import { ReviewList } from '../components/product/ReviewList';
import { QASection } from '../components/product/QASection';
import { Button } from '../components/ui/button';
import { formatCurrency } from '../lib/formatters';
import { Skeleton } from '../components/ui/skeleton';
import { wishlistStore } from '../stores/wishlistStore';

const ProductDetail = () => {
  const { slug } = useParams();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState<Record<string, string>>({});

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const res = await fetchWithAuth(`/products/${slug}`);
        setProduct(res.data);
      } catch (err) {
        console.error('Failed to load product');
      } finally {
        setLoading(false);
      }
    };
    loadProduct();
  }, [slug]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <Skeleton className="h-96 w-full" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-12 w-32" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) return <div>Product not found</div>;

  const isInWishlist = wishlistStore((s) => s.has(product._id));
  const toggleWishlist = () => {
    if (isInWishlist) {
      wishlistStore.getState().remove(product._id);
    } else {
      wishlistStore.getState().add(product);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <ImageGallery images={product.images} />
        <div>
          <h1 className="mb-2 text-2xl font-bold">{product.title}</h1>
          <p className="mb-4 text-text_dim">{product.brand}</p>
          <div className="mb-4">
            <span className="text-2xl font-bold text-accent">{formatCurrency(product.price)}</span>
            {product.original_price > product.price && (
              <span className="ml-2 text-lg text-text_dim line-through">{formatCurrency(product.original_price)}</span>
            )}
            {product.discount_percent > 0 && (
              <span className="ml-2 rounded bg-warning px-2 py-1 text-sm text-white">-{product.discount_percent}%</span>
            )}
          </div>
          <p className="mb-6">{product.description}</p>

          {product.variants.length > 0 && (
            <div className="mb-6">
              <h3 className="mb-2 font-medium">Options</h3>
              <VariantSelector variants={product.variants} selected={selectedVariant} onChange={setSelectedVariant} />
            </div>
          )}

          <div className="mb-6">
            <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm ${product.stock_quantity > 0 ? 'bg-success/20 text-success' : 'bg-error/20 text-error'}`}>
              {product.stock_quantity > 0 ? 'In Stock' : 'Out of Stock'}
            </span>
          </div>

          <div className="flex gap-4">
            <Button className="flex-1">Add to Cart</Button>
            <Button variant="outline" onClick={toggleWishlist}>
              {isInWishlist ? '❤️' : '♡'}
            </Button>
          </div>

          <div className="mt-8 border-t pt-6">
            <h3 className="mb-4 text-xl font-semibold">Product Details</h3>
            <dl className="space-y-2">
              <div className="flex justify-between">
                <dt className="text-text_dim">SKU</dt>
                <dd>{product.sku}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-text_dim">Category</dt>
                <dd>{product.category_id}</dd>
              </div>
            </dl>
          </div>
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
};

export default ProductDetail;