'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTranslations } from 'next-intl';

export default function Footer() {
  const t = useTranslations('footer');

  return (
    <footer className="border-t bg-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div>
            <h3 className="text-lg font-bold text-accent">{t('company')}</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <a href="#" className="text-text_dim hover:text-text">
                  {t('about')}
                </a>
              </li>
              <li>
                <a href="#" className="text-text_dim hover:text-text">
                  {t('careers')}
                </a>
              </li>
              <li>
                <a href="#" className="text-text_dim hover:text-text">
                  {t('press')}
                </a>
              </li>
              <li>
                <a href="#" className="text-text_dim hover:text-text">
                  {t('blog')}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold text-accent">{t('support')}</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <a href="#" className="text-text_dim hover:text-text">
                  {t('helpCenter')}
                </a>
              </li>
              <li>
                <a href="#" className="text-text_dim hover:text-text">
                  {t('contactUs')}
                </a>
              </li>
              <li>
                <a href="#" className="text-text_dim hover:text-text">
                  {t('shipping')}
                </a>
              </li>
              <li>
                <a href="#" className="text-text_dim hover:text-text">
                  {t('returns')}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold text-accent">{t('legal')}</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <a href="#" className="text-text_dim hover:text-text">
                  {t('privacy')}
                </a>
              </li>
              <li>
                <a href="#" className="text-text_dim hover:text-text">
                  {t('terms')}
                </a>
              </li>
              <li>
                <a href="#" className="text-text_dim hover:text-text">
                  {t('security')}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold text-accent">{t('newsletter')}</h3>
            <p className="mt-4 text-text_dim">{t('subscribe')}</p>
            <form className="mt-4 flex">
              <div className="flex-1">
                <Label htmlFor="email" className="sr-only">
                  {t('email')}
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder={t('emailPlaceholder')}
                  className="rounded-r-none"
                />
              </div>
              <Button type="submit" className="rounded-l-none">
                {t('subscribeButton')}
              </Button>
            </form>
          </div>
        </div>

        <div className="mt-12 border-t pt-8 text-center">
          <p className="text-text_dim">
            © {new Date().getFullYear()} ShopSphere. {t('allRights')}
          </p>
        </div>
      </div>
    </footer>
  );
}