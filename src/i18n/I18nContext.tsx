import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Language, translations, TranslationKeys } from './index';

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: TranslationKeys;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export const I18nProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('ecu-language');
    // 验证保存的语言是否有效
    const validLanguages: Language[] = ['zh-CN', 'zh-TW', 'en', 'ja', 'th', 'ko', 'ru', 'de', 'fr', 'es', 'pt', 'id', 'vi', 'tr', 'ar'];
    if (saved && validLanguages.includes(saved as Language)) {
      return saved as Language;
    }
    return 'zh-CN';
  });

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('ecu-language', lang);
  };

  const value: I18nContextType = {
    language,
    setLanguage: handleSetLanguage,
    t: translations[language] || translations['zh-CN'], // 添加默认值
  };

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};

export const useI18n = (): I18nContextType => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within I18nProvider');
  }
  return context;
};
