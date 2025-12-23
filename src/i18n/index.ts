import zhCN from './locales/zh-CN';
import zhTW from './locales/zh-TW';
import en from './locales/en';
import ja from './locales/ja';
import th from './locales/th';
import ko from './locales/ko';
import ru from './locales/ru';
import de from './locales/de';
import fr from './locales/fr';
import es from './locales/es';
import pt from './locales/pt';
import id from './locales/id';
import vi from './locales/vi';
import tr from './locales/tr';
import ar from './locales/ar';

export type Language = 'zh-CN' | 'zh-TW' | 'en' | 'ja' | 'th' | 'ko' | 'ru' | 'de' | 'fr' | 'es' | 'pt' | 'id' | 'vi' | 'tr' | 'ar';

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
  'es': es,
  'pt': pt,
  'id': id,
  'vi': vi,
  'tr': tr,
  'ar': ar,
};

export type TranslationKeys = typeof zhCN;
