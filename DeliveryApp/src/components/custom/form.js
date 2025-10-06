/**
 * custom-form.js
 */

import Swal from 'sweetalert2';

function maskPhoneNumber(value) {
  if(!value) { 
    return '' 
  } else { 
    return value.replace(/[\D]/g, '')
    .replace(/(\d{2})(\d)/, '($1) $2')
    .replace(value[5] !== "9" ? /(\d{4})(\d)/ : /(\d{5})(\d)/, '$1-$2')
    .replace(/(-\d{4})(\d+?)/, '$1')
  }
}

function applyPhoneNumberMask(input) {
  input.value = maskPhoneNumber(input.value)
}

async function formTelegram() {
  // const { value: formValues } = 
  await Swal.fire({
    theme: 'dark',
    title: 'Contato via Telegram',
    html: 
      '<p>Por favor, informe seu Nome e Telefone</p>'+
      '<input id="swal-input1" class="swal2-input" placeholder="Nome" >' +
      `<input id="swal-input2" class="swal2-input" placeholder="Telefone" oninput=${applyPhoneNumberMask(this)} >`,
    showCancelButton: true,
    cancelButtonText: 'CANCELAR',
    focusConfirm: false,
    preConfirm: () => {
      const FullName = Swal.getPopup().querySelector('#swal-input1').value;
      const TelephoneNumber = Swal.getPopup().querySelector('#swal-input2').value;
      if (!FullName || !TelephoneNumber) {
        Swal.showValidationMessage('Por favor, preencha o Nome e Telefone!');
      }
      return { nome: FullName, telefone: TelephoneNumber };
    }
  }).then(async(result) => {
    if (result.isConfirmed) {
      const nome = result.value.nome;
      const telefone = result.value.telefone;
      // Enviando os dados para o servidor Node.js
      const response = await fetch('https://srv.deliverybairro.com/send-message', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Accept-encoding': 'gzip, deflate',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nome, telefone }),
      });
      if (response.ok) {
        // Redirecione para a API do WhatsApp
        window.location.href = `https://t.me/psi_software`;
      }
    } else if (formValues) {
      Swal.fire({
        theme: 'dark',
        title: 'Valores do Formulário',
        text: JSON.stringify(formValues),
        icon: 'info'
      });
    }
  })
}

async function formWhatsApp() {
  const { value: formValues } = await Swal.fire({
    theme: 'dark',
    title: 'Contato via WhatsApp',
    html: 
      '<p>Por favor, informe seu Nome e Telefone</p>'+
      '<input id="swal-input1" class="swal2-input" placeholder="Nome" >' +
      '<input id="swal-input2" class="swal2-input" placeholder="Telefone" oninput="applyPhoneNumberMask(this)" >',
    showCancelButton: true,
    cancelButtonText: 'CANCELAR',
    focusConfirm: false,
    preConfirm: () => {
      const FullName = Swal.getPopup().querySelector('#swal-input1').value;
      const TelephoneNumber = Swal.getPopup().querySelector('#swal-input2').value;
      if (!FullName || !TelephoneNumber) {
        Swal.showValidationMessage('Por favor, preencha o Nome e Telefone!');
      }
      return { nome: FullName, telefone: TelephoneNumber };
    }
  }).then(async(result) => {
    if (result.isConfirmed) {
      const nome = result.value.nome;
      const telefone = result.value.telefone;
      // Enviando os dados para o servidor Node.js
      const response = await fetch('https://srv.deliverybairro.com/send-message', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Accept-encoding': 'gzip, deflate',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nome, telefone }),
      });
      if (response.ok) {
        // Redirecione para a API do WhatsApp
        window.location.href = `https://api.whatsapp.com/send?phone=5531984107540&text=Olá! Meu nome é ${nome}, gostaria de mais informações por favor. (clique aqui p/ enviar) ->`;
      }
    } else if (formValues) {
      Swal.fire({
        theme: 'dark',
        title: 'Valores do Formulário',
        text: JSON.stringify(formValues),
        icon: 'info'
      });
    }
  })
}

export {
  formWhatsApp, formTelegram
}

// import { formWhatsApp, formTelegram } from '../src/components/custom/form'; (src/index.jsx)

// <script type="text/javascript" src="./custom-form.js"></script>
// <a href="#telegram" id="buttomTelegram" onclick={formTelegram} className="telegram-float">
//   <svg className="telegram-icon">
//     <path d="M0,17.46A3.22,3.22,0,0,1,1.87,16q4.62-1.8,9.26-3.56L42.84.25A3.55,3.55,0,0,1,43.61,0,2,2,0,0,1,46,2.18a17.08,17.08,0,0,1-.45,2.91Q42.3,20.44,39,35.77a6.38,6.38,0,0,1-.53,1.52,1.79,1.79,0,0,1-2.27,1,4.87,4.87,0,0,1-1.36-.65c-3.3-2.39-6.58-4.8-9.87-7.21l-.42-.31c-.13.12-.26.22-.37.33l-5,4.81a2.46,2.46,0,0,1-1.83.75c0-.65.08-1.29.13-1.92.2-2.81.39-5.62.61-8.43a1,1,0,0,1,.3-.59Q27.9,16.42,37.47,7.84s.1-.07.13-.12L38,7.05a2.48,2.48,0,0,0-.82-.14,2.47,2.47,0,0,0-.89.41q-11.9,7.42-23.8,14.87a.85.85,0,0,1-.64.11Q6.73,20.76,1.68,19.17A2.72,2.72,0,0,1,0,18Z" />
//   </svg>
// </a>
// <a href="#whatsapp" id="buttomWhatsapp" onclick={formWhatsApp} className="whatsapp-float">
//   <svg className="whatsapp-icon">
//     <path d="M.33,48.33,3.06,35.62A23.67,23.67,0,0,1,0,24,24.06,24.06,0,0,1,24.12,0h0a23.95,23.95,0,1,1,0,47.89,24.33,24.33,0,0,1-11-2.61ZM13.7,41.08l.67.36a20.3,20.3,0,0,0,9.74,2.49A20,20,0,1,0,4,24a19.78,19.78,0,0,0,2.89,10.3l.41.68L5.52,43Z" />
//     <path d="M34.67,31.75C34.22,33,32,34.21,31,34.31S30,35.12,24.5,33s-9-7.77-9.27-8.13S13,21.92,13,19.27a6.08,6.08,0,0,1,1.89-4.5,2,2,0,0,1,1.45-.67c.36,0,.72.05,1,.05s.77-.18,1.22.9,1.54,3.72,1.67,4a1,1,0,0,1,.05.95,3.53,3.53,0,0,1-.54.89c-.28.32-.58.71-.82.95s-.55.56-.24,1.09a16.48,16.48,0,0,0,3,3.73,14.93,14.93,0,0,0,4.37,2.68c.54.26.86.22,1.17-.14s1.36-1.58,1.72-2.12.72-.45,1.22-.26,3.17,1.47,3.71,1.74.9.41,1,.63A4.4,4.4,0,0,1,34.67,31.75Z" />
//   </svg>
// </a> 

// import * as Sentry from '@sentry/react';

// Sentry.init({
//   enableInExpoDevelopment: true,
//   dsn: "https://76cab4f207161a649d922c8690e95e7f@o4505409112309760.ingest.sentry.io/4505697799897088",
//   tracesSampleRate: 1.0,
// });
