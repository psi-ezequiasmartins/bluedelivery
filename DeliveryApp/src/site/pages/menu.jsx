/**
 * src/site/pages/menu.jsx
 */

import React from 'react';
import { useTranslation } from 'react-i18next';
import logomarca from '../../assets/logomarca.png';
import FlagSelector from '../../components/FlagSelector';

function Menu() {
  const { t } = useTranslation();

  return (
    <div>
      <nav className="navbar fixed-top navbar-expand-lg navbar-dark bg-dark"
        style={{ backgroundColor: '#000', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}
      >
        <div className="container">

          <a className="navbar-brand" href="/#">
            <img src={logomarca} alt="blue delivery" height="50" className="d-inline-block align-text-top" />
          </a>

          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav ms-auto" style={{ gap: '1rem' }}>
              <li className="nav-item">
                <a className="nav-link" aria-current="page" href="#banner">{t('menu.home')}</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" aria-current="page" href="#vantagens">{t('menu.advantages')}</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" aria-current="page" href="#depoimentos">{t('menu.testimonials')}</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" aria-current="page" href="#planos-e-precos">{t('menu.plans')}</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" aria-current="page" href="#mobile">{t('menu.download')}</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" aria-current="page" href="#contato">{t('menu.contact')}</a>
              </li>
              {/* Seletor de idiomas no final da navbar */}
              <li className="nav-item ms-4 d-none d-lg-block" style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                <FlagSelector variant="buttons" />
              </li>
              {/* Seletor dropdown para mobile */}
              <li className="nav-item ms-2 d-lg-none" style={{ display: 'flex', alignItems: 'center' }}>
                <FlagSelector variant="dropdown" />
              </li>
            </ul>
          </div>
        </div>

      </nav>

    </div>
  );
}

export default Menu;
