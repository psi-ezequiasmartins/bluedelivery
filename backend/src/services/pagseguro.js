/**
 * pagseguro.js
 */

const express = require("express");
const authMiddleware = require('../auth');
const axios = require("axios");

const router = express.Router();

const PAGSEGURO_EMAIL = process.env.PGS_EMAIL;
const PAGSEGURO_TOKEN = process.env.PGS_TOKEN;
const api = axios.create({
    baseURL: 'https://sandbox.api.pagseguro.com',
    headers: {
        'Authorization': `Bearer ${PAGSEGURO_TOKEN}`,
        'Content-Type': 'application/json'
    }
});

/**
* Private routes
*/

router.use(authMiddleware);

// Criar Pedido (pagamento)

router.post('/checkout/orders', async (request, result) => {
    const order = request.body;
    const data = JSON.stringify({
        reference_id: order.PedidoID,
        customer: {
            name: order.Nome,
            email: order.Email,
            tax_id: order.Cpf,
            phones: [{
                country: order.phoneCountry, 
                area: order.phoneArea, 
                number: order.phoneNumber, 
                type: 'MOBILE'
            }]
        },
        items: order.itens, // [{ reference_id: item.ItemID, name: item.Produto, quantity: item.Qtd, unit_amount: item.VrUnitario }, {...}, {...}],
        qr_codes: [{amount: {value: order.VrTotal}}],
        shipping: {
            address: {
              street: order?.Address.Endereco,
              number: order?.Addres.Number,
              complement: order?.Address.Complement,
              locality: order?.Addres.Locality,
              city: order?.Address.City,
              region_code: order?.Address.Uf,
              country: 'BRA',
              postal_code: order?.Address.Cep
            }
        },
        notification_urls: ['https://deliverybairro.com/notifications']
    });

    try {
        api.post('/order', data).then(response => {
            console.log(JSON.stringify(response.data));
        }).catch((e) =>{
            console.error(e)
        });
    } catch (error) {
        console.error('Não foi possível concluir pagamento:', error);
    }

});

/** Pagamento via Cartão de Crédito */

router.post('/checkout', async (request, result) => {
    try {
        const paymentData = request.body; // Dados do pagamento recebidos do app React Native
        const response = await axios.post('https://ws.pagseguro.uol.com.br/v2/checkout', null, {
            params: {
                email: PAGSEGURO_EMAIL,
                token: PAGSEGURO_TOKEN,
                currency: 'BRL',
                itemId1: paymentData.itemId,
                itemDescription1: paymentData.itemDescription,
                itemAmount1: paymentData.itemAmount,
                itemQuantity1: paymentData.itemQuantity,
                paymentMode: 'default',
                method: 'creditCard',
                ...paymentData // Outros dados do pagamento
            }
        });
        result.json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;