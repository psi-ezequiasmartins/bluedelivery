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

  // Inicializar com idioma do localStorage ou fallback para i18n.language
  const [currentLanguage, setCurrentLanguage] = useState(() => {
    const savedLanguage = localStorage.getItem('bluedelivery-language');
    console.log('🌐 TranslateContext inicializando:', {
      savedLanguage,
      i18nLanguage: i18n.language,
      usando: savedLanguage || i18n.language
    });
    return savedLanguage || i18n.language;
  });

  // Efeito para sincronizar o idioma inicial com i18n - apenas se necessário
  useEffect(() => {
    const savedLanguage = localStorage.getItem('bluedelivery-language');
    const supportedLanguages = ['pt-BR', 'en-US', 'es-LA'];

    if (savedLanguage &&
      savedLanguage !== i18n.language &&
      supportedLanguages.includes(savedLanguage)) {
      console.log('🔄 TranslateContext aplicando idioma salvo:', savedLanguage);
      i18n.changeLanguage(savedLanguage);
    }
  }, []); // Executar apenas uma vez

  // Sincronizar com mudanças do i18n
  useEffect(() => {
    const handleLanguageChanged = (lng) => {
      console.log('🌐 Idioma alterado para:', lng);
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
      console.log('🎯 TranslateContext mudando idioma para:', language);
      await i18n.changeLanguage(language);
      setCurrentLanguage(language);
      localStorage.setItem('bluedelivery-language', language);
      console.log('✅ Idioma alterado e salvo no localStorage');
    } catch (error) {
      console.error('❌ Erro ao trocar idioma:', error);
    }
  };

  // Função para obter informações do idioma atual (com bandeira UK)
  const getLanguageInfo = () => {
    const languages = {
      'es-LA': { name: 'Español', flag: '��', code: 've' },
      'pt-BR': { name: 'Português', flag: '��', code: 'br' },
      'en-US': { name: 'English', flag: '��', code: 'gb' }, // Bandeira UK em vez de US
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