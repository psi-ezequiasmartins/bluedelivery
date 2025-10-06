/**
 * src/site/pages/mobile.jsx
 */

import React from 'react';

function Mobile() {
    return (
      <section id="mobile">
        <div className="container">
          <div className="row align-items-center">

            <div className="col-lg-6">
              <div className="bloco">
                <h1>Baixe grátis o nosso <br/>App Mobile (Android/iOs*)</h1>
                <h4>Acesse o nosso catálogo de estabelecimentos com entregas a domicílio próximo a você!</h4>
                <a 
                  href="https://drive.google.com/file/d/1KfQlIx6Hkeb5CnZvROEz_Xi6WqG2VzoO/view?usp=sharing"
                  type="button" 
                  className="btn btn-dark btn-lg btn-app"
                >DOWNLOAD<br/>UserApp v3.0.1<i className="fa fa-android"></i></a>
                <p className="text-white">(*) em breve disponível também para dispositivos iOs (iPhone, iPads, etc)</p>
                <p>BUILD · 28-09-2025-21:28</p>
              </div>
            </div>
            <div className="col-lg-6">
              <img src="images/mobile.png" width="700px" alt="deliverybairro.com"/>
            </div>

          </div>
        </div>
      </section>
    );
  }

export default Mobile;
