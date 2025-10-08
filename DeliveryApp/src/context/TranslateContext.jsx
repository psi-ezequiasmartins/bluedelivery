/**
 * src/context/TranslateContext.jsx
 * Contexto para gerenciar estado global do idioma selecionado
 */

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

const TranslateContext = createContext();

export const useTranslateContext = () => {
  const context = useContext(TranslateContext);
  if (!context) {
    throw new Error('useTranslateContext must be used within a TranslateProvider');
  }
  return context;
};

export const TranslateProvider = ({ children }) => {
  const { i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language);

  // Sincronizar com mudanças do i18n
  useEffect(() => {
    const handleLanguageChanged = (lng) => {
      setCurrentLanguage(lng);
      // Garantir que o localStorage seja atualizado com a chave correta
      localStorage.setItem('bluedelivery-language', lng);
    };

    i18n.on('languageChanged', handleLanguageChanged);

    return () => {
      i18n.off('languageChanged', handleLanguageChanged);
    };
  }, [i18n]);

  // Função para trocar idioma
  const changeLanguage = async (language) => {
    try {
      await i18n.changeLanguage(language);
      setCurrentLanguage(language);
      localStorage.setItem('bluedelivery-language', language);
    } catch (error) {
      console.error('Erro ao trocar idioma:', error);
    }
  };

  // Função para obter informações do idioma atual
  const getLanguageInfo = () => {
    const languages = {
      'pt-BR': { name: 'Português', flag: '🇧🇷', code: 'br' },
      'en-US': { name: 'English', flag: '🇺🇸', code: 'us' },
      'es-LA': { name: 'Español', flag: '🇪🇸', code: 'es' }
    };
    return languages[currentLanguage] || languages['pt-BR'];
  };

  const value = {
    currentLanguage,
    changeLanguage,
    getLanguageInfo,
    isPortuguese: currentLanguage === 'pt-BR',
    isEnglish: currentLanguage === 'en-US',
    isSpanish: currentLanguage === 'es-LA'
  };

  return (
    <TranslateContext.Provider value={value}>
      {children}
    </TranslateContext.Provider>
  );
};

export default TranslateContext;