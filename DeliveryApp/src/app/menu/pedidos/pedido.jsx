/**
 * src/app/menu/pedidos/pedido.jsx
 */

import React, { useState, useEffect } from 'react';

import { MdNotificationAdd } from "react-icons/md";
import { BsClockHistory } from "react-icons/bs";
import { GiCook } from "react-icons/gi";
import { HiMiniShoppingBag } from "react-icons/hi2";
import { RiEBikeFill } from "react-icons/ri";
import { IoBagCheckSharp } from "react-icons/io5";
import { FiCheckCircle } from "react-icons/fi";
import { AiOutlineStop } from "react-icons/ai";

import api from '../../../config/apiAxios';
import './pedido.css';

export default function Pedido(props) {
  const [status, setStatus] = useState(props.STATUS);
  const [visible, setVisible] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth <= 768);
    }
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  async function AlterarStatus(codigo) {
    setStatus(codigo);
    await api.put(`/delivery-app/update/status/pedido`, { 
      orderId: props.PEDIDO_ID, 
      status: codigo 
    }).then((response) => {
        console.log(response);
        const json = {
          title: 'psi-Delivery',
          body: 'Pedido #' + props.PEDIDO_ID + ' atualizado em ' + new Date().toLocaleString() + ' Status: ' + codigo, 
          pushToken: props.PUSH_TOKEN || null,
        }
        console.log(json);
        if (status === 'FINALIZADO') {
          setVisible(false);
        }
    }).catch((error) => {
      console.log(error);
    });
  }

  return !visible ? null : (
    <div className={`shadow-sm pedido ${isMobile ? 'flex-column' : 'flex-row justify-content-between'}`}>

      <div className="row" >
        <div className="col-8">
          <text-black><b>{props.USER_ID} {props.CLIENTE}</b></text-black><br/>
          <text-gray>{props.ENDERECO_ENTREGA}</text-gray><br/>
          <text-black><b>PEDIDO #{props.PEDIDO_ID}</b></text-black>
          <span className='badge bg-dark m-2'>{props.DATA}</span>
          {status === 'NOVO' && <span className='badge bg-danger mr-2'>NOVO</span>}
          {status === 'AGUARDANDO' && <span className='badge bg-warning mr-2'>AGUARDANDO</span>}
          {status === 'PREPARANDO' && <span className='badge bg-secondary mr-2'>PREPARANDO</span>}
          {status === 'PRONTO_PARA_RETIRADA' && <span className='badge bg-warning mr-2'>PRONTO PARA RETIRADA</span>}
          {status === 'SAIU_PARA_ENTREGA' && <span className='badge bg-primary mr-2'>SAIU PARA ENTREGA</span>}
          {status === 'ENTREGUE' && <span className='badge bg-dark mr-2'>PEDIDO ENTREGUE</span>}
          {status === 'PGTO_PENDENTE' && <span className='badge bg-danger mr-2'>PAGTO PENDENTE</span>}
          {status === 'PGTO_OK' && <span className='badge bg-success mr-2'>PAGTO OK</span>}
          {status === 'FINALIZADO' && <span className='badge bg-dark mr-2'>FINALIZADO</span>}
          {status === 'CANCELADO' && <span className='badge bg-secondary mr-2'>CANCELADO</span>}
        </div>

        <div className="col-2">
          <div className='dropdown'>
            <a className='btn btn-dark dropdown-toggle' href='#status' role='button' id='dropdownMenuLink' data-bs-toggle='dropdown' aria-expanded='false'>
              <i className='bi bi-pin-angle'></i> STATUS
            </a>
            <ul className='dropdown-menu' aria-labelledby='dropdownMenuLink'>
              <li><a href='#novo' onClick={() => AlterarStatus('NOVO')} className='dropdown-item' style={{ color: 'red', fontSize: 18 }}><MdNotificationAdd /> NOVO PEDIDO</a></li>
              <li><a href='#aguardando' onClick={() => AlterarStatus('AGUARDANDO')} className='dropdown-item' style={{ color: 'orange', fontSize: 18 }}><BsClockHistory /> AGUARDANDO...</a></li>
              <li><a href='#preparando' onClick={() => AlterarStatus('PREPARANDO')} className='dropdown-item' style={{ color: 'gray', fontSize: 18 }}><GiCook /> PREPARANDO...</a></li>
              <li><a href='#retirada' onClick={() => AlterarStatus('PRONTO_PARA_RETIRADA')} className='dropdown-item' style={{ color: 'orange', fontSize: 18 }}><HiMiniShoppingBag /> PRONTO PARA RETIRADA</a></li>
              <li><a href='#entrega' onClick={() => AlterarStatus('SAIU_PARA_ENTREGA')} className='dropdown-item' style={{ color: '#019FF5', fontSize: 18 }}><RiEBikeFill /> SAIU PARA ENTREGA...</a></li>
              <li><a href='#recebido' onClick={() => AlterarStatus('ENTREGUE')} className='dropdown-item' style={{ color: 'black', fontSize: 18 }}><IoBagCheckSharp /> PEDIDO ENTREGUE</a></li>
              <li><a href='#pendente' onClick={() => AlterarStatus('PGTO_PENDENTE')} className='dropdown-item' style={{ color: 'red', fontSize: 18 }}><AiOutlineStop /> PAGAMENTO PENDENTE</a></li>
              <li><a href='#ok' onClick={() => AlterarStatus('PGTO_OK')} className='dropdown-item' style={{ color: 'green', fontSize: 18 }}><FiCheckCircle /> PAGAMENTO OK</a></li>
              <li><a href='#finalizado' onClick={() => AlterarStatus('FINALIZADO')} className='dropdown-item' style={{ color: 'black', fontSize: 18 }}><FiCheckCircle /> FINALIZADO</a></li>
              <li><a href='#cancelado' onClick={() => AlterarStatus('CANCELADO')} className='dropdown-item' style={{ color: 'gray', fontSize: 18 }}><AiOutlineStop /> CANCELADO</a></li>            </ul>
          </div>
        </div>

      </div>

      <div className="flex-column" >

        {props.itens.map((item) => (
          <div className='d-inline-block align-items-start' key={item.ITEM_ID}>
            <div className='text-left me-4 mt-2 card-pedido'>
              <img src={item.URL_IMAGEM} className='foto-item' alt='' />
              <small className='d-block text-dark'><b>( {item.QTD}x ) {item.PRODUTO_NOME}</b></small>
              <br/>
              {(item.ACRESCIMOS.length) > 0 
                ? <div className='text-dark acrescimos'>
                    <b>Acrescimos:</b>
                    <ul>
                      {item.ACRESCIMOS.map((acrescimo, index) => (
                        <li key={index}>
                          {acrescimo.DESCRICAO} - R$ {parseFloat(acrescimo.VR_UNITARIO).toFixed(2)}
                        </li>
                      ))}
                    </ul>
                  </div>
                : null
              }
              {item.OBS && (
                <text-orange>
                  <b>OBSERVAÇÕES:</b><br />
                  {item.OBS}
                </text-orange>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

