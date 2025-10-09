/**
 * src/contexts/TranslateContext.js
 * Contexto para gerenciar estado global do idioma selecionado no React Native
 * Implementação similar ao DeliveryApp com detecção de localização e persistência
 */

import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
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

  // Usar idioma padrão (português) ou idioma salvo
  const [currentLanguage, setCurrentLanguage] = useState('pt-BR');

  const [isLoading, setIsLoading] = useState(true);

  // Efeito para carregar idioma salvo ou aplicar idioma detectado - executa apenas uma vez
  useEffect(() => {
    const initializeLanguage = async () => {
      try {
        const savedLanguage = await AsyncStorage.getItem('bluedelivery-language');
        const supportedLanguages = ['pt-BR', 'en-US', 'es-LA'];

        if (savedLanguage && supportedLanguages.includes(savedLanguage)) {
          // Se há idioma salvo, usar ele
          console.log('🔄 Aplicando idioma salvo:', savedLanguage);
          if (savedLanguage !== i18n.language) {
            await i18n.changeLanguage(savedLanguage);
          }
          setCurrentLanguage(savedLanguage);
        } else {
          // Se não há idioma salvo, usar o detectado do dispositivo
          console.log('🌐 Aplicando idioma detectado:', currentLanguage);
          await i18n.changeLanguage(currentLanguage);
          await AsyncStorage.setItem('bluedelivery-language', currentLanguage);
        }
      } catch (error) {
        console.error('❌ Erro ao inicializar idioma:', error);
        // Fallback para português
        await i18n.changeLanguage('pt-BR');
        setCurrentLanguage('pt-BR');
        await AsyncStorage.setItem('bluedelivery-language', 'pt-BR');
      } finally {
        setIsLoading(false);
      }
    };

    initializeLanguage();
  }, []); // Executar apenas uma vez na inicialização  // Sincronizar com mudanças do i18n - igual ao DeliveryApp
  useEffect(() => {
    const handleLanguageChanged = async (lng) => {
      console.log('🌐 Idioma alterado para:', lng);
      setCurrentLanguage(lng);
      try {
        // Garantir que o AsyncStorage seja atualizado com a chave correta
        await AsyncStorage.setItem('bluedelivery-language', lng);
        console.log('✅ Idioma salvo no AsyncStorage');
      } catch (error) {
        console.error('❌ Erro ao salvar idioma:', error);
      }
    };

    i18n.on('languageChanged', handleLanguageChanged);

    return () => {
      i18n.off('languageChanged', handleLanguageChanged);
    };
  }, [i18n]);

  // Função para trocar idioma - igual ao DeliveryApp
  const changeLanguage = async (language) => {
    try {
      console.log('🎯 TranslateContext mudando idioma para:', language);
      await i18n.changeLanguage(language);
      setCurrentLanguage(language);
      await AsyncStorage.setItem('bluedelivery-language', language);
      console.log('✅ Idioma alterado e salvo no AsyncStorage');
    } catch (error) {
      console.error('❌ Erro ao trocar idioma:', error);
    }
  };

  // Função para obter informações do idioma atual (com bandeira UK para inglês)
  const getLanguageInfo = () => {
    const languages = {
      'es-LA': { name: 'Español', flag: '🇻🇪', code: 've' },
      'pt-BR': { name: 'Português', flag: '🇧🇷', code: 'br' },
      'en-US': { name: 'English', flag: '🇬🇧', code: 'gb' }, // Bandeira UK em vez de US
    };
    return languages[currentLanguage] || languages['pt-BR'];
  };

  // Função para obter todas as opções de idiomas na ordem correta
  const getLanguageOptions = () => {
    return [
      { code: 'es-LA', flagCode: 've', name: 'Español', flag: '🇻🇪' },
      { code: 'pt-BR', flagCode: 'br', name: 'Português', flag: '🇧🇷' },
      { code: 'en-US', flagCode: 'gb', name: 'English', flag: '🇬🇧' },
    ];
  };

  const value = {
    currentLanguage,
    changeLanguage,
    getLanguageInfo,
    getLanguageOptions,
    isLoading,
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