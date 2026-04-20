import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ImageGallery } from '../components/product/ImageGallery';
import { VariantSelector } from '../components/product/VariantSelector';
import { ReviewList } from '../components/product/ReviewList';
import { QASection } from '../components/product/QASection';
import { formatCurrency } from '../lib/formatters';
import { fetchWithAuth } from '../lib/api';
import { cartStore } from '../stores/cartStore';
import { wishlistStore } from '../stores/wishlistStore';
import { Heart, ShoppingCart, Share2 } from 'lucide-react';

const ProductDetail: React.FC = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<any>(null);
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const { addItem } = cartStore();
  const { toggle, has } = wishlistStore();

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const res = await fetchWithAuth(`/api/products/${slug}`);
        setProduct(res.data);
        if (res.data.variants?.length > 0) {
          setSelectedVariant(res.data.variants[0]);
        }
      } catch (err) {
        console.error('Failed to load product:', err);
        navigate('/products');
      }
    };
    loadProduct();
  }, [slug]);

  const handleAddToCart = () => {
    if (!product) return;
    addItem({
      product_id: product._id,
      title: product.title,
      image: product.images[0],
      price: selectedVariant?.price || product.price,
      quantity,
    });
    // Show toast
  };

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="skeleton h-96 rounded-lg mb-6"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <div className="skeleton h-12 w-3/4 mb-4"></div>
            <div className="skeleton h-4 w-1/2 mb-2"></div>
            <div className="skeleton h-4 w-full mb-2"></div>
            <div className="skeleton h-4 w-5/6"></div>
          </div>
          <div>
            <div className="skeleton h-32 mb-4"></div>
            <div className="skeleton h-12 w-full"></div>
          </div>
        </div>
      </div>
    );
  }

  const finalPrice = selectedVariant?.price || product.price;
  const originalPrice = selectedVariant?.original_price || product.original_price || finalPrice;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <ImageGallery images={product.images} />

        <div>
          <h1 className="text-3xl font-bold mb-2 font-display">{product.title}</h1>
          <p className="text-text-dim mb-4">by {product.brand}</p>

          <div className="flex items-center mb-4">
            <div className="text-accent font-bold text-2xl">{formatCurrency(finalPrice)}</div>
            {originalPrice > finalPrice && (
              <div className="ml-2 text-text-dim line-through">{formatCurrency(originalPrice)}</div>
            )}
            {originalPrice > finalPrice && (
              <div className="ml-2 text-warning font-semibold">
                Save {Math.round(((originalPrice - finalPrice) / originalPrice) * 100)}%
              </div>
            )}
          </div>

          <p className="text-text-dim mb-6">{product.description}</p>

          {product.variants && product.variants.length > 0 && (
            <VariantSelector
              variants={product.variants}
              selected={selectedVariant}
              onSelect={setSelectedVariant}
            />
          )}

          <div className="flex items-center space-x-4 mb-6">
            <label className="text-text">Quantity:</label>
            <input
              type="number"
              min="1"
              max={product.stock_quantity}
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-16 px-3 py-1 border border-border rounded text-text bg-surface"
            />
            <span className="text-text-dim">In stock: {product.stock_quantity}</span>
          </div>

          <div className="flex flex-wrap gap-4 mb-6">
            <button
              onClick={handleAddToCart}
              className="btn btn-primary flex items-center space-x-2 px-8 py-3"
            >
              <ShoppingCart size={20} />
              <span>Add to Cart</span>
            </button>
            <button
              onClick={() => toggle(product._id)}
              className={`btn px-6 py-3 ${has(product._id) ? 'text-accent' : 'text-text-dim'}`}
            >
              <Heart size={20} fill={has(product._id) ? '#FF9900' : 'none'} />
            </button>
            <button className="btn px-6 py-3 text-text-dim">
              <Share2 size={20} />
            </button>
          </div>

          <div className="border-t border-border pt-6">
            <h3 className="