/**
 * src/site/pages/footer.jsx
 */
import React from 'react';
import { useTranslation } from 'react-i18next';

function Footer() {
  const { t } = useTranslation();
  var ano = new Date().getFullYear();

  return (
    <section id="contato">
      <div>
        {/* me ajuda a localizar o arquivo em assets/marka.png */}
        <img src="images/marka.png" alt="Blue Delivery" height="60" />
        <p>&nbsp;</p>
      </div>
      <p>
        <strong>{t('footer.company_name')}</strong> {t('footer.cnpj')}
        <br /><i className="fa fa-map-marker"></i> {t('footer.address')}
        <br /><i className="fa fa-envelope"></i> <a href="mailto:#">{t('footer.email')}</a>
        <br /><i className="fa fa-phone"></i> {t('footer.phone')}
        <p>&nbsp;</p>
        <small>
          <a href="https://www.easycounter.com/">
            <img src="https://www.easycounter.com/counter.php?ezequiasmartins,index-paginainicial" border="0" alt="Free Hit Counter" /></a><br />
          <a href="https://www.easycounter.com/">{t('footer.visits_since')}
          </a>
          <br />© {ano} Blue Delivery<br />
        </small>
      </p>
    </section>
  );
}

export default Footer;