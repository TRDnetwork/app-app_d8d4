// Steering interpretation: Using next-intl for Next.js 14 App Router as specified in ARCHITECT_PLAN.md
import { notFound } from 'next/navigation';
import { createInternationalization } from 'next-intl';

export const locales = ['en', 'es', 'fr', 'de', 'ja'] as const;
export type Locale = typeof locales[number];

export const i18n = createInternationalization({
  defaultLocale: 'en',
  localePrefix: 'as-needed',
  locales,
  getMessageFallback({ key, namespace, error }) {
    return key;
  },
  async getMessages(locale) {
    try {
      return (await import(`../locales/${locale}.json`)).default;
    } catch (error) {
      notFound();
    }
  }
});