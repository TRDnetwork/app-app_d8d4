'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

export default function ProductCard({ product }) {
  const t = useTranslations('product');

  return (
    <div className="group rounded-lg border transition-colors hover:shadow-md">
      <div className="relative">
        <Link href={`/products/${product._id}`}>
          <img
            src={product.images[0]}
            alt={product.title}
            className="aspect-square w-full object-cover"
            loading="lazy"
          />
        </Link>
        {product.discount_percent > 0 && (
          <div className="absolute left-2 top-2 rounded bg-warning px-2 py-1 text-xs font-bold text-white">
            {t('discount', { percent: product.discount_percent })}
          </div>
        )}
        <div className="absolute right-2 top-2">
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </Button>
        </div>
      </div>
      <div className="p-4">
        <Link href={`/products/${product._id}`}>
          <h3 className="line-clamp-2 text-sm font-medium">{product.title}</h3>
        </Link>
        <div className="mt-2 flex items-center gap-2">
          <span className="text-lg font-bold">${product.price}</span>
          {product.originalPrice && (
            <span className="text-sm text-text_dim line-through">${product.originalPrice}</span>
          )}
        </div>
        <div className="mt-2 flex items-center gap-1">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className={`h-4 w-4 ${i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-text_dim'}`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <span className="text-sm text-text_dim">({product.reviewCount})</span>
        </div>
        <Button className="mt-4 w-full" size="sm">
          {t('addToCart')}
        </Button>
      </div>
    </div>
  );
}