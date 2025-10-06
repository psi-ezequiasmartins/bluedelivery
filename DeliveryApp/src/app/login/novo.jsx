/**
 * src/app/login/login.jsx
 */

import React, { useState, useContext } from 'react';
import Loading from '../../components/loading/loading';
import { Link, Navigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import './novo.css';

export default function Novo() {
  const { loading, msg, result, signUp } = useContext(AuthContext);

  const [ delivery, setDelivery ] = useState('');
  const [ email, setEmail ] = useState('');
  const [ password, setPassword ] = useState('');
  const [ confirm_password, setConfirmPassword ] = useState('');

  var ano = new Date().getFullYear();

  return (
    <div className="d-flex align-items-center text-center form-container">
      <form className="form-login">

        <a href="/#">
          <img className="mb-4" src="/images/logo.png" alt="" />
        </a>

        <h1 className="h3 mb-2 fw-normal">Novo Usuário</h1>

        <div className="form-floating mt-2">
          <input onChange={(e)=>setDelivery(e.target.value)} type="text" className="form-control" id="delivery" placeholder='Nome do Delivery' />
          <label htmlFor="delivery">Delivery</label>
        </div>

        <div className="form-floating mt-2">
          <input onChange={(e)=>setEmail(e.target.value)} type="email" className="form-control" id="email" placeholder='E-mail' />
          <label htmlFor="email">E-mail</label>
        </div>

        <div className="form-floating mt-2">
          <input onChange={(e)=>setPassword(e.target.value)} type="password" className="form-control" id="password" placeholder='Defina sua Senha' />
          <label htmlFor="password">Defina sua Senha</label>
        </div>

        <div className="form-floating mt-2">
          <input onChange={(e)=>setConfirmPassword(e.target.value)} type="password" className="form-control" id="confirm_password" placeholder='Confirme sua Senha'/>
          <label htmlFor="confirm_password">Confirme sua Senha</label>
        </div> 

        <button onClick={()=>signUp(delivery, email, password, confirm_password)} className="w-100 btn btn-lg btn-dark mt-2" type="button">CADASTRAR ACESSO</button>

        <div className="form-links">
          <Link to="/app/login" className="mx-3">Já tenho uma conta</Link>
        </div>

        {msg.length > 0 ? <div className="alert alert-danger mt-2" role="alert">{msg}</div> : null}

        {result === 'S' ? <Navigate to="/app/pedidos" /> : null}
        <p>&copy; 1999-{ano} PSI-SOFTWARE</p>
      </form>
      {loading && <Loading />}
    </div>
  );
}
