/**
 * src/app/extras/index.jsx (acrécimos de pedido)
 */

import { useState, useEffect, useCallback } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { imprimirListagemDeItensAcrescimo } from './impressao';
import './index.css';

import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import Swal from 'sweetalert2';
import Menu from "../../../components/menu";

import api from '../../../config/apiAxios';

// Configuração segura do pdfMake
if (pdfFonts && pdfFonts.pdfMake && pdfFonts.pdfMake.vfs) {
  pdfMake.vfs = pdfFonts.pdfMake.vfs;
}

export default function Extras() {
  const vDelivery = localStorage.getItem("vDelivery"); 
  const vID = localStorage.getItem("vID");

  const [busca, setBusca] = useState('');
  const [excluido, setExcluido] = useState('');
  const [success, setSuccess] = useState('N');
  const [msg, setMsg] = useState('');

  const [extras, setExtras] = useState([]);
  const [extra_id, setExtraID] = useState(null);
  const [delivery_id, setDeliveryID] = useState(vID);
  const [descricao, setDescricao] = useState('');
  const [vr_unitario, setVrUnitario] = useState(0.00);

  const atualizarListagem = useCallback(async () => {
    try {
      const response = await api.get(`/delivery-app/listar/extras/delivery/${vID}`);
      if (response.data.length > 0) {
        const listagem = response.data.map((snapshot) => ({
          "EXTRA_ID": snapshot.EXTRA_ID,
          "DELIVERY_ID": snapshot.DELIVERY_ID,
          "DESCRICAO": snapshot.DESCRICAO,
          "VR_UNITARIO": snapshot.VR_UNITARIO,
        }));
        setExtras(listagem);
        setMsg(''); // Limpa a mensagem caso existam itens
      } else {
        setExtras([]);
        setMsg('Nenhum item extra cadastrado para este delivery.');
      }
    } catch (error) {
      console.error(error);
      if (error.response && error.response.status === 404) {
        setMsg('Nenhum item extra cadastrado para este delivery.');
      } else {
        setMsg('Erro ao carregar itens extras. Tente novamente mais tarde.');
      }
    }
  }, [vID]); // Inclua as dependências necessárias

  useEffect(() => {
    atualizarListagem();
  }, [atualizarListagem, busca, excluido, success, vID]);

  async function Cadastrar() {
    if (descricao.trim().length === 0) {
      setMsg('Favor preencher o campo Descrição.');
      return;
    }
  
    if (isNaN(parseFloat(vr_unitario))) {
      setMsg('Favor preencher o campo Valor Unitário com um número válido.');
      return;
    }
  
    const info = {
      "EXTRA_ID": null,
      "DELIVERY_ID": vID,
      "DESCRICAO": descricao.trim(),
      "VR_UNITARIO": parseFloat(vr_unitario.toString().replace(',', '.')) // Converte vírgula para ponto
    };
  
    try {
      await api.post('/delivery-app/add/extra', info);
      setMsg('Item de Acréscimo cadastrado com sucesso!');
      setSuccess('S');
      setDescricao(''); // Limpa o campo de descrição
      setVrUnitario(0.00); // Reseta o valor unitário
      atualizarListagem(); // Atualiza a listagem após o cadastro
    } catch (error) {
      console.error(error);
      if (error.response && error.response.status === 400) {
        setMsg('Erro de validação: Verifique os dados informados.');
      } else if (error.response && error.response.status === 500) {
        setMsg('Erro no servidor: Não foi possível cadastrar o item.');
      } else {
        setMsg('Erro desconhecido: Tente novamente mais tarde.');
      }
      setSuccess('N');
    }
  }

  function Editar() {
    if (descricao.trim().length === 0) {
      setMsg('Favor preencher a descrição do Item de Acréscimo.');
      return;
    }

    if (isNaN(parseFloat(vr_unitario))) {
      setMsg('Favor preencher o campo Valor Unitário com um número válido.');
      return;
    }

    const info = {
      "EXTRA_ID": extra_id,
      "DELIVERY_ID": delivery_id,
      "DESCRICAO": descricao.trim(),
      "VR_UNITARIO": parseFloat(vr_unitario.toString().replace(',', '.')) // Converte vírgula para ponto
    };

    api.put(`/delivery-app/update/extra/${extra_id}`, info).then(() => {
      setMsg('Item de Acréscimo atualizado com sucesso!');
      setSuccess("S");
      atualizarListagem(); // Atualiza a listagem após a edição
    }).catch((error) => {
      console.error(error);
      if (error.response && error.response.status === 400) {
        setMsg('Erro de validação: Verifique os dados informados.');
      } else if (error.response && error.response.status === 500) {
        setMsg('Erro no servidor: Não foi possível atualizar o item.');
      } else {
        setMsg('Erro desconhecido: Tente novamente mais tarde.');
      }
      setSuccess("N");
    });
  }

  function selectById(id){
    console.log('🔍 selectById chamado com ID:', id);
    api.get(`/delivery-app/extra/${id}`).then((result) => {
      console.log('📦 Dados recebidos do backend:', result.data);
      
      // Backend retorna o extra diretamente, não em array (igual aos produtos)
      if (result.data && result.data.EXTRA_ID) {
        const extra = result.data; // Extra vem direto, não em array
        console.log('✅ Extra encontrado:', extra);
        
        setExtraID(extra.EXTRA_ID);
        setDeliveryID(extra.DELIVERY_ID);
        setDescricao(extra.DESCRICAO);
        setVrUnitario(extra.VR_UNITARIO);
        
        console.log('🎯 Estados atualizados - ID:', extra.EXTRA_ID, 'Descrição:', extra.DESCRICAO);
      } else {
        console.log('❌ Nenhum extra encontrado na resposta');
        setMsg('Extra não encontrado.');
      }
    }).catch((error) => {
      console.error('💥 Erro selectById:', error);
      setMsg('Erro ao carregar extra: ' + error.message);
    });
  }

  function deleteByID(id) {
    api.delete(`/delivery-app/delete/extra/${id}`).then(() => {
    setExcluido(id);
    })
  }

  function confirmaExclusao(id) {
    let extra = extras.find(item => item.EXTRA_ID === id);

    Swal.fire({
      theme: 'dark',
      title: "Exclusão",
      text: `Confirma excluir ${extra.DESCRICAO} ?`,
      icon: 'warning',
      confirmButtonText: 'OK',
      cancelButtonText: 'Cancelar',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
    }).then((result) => {
      if (result.isConfirmed) {
        deleteByID(id);
        Swal.fire({
            theme: 'dark',
            title: 'Excluído!',
            text: 'Item extra removido.',
            icon: 'success',
            timer: 2000,
            showConfirmButton: false
        });
      } else {
        Swal.fire({
            title: 'Cancelado',
            text: 'A exclusão do item extra foi cancelada.',
            icon: 'info'
        });
      } 
    });
  }

  async function VisualizarPDF() {
    if (!extras || extras.length === 0) {
      Swal.fire({
          theme: 'dark',
          title: 'Aviso',
          text: 'Não há itens extras cadastrados para gerar o PDF.',
          icon: 'info'
      });
      return;
    }
    try {
      console.log('report', extras);
      const documento = imprimirListagemDeItensAcrescimo(extras); 
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

  function Listagem(props) {

    return (
      <table className="table table-hover table-bordered">
        <thead>
          <tr className="table-secondary">
            <th scope="col">ID</th>
            <th scope="col">ITEM EXTRA</th>
            <th scope="col">VALOR UN.</th>
            <th scope="col">AÇÕES</th>
          </tr>
        </thead>
        <tbody>
          {
            props.array.map((extra) => {
              return (
                <tr key={extra.EXTRA_ID}>
                  <th scope="row">{extra.EXTRA_ID}</th>
                  <td>{extra.DESCRICAO}</td>
                  <td>R$ { parseFloat(extra.VR_UNITARIO).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.') }</td>
                  <td>
                    <Link to="#" onClick={()=>props.select(extra.EXTRA_ID)} title="EDITAR ITEM DE ACRÉSCIMO" data-bs-toggle="modal" data-bs-target="#md_editar"><i className="fas fa-user-edit icon-action"></i></Link>
                    <Link to="#" onClick={()=>props.delete(extra.EXTRA_ID)} title="EXCLUIR ITEM DE ACRÉSCIMO"><i className="fas fa-trash-alt icon-action red"></i></Link>
                  </td>
                </tr>
              )
            })
          }
        </tbody>
      </table>
    );
  }

  return (
    <div className="container-fluid">
      <div className="row flex-nowrap">

        <div className="col-auto col-md-3 col-xl-2 px-sm-2 px-0">
          <Menu page="extras" />
        </div>

        <div className="col py-3 me-3">

          <h1>Itens de Acréscimo - {vID} {vDelivery}</h1>
          <div className="row">
            <div className="col-6">
              <div className="mt-2">
                <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#md_novo">
                  <i className="fas fa-address-book"></i> NOVO ITEM ACRÉSCIMO
                </button>
                <button onClick={VisualizarPDF} className="btn btn-warning"><i className="fas fa-file-pdf"></i> PDF</button>
              </div>
            </div>
            <div className="col-6">
              <div className="input-group mt-2">
                <input onChange={e => setBusca(e.target.value)} type="text" className="form-control" placeholder="Item extra" aria-describedby="bt_pesquisar"/>
              </div>
            </div>
          </div>

          <Listagem array={extras} select={selectById} delete={confirmaExclusao} />
          <div>
            {msg.length > 0 && <div className="alert alert-info mt-2">{msg}</div>}
          </div>

          {/* md_novo */}

          <div className="modal fade" id="md_novo" tabIndex="-1" aria-labelledby="titulo_modal" aria-hidden="true">
            <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
              <div className="modal-content">

                <div className="modal-header">
                  <h5 className="modal-title" id="titulo_modal">NOVO ITEM DE ACRÉSCIMO</h5>
                  <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Fechar"></button>
                </div>

                <div className="modal-body">
                  <form>
                    <div className="row">
                      <div className="mb-2">
                        <label htmlFor="descricao" className="form-label">Descrição</label>
                        <input onChange={e => setDescricao(e.target.value)} type="text" className="form-control" id="descricao" />
                      </div>
                      <div className="mb-2">
                        <label htmlFor="vr_unitario" className="form-label">Valor Unitário</label>
                        <input onChange={e => setVrUnitario(e.target.value)} type="text" className="form-control" id="vr_unitario" />
                      </div>
                    </div>
                    {msg.length > 0 ? <div className="alert alert-danger mt-2" role="alert">{msg}</div> : null}
                    {success === 'S' ? <Navigate to="/app/extras" replace={true} /> : null}
                  </form>
                </div>

                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">CANCELAR</button>
                  <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={Cadastrar}>SALVAR</button>
                </div>

              </div>
            </div>
          </div>

          {/* md_editar */}

          <div className="modal fade" id="md_editar" tabIndex="-1" aria-labelledby="titulo_modal" aria-hidden="true">
            <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
              <div className="modal-content">

                <div className="modal-header">
                  <h5 className="modal-title" id="titulo_modal">EDITAR ITEM DE ACRÉSCIMO</h5>
                  <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Fechar"></button>
                </div>

                <div className="modal-body">
                  <form>
                    <div className="row">
                      <div className="mb-2">
                        <label htmlFor="descricao" className="form-label">Descrição</label>
                        <input onChange={e => setDescricao(e.target.value)} value={descricao} type="text" className="form-control" id="descricao" />
                      </div>
                      <div className="mb-2">
                        <label htmlFor="vr_unitario" className="form-label">Valor Unitário</label>
                        <input onChange={e => setVrUnitario(e.target.value)} value={vr_unitario} type="text" className="form-control" id="vr_unitario" />
                      </div>
                    </div>
                    {msg.length > 0 ? <div className="alert alert-danger mt-2" role="alert">{msg}</div> : null}
                    {success === 'S' ? <Navigate to="/app/extras" replace={true} /> : null}
                  </form>
                </div>

                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">CANCELAR</button>
                  <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={Editar}>SALVAR</button>
                </div>

              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
