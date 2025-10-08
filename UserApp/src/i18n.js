/**
 * src/i18n.js
 * Configuração do i18next para React Native
 */

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Importar os recursos de tradução
import ptBR from './locales/pt-BR.json';
import esLA from './locales/es-LA.json';
import enUS from './locales/en-US.json';

// Recursos de tradução
const resources = {
  'pt-BR': {
    translation: ptBR
  },
  'es-LA': {
    translation: esLA
  },
  'en-US': {
    translation: enUS
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'pt-BR', // idioma padrão
    fallbackLng: 'pt-BR',

    // Opções para React Native
    compatibilityJSON: 'v3',

    interpolation: {
      escapeValue: false, // React já faz escape dos valores
    },

    // Configurações de debug (desabilitar em produção)
    debug: __DEV__, // só ativa debug em desenvolvimento

    // Cache e persistência serão gerenciados pelo TranslateContext
    react: {
      useSuspense: false
    }
  });

export default i18n;