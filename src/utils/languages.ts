export const SUPPORTED_LANGUAGES = [
  { code: 'en-US', name: 'English (US)', translateCode: 'en' },
  { code: 'es-ES', name: 'Spanish', translateCode: 'es' },
  { code: 'fr-FR', name: 'French', translateCode: 'fr' },
  { code: 'de-DE', name: 'German', translateCode: 'de' },
  { code: 'it-IT', name: 'Italian', translateCode: 'it' },
  { code: 'pt-PT', name: 'Portuguese', translateCode: 'pt' },
  { code: 'nl-NL', name: 'Dutch', translateCode: 'nl' },
  { code: 'pl-PL', name: 'Polish', translateCode: 'pl' },
  { code: 'ru-RU', name: 'Russian', translateCode: 'ru' },
  { code: 'ja-JP', name: 'Japanese', translateCode: 'ja' },
  { code: 'ko-KR', name: 'Korean', translateCode: 'ko' },
  { code: 'zh-CN', name: 'Chinese (Simplified)', translateCode: 'zh-CN' },
  { code: 'ar-SA', name: 'Arabic', translateCode: 'ar' },
  { code: 'hi-IN', name: 'Hindi', translateCode: 'hi' },
  { code: 'ur-PK', name: 'Urdu', translateCode: 'ur' },
];

export const getTranslateCode = (languageCode: string): string => {
  const lang = SUPPORTED_LANGUAGES.find(l => l.code === languageCode);
  return lang?.translateCode || languageCode.split('-')[0];
};
