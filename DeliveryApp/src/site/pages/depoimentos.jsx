import React from 'react';
import { useTranslation } from 'react-i18next';

function Depoimentos() {
  const { t } = useTranslation();
  const testimonials = t('testimonials.items', { returnObjects: true });

  return (
    <section id="depoimentos">
      <div id="carouselExampleInterval" className="carousel slide" data-bs-ride="carousel" data-mdb-interval="true" >

        <center>
          <h1>{t('testimonials.title')}</h1>
        </center>

        <div className="carousel-inner">
          {testimonials.map((testimonial, index) => (
            <div key={index} className={`carousel-item ${index === 0 ? 'active' : ''}`} data-bs-interval="5000">
              <img src={`images/${index === 0 ? 'heliomarmarques' : index === 1 ? 'afonsomotta' : index === 2 ? 'ezequiasmartins' : 'sergiosales'}.jpg`} alt={testimonial.name} /><br />
              <em>{testimonial.name}</em>
              <p>{testimonial.text}</p>
            </div>
          ))}
        </div>

        <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleInterval" data-bs-slide="prev">
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          <span className="visually-hidden">{t('testimonials.previous')}</span>
        </button>
        <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleInterval" data-bs-slide="next">
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="visually-hidden">{t('testimonials.next')}</span>
        </button>

      </div>
    </section>
  );
}

export default Depoimentos;
