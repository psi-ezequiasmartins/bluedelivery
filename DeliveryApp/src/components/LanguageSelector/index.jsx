/**
 * src/components/LanguageSelector/index.jsx
 */

import React from 'react';
import { useTranslateContext } from '../../context/TranslateContext';
import 'flag-icons/css/flag-icons.min.css';
import './index.css';

const LanguageSelector = ({ isMobile = false }) => {
  const { currentLanguage, changeLanguage } = useTranslateContext();

  // Ordem solicitada: Venezuela → Brasil → Inglaterra
  const languages = [
    { code: 'es-LA', flagCode: 've', name: 'Español' },
    { code: 'pt-BR', flagCode: 'br', name: 'Português' },
    { code: 'en-US', flagCode: 'gb', name: 'English' }, // Bandeira UK em vez de US
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
        // Versão desktop - botões com bandeiras (mesmo estilo da NavBar)
        <div className="d-flex align-items-center" style={{ gap: '0px', height: '100%' }}>
          {languages.map(lang => (
            <button
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className={`btn btn-sm d-flex align-items-center justify-content-center ${currentLanguage === lang.code
                ? 'btn-light'
                : 'btn-outline-light'
                }`}
              style={{
                width: '28px',
                height: '28px',
                padding: '4px',
                margin: 'auto 0',
                border: currentLanguage === lang.code
                  ? '1px solid rgba(255,255,255,0.15)'
                  : '1px solid transparent',
                borderRadius: '2px',
                transition: 'all 0.2s ease',
                lineHeight: '1',
                backgroundColor: currentLanguage === lang.code
                  ? 'rgba(255,255,255,0.05)'
                  : 'transparent',
                boxShadow: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              title={lang.name}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = 'rgba(255,255,255,0.08)';
                e.target.style.borderColor = 'rgba(255,255,255,0.2)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = currentLanguage === lang.code
                  ? 'rgba(255,255,255,0.05)'
                  : 'transparent';
                e.target.style.borderColor = currentLanguage === lang.code
                  ? 'rgba(255,255,255,0.15)'
                  : 'transparent';
              }}
            >
              <span
                className={`fi fi-${lang.flagCode}`}
                style={{
                  fontSize: '16px',
                  lineHeight: '1',
                  display: 'block'
                }}
              ></span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;