import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import es from './locales/es.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      es: { translation: es }
    },
    lng: 'es', // idioma por defecto
    fallbackLng: 'en', // idioma de respaldo si falta una traducción
    interpolation: {
      escapeValue: false // react ya nos protege de XSS
    }
  });

export default i18n;
