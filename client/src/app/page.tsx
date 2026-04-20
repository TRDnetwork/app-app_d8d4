import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/ProductCard';
import { getProducts } from '@/lib/api';

export default async function HomePage() {
  const products = await getProducts({ limit: 8 });

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Banner */}
      <div className="mb-12 rounded-lg bg-gradient-to-r from-accent to-accent_alt p-12 text-white">
        <h1 className="mb-4 text-4xl font-bold">Welcome to ShopSphere</h1>
        <p className="mb-6 text-xl opacity-90">Discover premium products with lightning-fast delivery</p>
        <Button asChild size="lg" className="bg-white text-accent hover:bg-gray-100">
          <Link href="/products">Shop Now</Link>
        </Button>
      </div>

      {/* Deals of the Day */}
      <section className="mb-12">
        <h2 className="mb-6 text-2xl font-semibold">Deals of the Day</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </section>

      {/* Featured Categories */}
      <section>
        <h2 className="mb-6 text-2xl font-semibold">Shop by Category</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6">
          {['Electronics', 'Fashion', 'Home', 'Beauty', 'Sports', 'Books'].map((category) => (
            <Link
              key={category}
              href={`/products?category=${category.toLowerCase()}`}
              className="flex aspect-square flex-col items-center justify-center rounded-lg border bg-surface p-4 text-center hover:bg-gray-50"
            >
              <span className="font-medium text-text">{category}</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}