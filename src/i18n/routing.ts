import { LANGS } from '@/lib/utils';
import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: LANGS,
  defaultLocale: 'en'
});