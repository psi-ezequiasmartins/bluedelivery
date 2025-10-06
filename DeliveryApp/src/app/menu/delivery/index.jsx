/**
 * src/app/menu/delivery/index.jsx
 */

import React, { useState, useEffect } from "react";
import InputMask from 'react-input-mask';
import Menu from "../../../components/menu";
import './index.css';

import api from "../../../config/apiAxios";

function Delivery() {
  const vDelivery = localStorage.getItem("vDelivery");
  const vID = localStorage.getItem("vID");

  const [delivery, setDelivery] = useState([]);

  const [delivery_id, setDeliveryID] = useState(delivery?.DELIVERY_ID || vID);
  const [delivery_nome, setDeliveryNome] = useState(delivery?.DELIVERY_NOME || vDelivery);
  const [plano, setPlanoAssinatura] = useState(delivery?.PLANO || "BASIC");
  const [situacao, setSituacao] = useState(delivery?.SITUACAO || "ATIVO");
  const [categoria, setCategoria] = useState(delivery?.CATEGORIA_ID || 101);
  const [responsavel, setResponsavel] = useState(delivery?.RESPONSAVEL || "");
  const [email, setEmail] = useState(delivery?.EMAIL || "");
  const [telefone, setTelefone] = useState(delivery?.TELEFONE || "");
  const [horario, setHorario] = useState(delivery?.HORARIO || "");
  const [min_delivery_time, setMinDeliveryTime] = useState(delivery?.MIN_DELIVERY_TIME || 15);
  const [max_delivery_time, setMaxDeliveryTime] = useState(delivery?.MAX_DELIVERY_TIME || 45);
  const [taxa_entrega, setTaxaEntrega] = useState(delivery?.TAXA_ENTREGA || 5.0);
  const [rating, setRating] = useState(delivery?.RATING || 4.9);
  const [url_imagem, setUrlImagem] = useState(delivery?.URL_IMAGEM || "");
  const [CEP, setCep] = useState(delivery?.CEP || "");
  const [endereco, setEndereco] = useState(delivery?.ENDERECO || "");
  const [numero, setNumero] = useState(delivery?.NUMERO || "");
  const [complemento, setComplemento] = useState(delivery?.COMPLEMENTO || "");
  const [bairro, setBairro] = useState(delivery?.BAIRRO || "");
  const [cidade, setCidade] = useState(delivery?.CIDADE || "");
  const [UF, setUf] = useState(delivery?.UF || "");

  const [msg, setMsg] = useState({ text: '', type: 0 });

  async function loadDeliveryInfo() {
    if (vID) {
      await api.get(`/api/delivery/${vID}`)
        .then((response) => {
          setDelivery(response.data);

          setDeliveryID(response.data.DELIVERY_ID);
          setDeliveryNome(response.data.DELIVERY_NOME);
          setPlanoAssinatura(response.data.PLANO);
          setSituacao(response.data.SITUACAO);
          setCategoria(response.data.CATEGORIA_ID)
          setResponsavel(response.data.RESPONSAVEL);
          setEmail(response.data.EMAIL);
          setTelefone(response.data.TELEFONE);
          setHorario(response.data.HORARIO);
          setMinDeliveryTime(response.data.MIN_DELIVERY_TIME);
          setMaxDeliveryTime(response.data.MAX_DELIVERY_TIME);
          setRating(response.data.RATING);
          setTaxaEntrega(response.data.TAXA_ENTREGA);
          setUrlImagem(response.data.URL_IMAGEM);
          setEndereco(response.data.ENDERECO);
          setNumero(response.data.NUMERO);
          setComplemento(response.data.COMPLEMENTO);
          setBairro(response.data.BAIRRO);
          setCidade(response.data.CIDADE);
          setUf(response.data.UF);
          setCep(response.data.CEP);
          console.count = 0;
        }).catch((error) => {
          console.log(error);
        })
    }
  }

  useEffect(() => {
    loadDeliveryInfo(); // eslint-disable-next-line
  }, [vID])

  async function saveDeliveryInfo() {
    if (delivery_nome.length === 0) {
      setMsg({ text: 'Favor preencher o campo Nome do Delivery', type: 1 });
      return;
    }
    const jsonData = {
      "DELIVERY_ID": delivery_id,
      "DELIVERY_NOME": delivery_nome,
      "PLANO": plano,
      "SITUACAO": situacao === "ATIVO" ? 1 : 0, // Convertendo para BIT (1/0)
      "CATEGORIA_ID": categoria,
      "RESPONSAVEL": responsavel,
      "EMAIL": email,
      "TELEFONE": telefone,
      "HORARIO": horario,
      "MIN_DELIVERY_TIME": min_delivery_time,
      "MAX_DELIVERY_TIME": max_delivery_time,
      "RATING": rating,
      "TAXA_ENTREGA": taxa_entrega,
      "URL_IMAGEM": url_imagem,
      "CEP": CEP,
      "ENDERECO": endereco,
      "NUMERO": numero,
      "COMPLEMENTO": complemento,
      "BAIRRO": bairro,
      "CIDADE": cidade,
      "UF": UF
    };
    if (!vID) {
      // Pré-cadastro de novo delivery
      await api.post('/delivery-app/delivery/pre-cadastro', jsonData)
        .then((response) => {
          setMsg({ text: 'Pré-cadastro realizado com sucesso!', type: 0 });
          // Se backend retornar o novo ID, pode salvar no localStorage
          if (response.data?.DELIVERY_ID) {
            localStorage.setItem('vID', response.data.DELIVERY_ID);
          }
        })
        .catch((error) => {
          setMsg({ text: 'Erro no pré-cadastro: ' + error, type: 1 });
        });
    } else {
      // Atualização de delivery existente
      console.log('🎯 Atualizando delivery ID:', vID);
      console.log('📦 Dados enviados:', jsonData);
      
      await api.put(`/delivery-app/update/delivery/${vID}`, jsonData)
        .then((response) => {
          console.log('✅ Resposta do backend:', response.data);
          setMsg({ text: 'Dados atualizados com sucesso!', type: 0 });
        })
        .catch((error) => {
          console.error('💥 Erro ao atualizar delivery:', error);
          let errorMessage = 'Erro desconhecido';
          
          if (error.response) {
            errorMessage = `Erro ${error.response.status}: ${error.response.data?.message || 'Erro no servidor'}`;
          } else if (error.request) {
            errorMessage = 'Erro de conexão com o servidor';
          } else {
            errorMessage = error.message;
          }
          
          setMsg({ text: errorMessage, type: 1 });
        });
    }
  }

  function phoneMask(value) {
    if (!value) return "";
    value = value.replace(/\D/g, '');
    value = value.replace(/(\d{2})(\d)/, "($1) $2");
    value = value.replace(/(\d)(\d{4})$/, "$1-$2");
    return value;
  }

  async function SearchAddressByCEP(cep) {
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      if (!response.ok) throw new Error('Erro na consulta do CEP');
      const data = await response.json();
      if (data.erro) throw new Error('CEP não encontrado');
      return data;
    } catch (error) {
      console.error('Erro na busca do endereço pelo CEP:', error);
      return null;
    }
  }

  async function handleInputPhone(e) {
    setTelefone(phoneMask(e.target.value));
  }

  async function handleInputCEP(e) {
    setCep(e.target.value);
    if (e.target.value.length === 9) {
      const cleanedCEP = e.target.value.replace(/\D/g, ''); // Remove non-numeric characters
      const addressData = await SearchAddressByCEP(cleanedCEP);
      if (addressData) {
        setEndereco(addressData.logradouro); setNumero(''); setComplemento('');
        setBairro(addressData.bairro);
        setCidade(addressData.localidade);
        setUf(addressData.uf);
      } else {
        setMsg({ text: 'CEP não encontrado ou inválido', type: 1 });
      }
    }
  }

  useEffect(() => {
    if (msg) {
      const timer = setTimeout(() => {
        setMsg({text: '', type: 0});
      }, 3000); // Oculta a mensagem após 3 segundos
      return () => clearTimeout(timer); // Limpa o timer se o componente for desmontado
    }
  }, [msg]);

  return (
    <div className="container-fluid">
      <div className="row flex-nowrap">

        <div className="col-auto col-md-3 col-xl-2 px-sm-2 px-0">
          <Menu page="delivery" />
        </div>

        <div className="col py-3 me-3">
          <div className='shadow-sm delivery'>

            <h1>DADOS DO DELIVERY</h1>

            <form>
              <div className="row">

                <div className="mb-2">
                  <label htmlFor="delivery_nome" className="form-label">Nome do Delivery</label>
                  <input type="text" id="delivery_nome" name="DELIVERY_NOME" value={delivery_nome} className="form-control text-primary" onChange={e => setDeliveryNome(e.target.value)} />
                </div>

                <div className="mb-2">
                  <label htmlFor="plano" className="form-label">Plano*</label>
                  <select id="plano" name="PLANO" value={plano} className="form-select text-primary" onChange={e => setPlanoAssinatura(e.target.value)}  >
                    <option value="BASIC">Plano Free | Até 10 produtos (incluindo bebidas): Taxa de Adesão: R$ 0,00 + 0,99 por pedido</option>
                    <option value="PRO">Plano Pro | Até 30 produtos (incluindo bebidas): Taxa de Adesão R$ 79,90 + 0,99 por pedido</option>
                    <option value="PREMIUM">Plano Premium | Até 50 Produtos (incluindo bebidas): Taxa de Adesão R$ 579,90 + 0,99 por pedido</option>
                  </select>
                  <input type="hidden" id="status" name="STATUS" value={situacao} onChange={e => setSituacao(e.target.value)} />
                </div>

        <div className="row text-center">
          <div className="titulo">
            <h1>Planos de Adesão</h1>
            <p>Taxa de Adesão (pagamento único) a partir de R$ 89,90 (Plano PRO), <br/>escolha o plano conforme a sua necessidade:</p>
          </div>
        </div>

        <div className="container">

          <div className="row text-center">

            <div className="col-lg-4">
              <div className="card">
                <div className="card-header">
                  <h1>Free</h1>
                </div>
                <div className="card-body">
                  <h2>R$ 0,00</h2>  
                  <h5>+ R$ 0,99 por pedido</h5>
                  <p>Até 10 produtos</p>
                  <p>Cadastre-se grátis e venha<br/>fazer parte do nosso catálogo!<br/>Suporte Offline (por email)</p>
                </div>
              </div>
            </div> 

            <div className="col-lg-4">
              <div className="card">
                <div className="card-header">
                  <h1>Pro</h1>
                </div>
                <div className="card-body">
                  <h2>R$ 89,90</h2>  
                  <h5>+ R$ 0,99 por pedido</h5>
                  <p>Até 30 produtos</p>
                  <p>Suporte Online:<br/>(Google Meet/WhatsApp) + Cardápio Online*</p>
                </div>
              </div>
            </div>

            <div className="col-lg-4">
              <div className="card">
                <div className="card-header">
                  <h1>Premium</h1>
                </div>
                <div className="card-body">
                  <h2>R$ 489,90</h2>  
                  <h5>+ R$ 0,99 por pedido</h5>
                  <p>Até 50 produtos</p>
                  <p>Suporte Online:<br/>(Google Meet/WhatsApp) + <br/>Cardápio Online* + Google Ads**</p>
                </div>
              </div>
            </div>
            <p></p>
            <strong>(*) Cardápio Online personalizado c/ a Logo do Delivery</strong><br/>
            <strong>(**) Campanha de Publicidade no Google Ads</strong>
            <p>Promova o seu Delivery em sua região através da nossa campanha no Google Ads,<br/>para saber mais a respeito, entre em contato por favor.</p>

          </div>
        </div>

                <div className="mb-2">
                  <label htmlFor="categoria" className="form-label">Categoria*</label>
                  <select id="categoria" name="CATEGORIA" value={categoria} className="form-select text-primary" readOnly>
                    <option value="101">Ofertas</option>
                    <option value="102">Sanduiches</option>
                    <option value="103">Hotdog</option>
                    <option value="104">Bebidas</option>
                    <option value="105">Pratos e Porções</option>
                    <option value="106">Sushi</option>
                    <option value="107">Frutas e Verduras</option>
                    <option value="108">Medicamentos</option>
                    <option value="109">Gás de Cozinha</option>
                    <option value="110">Floricultura</option>
                    <option value="111">Água Mineral</option>
                  </select>
                </div>

                <div className="mb-2">
                  <label htmlFor="responsavel" className="form-label">Responsável</label>
                  <input type="text" id="responsavel" name="RESPONSAVEL" value={responsavel} className="form-control text-primary" onChange={e => setResponsavel(e.target.value)} />
                </div>

                <div className="row mb-2">
                  <div className="col-8">
                    <label htmlFor="email" className="form-label">E-mail</label>
                    <input type="email" id="email" name="EMAIL" className="form-control text-primary" onChange={e => setEmail(e.target.value)} value={email} />
                  </div>
                  <div className="col-4">
                    <label htmlFor="telefone" className="form-label">Telefone</label>
                    <input type="text" id="telefone" name="TELEFONE" value={telefone} className="form-control text-primary" onChange={e => handleInputPhone(e)} />
                  </div>
                </div>

                <div className="mb-2">
                  <label htmlFor="horario" className="form-label">Horário</label>
                  <input type="text" id="horario" name="HORARIO" value={horario} className="form-control text-primary" onChange={e => setHorario(e.target.value)} />
                </div>

                <div className="row mb-2">
                  <div className="col-3">
                    <label htmlFor="mindeliverytime" className="form-label">Tempo Mín.</label>
                    <input type="text" id="mindeliverytime" name="MIN_DELIVERY_TIME" value={min_delivery_time} className="form-control text-primary" onChange={e => setMinDeliveryTime(e.target.value)} />
                  </div>
                  <div className="col-3">
                    <label htmlFor="maxdeliverytime" className="form-label">Tempo Máx.</label>
                    <input type="text" id="maxdeliverytime" name="MAX_DELIVERY_TIME" value={max_delivery_time} className="form-control text-primary" onChange={e => setMaxDeliveryTime(e.target.value)} />
                  </div>
                  <div className="col-3">
                    <label htmlFor="rating" className="form-label">Pontuação (avaliação)*</label>
                    <select id="rating" name="RATING" value={rating} className="form-select text-primary" readOnly>
                      <option value="4.9">Ótima</option>
                      <option value="3.5">Muito Boa</option>
                      <option value="2.5">Regular</option>
                      <option value="1.0">Fraca</option>
                      <option value="0.5">Ruim</option>
                      <option value="0.1">Péssima</option>
                    </select>
                  </div>
                  <div className="col-3">
                    <label htmlFor="taxaentrega" className="form-label">Taxa Entrega</label>
                    <input type="text" id="taxaentrega" name="TAXA_ENTREGA" value={taxa_entrega} className="form-control text-primary" onChange={e => setTaxaEntrega(e.target.value)} />
                    <input type="hidden" id="urlimagem" name="URL_IMAGEM" value={url_imagem} onChange={e => setUrlImagem(e.target.value)} />
                  </div>
                </div>

                <div className="row mb-2">
                  <div className="col-md-3">
                    <label htmlFor="CEP" className="form-label">CEP</label>
                    <InputMask mask="99999-999" id="CEP" name="CEP" value={CEP} className="form-control text-primary" onChange={e => handleInputCEP(e)} />
                  </div>
                </div>

                <div className="row mb-2">
                  <div className="col-md-6">
                    <label htmlFor="endereco" className="form-label">Endereço</label>
                    <input type="text" id="endereco" name="ENDERECO" value={endereco} className="form-control text-primary" onChange={e => setEndereco(e.target.value)} />
                  </div>
                  <div className="col-md-3">
                    <label htmlFor="numero" className="form-label">Número</label>
                    <input type="text" id="numero" name="NUMERO" value={numero} className="form-control text-primary" onChange={e => setNumero(e.target.value)} />
                  </div>
                  <div className="col-md-3">
                    <label htmlFor="complemento" className="form-label">Complemento</label>
                    <input type="text" id="complemento" name="COMPLEMENTO" value={complemento} className="form-control text-primary" onChange={e=>setComplemento(e.target.value)} />
                  </div>
                </div>

                <div className="row mb-2">
                  <div className="col-md-6">
                    <label htmlFor="bairro" className="form-label">Bairro</label>
                    <input type="text" id="bairro" name="BAIRRO" value={bairro} className="form-control text-primary" onChange={e => setBairro(e.target.value)} />
                  </div>
                  <div className="col-md-3">
                    <label htmlFor="cidade" className="form-label">Cidade</label>
                    <input type="text" id="cidade" name="CIDADE" value={cidade} className="form-control text-primary" onChange={e => setCidade(e.target.value)} />
                  </div>
                  <div className="col-md-3">
                    <label htmlFor="UF" className="form-label">UF</label>
                    <input type="text" id="UF" name="UF" value={UF} className="form-control text-primary" onChange={e => setUf(e.target.value)} />
                  </div>
                </div>

              </div>
            </form>

            <button type="button" className="btn btn-dark" onClick={saveDeliveryInfo} >{!vID ? 'PRÉ-CADASTRAR DELIVERY' : 'SALVAR DADOS'}</button>

            {msg.text && (
              <div className={msg.type !== 0 ? "alert alert-danger" : "alert alert-info"} role="alert">
                {msg.text}
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  )
}

export default Delivery;

/* 
  const [latitude, setLatitude] = useState(delivery?.LATITUDE || -19.92273710527297); 
  const [longitude, setLongitude] = useState(delivery?.LONGITUDE || -43.945118685204825);
...
  setLatitude(response.data.Latitude);
  setLongitude(response.data.Longitude);
...
  "LATITUDE": latitude, 
  "LONGITUDE": longitude,
...
<div className="row">
  <div className="col-6">
    <label htmlFor="latitude" className="form-label">LATITUDE</label>
    <input onChange={e => setLatitude(e.target.value)} value={latitude} type="text" className="form-control" id="latitude" />
  </div>
  <div className="col-6">
    <label htmlFor="longitude" className="form-label">LONGITUDE</label>
    <input onChange={e => setLongitude(e.target.value)} value={longitude} type="text" className="form-control" id="longitude" />
  </div>
</div>

<div className="mb-2">
  <p></p>
  <p>(*) Alguns campos são protegidos (somente para leitura), para atualizar e/ou modificá-los, entre em contato conosco.</p>
  <p>Como obter as suas coordenadas no Google Maps:</p>
  <p>
    1. No computador, abra o link abaixo para Google Maps.<br/>
    2. Digite o seu endereço na caixa de pesquisa (busca) do Mapa, será apontado um marcador (ícone na cor vermelha) que vc deverá clicar com o botao direito do mouse, ou tocar e aguardar abrir uma janela pop-up. A latitude e a longitude vão aparecer no formato decimal na parte superior.<br/>
    3. Para copiar as coordenadas automaticamente, clique (ou toque) na latitude e longitude informadas.
  </p>
  <p>* <a href="https://maps.google.com/" target="_blank" rel="noreferrer">Clique aqui</a> para acessar o Google Maps</p>
</div> 

*/

