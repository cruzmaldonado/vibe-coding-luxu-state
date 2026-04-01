/**
 * i18n barrel file.
 *
 * HOW TO ADD A NEW LANGUAGE:
 * 1. Add the locale code to `Locale` in ./types.ts
 * 2. Add it to `SUPPORTED_LOCALES` and `LOCALE_LABELS` in ./types.ts
 * 3. Create ./locales/<code>.ts implementing the full `Translations` interface
 * 4. Import and add it to the `locales` map below
 */
import en from './locales/en';
import es from './locales/es';
import fr from './locales/fr';

export type { Translations, Locale } from './types';
export { SUPPORTED_LOCALES, DEFAULT_LOCALE, LOCALE_COOKIE, LOCALE_LABELS } from './types';

export const locales = { en, es, fr } as const;

export function getTranslations(locale: string) {
  return locales[locale as keyof typeof locales] ?? locales.en;
}
