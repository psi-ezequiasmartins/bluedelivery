/**
 * src/app/menu/pedidos/index.jsx
 */

import { useState, useEffect } from "react";
import { useTranslation } from 'react-i18next';
import { imprimirListagemDePedidos } from './impressao';
import Menu from "../../../components/menu";
import Pedido from "./pedido";
import './index.css';

import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import Swal from 'sweetalert2';

import api from "../../../config/apiAxios";

// Configuração segura do pdfMake
if (pdfFonts && pdfFonts.pdfMake && pdfFonts.pdfMake.vfs) {
  pdfMake.vfs = pdfFonts.pdfMake.vfs;
}

export default function Pedidos() {
  const { t } = useTranslation();
  const vDelivery = localStorage.getItem("vDelivery");
  const vID = localStorage.getItem("vID");

  const [pedidos, setPedidos] = useState(null);
  const [msg, setMsg] = useState('');

  async function ListarPedidos() {
    try {
      const response = await api.get(`/delivery-app/pedidos/abertos/delivery/${vID}`);
      if (response.data.length > 0) {
        setPedidos(response.data);
        setMsg(''); // Limpa a mensagem caso existam pedidos
      } else {
        setMsg(t('app.orders.no_orders'));
        setPedidos([]); // Garante que a lista de pedidos esteja vazia
      }
    } catch (error) {
      console.log(error);
      if (error.response && error.response.status === 404) {
        setMsg(t('app.orders.no_orders'));
      } else {
        setMsg(t('app.orders.error_loading'));
      }
      setPedidos([]); // Garante que a lista de pedidos esteja vazia
    }
  }

  useEffect(() => {
    ListarPedidos(); // eslint-disable-next-line 
  }, [pedidos, vID])

  async function loadDeliveryAddress() {
    if (vID) {
      await api.get(`/api/delivery/${vID}`)
        .then((response) => {
          let address = "";
          address += response.data.ENDERECO + ", ";
          address += response.data.NUMERO + " " + response.data.COMPLEMENTO + ", ";
          address += response.data.BAIRRO + " " + response.data.CIDADE + "-" + response.data.UF + " ";
          address += response.data.CEP;
          localStorage.setItem("vDeliveryAddress", address);
          console.count = 0;
        }).catch((error) => {
          console.log(error);
        })
    }
  }

  loadDeliveryAddress();

  async function VisualizarPDF() {
    if (!pedidos || pedidos.length === 0) {
      Swal.fire({
        theme: 'dark',
        title: 'Aviso',
        text: 'Nenhum pedido em aberto disponível para gerar o PDF.',
        icon: 'info'
      });
      return;
    }
    try {
      console.log('report', pedidos);
      const documento = imprimirListagemDePedidos(pedidos);
      pdfMake.createPdf(documento).open({}, window.open('', '_blank'));
    } catch (error) {
      console.error('Erro ao gerar o PDF:', error);
      Swal.fire({
        theme: 'dark',
        title: 'Erro',
        text: 'Não foi possível gerar o PDF. Tente novamente mais tarde.',
        icon: 'error'
      });
    }
  }

  return <>
    <div className="container-fluid">
      <div className="row flex-nowrap">

        <div className="col-auto col-md-3 col-xl-2 px-sm-2 px-0">
          <Menu page="pedidos" />
        </div>

        <div className="col py-3 me-3">
          <h1>{t('app.orders.title')} - {vID} {vDelivery}</h1>

          <div className="row">
            <div className="mt-2">
              <button onClick={ListarPedidos} className="btn m-2 btn-primary">{t('app.orders.update')}</button>
              <button onClick={VisualizarPDF} className="btn m-2 btn-warning"><i className="fas fa-file-pdf"></i> {t('app.orders.pdf')}</button>
            </div>
          </div>

          <div className="m-2 mt-2">
            {msg.length > 0 && <div className="alert alert-info">{msg}</div>}
            {
              pedidos?.map((pedido) => {
                return <Pedido
                  key={pedido.PEDIDO_ID}
                  PEDIDO_ID={pedido.PEDIDO_ID}
                  DATA={pedido.DATA}
                  DELIVERY_ID={vDelivery}
                  STATUS={pedido.STATUS}
                  USER_ID={pedido.USER_ID}
                  CLIENTE={(pedido.CLIENTE || '').toUpperCase()}
                  ENDERECO_ENTREGA={(pedido.ENDERECO_ENTREGA || '').toUpperCase()}
                  PUSH_TOKEN={pedido.PUSH_TOKEN}
                  itens={pedido.ITENS}
                />
              })
            }
          </div>
        </div>

      </div>
    </div>
  </>
}

// eslint-disable-next-line react-hooks/exhaustive-deps
