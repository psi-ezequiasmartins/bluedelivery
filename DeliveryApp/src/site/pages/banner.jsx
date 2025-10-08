/**
 * src/site/pages/banner.jsx
 */

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import banner from '../../assets/banner.jpg';
import './banner.css'

function Banner() {
  const { t } = useTranslation();
  const texts = t('banner.rotating_texts', { returnObjects: true });

  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setIndex(prevIndex => (prevIndex + 1) % texts.length);
        setFade(true);
      }, 1500); // Duração do efeito fade
    }, 8000); // 8 segundos para leitura
    return () => clearInterval(interval);
  }, [texts.length]);

  return (
    <section id="banner">
      <div className="container">
        <div className="row align-items-center">

          <div className="col-lg-6">
            <img src={banner} className="img-fluid" alt="blue delivery" />
          </div>
          <div className="col-lg-6">
            <div className="bloco">
              <h1>{t('banner.title')}</h1>
              <div className={`${fade ? 'fade-in' : 'fade-out'}`}>
                <h4>{texts[index]}</h4>
              </div>
              <h5>{t('banner.description')}</h5>
              <a href="#planos-e-precos" type="button" className="btn btn-primary btn-lg btn-app">{t('banner.register')}</a>
              <a href="/app/login" type="button" className="btn btn-outline-light btn-lg btn-app">{t('banner.login')}</a>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

export default Banner;
