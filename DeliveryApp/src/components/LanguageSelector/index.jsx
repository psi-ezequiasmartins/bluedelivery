/**
 * src/components/LanguageSelector/index.jsx
 */

import React from 'react';
import { useTranslateContext } from '../../context/TranslateContext';
import 'flag-icons/css/flag-icons.min.css';
import './index.css';

const LanguageSelector = ({ isMobile = false }) => {
  const { currentLanguage, changeLanguage } = useTranslateContext();

  const languages = [
    { code: 'pt-BR', flagCode: 'br', name: 'Português' },
    { code: 'en-US', flagCode: 'us', name: 'English' },
    { code: 'es-LA', flagCode: 've', name: 'Español' }
  ];

  const handleLanguageChange = (languageCode) => {
    changeLanguage(languageCode);
  };

  return (
    <div className={`language-selector ${isMobile ? 'mobile' : 'desktop'}`}>
      {isMobile ? (
        // Versão mobile - dropdown compacto com Bootstrap
        <div className="dropdown">
          <button
            className="btn btn-outline-light btn-sm dropdown-toggle d-flex align-items-center justify-content-center w-100"
            type="button"
            id="languageDropdownMobile"
            data-bs-toggle="dropdown"
            aria-expanded="false"
            style={{
              border: '1px solid rgba(255,255,255,0.3)',
              borderRadius: '4px',
              padding: '6px 12px',
              fontSize: '12px',
              backgroundColor: 'rgba(255,255,255,0.1)'
            }}
          >
            <span
              className={`fi fi-${languages.find(lang => lang.code === currentLanguage)?.flagCode || 'br'} me-1`}
              style={{ fontSize: '14px' }}
            ></span>
            <span>{languages.find(lang => lang.code === currentLanguage)?.name || 'Português'}</span>
          </button>

          <ul className="dropdown-menu dropdown-menu-dark" aria-labelledby="languageDropdownMobile">
            {languages.map((lang) => (
              <li key={lang.code}>
                <button
                  className={`dropdown-item d-flex align-items-center ${currentLanguage === lang.code ? 'active' : ''}`}
                  onClick={() => handleLanguageChange(lang.code)}
                  style={{ fontSize: '12px' }}
                >
                  <span
                    className={`fi fi-${lang.flagCode} me-2`}
                    style={{ fontSize: '14px' }}
                  ></span>
                  <span>{lang.name}</span>
                  {currentLanguage === lang.code && (
                    <i className="bi bi-check-circle-fill ms-auto text-success"></i>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        // Versão desktop - botões com bandeiras
        <div className="language-buttons">
          {languages.map(lang => (
            <button
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className={`language-btn ${currentLanguage === lang.code ? 'active' : ''}`}
              title={lang.name}
            >
              <span
                className={`fi fi-${lang.flagCode}`}
                style={{ fontSize: '14px' }}
              ></span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;