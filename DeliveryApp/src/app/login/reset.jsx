import React, { useState, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import './reset.css';

export default function Reset() {
  const { t } = useTranslation();
  const { msg, changePassword } = useContext(AuthContext);
  const [email, setEmail] = useState('');

  var ano = new Date().getFullYear();

  return (
    <div className="d-flex align-items-center text-center form-container">
      <form className="form-login">

        <a href="/#">
          <img className="mb-4" src="/images/logo.png" alt="" />
        </a>

        <h1 className="h3 mb-2 fw-normal">{t('app.reset.title')}</h1>

        <div className="form-floating mt-2">
          <input onChange={(e) => setEmail(e.target.value)} type="email" className="form-control" id="email" placeholder={t('app.reset.email')} />
          <label htmlFor="email">{t('app.reset.email')}</label>
        </div>

        <button onClick={() => changePassword(email)} className="w-150 btn btn-lg btn-dark" type="submit">{t('app.reset.send_link')}</button>

        <div className="form-links">
          <Link to="/app/login" className="mx-3">{t('app.reset.back_to_login')}</Link><br />
          <Link to="/app/login/novo" className="mx-3">{t('app.reset.create_account')}</Link><br />
        </div>

        {msg.length > 0 ? <div className="alert alert-danger mt-2" role="alert">{msg}</div> : null}

        <p>&copy; 1999-{ano} {t('app.reset.copyright')}</p>
      </form>
    </div>
  );
}
