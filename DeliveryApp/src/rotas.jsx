/**
 * src/rotas.jsx
 */

import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

/** rotas */

import Site from './site/index.jsx';

import Login from "./app/login/login.jsx";
import Novo from "./app/login/novo.jsx";
import Reset from "./app/login/reset.jsx";

// import Dashboard from "./app/dashboard.jsx";
import Pedidos from "./app/menu/pedidos";
import Produtos from "./app/menu/produtos/index.jsx";
import Extras from "./app/menu/extras/index.jsx";
import Delivery from "./app/menu/delivery/index.jsx";
// import Cheques from './app/menu/cheques/index.jsx';
// import Recibos from './app/menu/recibos/index.jsx';

import SecureRoute from "./components/route/protected.js";

export default function Rotas() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Site />} />
                <Route path='/app/login' element={<Login/>} />
                <Route path='/app/login/novo' element={<Novo/>} />
                <Route path='/app/login/reset' element={<Reset/>} />
                {/* SecureRoutes */}
                {/* <Route path="/app/dashboard" element={
                    <SecureRoute>
                        <Dashboard />
                    </SecureRoute>
                } />   */}
                <Route path="/app/pedidos" element={
                    <SecureRoute>
                        <Pedidos/> 
                    </SecureRoute>
                } />
                <Route path="/app/produtos" element={
                    <SecureRoute>
                        <Produtos/>
                    </SecureRoute>
                } />
                <Route path="/app/extras" element={
                    <SecureRoute>
                        <Extras/>
                    </SecureRoute>
                } />
                <Route path="/app/delivery" element={
                    <SecureRoute>
                        <Delivery/>
                    </SecureRoute>
                } />
                {/* <Route path="/app/cheques" element={
                    <SecureRoute>
                        <Cheques />
                    </SecureRoute>
                } />                
                <Route path="/app/recibos" element={
                    <SecureRoute>
                        <Recibos />
                    </SecureRoute>
                } />                 */}
                {/* SecureRoutes */}
                </Routes>
        </BrowserRouter>
    )
}
