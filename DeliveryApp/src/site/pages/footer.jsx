/**
 * src/site/pages/footer.jsx
 */
import React from 'react';

function Footer() {
  var ano = new Date().getFullYear();

  return (
    <section id="contato">
      <div>
        {/* me ajuda a localizar o arquivo em assets/marka.png */}
        <img src="images/marka.png" alt="MARKA GESTÃO DE PROJETOS" height="60" />
        <p>&nbsp;</p>
        {/* <ul className="list-unstyled list-inline social text-center">
          <li className="list-inline-item"><a href="https://www.facebook.com/outdoorvirtual.ezequiasmartins"><i className="fa fa-facebook fa-2x"></i></a></li>
          <li className="list-inline-item"><a href="https://twitter.com/ezequiasmartins"><i className="fa fa-twitter fa-2x"></i></a></li>
          <li className="list-inline-item"><a href="https://www.instagram.com/ezequiasmartins/"><i className="fa fa-instagram fa-2x"></i></a></li>
          <li className="list-inline-item"><a href="https://www.linkedin.com/in/ezequiasmartins-bhz/"><i className="fa fa-linkedin fa-2x"></i></a></li>
          <li className="list-inline-item"><a href="mailto:ezequiasmartins@gmail.com"><i className="fa fa-envelope fa-2x"></i></a></li>
        </ul> */}
      </div>
      <p>
        <strong>MARKA GESTÃO DE PROJETOS</strong> CNPJ 57.294.418/0001-76
        <br /><i className="fa fa-map-marker"></i> Av. Acadêmico Nilo Figueiredo, 2303 - Joana Darc - Lagoa Santa MG
        <br /><i className="fa fa-envelope"></i> <a href="mailto:#">agenciamarka7@gmail.com</a>
        <br /><i className="fa fa-phone"></i> +55 31 97598-4608
        <br />© 2025-{ano} MARKA<br />
        <a href="https://www.easycounter.com/">
          <img src="https://www.easycounter.com/counter.php?ezequiasmartins,index-paginainicial" border="0" alt="Free Hit Counter" /></a><br />
        <a href="https://www.easycounter.com/">Visitas desde 30'Setembro'2025</a>
      </p>
    </section>
  );
}

export default Footer;