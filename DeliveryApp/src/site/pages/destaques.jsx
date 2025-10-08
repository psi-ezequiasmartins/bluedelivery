import React from 'react';
import { useTranslation } from 'react-i18next';

function Destaques() {
  const { t } = useTranslation();

  return (
    <section id="vantagens">
      <div className="container">
        <div className="row">
          <center>
            <h1>{t('advantages.title')}</h1>
            <h3>{t('advantages.subtitle')}</h3>
          </center>
          <div className="col-lg-4 box">
            <i className="icon fas fa-heart fa-4x vermelho"></i>
            <h3>{t('advantages.items.easy.title')}</h3>
            <p>{t('advantages.items.easy.description')}</p>
          </div>
          <div className="col-lg-4 box">
            <i className="icon fas fa-globe-americas fa-4x azul"></i>
            <h3>{t('advantages.items.anywhere.title')}</h3>
            <p>{t('advantages.items.anywhere.description')}</p>
          </div>
          <div className="col-lg-4 box">
            <i className="icon fas fa-dollar-sign fa-4x verde"></i>
            <h3>{t('advantages.items.affordable.title')}</h3>
            <p>{t('advantages.items.affordable.description')}</p>
          </div>

        </div>
      </div>
    </section>
  );
}

export default Destaques;
