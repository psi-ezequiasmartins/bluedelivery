/**
 * src/site/pages/footer.jsx
 */
import React from 'react';

function Footer() {
  var ano = new Date().getFullYear();

    return (
      <section id="contato">
        <div>
          <ul className="list-unstyled list-inline social text-center">
            <li className="list-inline-item"><a href="https://www.facebook.com/outdoorvirtual.ezequiasmartins"><i className="fa fa-facebook fa-2x"></i></a></li>
            <li className="list-inline-item"><a href="https://twitter.com/ezequiasmartins"><i className="fa fa-twitter fa-2x"></i></a></li>
            <li className="list-inline-item"><a href="https://www.instagram.com/ezequiasmartins/"><i className="fa fa-instagram fa-2x"></i></a></li>
            <li className="list-inline-item"><a href="https://www.linkedin.com/in/ezequiasmartins-bhz/"><i className="fa fa-linkedin fa-2x"></i></a></li>
            <li className="list-inline-item"><a href="mailto:ezequiasmartins@gmail.com"><i className="fa fa-envelope fa-2x"></i></a></li>
          </ul>
        </div>
        <p>
          <strong>PSI-SOFTWARE</strong> CNPJ 18.478.810/0001-13
          <br/><i className="fa fa-map-marker"></i> Rua dos Comanches, 870 Santa Mônica CEP 31530-250 Belo Horizonte MG
          <br/><i className="fa fa-envelope"></i> <a href="mailto:#">ezequiasmartins@gmail.com</a>
          <br/><i className="fa fa-phone"></i> +55 31 98410-7540
          <br/>© 1999-{ano} PSI-SOFTWARE<br/>
<a href="https://www.easycounter.com/">
<img src="https://www.easycounter.com/counter.php?ezequiasmartins,index-paginainicial" border="0" alt="Free Hit Counter"/></a><br/>
<a href="https://www.easycounter.com/">Visitas desde 30'Abril'2024</a>
        </p>
      </section>
      );
    }
  
  export default Footer;