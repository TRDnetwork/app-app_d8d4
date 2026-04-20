'use client';

import { useEffect } from 'react';
import { useAppDispatch } from '@/store';
import { loadCart } from '@/store/cartSlice';
import { loadWishlist } from '@/store/wishlistSlice';
import { checkAuth } from '@/store/authSlice';
import Hero from '@/components/Hero';
import DealsSection from '@/components/DealsSection';
import CategoryGrid from '@/components/CategoryGrid';
import SponsoredProducts from '@/components/SponsoredProducts';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function Home() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(checkAuth());
    dispatch(loadCart());
    dispatch(loadWishlist());
  }, [dispatch]);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Hero />
        <DealsSection />
        <CategoryGrid />
        <SponsoredProducts />
      </main>
      <Footer />
    </div>
  );
}