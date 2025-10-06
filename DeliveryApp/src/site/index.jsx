/**
 * src/site/index.jsx
 */

import React from 'react';

import Menu from './pages/menu';
import Banner from './pages/banner';
import Destaques from './pages/destaques';
import Depoimentos from './pages/depoimentos';
import Planos from './pages/planos';
import Mobile from './pages/mobile';
import Footer from './pages/footer';

function Site() {

  return (
    <div>
      <Menu/>
      <Banner/>
      <Destaques/>
      <Depoimentos/>
      <Planos/>
      <Mobile/>
      <Footer/>
    </div>
  );
}

export default Site;
