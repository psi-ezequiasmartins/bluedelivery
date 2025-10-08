/**
 * src/components/LanguageSelector/index.jsx
 */

import React from 'react';
import { useTranslation } from 'react-i18next';
import './index.css';

const LanguageSelector = ({ isMobile = false }) => {
  const { i18n } = useTranslation();

  const languages = [
    { code: 'pt-BR', name: 'Português', flag: '🇧🇷' },
    { code: 'en-US', name: 'English', flag: '🇺🇸' },
    { code: 'es-LA', name: 'Español', flag: '🇪🇸' }
  ];

  const handleLanguageChange = (languageCode) => {
    // Trocar idioma e persistir no localStorage
    i18n.changeLanguage(languageCode);
    localStorage.setItem('bluedelivery-language', languageCode);
  };

  return (
    <div className={`language-selector ${isMobile ? 'mobile' : 'desktop'}`}>
      {isMobile ? (
        // Versão mobile - dropdown compacto
        <select
          value={i18n.language}
          onChange={(e) => handleLanguageChange(e.target.value)}
          className="language-select-mobile"
        >
          {languages.map(lang => (
            <option key={lang.code} value={lang.code}>
              {lang.flag} {lang.name}
            </option>
          ))}
        </select>
      ) : (
        // Versão desktop - botões com bandeiras
        <div className="language-buttons">
          {languages.map(lang => (
            <button
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className={`language-btn ${i18n.language === lang.code ? 'active' : ''}`}
              title={lang.name}
            >
              <span className="flag">{lang.flag}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;