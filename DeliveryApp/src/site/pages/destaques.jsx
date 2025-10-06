import React from 'react';

function Destaques() {
    return (
      <section id="vantagens">
        <div className="container">
          <div className="row">
          	<center>
              <h1>Aplicação Web (100% online)</h1>
              <h3>Gestão Pedidos, Cadastro de Produtos, Cardápio Digital, etc.<br/>
              Tudo o que vc precisa em um único lugar!</h3>
            </center>
            <div className="col-lg-4 box">
              <i className="icon fas fa-heart fa-4x vermelho"></i>
              <h3>Fácil de usar</h3>
              <p>O sistema possui uma interface simples, prática e intuitiva. Fácil de configurar e usar.</p>
            </div>
            <div className="col-lg-4 box">
            <i className="icon fas fa-globe-americas fa-4x azul"></i>
              <h3>De qualquer lugar</h3>
              <p>Gerencie seu Delivery remotamente (100% online), esteja onde estiver.</p>
            </div>
            <div className="col-lg-4 box">
              <i className="icon fas fa-columns fa-4x verde"></i>
              <h3>Organização é tudo</h3>
              <p>Tenha todos seus cadastros e controle sempre bem organizados e atualizados.</p>
            </div>

          </div>
        </div>
      </section>
    );
  }

export default Destaques;
