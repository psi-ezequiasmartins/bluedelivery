/**
 * src/app/login/login.jsx
 */

import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import './login.css';

export default function Login() {
  const { loading, msg, result, signIn } = useContext(AuthContext);
  const [ email, setEmail ] = useState('');
  const [ password, setPassword ] = useState('');
  const navigate = useNavigate();
  const ano = new Date().getFullYear();

  useEffect(() => {
    if (result === 'S') {
      navigate('/app/pedidos');
    }
  }, [result, navigate]);

  return (
    <div className="d-flex align-items-center text-center form-container">
      <form className="form-login" onSubmit={(e) => e.preventDefault()}>
        <a href="/#">
          <img className="mb-4" src="/images/logo.png" alt="" />
        </a>

        <h1 className="h3 mb-2 fw-normal">Olá! Seja bem vindo!</h1>

        <div className="form-floating mt-2">
          <input onChange={(e)=>setEmail(e.target.value)} type="email" className="form-control" id="email" placeholder="E-mail"/>
          <label htmlFor="email">E-mail</label>
        </div>

        <div className="form-floating mt-2">
          <input onChange={(e)=>setPassword(e.target.value)} type="password" className="form-control" id="password" placeholder="Senha"/>
          <label htmlFor="password">Senha</label>
        </div>

        <button onClick={()=>signIn(email, password)} className="btn btn-lg btn-dark mt-2 w-100" type="button">ENTRAR</button>

        <div className="form-links">
          <Link to="/app/login/reset" className="mx-3">Esqueci minha senha!</Link><br/>
          <Link to="/app/login/novo" className="mx-3">Ainda não possui Conta? Junte-se a nós!</Link> 
        </div>

        {msg && <div className="alert alert-danger mt-2" role="alert">{msg}</div>}
        <p>&copy; 1999-{ano} PSI-SOFTWARE</p>
      </form>
      {loading && (
        <div className="loading-overlay">
          <div className="spinner"></div>
        </div>
      )}
    </div>
  );
}
