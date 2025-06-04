import { translations } from './translations';

export function getCurrentLanguage(): string {
  return document.documentElement.lang || 'en';
}

export function translate(key: string): string {
  const lang = getCurrentLanguage();
  const translation = translations[key];
  
  if (!translation) {
    console.warn(`Translation missing for key: ${key}`);
    return key;
  }

  return translation[lang as 'en' | 'tr'] || translation.en;
}

export function translateMultiple(keys: string[]): { [key: string]: string } {
  return keys.reduce((acc, key) => {
    acc[key] = translate(key);
    return acc;
  }, {} as { [key: string]: string });
} 