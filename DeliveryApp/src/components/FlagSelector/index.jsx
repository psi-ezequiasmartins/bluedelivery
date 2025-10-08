import React from 'react';
import { useTranslation } from 'react-i18next';
import 'flag-icons/css/flag-icons.min.css';

const FlagSelector = ({ variant = 'buttons' }) => {
  const { i18n } = useTranslation();

  // Ordem solicitada: Venezuela → Brasil → Inglaterra
  const languages = [
    { code: 'es-LA', flagCode: 've', name: 'Español' },
    { code: 'pt-BR', flagCode: 'br', name: 'Português' },
    { code: 'en-US', flagCode: 'gb', name: 'English' }, // Bandeira UK em vez de US
  ];

  const changeLanguage = (languageCode) => {
    console.log('🚩 FlagSelector mudando idioma para:', languageCode);
    // Salvar no localStorage com a chave correta
    localStorage.setItem('bluedelivery-language', languageCode);
    console.log('💾 Salvo no localStorage:', languageCode);
    i18n.changeLanguage(languageCode);
  };

  if (variant === 'buttons') {
    return (
      <div className="d-flex align-items-center" style={{ gap: '0px', height: '100%' }}>
        {languages.map((language) => (
          <button
            key={language.code}
            onClick={() => changeLanguage(language.code)}
            className={`btn btn-sm d-flex align-items-center justify-content-center ${i18n.language === language.code ? 'btn-light' : 'btn-outline-light'
              }`}
            style={{
              width: '28px',
              height: '28px',
              padding: '4px',
              margin: 'auto 0',
              border: i18n.language === language.code
                ? '1px solid rgba(255,255,255,0.15)'
                : '1px solid transparent',
              borderRadius: '2px',
              transition: 'all 0.2s ease',
              lineHeight: '1',
              backgroundColor: i18n.language === language.code
                ? 'rgba(255,255,255,0.05)'
                : 'transparent',
              boxShadow: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            title={language.name}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = 'rgba(255,255,255,0.08)';
              e.target.style.borderColor = 'rgba(255,255,255,0.2)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = i18n.language === language.code
                ? 'rgba(255,255,255,0.05)'
                : 'transparent';
              e.target.style.borderColor = i18n.language === language.code
                ? 'rgba(255,255,255,0.15)'
                : 'transparent';
            }}
          >
            <span
              className={`fi fi-${language.flagCode}`}
              style={{
                fontSize: '16px',
                lineHeight: '1',
                display: 'block'
              }}
            ></span>
          </button>
        ))}
      </div>
    );
  }

  // Versão dropdown para mobile
  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  return (
    <div className="dropdown">
      <button
        className="btn btn-outline-light btn-sm dropdown-toggle d-flex align-items-center"
        type="button"
        id="languageDropdown"
        data-bs-toggle="dropdown"
        aria-expanded="false"
        style={{
          border: '1px solid rgba(255,255,255,0.3)',
          borderRadius: '3px',
          padding: '6px 12px',
          fontSize: '14px'
        }}
      >
        <span
          className={`fi fi-${currentLanguage.flagCode} me-2`}
          style={{ fontSize: '18px' }}
        ></span>
        <span className="d-none d-md-inline">{currentLanguage.name}</span>
        <span className="d-md-none">{currentLanguage.code}</span>
      </button>

      <ul className="dropdown-menu dropdown-menu-dark" aria-labelledby="languageDropdown">
        {languages.map((language) => (
          <li key={language.code}>
            <button
              className={`dropdown-item d-flex align-items-center ${i18n.language === language.code ? 'active' : ''
                }`}
              onClick={() => changeLanguage(language.code)}
              style={{ fontSize: '14px' }}
            >
              <span
                className={`fi fi-${language.flagCode} me-2`}
                style={{ fontSize: '16px' }}
              ></span>
              <span>{language.name}</span>
              {i18n.language === language.code && (
                <i className="bi bi-check-circle-fill ms-auto text-success"></i>
              )}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FlagSelector;