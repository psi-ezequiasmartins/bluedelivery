/**
* src/components/menu/index.jsx (Tabbar/Sidebar)
*/

import React, { useState, useEffect, useContext, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AuthContext } from '../../context/AuthContext.jsx';
import { FaStore, FaSignOutAlt } from 'react-icons/fa'; //, FaMoneyCheck
import { IoFastFood } from 'react-icons/io5';
import { GiShoppingBag } from 'react-icons/gi';
import { BiFoodMenu } from 'react-icons/bi';

import logo from '../../assets/logo-black.png';
import LanguageSelector from '../LanguageSelector';
import './index.css';

import SessionTimeout from '../session/SessionTimeOFF.jsx';

export default function Menu(props) {
  const { t } = useTranslation();
  const { signOut } = useContext(AuthContext);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [isMobile]);

  const handleLogout = useCallback(() => { // Envolva handleLogout com useCallback
    // console.log("Função handleLogout chamada.");
    signOut();
    navigate("/"); // retorna para a página inicial
  }, [signOut, navigate]); // Adicione signOut e navigate como dependências

  const activeLink = "nav-link active";
  const inactiveLink = "nav-link text-white";

  const renderMenuItems = (isTabbar = false) => (
    <ul className={`nav ${isTabbar ? 'nav-justified w-100' : 'nav-pills flex-column mb-auto'}`}>
      <li className={`nav-item ${isTabbar ? 'text-center' : ''}`}>
        <Link to="/app/pedidos" className={props.page === "pedidos" ? activeLink : inactiveLink} aria-current="page">
          <GiShoppingBag size={24} className="icon" />
          {!isTabbar && <span className="ms-1 d-none d-sm-inline">{t('app.menu.orders')}</span>}
        </Link>
      </li>
      <li className={`nav-item ${isTabbar ? 'text-center' : ''}`}>
        <Link to="/app/produtos" className={props.page === "produtos" ? activeLink : inactiveLink}>
          <IoFastFood size={24} className="icon" />
          {!isTabbar && <span className="ms-1 d-none d-sm-inline">{t('app.menu.products')}</span>}
        </Link>
      </li>
      <li className={`nav-item ${isTabbar ? 'text-center' : ''}`}>
        <Link to="/app/extras" className={props.page === "extras" ? activeLink : inactiveLink}>
          <BiFoodMenu size={24} className="icon" />
          {!isTabbar && <span className="ms-1 d-none d-sm-inline">{t('app.menu.extras')}</span>}
        </Link>
      </li>
      <li className={`nav-item ${isTabbar ? 'text-center' : ''}`}>
        <Link to="/app/delivery" className={props.page === "delivery" ? activeLink : inactiveLink}>
          <FaStore size={24} className="icon" />
          {!isTabbar && <span className="ms-1 d-none d-sm-inline">{t('app.menu.delivery')}</span>}
        </Link>
      </li>
      {/* <li className={`nav-item ${isTabbar ? 'text-center' : ''}`}>
        <Link to="/app/cheques" className={props.page === "cheques" ? activeLink : inactiveLink}>
          <FaMoneyCheck size={24} className="icon" />
          {!isTabbar && <span className="ms-1 d-none d-sm-inline">Cheques</span>}
        </Link>
      </li>
      <li className={`nav-item ${isTabbar ? 'text-center' : ''}`}>
        <Link to="/app/recibos" className={props.page === "recibos" ? activeLink : inactiveLink}>
          <FaMoneyCheck size={24} className="icon" />
          {!isTabbar && <span className="ms-1 d-none d-sm-inline">Recibos</span>}
        </Link>
      </li> */}
      <hr className={!isTabbar ? '' : 'd-none'} />
      <li className={`nav-item ${isTabbar ? 'text-center' : ''}`}>
        <Link to="/" onClick={handleLogout} className={props.page === "Logout" ? activeLink : inactiveLink}>
          <FaSignOutAlt size={24} className="icon" />
          {!isTabbar && <span className="ms-1 d-none d-sm-inline">{t('app.menu.logout')}</span>}
        </Link>
      </li>
      {!isTabbar && (
        <li className="nav-item mt-3" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <LanguageSelector isMobile={false} />
        </li>
      )}
    </ul>
  );

  return (
    <>
      <SessionTimeout onTimeout={handleLogout} timeout={2700000} /> {/* 45 minutos em milessegundos */}

      {/* Menu Sidebar */}
      {!isMobile && (
        <div className="menu sidebar" id="menu">
          <div className="d-flex flex-column align-items-center px-2 pt-2 text-white min-vh-100">
            <a href="/" onClick={signOut} className="navbar-brand">
              <img src={logo} alt="" height="180" className="d-inline-block align-text-top" />
            </a>
            <p></p>
            <span className="fs-4">{isMobile ? 'Menu' : 'Menu Principal'}</span>
            {renderMenuItems()}
          </div>
        </div>
      )}

      {/* Menu Tabbar */}
      {isMobile && (
        <nav className="menu tabbar" id="menu">
          {renderMenuItems(true)}
          <div className="mobile-language-wrapper">
            <LanguageSelector isMobile={true} />
          </div>
        </nav>
      )}
    </>
  );
}
