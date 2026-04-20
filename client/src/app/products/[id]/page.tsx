'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Image from 'next/image';
import { useToast } from '@/components/ui/use-toast';
import { StarIcon } from 'lucide-react';

export default function ProductDetail({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState<any>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${params.id}`);
        const data = await res.json();
        if (data.success) {
          setProduct(data.product);
        } else {
          throw new Error(data.message);
        }
      } catch (error: any) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: error.message || 'Failed to load product',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [params.id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="w-full h-96 bg-gray-200 rounded-lg"></div>
              <div className="grid grid-cols-4 gap-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-20 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-10 bg-gray-200 rounded w-1/3"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-bold">Product not found</h2>
      </div>
    );
  }

  const discountedPrice = product.price * (1 - product.discount_percent / 100);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <div className="relative w-full h-96 mb-4">
            <Image
              src={product.images[selectedImage]}
              alt={product.title}
              fill
              className="object-cover rounded-lg"
            />
          </div>
          <div className="grid grid-cols-4 gap-2">
            {product.images.map((img: string, idx: number) => (
              <div
                key={idx}
                className={`relative w-full h-20 rounded cursor-pointer ${
                  selectedImage === idx ? 'ring-2 ring-orange-500' : ''
                }`}
                onClick={() => setSelectedImage(idx)}
              >
                <Image src={img} alt={`Thumbnail ${idx}`} fill className="object-cover rounded" />
              </div>
            ))}
          </div>
        </div>

        <div>
          <h1 className="text-3xl font-bold mb-2">{product.title}</h1>
          <p className="text-gray-600 mb-4">{product.brand}</p>

          <div className="flex items-center mb-4">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <StarIcon
                  key={i}
                  className={`w-5 h-5 ${i < Math.round(product.average_rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                  fill="currentColor"
                />
              ))}
            </div>
            <span className="ml-2 text-sm text-gray-600">({product.review_count} reviews)</span>
          </div>

          <div className="mb-4">
            <div className="text-3xl font-bold text-orange-600">${discountedPrice.toFixed(2)}</div>
            <div className="flex items-center">
              <span className="text-lg text-gray-500 line-through">${product.price.toFixed(2)}</span>
              <span className="ml-2 text-sm font-medium text-green-600">{product.discount_percent}% off</span>
            </div>
          </div>

          <div className="mb-4">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              product.stock > 10 ? 'bg-green-100 text-green-800' : product.stock > 0 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
            }`}>
              {product.stock > 10 ? 'In Stock' : product.stock > 0 ? 'Low Stock' : 'Out of Stock'}
            </span>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Quantity</label>
            <div className="flex items-center border rounded">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="h-10 w-10"
              >
                -
              </Button>
              <Input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="h-10 w-16 text-center border-0"
                min="1"
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setQuantity(quantity + 1)}
                className="h-10 w-10"
              >
                +
              </Button>
            </div>
          </div>

          <div className="space-y-3 mb-6">
            <Button className="w-full h-12 text-lg bg-orange-600 hover:bg-orange-700">
              Add to Cart
            </Button>
            <Button variant="outline" className="w-full h-12 text-lg">
              Buy Now
            </Button>
          </div>

          <div className="text-sm text-gray-600">
            <p>Free delivery: Estimated between {new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString()} - {new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}</p>
            <p className="mt-1">EMI options available</p>
          </div>
        </div>
      </div>

      <Tabs defaultValue="description" className="mt-12">
        <TabsList>
          <TabsTrigger value="description">Description</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
          <TabsTrigger value="qa">Q&A</TabsTrigger>
          <TabsTrigger value="frequently-bought">Frequently Bought Together</TabsTrigger>
        </TabsList>
        <TabsContent value="description" className="mt-6">
          <p className="text-gray-700 leading-relaxed">{product.description}</p>
        </TabsContent>
        <TabsContent value="reviews" className="mt-6">
          <div className="space-y-4">
            {product.reviews?.slice(0, 3).map((review: any) => (
              <div key={review._id} className="border-b pb-4">
                <div className="flex items-center mb-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon
                        key={i}
                        className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                        fill="currentColor"
                      />
                    ))}
                  </div>
                  <span className="ml-2 font-medium">{review.user_name}</span>
                </div>
                <h4 className="font-medium">{review.title}</h4>
                <p className="text-gray-700 mt-1">{review.comment}</p>
                {review.images?.length > 0 && (
                  <div className="flex gap-2 mt-2">
                    {review.images.slice(0, 3).map((img: string, idx: number) => (
                      <div key={idx} className="relative w-20 h-20">
                        <Image src={img} alt="Review" fill className="object-cover rounded" />
                      </div>
                    ))}
                  </div>
                )}
                <div className="flex items-center mt-2 text-sm text-gray-500">
                  <button className="hover:text-gray-700">Helpful</button>
                  <span className="mx-2">•</span>
                  <span>{review.helpful_votes?.length || 0} found this helpful</span>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="qa" className="mt-6">
          <div className="space-y-4">
            {product.questions?.map((q: any) => (
              <div key={q._id} className="border-b pb-4">
                <p className="font-medium">Q: {q.question}</p>
                {q.answer ? (
                  <p className="text-gray-700 mt-2">A: {q.answer}</p>
                ) : (
                  <p className="text-gray-500 text-sm mt-2">No answer yet</p>
                )}
              </div>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="frequently-bought" className="mt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {product.frequently_bought_together?.map((item: any) => (
              <ProductCard key={item._id} product={item} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}