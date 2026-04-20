import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { apiClient } from '../lib/api';
import ImageGallery from '../components/ImageGallery';
import { Button } from '../components/ui/button';
import { useCart } from '../stores/cartStore';
import { useWishlist } from '../stores/wishlistStore';
import { Skeleton } from '../components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<any>(null);
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await apiClient(`/products/${id}`);
        setProduct(data);
        if (data.variants?.length > 0) {
          setSelectedVariant(data.variants[0]);
        }
      } catch (err) {
        // ignore
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  useEffect(() => {
    if (product) {
      apiClient(`/products/${id}/view`, { method: 'POST' });
    }
  }, [product, id]);

  if (loading || !product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/2">
            <Skeleton className="h-96 w-full shimmer" />
          </div>
          <div className="md:w-1/2 space-y-4">
            <Skeleton className="h-8 w-3/4 shimmer" />
            <Skeleton className="h-6 w-1/2 shimmer" />
            <Skeleton className="h-20 w-full shimmer" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/2">
          <ImageGallery images={product.images} />
        </div>
        <div className="md:w-1/2">
          <h1 className="text-3xl font-bold mb-4">{product.title}</h1>
          <p className="text-text-dim mb-4">{product.brand}</p>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl font-bold text-primary">${product.price}</span>
            {product.original_price > product.price && (
              <span className="text-text-dim line-through">${product.original_price}</span>
            )}
            {product.discount_percent > 0 && (
              <span className="text-success font-medium">-{product.discount_percent}%</span>
            )}
          </div>
          <p className="mb-6">{product.description}</p>

          {/* Variants */}
          {product.variants?.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold mb-2">Select Variant</h3>
              <div className="flex gap-2 flex-wrap">
                {product.variants.map((v: any) => (
                  <Button
                    key={v.sku}
                    variant={selectedVariant?.sku === v.sku ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedVariant(v)}
                  >
                    {v.color} / {v.size}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="flex items-center gap-4 mb-6">
            <label className="font-medium">Quantity:</label>
            <input
              type="number"
              min="1"
              max={selectedVariant?.stock || 99}
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value))}
              className="w-20 px-3 py-1 border border-border rounded bg-surface text-text"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-4 mb-6">
            <Button
              className="flex-1"
              onClick={() => selectedVariant && addItem(product._id, selectedVariant.sku, quantity)}
            >
              Add to Cart
            </Button>
            <Button variant="secondary" size="icon" onClick={() => toggleWishlist(product._id)}>
              {isInWishlist(product._id) ? '❤️' : '♡'}
            </Button>
          </div>

          {/* Stock */}
          <div className="mb-6">
            <span
              className={`inline-block px-3 py-1 rounded-full text-sm ${
                selectedVariant?.stock > 10 ? 'bg-success/20 text-success' : 'bg-warning/20 text-warning'
              }`}
            >
              {selectedVariant?.stock > 10 ? 'In Stock' : selectedVariant?.stock > 0 ? 'Low Stock' : 'Out of Stock'}
            </span>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
              <TabsTrigger value="qa">Q&A</TabsTrigger>
            </TabsList>
            <TabsContent value="description">
              <p className="mt-4">{product.description}</p>
            </TabsContent>
            <TabsContent value="reviews">Reviews Section</TabsContent>
            <TabsContent value="qa">Q&A Section</TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;