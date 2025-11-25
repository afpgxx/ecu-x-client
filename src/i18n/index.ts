import zhCN from './locales/zh-CN';
import zhTW from './locales/zh-TW';
import en from './locales/en';
import ja from './locales/ja';
import th from './locales/th';
import ko from './locales/ko';
import ru from './locales/ru';
import de from './locales/de';
import fr from './locales/fr';

export type Language = 'zh-CN' | 'zh-TW' | 'en' | 'ja' | 'th' | 'ko' | 'ru' | 'de' | 'fr';

export const translations = {
  'zh-CN': zhCN,
  'zh-TW': zhTW,
  'en': en,
  'ja': ja,
  'th': th,
  'ko': ko,
  'ru': ru,
  'de': de,
  'fr': fr,
};

export type TranslationKeys = typeof zhCN;
