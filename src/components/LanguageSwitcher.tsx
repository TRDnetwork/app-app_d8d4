'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';

export function LanguageSwitcher() {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const languages = [
    { code: 'en', label: 'EN', name: 'English' },
    { code: 'es', label: 'ES', name: 'Español' },
    { code: 'fr', label: 'FR', name: 'Français' },
    { code: 'de', label: 'DE', name: 'Deutsch' },
    { code: 'ja', label: 'JA', name: '日本語' }
  ];

  const switchLanguage = (newLocale: string) => {
    // Extract the current path without locale prefix
    const pathWithoutLocale = pathname.replace(/^\/[a-z]{2}/, '');
    // Construct new path with new locale
    const newPath = `/${newLocale}${pathWithoutLocale}`;
    router.push(newPath);
  };

  return (
    <div className="flex items-center space-x-2">
      {languages.map((lang) => (
        <Button
          key={lang.code}
          variant="ghost"
          size="sm"
          onClick={() => switchLanguage(lang.code)}
          className={`px-2 py-1 text-xs font-medium transition-colors ${
            locale === lang.code 
              ? 'bg-accent text-accent-foreground' 
              : 'text-text_dim hover:text-text'
          }`}
          aria-label={lang.name}
        >
          {lang.label}
        </Button>
      ))}
    </div>
  );
}