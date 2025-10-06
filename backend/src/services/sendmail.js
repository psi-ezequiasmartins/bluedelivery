/**
* src/services/sendmail.js
*/

const express = require("express");
const authMiddleware = require('../auth');
const nodemailer = require('nodemailer');

const router = express.Router();

router.use(authMiddleware);

// NodeMailer

router.post('/send-message', async (request, response) => {
    const { nome, telefone } = request.body;
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'ezequiasmartins@gmail.com',
            pass: 'ffij nbcu ymku jueh',
        },
    });
    const mailOptions = {
        from: 'ezequiasmartins@gmail.com',
        to: 'psi.software.adm@gmail.com',
        subject: 'Contato capturado via botão WhatsApp (website)',
        text: `Nome: ${nome}\nTelefone: ${telefone}`,
    };
    try {
        await transporter.sendMail(mailOptions);
        console.log('E-mail enviado com sucesso!');
        response.sendStatus(200);
    } catch (error) {
        console.error('Erro ao enviar e-mail:', error);
        response.sendStatus(500);
    }
});

module.exports = router;