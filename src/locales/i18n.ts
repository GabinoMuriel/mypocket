import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// 1. Import the JSON files directly
import es from '../locales/es.json';
import en from '../locales/en.json';
import zh from '../locales/zh-CN.json';

// 2. Map them to the resources object
const resources = {
    es: { translation: es },
    en: { translation: en },
    'zh-CN': { translation: zh }
};

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources,
        fallbackLng: "es",
        supportedLngs: ['es', 'en', 'zh-CN'],
        interpolation: {
            escapeValue: false
        }
    });

export default i18n;