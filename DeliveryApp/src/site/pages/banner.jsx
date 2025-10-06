/**
 * src/site/pages/banner.jsx
 */

import React, { useState, useEffect } from 'react';
import banner from '../../assets/banner.jpg';
import './banner.css'

function Banner() {
  const texts = [
    "Agilize a gestão de pedidos do seu bar, restaurante ou fastfood de forma muito prática e simples!",
    "Gestão de Pedidos para Deliveries em Geral de forma ágil e descomplicada.",
    "Sistema prático e simplificado para Delivery + Cardápio Digital c/ envio de pedidos via WhatsApp.",
    "Bares, Restaurantes, Pizzarias, Fastfoods, Farmácias, Floriculturas, Gáz de Cozinha, Água Mineral, etc.",
  ];

  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setIndex(prevIndex => (prevIndex + 1) % texts.length);
        setFade(true);
      }, 1500); // Duração do efeito fade
    }, 8000); // 8 segundos para leitura
    return () => clearInterval(interval);
  }, [texts.length]);

  return (
    <section id="banner">
      <div className="container">
        <div className="row align-items-center">

          <div className="col-lg-6">
            <img src={banner} className="img-fluid" alt="deliverybairro.com"/>
          </div>
          <div className="col-lg-6">
            <div className="bloco">
              <h1>Simples de configurar <br/>e fácil de usar!</h1>
              <div className={`${fade ? 'fade-in' : 'fade-out'}`}>
                <h4>{texts[index]}</h4>
              </div>
              <h5>Cadastre gratuitamente o seu Delivery hoje mesmo e faça parte do nosso Catálogo! Pague apenas R$ 0,99 por pedido enviado pela nossa plataforma.</h5>
              <a href="#planos-e-precos" type="button" className="btn btn-primary btn-lg btn-app">Cadastre-se</a>
              <a href="/app/login" type="button" className="btn btn-outline-light btn-lg btn-app">Fazer Login</a>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

export default Banner;
