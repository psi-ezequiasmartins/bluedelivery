import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Importar as traduções
import ptBR from './locales/pt-BR.json';
import enUS from './locales/en-US.json';
import esLA from './locales/es-LA.json';

const resources = {
  'pt-BR': {
    translation: ptBR
  },
  'en-US': {
    translation: enUS
  },
  'es-LA': {
    translation: esLA
  }
};

i18n
  // Detector de idioma do navegador
  .use(LanguageDetector)
  // Integração com React
  .use(initReactI18next)
  // Configuração
  .init({
    resources,

    // Idioma padrão se não detectar
    fallbackLng: 'pt-BR',

    // Idiomas suportados
    supportedLngs: ['pt-BR', 'en-US', 'es-LA'],

    // Configuração de detecção
    detection: {
      // Ordem de verificação: localStorage -> navegador -> padrão
      order: ['localStorage', 'navigator', 'htmlTag'],

      // Chave no localStorage
      lookupLocalStorage: 'bluedelivery-language',

      // Mapear idiomas do navegador para nossos códigos
      convertDetectedLanguage: (lng) => {
        // Mapear códigos comuns para nossos idiomas
        const languageMap = {
          'pt': 'pt-BR',
          'pt-BR': 'pt-BR',
          'en': 'en-US',
          'en-US': 'en-US',
          'es': 'es-LA',
          'es-ES': 'es-LA',
          'es-AR': 'es-LA',
          'es-CL': 'es-LA',
          'es-VE': 'es-LA',
          'es-UY': 'es-LA',
          'es-PY': 'es-LA'
        };

        return languageMap[lng] || 'pt-BR';
      }
    },

    interpolation: {
      // React já escapa por padrão
      escapeValue: false
    },

    // Debug apenas em desenvolvimento
    debug: process.env.NODE_ENV === 'development'
  });

export default i18n;