'use client';

import { useTranslations } from 'next-intl';

const categories = [
  { name: 'Electronics', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e' },
  { name: 'Fashion', image: 'https://images.unsplash.com/photo-1445205170230-053b83016050' },
  { name: 'Home & Kitchen', image: 'https://images.unsplash.com/photo-1584651558730-1d41a38c0e86' },
  { name: 'Beauty', image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9' },
  { name: 'Sports', image: 'https://images.unsplash.com/photo-1519741497674-611481863552' },
  { name: 'Books', image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f' },
];

export default function CategoryGrid() {
  const t = useTranslations('category');

  return (
    <div className="mb-8">
      <h2 className="mb-4 text-xl font-bold">{t('title')}</h2>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6">
        {categories.map((category) => (
          <div key={category.name} className="group relative overflow-hidden rounded-lg">
            <img
              src={category.image}
              alt={category.name}
              className="h-32 w-full object-cover transition-transform group-hover:scale-105"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
              <span className="text-lg font-semibold text-white">{category.name}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}