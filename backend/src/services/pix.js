/**
 * src/extras/pix.js
 */

const express = require("express");
const authMiddleware = require('../auth');
const db = require("../config/database");
const QRCode = require('qrcode');

const router = express.Router();

// Função para calcular CRC16
function calculateCRC16(payload) {
    const polynomial = 0x1021;
    let crc = 0xFFFF;
    // Converte o payload para string    
    for (let i = 0; i < payload.length; i++) {
      crc ^= (payload.charCodeAt(i) << 8);
      for (let j = 0; j < 8; j++) {
          crc = ((crc << 1) ^ (crc & 0x8000 ? polynomial : 0)) & 0xFFFF;
      }
    }
    // Retorna o CRC16 em formato hexadecimal    
    return crc.toString(16).toUpperCase().padStart(4, '0');
};

function validatePixKey(key) {
  // Validação básica de email
  if (key.includes('@')) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(key);
  }
  // Validação de CPF/CNPJ
  if (/^\d+$/.test(key)) {
    return key.length === 11 || key.length === 14;
  }
  // Validação de telefone
  if (key.startsWith('+')) {
    return /^\+55\d{11}$/.test(key);
  }
  return false;
};

function generatePixPayload(config) {
  try {
    const { nome, cidade, chavePix, valor, txid } = config;

    // Função auxiliar para formatar campos EMV
    const formatEMV = (id, value) => {
      if (!value) return '';
      const len = value.toString().length;
      return `${id}${len.toString().padStart(2, '0')}${value}`;
    };

    // Formata o valor monetário (máximo 2 casas decimais)
    const valorNumerico = Number(valor).toFixed(2);
    if (isNaN(valorNumerico)) {
      throw new Error('Valor inválido para PIX');
    }

    // Monta o Payload seguindo especificação EMV
    const merchant = [
      formatEMV('00', 'br.gov.bcb.pix'),
      formatEMV('01', chavePix),
    ].join('');
  
    const additionalData = [
      formatEMV('05', txid),
    ].join('');

    let payload = [
      formatEMV('00', '01'),                     // Payload Format Indicator
      formatEMV('26', merchant),                 // Merchant Account Info
      formatEMV('52', '0000'),                   // Merchant Category Code
      formatEMV('53', '986'),                    // Transaction Currency
      formatEMV('54', valorNumerico),            // Transaction Amount
      formatEMV('58', 'BR'),                     // Country Code
      formatEMV('59', nome.substring(0, 25)),    // Merchant Name (max 25 chars)
      formatEMV('60', cidade.substring(0, 15)),  // Merchant City (max 15 chars)
      formatEMV('62', additionalData),           // Additional Data Field
    ].join('');
    
    // Adiciona o CRC16 no final
    payload += '6304';
    payload += calculateCRC16(payload);
  
    // Debug
    console.log('Payload gerado:', payload);
    console.log('Dados PIX:', {
      nome,
      cidade,
      chavePix,
      valor: valorNumerico,
      txid
    });
  
    return payload;  
  } catch (error) {
    console.error('Erro ao gerar payload PIX:', error);
    throw new Error('Erro ao gerar payload PIX');
  } 
};
  
// Rota para gerar o PIX (PÚBLICA)
router.post('/pix/generate', async (request, response) => {
  try {
    const { orderId, value, description } = request.body;

    // Validações aprimoradas
    if (!orderId || !value || !description) {        
      return response.status(400).json({
        success: false,
        error: 'Dados incompletos'
      });
    }
  
    if (value <= 0 || value > 9999999.99) {
      return response.status(400).json({
        success: false,
        error: 'Valor inválido'
      });
    }

    // Validação da chave PIX
    const pixKey = process.env.PIX_KEY;
    if (!pixKey || !validatePixKey(pixKey)) {
      return response.status(400).json({
          success: false,
          error: 'Chave PIX inválida ou não configurada'
      });
    }

    const txid = `PSI${orderId.toString().padStart(8, '0')}`; 

    // Verifica se o txid já existe no banco de dados
    const [result] = await db.query(
      `SELECT COUNT(*) AS count FROM pix_transactions WHERE txid = ?`, [txid]
    );

    if (result[0].count > 0) {
      return response.status(400).json({
        success: false,
        error: 'Txid já existe. Tente novamente.'
      });
    }

    // Configuração do PIX com valores formatados
    const pixConfig = {
      nome: (process.env.PIX_RECEIVER_NAME || 'psi-Delivery').toUpperCase(),
      cidade: (process.env.PIX_RECEIVER_CITY || 'Belo Horizonte').toUpperCase(),
      chavePix: process.env.PIX_KEY || 'chave@exemplo.com',
      valor: value,
      txid
    };

    // Registra a transação no banco de dados   
    await db.query(
      `INSERT INTO pix_transactions (orderId, value, status, txid, created_at) VALUES (?, ?, ?, ?, NOW())`, 
      [orderId, value, 'PENDING', txid]
    );

    // Gera payload e QRCode
    const payload = generatePixPayload(pixConfig);
    const qrcode = await QRCode.toDataURL(payload);

    // Atualiza o status
    const ssqlUpdate = 
    await db.query(
      `UPDATE pix_transactions SET payload = ?, status = ?, updated_at = NOW() WHERE txid = ?`,
      [payload, 'GENERATED', txid]
    );

    // Atualiza o status do pedido
    await db.query( 
      `UPDATE pedidos SET STATUS = ? WHERE PEDIDO_ID = ?`
      ["PGTO_PENDENTE", orderId]
    );

    return response.json({
      success: true, 
      qrcode, copyPaste: payload, 
      orderId, value, 
      expiresIn: 3600
    });
  } catch (error) {
    console.error('Erro detalhado:', error);
    return response.status(500).json({
      success: false,
      error: error.message || 'Erro ao gerar código PIX'
    });
  }
});

// Webhook para receber confirmação do banco (opcional) - PÚBLICA
router.post('/pix/webhook', async (request, response) => {
  try {
    const { txid, status } = request.body;
    // Atualiza o status do pagamento
    await db.execute(
      'UPDATE pix_transactions SET status = ? WHERE txid = ?',
      ['GENERATED', txid]
    );
    // Atualiza o status do pedido
    const orderId = txid.replace('ORDER', '');
    await db.execute(
      'UPDATE pedidos set STATUS = ? where PEDIDO_ID = ? ',
      ["PAGO", orderId]
    );
    return response.json({ success: true });
  } catch (error) {
    console.error('Erro no webhook PIX:', error);
    return response.status(500).json({ success: false });
  }
});

router.get('/pix/status/:orderId', async (request, response) => {
  try {
    const { orderId } = request.params;
    const txid = `ORDER${orderId}`;
    const [transaction] = await db.execute(
      'SELECT * FROM pix_transactions WHERE txid = ?', [txid]
    );
    if (!transaction) {
        return response.status(404).json({
          success: false,
          error: 'Transação não encontrada'
        });
    }
    return response.json({
      success: true,
      status: transaction.status,
      value: transaction.value,
      created_at: transaction.created_at
    });
  } catch (error) {
    console.error('Erro ao consultar status PIX:', error);
    return response.status(500).json({
      success: false,
      error: 'Erro ao consultar status'
    });
  }
});

module.exports = router;
