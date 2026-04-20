'use client';

import { useTranslations } from 'next-intl';

const sponsoredProducts = [
  {
    id: 1,
    name: 'Premium Wireless Headphones',
    brand: 'AudioPro',
    price: 299.99,
    originalPrice: 399.99,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e',
  },
  {
    id: 2,
    name: 'Smart Fitness Watch',
    brand: 'FitTech',
    price: 199.99,
    originalPrice: 249.99,
    image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12',
  },
  {
    id: 3,
    name: 'Ultra HD 4K TV',
    brand: 'VisionX',
    price: 899.99,
    originalPrice: 1199.99,
    image: 'https://images.unsplash.com/photo-1598971639058-fab3c29a8374',
  },
];

export default function SponsoredProducts() {
  const t = useTranslations('sponsored');

  return (
    <div className="mb-8">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold">{t('title')}</h2>
        <span className="rounded-full bg-accent px-3 py-1 text-xs font-bold text-white">
          {t('sponsored')}
        </span>
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {sponsoredProducts.map((product) => (
          <div key={product.id} className="group rounded-lg border p-4 transition-colors hover:shadow-md">
            <div className="relative">
              <img
                src={product.image}
                alt={product.name}
                className="aspect-square w-full object-cover"
              />
              <div className="absolute left-2 top-2 rounded bg-warning px-2 py-1 text-xs font-bold text-white">
                {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-sm font-medium">{product.name}</h3>
              <p className="mt-1 text-sm text-text_dim">{product.brand}</p>
              <div className="mt-2 flex items-center gap-2">
                <span className="text-lg font-bold">${product.price}</span>
                <span className="text-sm text-text_dim line-through">${product.originalPrice}</span>
              </div>
              <button className="mt-4 w-full rounded bg-accent px-4 py-2 text-white transition-colors hover:bg-orange-600">
                {t('addToCart')}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}