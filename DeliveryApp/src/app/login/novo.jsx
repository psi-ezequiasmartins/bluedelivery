/**
 * src/app/login/login.jsx
 */

import React, { useState, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import Loading from '../../components/loading/loading';
import { Link, Navigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import './novo.css';

export default function Novo() {
  const { t } = useTranslation();
  const { loading, msg, result, signUp } = useContext(AuthContext);

  const [delivery, setDelivery] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm_password, setConfirmPassword] = useState('');

  var ano = new Date().getFullYear();

  return (
    <div className="d-flex align-items-center text-center form-container">
      <form className="form-login">

        <a href="/#">
          <img className="mb-4" src="/images/logo.png" alt="" />
        </a>

        <h1 className="h3 mb-2 fw-normal">{t('app.register.title')}</h1>

        <div className="form-floating mt-2">
          <input onChange={(e) => setDelivery(e.target.value)} type="text" className="form-control" id="delivery" placeholder={t('app.register.delivery_name')} />
          <label htmlFor="delivery">{t('app.register.delivery_name')}</label>
        </div>

        <div className="form-floating mt-2">
          <input onChange={(e) => setEmail(e.target.value)} type="email" className="form-control" id="email" placeholder={t('app.register.email')} />
          <label htmlFor="email">{t('app.register.email')}</label>
        </div>

        <div className="form-floating mt-2">
          <input onChange={(e) => setPassword(e.target.value)} type="password" className="form-control" id="password" placeholder={t('app.register.password')} />
          <label htmlFor="password">{t('app.register.password')}</label>
        </div>

        <div className="form-floating mt-2">
          <input onChange={(e) => setConfirmPassword(e.target.value)} type="password" className="form-control" id="confirm_password" placeholder={t('app.register.confirm_password')} />
          <label htmlFor="confirm_password">{t('app.register.confirm_password')}</label>
        </div>

        <button onClick={() => signUp(delivery, email, password, confirm_password)} className="w-100 btn btn-lg btn-dark mt-2" type="button">{t('app.register.signup')}</button>

        <div className="form-links">
          <Link to="/app/login" className="mx-3">{t('app.register.already_have_account')}</Link>
        </div>

        {msg.length > 0 ? <div className="alert alert-danger mt-2" role="alert">{msg}</div> : null}

        {result === 'S' ? <Navigate to="/app/pedidos" /> : null}
        <p>&copy; 1999-{ano} {t('app.register.copyright')}</p>
      </form>
      {loading && <Loading />}
    </div>
  );
}
