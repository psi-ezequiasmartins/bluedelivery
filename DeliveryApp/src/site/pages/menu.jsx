/**
 * src/site/pages/menu.jsx
 */

import React from 'react';
import logomarca from '../../assets/logomarca.png'

function Menu() {
  return (
    <div>
      <nav className="navbar fixed-top navbar-expand-lg navbar-dark bg-dark">
        <div className="container">

          <a className="navbar-brand" href="/#">
            <img src={logomarca} alt="blue delivery" height="50" className="d-inline-block align-text-top" />
          </a>

          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <a className="nav-link" aria-current="page" href="#banner">Início</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" aria-current="page" href="#vantagens">Vantagens</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" aria-current="page" href="#depoimentos">Depoimentos</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" aria-current="page" href="#planos-e-precos">Planos de Adesão</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" aria-current="page" href="#mobile">Download (App)</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" aria-current="page" href="#contato">Contato</a>
              </li>
            </ul>
          </div>
        </div>

      </nav>

    </div>
  );
}

export default Menu;
