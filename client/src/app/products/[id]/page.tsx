import { notFound } from 'next/navigation';
import { getProduct } from '@/lib/api';

export default async function ProductDetailPage({ params }: { params: { id: string } }) {
  const product = await getProduct(params.id);

  if (!product) return notFound();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Image Gallery */}
        <div>
          <div className="relative aspect-square overflow-hidden rounded-lg bg-surface">
            <img
              src={product.images[0]}
              alt={product.title}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="mt-4 grid grid-cols-4 gap-2">
            {product.images.slice(0, 4).map((img, i) => (
              <img
                key={i}
                src={img}
                alt={`${product.title} ${i + 1}`}
                className="aspect-square cursor-pointer rounded border hover:border-accent"
              />
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div>
          <h1 className="mb-2 text-2xl font-bold">{product.title}</h1>
          <p className="mb-4 text-text_dim">{product.brand}</p>

          <div className="mb-4 flex items-center gap-2">
            <span className="text-2xl font-bold text-accent">${product.price}</span>
            {product.discount_percent > 0 && (
              <>
                <span className="text-lg text-text_dim line-through">
                  ${((product.price * 100) / (100 - product.discount_percent)).toFixed(2)}
                </span>
                <span className="rounded bg-accent px-2 py-1 text-sm text-white">
                  {product.discount_percent}% off
                </span>
              </>
            )}
          </div>

          <p className="mb-4 text-text_dim">{product.description}</p>

          {/* Variants */}
          <div className="mb-4">
            <h3 className="mb-2 font-medium">Color</h3>
            <div className="flex gap-2">
              {['Red', 'Blue', 'Black'].map((color) => (
                <button
                  key={color}
                  className="h-8 w-8 rounded-full border-2 border-border bg-red-500 hover:border-accent"
                ></button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <h3 className="mb-2 font-medium">Size</h3>
            <div className="flex gap-2">
              {['S', 'M', 'L', 'XL'].map((size) => (
                <button
                  key={size}
                  className="flex h-10 min-w-10 items-center justify-center rounded border border-border hover:border-accent hover:bg-accent hover:text-white"
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6 flex items-center gap-4">
            <div className="flex items-center gap-2">
              <button className="rounded-l border p-2 hover:bg-gray-100">-</button>
              <span className="w-12 text-center">1</span>
              <button className="rounded-r border p-2 hover:bg-gray-100">+</button>
            </div>
            <button className="flex-1 rounded bg-accent px-6 py-3 text-white hover:bg-orange-600">
              Add to Cart
            </button>
          </div>

          <div className="rounded border p-4">
            <h3 className="mb-2 font-medium">Delivery & Returns</h3>
            <p className="text-sm text-text_dim">Free delivery on orders over $50</p>
            <p className="text-sm text-text_dim">30-day return policy</p>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <section className="mt-12">
        <h2 className="mb-6 text-xl font-semibold">Customer Reviews</h2>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded border p-4">
              <div className="mb-2 flex items-center gap-2">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      className="h-4 w-4 text-yellow-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-sm text-text_dim">5 stars</span>
              </div>
              <p className="text-text">Great product! Highly recommend.</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}