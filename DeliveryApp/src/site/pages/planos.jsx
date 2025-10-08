import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import emailjs from '@emailjs/browser';
import { Navigate } from 'react-router-dom';

import api from '../../config/apiAxios';

function Planos() {
  const { t } = useTranslation();
  // eslint-disable-next-line

  const [nome, setNome] = useState("");
  const [planoassinatura, setPlanoAssinatura] = useState("BASIC");
  const [situacao, setSituacao] = useState("ATIVO");
  const [categoria, setCategoria] = useState(101);
  const [responsavel, setResponsavel] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [horario, setHorario] = useState("");
  const [mindeliverytime, setMinDeliverTime] = useState(15);
  const [maxdeliverytime, setMaxDeliverTime] = useState(45);
  const [rating, setRating] = useState(4.9);
  const [taxaentrega, setTaxaEntrega] = useState(5.0);
  const [urlimagem, setUrlImagem] = useState("");
  const [endereco, setEndereco] = useState("");
  const [latitude, setLatitude] = useState(-19.92273710527297);
  const [longitude, setLongitude] = useState(-43.945118685204825);
  const [pushToken, setPushToken] = useState("");

  const [success, setSuccess] = useState('N');
  const [msg, setMsg] = useState('');

  async function sendMail() {
    const templateParams = {
      from_name: nome,
      to_name: "Admin",
      nome: nome,
      plano: planoassinatura,
      categoria: categoria,
      responsavel: responsavel,
      endereco: endereco,
      email: email,
      telefone: telefone,
    }
    await emailjs.send("service_akjyijq", "template_i7xi5b3", templateParams, "UY1NfOjNNhttAGWZ_").then((response) => {
      alert("Cadastro enviado com sucesso! ", response.status, response.text);
    }, (error) => {
      console.log('Erro: ', error)
    });
  }

  function Cadastrar() {
    if (nome === "" || responsavel === "" || email === "") {
      setMsg(t('plans.form.error_required'));
    } else {
      const info = {
        "DeliveryID": null,
        "Nome": nome,
        "PlanoAssinatura": planoassinatura,
        "Situacao": situacao,
        "CategoriaID": categoria,
        "Responsavel": responsavel,
        "Email": email,
        "Telefone": telefone,
        "Horario": horario,
        "MinDeliveryTime": mindeliverytime,
        "MaxDeliveryTime": maxdeliverytime,
        "Rating": rating,
        "TaxaEntrega": taxaentrega,
        "UrlImagem": urlimagem,
        "Endereco": endereco,
        "Latitude": latitude,
        "Longitude": longitude,
        "PushToken": pushToken
      }
      api.post('/api/add/delivery', info).then((response) => {
        localStorage.setItem("token", response.data.DeliveryID);
        localStorage.setItem("delivery", response.data.Nome);
        localStorage.setItem("email", response.data.Email);
        sendMail();
      }).then(() => {
        setMsg(t('plans.form.success'));
        setSuccess('S');
      }).catch((error) => {
        setMsg(error.message);
        setSuccess("N");
      })
    }
  }

  return (
    <section id="planos-e-precos">
      <div className="row text-center">
        <div className="titulo">
          <h1>{t('plans.title')}</h1>
          <p>{t('plans.subtitle')}</p>
        </div>
      </div>

      <div className="container">

        <div className="row text-center">

          <div className="col-lg-4">
            <div className="card">
              <div className="card-header">
                <h1>{t('plans.free.title')}</h1>
              </div>
              <div className="card-body">
                <h2>{t('plans.free.price')}</h2>
                <h5>{t('plans.free.fee')}</h5>
                <p>{t('plans.free.products')}</p>
                <p>{t('plans.free.description')}</p>
                <a className="btn btn-lg btn-outline-primary" data-bs-toggle="modal" href="#md_assinatura" role="button">{t('plans.free.button')}</a>
              </div>
            </div>
          </div>

          <div className="col-lg-4">
            <div className="card">
              <div className="card-header">
                <h1>{t('plans.pro.title')}</h1>
              </div>
              <div className="card-body">
                <h2>{t('plans.pro.price')}</h2>
                <h5>{t('plans.pro.fee')}</h5>
                <p>{t('plans.pro.products')}</p>
                <p>{t('plans.pro.description')}</p>
                <a className="btn btn-lg btn-outline-primary" data-bs-toggle="modal" href="#md_assinatura" role="button">{t('plans.pro.button')}</a>
              </div>
            </div>
          </div>

          <div className="col-lg-4">
            <div className="card">
              <div className="card-header">
                <h1>{t('plans.premium.title')}</h1>
              </div>
              <div className="card-body">
                <h2>{t('plans.premium.price')}</h2>
                <h5>{t('plans.premium.fee')}</h5>
                <p>{t('plans.premium.products')}</p>
                <p>{t('plans.premium.description')}</p>
                <a className="btn btn-lg btn-outline-primary" data-bs-toggle="modal" href="#md_assinatura" role="button">{t('plans.premium.button')}</a>
              </div>
            </div>
          </div>
        </div>

      </div>

      <div className="row text-center">
        <div className="titulo">
          <h3>{t('plans.notes.digital_menu')}</h3>
          <h3>{t('plans.notes.google_ads')}</h3>
          <p>{t('plans.notes.google_ads_description')}</p>
        </div>
      </div>

      {/* --- md_assinatura ---*/}
      <div className="modal fade" id="md_assinatura" aria-hidden="true" aria-labelledby="titulo_modal" tabIndex="-1">
        <div className="modal-dialog modal-lg modal-dialog">
          <div className="modal-content">

            <div className="modal-header">
              <h5 className="modal-title" id="titulo_modal">{t('plans.form.modal_title')}</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>

            <div className="modal-body">
              <form>
                <div className="row">
                  <div className="mb-2">
                    <label htmlFor="nome" className="form-label">{t('plans.form.delivery_name')}<font color="#FF0000">*</font></label>
                    <input onChange={e => setNome(e.target.value)} type="text" className="form-control" id="delivery" />
                  </div>
                  <div className="row mb-2">
                    <div className="col-9">
                      <label htmlFor="plano" className="form-label">{t('plans.form.plan')}</label>
                      <select onChange={e => setPlanoAssinatura(e.target.value)} className="form-select" id="plano">
                        <option value="BASIC">{t('plans.form.plans.basic')}</option>
                        <option value="PRO">{t('plans.form.plans.pro')}</option>
                        <option value="PREMIUM">{t('plans.form.plans.premium')}</option>
                      </select>
                      <input onChange={e => setSituacao(e.target.value)} type="hidden" id="status" name="status" value="ATIVO" />
                      <input onChange={e => setUrlImagem(e.target.value)} type="hidden" id="urlimagem" name="urlimagem" value="" />
                    </div>
                    <div className="col-3">
                      <label htmlFor="categoria" className="form-label">{t('plans.form.category')}</label>
                      <select onChange={e => setCategoria(e.target.value)} className="form-select" id="categoria">
                        <option value="101">{t('plans.form.categories.101')}</option>
                        <option value="102">{t('plans.form.categories.102')}</option>
                        <option value="103">{t('plans.form.categories.103')}</option>
                        <option value="104">{t('plans.form.categories.104')}</option>
                        <option value="105">{t('plans.form.categories.105')}</option>
                        <option value="106">{t('plans.form.categories.106')}</option>
                        <option value="107">{t('plans.form.categories.107')}</option>
                        <option value="108">{t('plans.form.categories.108')}</option>
                        <option value="109">{t('plans.form.categories.109')}</option>
                        <option value="110">{t('plans.form.categories.110')}</option>
                        <option value="111">{t('plans.form.categories.111')}</option>
                        <option value="112">{t('plans.form.categories.112')}</option>
                      </select>
                    </div>
                  </div>
                  <div className="mb-2">
                    <label htmlFor="responsavel" className="form-label">{t('plans.form.responsible')}<font color="#FF0000">*</font></label>
                    <input onChange={e => setResponsavel(e.target.value)} type="text" className="form-control" id="responsavel" />
                  </div>
                  <div className="row mb-2">
                    <div className="col-8">
                      <label htmlFor="email" className="form-label">{t('plans.form.email')}<font color="#FF0000">*</font></label>
                      <input onChange={e => setEmail(e.target.value)} type="email" className="form-control" id="email" />
                    </div>
                    <div className="col-4">
                      <label htmlFor="telefone" className="form-label">{t('plans.form.phone')}</label>
                      <input onChange={e => setTelefone(e.target.value)} type="text" className="form-control" id="telefone" />
                    </div>
                  </div>
                  <div className="mb-2">
                    <label htmlFor="horario" className="form-label">{t('plans.form.schedule')}</label>
                    <input onChange={e => setHorario(e.target.value)} type="text" className="form-control" id="horario" />
                  </div>
                  <input onChange={e => setMinDeliverTime(e.target.value)} type="hidden" id="mindeliverytime" name="mindeliverytime" value="15" />
                  <input onChange={e => setMaxDeliverTime(e.target.value)} type="hidden" id="maxdeliverytime" name="maxdeliverytime" value="45" />
                  <input onChange={e => setRating(e.target.value)} type="hidden" id="rating" name="rating" value="4.9" />
                  <input onChange={e => setTaxaEntrega(e.target.value)} type="hidden" id="taxaentrega" name="taxaentrega" value="5" />
                  <div className="mb-2">
                    <label htmlFor="endereco" className="form-label">{t('plans.form.address')}</label>
                    <input onChange={e => setEndereco(e.target.value)} type="text" className="form-control" id="endereco" />
                    <input onChange={e => setLatitude(e.target.value)} type="hidden" id="latitude" name="latitude" value="-19.999999" />
                    <input onChange={e => setLongitude(e.target.value)} type="hidden" id="longitude" name="longitude" value="-43.999999" />
                  </div>
                  <div className="mb-2">
                    <p>{t('plans.form.required_fields')}</p>
                  </div>
                  <input onChange={e => setPushToken(e.target.value)} type="hidden" id="pushToken" name="pushToken" value="" />
                </div>
                {msg.length > 0 ? <div className="alert alert-danger mt-2" role="alert">{msg}</div> : null}
                {success === 'S' ? <Navigate to="/app/login/novo" replace={true} /> : null}
              </form>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">{t('plans.form.cancel')}</button>
              <button type="button" className="btn btn-success" data-bs-dismiss="modal" onClick={Cadastrar}>{t('plans.form.send')}</button>
            </div>

          </div>
        </div>
      </div>

    </section>
  );
}

export default Planos;

/*
    Assinatura 49,90
    !-- INICIO FORMULARIO BOTAO PAGBANK: NAO EDITE OS COMANDOS DAS LINHAS ABAIXO -- 
    <form action="https://pagseguro.uol.com.br/pre-approvals/request.html" method="post">
    <input type="hidden" name="code" value="D56951268585189884B60FB3D4F3D67C" />
    <input type="hidden" name="iot" value="button" />
    <input type="image" src="https://stc.pagseguro.uol.com.br/public/img/botoes/assinaturas/209x48-assinar-azul-assina.gif" name="submit" alt="Pague com PagBank - É rápido, grátis e seguro!" width="209" height="48" />
    </form>
    !-- FINAL FORMULARIO BOTAO PAGBANK --! 

    Assinatura 179,90
    !-- INICIO FORMULARIO BOTAO PAGBANK: NAO EDITE OS COMANDOS DAS LINHAS ABAIXO --!
    <form action="https://pagseguro.uol.com.br/pre-approvals/request.html" method="post">
    <input type="hidden" name="code" value="E0BBDF39242432E224507F9DD48F0BC9" />
    <input type="hidden" name="iot" value="button" />
    <input type="image" src="https://stc.pagseguro.uol.com.br/public/img/botoes/assinaturas/209x48-assinar-azul-assina.gif" name="submit" alt="Pague com PagBank - É rápido, grátis e seguro!" width="209" height="48" />
    </form>
    !-- FINAL FORMULARIO BOTAO PAGBANK --! 


    Assinatura 375,00
    !-- INICIO FORMULARIO BOTAO PAGBANK: NAO EDITE OS COMANDOS DAS LINHAS ABAIXO --!
    <form action="https://pagseguro.uol.com.br/pre-approvals/request.html" method="post">
    <input type="hidden" name="code" value="57C4BA0E3B3B6F200483DFA9A8A37810" />
    <input type="hidden" name="iot" value="button" />
    <input type="image" src="https://stc.pagseguro.uol.com.br/public/img/botoes/assinaturas/209x48-assinar-azul-assina.gif" name="submit" alt="Pague com PagBank - É rápido, grátis e seguro!" width="209" height="48" />
    </form>
    !-- FINAL FORMULARIO BOTAO PAGBANK --!

*/