import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import english from 'src/utils/languages/en.json';
import chinese from 'src/utils/languages/ch.json';
import vietnam from 'src/utils/languages/vi.json';

const resources = {
  en: {
    translation: english,
  },
  vi: {
    translation: vietnam,
  },
  ch: {
    translation: chinese,
  },
};

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: 'en',
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;
