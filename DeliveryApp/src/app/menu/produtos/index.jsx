/**
 * src/app/menu/produtos/index.jsx
 */

import { useState, useEffect, useCallback } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { firebase_app } from "../../../config/apiFirebase";
import { imprimirListagemDeProdutos } from './impressao';
import Menu from '../../../components/menu';
import './index.css';

import pdfMake from "pdfmake/build/pdfmake";
// import pdfFonts from "pdfmake/build/vfs_fonts";
import Swal from 'sweetalert2';

import api from '../../../config/apiAxios';

// pdfMake.vfs = pdfFonts.pdfMake.vfs;

export default function Produtos() {
  const storage = getStorage(firebase_app);
  const vDelivery = localStorage.getItem("vDelivery"); 
  const vID = localStorage.getItem("vID");

  const [busca, setBusca] = useState('');
  const [excluido, setExcluido] = useState('');
  const [success, setSuccess] = useState('N');
  const [msg, setMsg] = useState('');

  const [produtos, setProdutos] = useState([]);
  const [delivery_id, setDeliveryID] = useState(vID);
  const [produto_id, setProdutoID] = useState(null);
  const [produto_nome, setProdutoNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [vr_unitario, setVrUnitario] = useState(0.00);
  const [itens_extras, setItensExtras] = useState('S');  
  const [itens_obs, setItensObs] = useState('S');
  const [url_imagem, setUrlImagem] = useState('');

const atualizarListagem = useCallback(async () => {
  try {
    const result = await api.get(`/delivery-app/listar/produtos/delivery/${vID}`);
    if (result.data.length > 0) {
      const searchLower = busca.toLowerCase();
      const listagem = result.data.filter((snapshot) =>
        snapshot.PRODUTO_ID.toString().includes(searchLower) ||
        snapshot.PRODUTO_NOME.toLowerCase().includes(searchLower) ||
        snapshot.DESCRICAO.toLowerCase().includes(searchLower) ||
        snapshot.VR_UNITARIO.toString().includes(searchLower)
      );
      setProdutos(listagem);
      setMsg('');
    } else {
      setProdutos([]);
      setMsg('Nenhum produto cadastrado para este delivery.');
    }
  } catch (error) {
    console.error('Error fetching produtos:', error);
    setProdutos([]);
    setMsg('Erro ao carregar produtos.');
  }
}, [vID, busca]);

  useEffect(() => {
    atualizarListagem();
  }, [atualizarListagem, busca, excluido]);

  async function imgUpload(id) {
    // let produto = produtos.find(item => item.PRODUTO_ID === id);

    const { value: file } = await Swal.fire({
      theme: 'dark',
      confirmButtonText: 'ENVIAR',
      confirmButtonColor: '#3085d6',
      title: 'Selecione a imagem:',
      input: 'file',
      inputAttributes: {
        'accept': 'image/*',
        'aria-label': 'Selecione a imagem'
      }
    })

    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        Swal.fire({
          theme: 'dark',
          title: 'Imagem enviada com sucesso!',
          imageUrl: e.target.result,
          imageAlt: 'Imagem selecionada'
        })
      }
      reader.readAsDataURL(file)

      console.log('File', file.name);

      /** @type {any} */
      const metadata = {
        contentType: 'image/jpeg'
      };

      const storageRef = ref(storage, '/produtos/' + file.name);
      const uploadTask = uploadBytesResumable(storageRef, file, metadata);
      uploadTask.on('state_changed', (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Upload is ' + progress + '% done');
          switch (snapshot.state) {
            case 'paused':
              console.log('Upload is paused');
              break;
            case 'running':
              console.log('Upload is running');
              break;
            default:
              // do nothing
          }
        }, (error) => {
          switch (error.code) {
            case 'storage/unauthorized':
              break;
            case 'storage/canceled':
              break;
            case 'storage/unknown':
              break;
            default:
          }
        }, () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async(downloadURL) => {
            console.log('File available at', downloadURL);
            setUrlImagem(downloadURL);
            api.put(`/delivery-app/update/imagem/produto/${id} `, {"url_imagem": downloadURL}).then(response => {
              console.log(response.data);
            });
          });
        }
      );
    }
  }

  function img_reset() {
    setUrlImagem('');
    setProdutoNome('');
    setDescricao('');
    setVrUnitario(0.00);
    setItensExtras('S');
    setItensObs('S');
    setProdutoID(null);
  }

  async function uploadImageForNewProduct() {
    const { value: file } = await Swal.fire({
      theme: 'dark',
      confirmButtonText: 'ENVIAR',
      confirmButtonColor: '#3085d6',
      title: 'Selecione a imagem do produto:',
      input: 'file',
      inputAttributes: {
        'accept': 'image/*',
        'aria-label': 'Selecione a imagem'
      }
    })

    if (file) {
      console.log('📷 Arquivo selecionado:', file.name);

      const metadata = {
        contentType: 'image/jpeg'
      };

      const storageRef = ref(storage, '/produtos/' + file.name);
      const uploadTask = uploadBytesResumable(storageRef, file, metadata);
      
      uploadTask.on('state_changed', 
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('📤 Upload: ' + progress + '% concluído');
        }, 
        (error) => {
          console.error('❌ Erro no upload:', error);
          Swal.fire({
            theme: 'dark',
            title: 'Erro',
            text: 'Falha no upload da imagem.',
            icon: 'error'
          });
        }, 
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            console.log('✅ Imagem disponível em:', downloadURL);
            setUrlImagem(downloadURL); // ATUALIZA O ESTADO
            Swal.fire({
              theme: 'dark',
              title: 'Imagem carregada!',
              text: 'Imagem selecionada com sucesso. Agora clique em SALVAR para cadastrar o produto.',
              imageUrl: downloadURL,
              imageAlt: 'Imagem selecionada'
            });
          });
        }
      );
    }
  }

  async function Cadastrar() {
    if (produto_nome.length === 0) {
      setMsg('Favor preencher o campo Nome do Produto.');
    } else {
      const vrUnitarioFormatted = vr_unitario.toString().replace(',', '.'); 
      const json = {
        "PRODUTO_NOME": produto_nome, 
        "DESCRICAO": descricao, 
        "VR_UNITARIO": vrUnitarioFormatted, 
        "URL_IMAGEM": url_imagem !== "" ? url_imagem : "https://placehold.co/500x500", 
        "ITENS_EXTRAS": itens_extras, 
        "ITENS_OBS": itens_obs, 
        "DELIVERY_ID": vID 
      }
      await api.post('/delivery-app/add/produto', json).then(() => {
        setMsg('Produto cadastrado com sucesso!');
        setSuccess('S');
        img_reset(); // Limpa o formulário
        setBusca(''); // Atualiza a listagem
        atualizarListagem();
      }).catch((error) => {
        setMsg(error.message);
        setSuccess("N");
      })
    }
  }

  function Editar() {
    console.log('🎯 Função Editar chamada');
    console.log('📝 Estado atual - produto_id:', produto_id, 'produto_nome:', produto_nome);
    
    if (produto_nome.length === 0) {
      setMsg('Favor preencher o campo Nome do Produto.');
    } else if (!produto_id) {
      console.log('❌ produto_id está vazio/null:', produto_id);
      setMsg('Erro: ID do produto não encontrado. Selecione um produto para editar.');
    } else {
      console.log('✅ Enviando dados para atualização:', produto_id);
      const vrUnitarioFormatted = vr_unitario.toString().replace(',', '.'); 
      let info = { 
        "PRODUTO_ID": produto_id, 
        "PRODUTO_NOME": produto_nome, 
        "DESCRICAO": descricao, 
        "VR_UNITARIO": vrUnitarioFormatted,
        "URL_IMAGEM": url_imagem,
        "ITENS_EXTRAS": itens_extras,
        "ITENS_OBS": itens_obs,
        "DELIVERY_ID": delivery_id
      }
      console.log('📦 Dados enviados:', info);
      api.put(`/delivery-app/update/produto/${produto_id}`, info).then(() => {
        console.log('✅ Produto atualizado com sucesso');
        setMsg('');
        setSuccess('S');
        img_reset();
        setBusca('');
        atualizarListagem();
      }).catch((error) =>{
        console.error('💥 Erro ao atualizar:', error);
        setMsg(error.message);
        setSuccess('N');
      })
    }
  }

  function selectById(id){
    console.log('🔍 selectById chamado com ID:', id);
    api.get(`/delivery-app/produto/${id}`).then((result) => {
      console.log('📦 Dados recebidos do backend:', result.data);
      
      // Backend retorna o produto diretamente, não em array
      if (result.data && result.data.PRODUTO_ID) {
        const produto = result.data; // Produto vem direto, não em array
        console.log('✅ Produto encontrado:', produto);
        
        setProdutoID(produto.PRODUTO_ID);
        setProdutoNome(produto.PRODUTO_NOME); 
        setDescricao(produto.DESCRICAO);
        setVrUnitario(produto.VR_UNITARIO);
        setUrlImagem(produto.URL_IMAGEM);
        setItensExtras(produto.ITENS_EXTRAS);
        setItensObs(produto.ITENS_OBS);
        setDeliveryID(produto.DELIVERY_ID);
        
        console.log('🎯 Estados atualizados - ID:', produto.PRODUTO_ID, 'Nome:', produto.PRODUTO_NOME);
      } else {
        console.log('❌ Nenhum produto encontrado na resposta');
        setMsg('Produto não encontrado.');
      }
    }).catch((error) => {
      console.error('💥 Erro selectById:', error);
      setMsg('Erro ao carregar produto: ' + error.message);
    })
  }

  function deleteByID(id) {
    api.delete(`/delivery-app/delete/produto/${id}`).then(() => {
    setExcluido(id);
    setBusca('');
    atualizarListagem();
    setMsg('Produto excluído com sucesso!');
    setSuccess('S');
    })
  }

  function confirmaExclusao(id) {
    let produto = produtos.find(item => item.PRODUTO_ID === id);
    Swal.fire({
      theme: 'dark',
      title: "Exclusão",
      text: `Confirma excluir ${produto.PRODUTO_NOME} ?`,
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
          text: 'Produto removido.',
          icon: 'success'
        });
      } 
    });
  }

  async function VisualizarPDF() {
    if (!produtos || produtos.length === 0) {
      Swal.fire({
        theme: 'dark',
        title: 'Aviso',
        text: 'Nenhum pedido em aberto disponível para gerar o PDF.',
        icon: 'info'
      });
      return;
    }
    try {
      console.log('report', produtos);
      const documento = imprimirListagemDeProdutos(produtos); 
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
            <th scope="col">IMAGEM</th>
            <th scope="col">PRODUTO</th>
            <th scope="col">VALOR UN.</th>
            <th scope="col">AÇÕES</th>
          </tr>
        </thead>
        <tbody>
          {
            props.array.map((produto) => {
              return (
                <tr key={produto.PRODUTO_ID}>
                  <th scope="row">{produto.PRODUTO_ID}</th>
                  <td><img src={produto.URL_IMAGEM} alt="imagem" width="50" /></td>
                  <td>{produto.PRODUTO_NOME}</td>
                  <td>R$ { parseFloat(produto.VR_UNITARIO).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.') }</td>
                  <td>
                    <Link to="#" onClick={()=>props.select(produto.PRODUTO_ID)} title="EDITAR PRODUTO" data-bs-toggle="modal" data-bs-target="#md_editarproduto"><i className="fas fa-user-edit icon-action"></i></Link>
                    <Link to="#" onClick={()=>props.image_upload(produto.PRODUTO_ID)} title="UPLOAD DE IMAGEM"><i className="fas fa-file-image icon-action"></i></Link>
                    <Link to="#" onClick={()=>props.delete(produto.PRODUTO_ID)} title="EXCLUIR PRODUTO"><i className="fas fa-trash-alt icon-action red"></i></Link>
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
          <Menu page="produtos" />
        </div>

        <div className="col py-3 me-3">

          <h1>Cadastro de Produtos - {vID} {vDelivery}</h1>
          <div className="row">
            <div className="col-6">
              <div className="mt-2">
                <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#md_novoproduto"><i className="fas fa-address-book"></i> NOVO PRODUTO</button>
                <button onClick={VisualizarPDF} className="btn btn-warning"><i className="fas fa-file-pdf"></i> PDF</button>
              </div>
            </div>
            <div className="col-6">
              <div className="input-group mt-2">
                <input onChange={e => setBusca(e.target.value)} type="text" className="form-control" placeholder="Produto" aria-describedby="bt_pesquisar"/>
              </div>
            </div>
          </div>

          <Listagem array={produtos} select={selectById} delete={confirmaExclusao} image_upload={imgUpload} />

          {/* md_novoproduto */}

          <div className="modal fade" id="md_novoproduto" tabIndex="-1" aria-labelledby="titulo_modal" aria-hidden="true">
            <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
              <div className="modal-content">

                <div className="modal-header">
                  <h5 className="modal-title" id="titulo_modal">NOVO PRODUTO</h5>
                  <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Fechar"></button>
                </div>

                <div className="modal-body">
                  <form>
                    <div className="row">

                      <div className="col-sm-6">
                        <div className="mb-2">
                          <label htmlFor="produto_nome" className="form-label">Nome do Produto</label>
                          <input onChange={e => setProdutoNome(e.target.value)} type="text" className="form-control" id="produto_nome" />
                        </div>
                        <div className="mb-2">
                          <label htmlFor="descricao" className="form-label">Descrição</label>
                          <textarea onChange={e => setDescricao(e.target.value)} type="text" className="form-control" style={{height: 90}} rows="3" id="descricao" ></textarea>
                        </div>
                        <div className="mb-2">
                          <label htmlFor="vr_unitario" className="form-label">Valor Unitário</label>
                          <input onChange={e => setVrUnitario(e.target.value)} type="text" className="form-control" id="vr_unitario" />
                        </div>

                        <div className="mb-2">
                          <p>Listar itens extras? (se houver para este produto)</p>
                          <div className="d-flex align-items-center">
                            <div className="form-check me-3">
                              <input 
                                onChange={e => setItensExtras("S")} 
                                type="radio" 
                                className="form-check-input" 
                                id="itens_extras_sim" 
                                name="itens_extras" 
                                checked={itens_extras === "S"} 
                                required 
                              />
                              <label htmlFor="itens_extras_sim" className="form-check-label">Sim</label>
                            </div>
                            <div className="form-check"> 
                              <input 
                                onChange={e => setItensExtras("N")} 
                                type="radio" 
                                className="form-check-input" 
                                id="itens_extras_nao" 
                                name="itens_extras" 
                                checked={itens_extras === "N"} 
                                required 
                              />
                              <label htmlFor="itens_extras_nao" className="form-check-label">Não</label>
                            </div>
                          </div>
                        </div>

                        <div className="mb-2">
                          <p>Acrescentar obs. p/ este produto no pedido?</p>
                          <div className="d-flex align-items-center">
                            <div className="form-check me-3">
                              <input onChange={e => setItensObs("S")} type="radio" className="form-check-input" id="itens_obs_sim" name="itens_obs" checked={itens_obs === "S"} required />
                              <label htmlFor="itens_obs_sim" className="form-check-label">Sim</label>
                            </div>
                            <div className="form-check"> 
                              <input onChange={e => setItensObs("N")} type="radio" className="form-check-input" id="itens_obs_nao" name="itens_obs" checked={itens_obs === "N"} required />
                              <label htmlFor="itens_obs_nao" className="form-check-label">Não</label>
                            </div>
                          </div>
                        </div>

                      </div>

                      <div className="col-sm-6">
                        Imagem do Produto:<br/>
                        <img 
                          className="ref" 
                          src={ url_imagem || "https://placehold.co/500" } 
                          alt="Imagem do Produto" 
                          style={{ width: '100%', maxWidth: '320px', height: 'auto', maxHeight: '224px', objectFit: 'contain' }}
                        />
                        <br/><br/>
                        <button 
                          type="button" 
                          className="btn btn-success" 
                          onClick={uploadImageForNewProduct}
                        >
                          <i className="fas fa-upload"></i> ADICIONAR IMAGEM
                        </button>
                        {url_imagem && (
                          <button 
                            type="button" 
                            className="btn btn-warning ms-2" 
                            onClick={() => setUrlImagem('')}
                          >
                            <i className="fas fa-trash"></i> REMOVER
                          </button>
                        )}
                      </div>

                    </div>
                    {msg.length > 0 ? <div className="alert alert-danger mt-2" role="alert">{msg}</div> : null}
                    {success === 'S' ? <Navigate to="/app/produtos" replace={true} /> : null}
                  </form>
                </div>

                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary ml-2" data-bs-dismiss="modal" onClick={img_reset}>CANCELAR</button>
                  <button type="button" className="btn btn-primary ml-2" data-bs-dismiss="modal" onClick={Cadastrar}>SALVAR</button>
                </div>

              </div>
            </div>
          </div>

          {/* md_editarproduto */}

          <div className="modal fade" id="md_editarproduto" tabIndex="-1" aria-labelledby="titulo_modal" aria-hidden="true">
            <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
              <div className="modal-content">

                <div className="modal-header">
                  <h5 className="modal-title" id="titulo_modal">EDITAR PRODUTO</h5>
                  <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Fechar"></button>
                </div>

                <div className="modal-body">
                  <form>
                    <div className="row">

                      <div className="col-sm-6">
                        <div className="mb-2">
                          <label htmlFor="produto_nome" className="form-label">Nome do Produto</label>
                          <input onChange={e => setProdutoNome(e.target.value)} value={produto_nome} type="text" className="form-control text-primary" id="produto_nome" />
                        </div>
                        <div className="mb-2">
                          <label htmlFor="descricao" className="form-label">Descrição</label>
                          <textarea onChange={e => setDescricao(e.target.value)} value={descricao} className="form-control text-primary" style={{height: 90}} rows="3" id="descricao" ></textarea>
                        </div>
                        <div className="mb-2">
                          <label htmlFor="vr_unitario" className="form-label">Valor Unitário</label>
                          <input onChange={e => setVrUnitario(e.target.value)} value={vr_unitario} type="text" className="form-control text-primary" id="vr_unitario" />
                        </div>

                        <div className="mb-2">
                          <p>Listar itens extras? (se houver para este produto)</p>
                          <div className="d-flex align-items-center">
                            <div className="form-check me-3">
                              <input 
                                onChange={e => setItensExtras("S")} 
                                type="radio" 
                                className="form-check-input" 
                                id="itens_extras_sim" 
                                name="itens_extras" 
                                checked={itens_extras === "S"} 
                                required 
                              />
                              <label htmlFor="itens_extras_sim" className="form-check-label">Sim</label>
                            </div>
                            <div className="form-check">
                              <input 
                                onChange={e => setItensExtras("N")} 
                                type="radio" 
                                className="form-check-input" 
                                id="itens_extras_nao" 
                                name="itens_extras" 
                                checked={itens_extras === "N"} 
                                required 
                              />
                              <label htmlFor="itens_extras_nao" className="form-check-label">Não</label>
                            </div>
                          </div>
                        </div>

                        <div className="mb-2">
                          <p>Acrescentar obs. p/ este produto no pedido?</p>
                          <div className="d-flex align-items-center">
                            <div className="form-check me-3">
                              <input onChange={e => setItensObs("S")} type="radio" className="form-check-input" id="itens_obs_sim" name="itens_obs" checked={itens_obs === "S"} required />
                              <label htmlFor="itens_obs_sim" className="form-check-label">Sim</label>
                            </div>
                            <div className="form-check"> 
                              <input onChange={e => setItensObs("N")} type="radio" className="form-check-input" id="itens_obs_nao" name="itens_obs" checked={itens_obs === "N"} required />
                              <label htmlFor="itens_obs_nao" className="form-check-label">Não</label>
                            </div>
                          </div>
                        </div>

                      </div>

                      <div className="col-sm-6">
                        Imagem do Produto:<br/>
                        <img 
                          className="ref" 
                          src={ url_imagem || "https://placehold.co/450" } 
                          alt="Imagem do Produto" 
                          style={{ width: '100%', maxWidth: '320px', height: 'auto', maxHeight: '224px', objectFit: 'contain' }}
                        />
                        <br/><br/>
                        <button 
                          type="button" 
                          className="btn btn-success" 
                          onClick={() => imgUpload(produto_id)}
                        >
                          <i className="fas fa-upload"></i> ALTERAR IMAGEM
                        </button>
                      </div>

                    </div>
                    {msg.length > 0 ? <div className="alert alert-danger mt-2" role="alert">{msg}</div> : null}
                    {success === 'S' ? <Navigate to="/app/produtos" replace={true} /> : null}
                  </form>
                </div>

                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={img_reset}>CANCELAR</button>
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
