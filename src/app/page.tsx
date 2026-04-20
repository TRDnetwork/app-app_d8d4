import { ProductCard } from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { SearchBar } from '@/components/SearchBar';
import { Carousel } from '@/components/Carousel';
import { useTranslations } from 'next-intl';

export default function HomePage() {
  const t = useTranslations();
  
  const featuredProducts = [
    {
      id: '1',
      name: 'Wireless Noise-Cancelling Headphones',
      price: 299.99,
      originalPrice: 399.99,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop',
      rating: 4.5,
      reviews: 1248,
    },
    {
      id: '2',
      name: 'Smart Fitness Watch',
      price: 199.99,
      originalPrice: 249.99,
      image: 'https://images.unsplash.com/photo-1523275335682-5f40b6cb2e4f?w=300&h=300&fit=crop',
      rating: 4.7,
      reviews: 892,
    },
    {
      id: '3',
      name: 'Premium Leather Backpack',
      price: 149.99,
      originalPrice: 179.99,
      image: 'https://images.unsplash.com/photo-1491637639811-60e2756cc1c7?w=300&h=300&fit=crop',
      rating: 4.8,
      reviews: 634,
    },
  ];

  const deals = [
    {
      id: '4',
      name: '4K Ultra HD Smart TV',
      price: 599.99,
      originalPrice: 899.99,
      image: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?w=300&h=300&fit=crop',
      discount: 33,
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Banner */}
      <section className="bg-accent text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            {t('hero.title')}
          </h1>
          <p className="text-xl mb-8 opacity-90">
            {t('hero.subtitle')}
          </p>
          <SearchBar />
        </div>
      </section>

      {/* Deals of the Day */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">{t('nav.deals')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {deals.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-12 bg-surface">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">{t('nav.categories')}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {['Electronics', 'Fashion', 'Home & Kitchen', 'Beauty', 'Sports', 'Books'].map((category) => (
              <div key={category} className="text-center p-6 bg-white rounded-lg shadow">
                <div className="w-16 h-16 bg-accent rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-white font-bold text-lg">?</span>
                </div>
                <h3 className="font-semibold">{category}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recommended For You */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">{t('nav.products')}</h2>
          <Carousel>
            {featuredProducts.map((product) => (
              <div key={product.id} className="px-2">
                <ProductCard product={product} />
              </div>
            ))}
          </Carousel>
        </div>
      </section>
    </div>
  );
}