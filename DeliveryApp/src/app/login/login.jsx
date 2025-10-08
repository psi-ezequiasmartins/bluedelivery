/**
 * src/app/login/login.jsx
 */

import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useTranslateContext } from '../../context/TranslateContext';
import { AuthContext } from '../../context/AuthContext';
import './login.css';

export default function Login() {
  const { t } = useTranslation();
  const { currentLanguage } = useTranslateContext();
  const { loading, msg, result, signIn } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const ano = new Date().getFullYear();

  useEffect(() => {
    console.log('🌐 Login - Current Language:', currentLanguage);
    console.log('🌐 Login - Translation test:', t('app.login.title'));
    if (result === 'S') {
      navigate('/app/pedidos');
    }
  }, [result, navigate, currentLanguage, t]);

  return (
    <div className="d-flex align-items-center text-center form-container">
      <form className="form-login" onSubmit={(e) => e.preventDefault()}>
        <a href="/#">
          <img className="mb-4" src="/images/logo.png" alt="" />
        </a>

        <h1 className="h3 mb-2 fw-normal">{t('app.login.title')}</h1>

        <div className="form-floating mt-2">
          <input onChange={(e) => setEmail(e.target.value)} type="email" className="form-control" id="email" placeholder={t('app.login.email')} />
          <label htmlFor="email">{t('app.login.email')}</label>
        </div>

        <div className="form-floating mt-2">
          <input onChange={(e) => setPassword(e.target.value)} type="password" className="form-control" id="password" placeholder={t('app.login.password')} />
          <label htmlFor="password">{t('app.login.password')}</label>
        </div>

        <button onClick={() => signIn(email, password)} className="btn btn-lg btn-dark mt-2 w-100" type="button">{t('app.login.signin')}</button>

        <div className="form-links">
          <Link to="/app/login/reset" className="mx-3">{t('app.login.forgot_password')}</Link><br />
          <Link to="/app/login/novo" className="mx-3">{t('app.login.create_account')}</Link>
        </div>

        {msg && <div className="alert alert-danger mt-2" role="alert">{msg}</div>}
        <small>&copy; {ano} {t('app.login.copyright')}</small>
      </form>
      {loading && (
        <div className="loading-overlay">
          <div className="spinner"></div>
        </div>
      )}
    </div>
  );
}
