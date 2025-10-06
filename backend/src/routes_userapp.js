/**
 * Rotas do UserApp extraídas de rotas.js
 */

const express = require('express');
const authMiddleware = require('../src/auth.js');
const db = require('../src/config/database.js');
const router = express.Router();

// ROTAS PÚBLICAS USER-APP (ajuste conforme necessário)
const publicRoutes = [
  // Exemplo: '/user-app/ping', etc.
];

// MIDDLEWARE DE AUTENTICAÇÃO

router.use((req, res, next) => {
  const path = req.path;
  const isPublic = publicRoutes.some(route => {
    if (route.includes(':')) {
      const basePath = route.split(':')[0];
      return path.startsWith(basePath);
    }
    return path === route;
  });
  if (isPublic) return next();
  return authMiddleware(req, res, next);
});

// --- Rotas USER-APP ---

router.get('/user-app/listar/categorias', async (req, res) => {
  try {
    const [result] = await db.query('select * from categorias order by ORDEM');
    return res.status(200).json(result);
  } catch (error) {
    console.error('Erro ao listar categorias:', error);
    return res.status(500).send(error);
  }
});

router.get('/user-app/listar/deliveries', async (req, res) => {
  try {
    const [result] = await db.query('select * from deliveries order by DELIVERY_NOME');
    const deliveries = result.map(delivery => ({
      ...delivery,
      SITUACAO: delivery.SITUACAO ? delivery.SITUACAO[0] : 0
    }));
    return res.status(200).json(deliveries);
  } catch (error) {
    console.error('Erro ao listar deliveries:', error);
    return res.status(500).send(error);
  }
});

router.get('/user-app/listar/deliveries/categoria/:id', async (req, res) => {
  try {
    const id = req.params.id;    
    const [result] = await db.query('select * from deliveries where CATEGORIA_ID = ?', [id]);
    if (result.length === 0) {
      return res.status(404).json({ error: 'Nenhum delivery encontrado para esta categoria' });
    }
    const deliveries = result.map(delivery => ({
      ...delivery,
      SITUACAO: delivery.SITUACAO ? delivery.SITUACAO[0] : 0
    }));
    return res.status(200).json(deliveries);
  } catch (error) {
    console.error('Erro ao listar deliveries por categoria:', error);
    return res.status(500).send(error);        
  }   
});

router.get('/user-app/delivery/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const [result] = await db.query('select * from deliveries where DELIVERY_ID = ?', [id]);
    if (result.length === 0) {
      return res.status(404).json({ error: 'Delivery não encontrado' });
    }
    const delivery = result[0];
    delivery.SITUACAO = delivery.SITUACAO ? delivery.SITUACAO[0] : 0;
    return res.status(200).json(delivery);
  } catch (error) {
    console.error('Erro ao buscar delivery:', error);
    return res.status(400).send(error);   
  }
});

router.get('/user-app/listar/produtos/delivery/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const [result] = await db.query('select * from produtos where DELIVERY_ID = ?', [id]);
    return res.status(200).json(result);
  } catch (error) {
    console.error('Erro ao listar produtos do delivery:', error);
    return res.status(500).send(error);
  }
});

router.get('/user-app/produto/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const [result] = await db.query('select * from produtos where PRODUTO_ID = ?', [id]);
    if (result.length === 0) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }
    return res.status(200).json(result[0]);
  } catch (error) {
    console.error('Erro ao buscar produto:', error);
    return res.status(400).send(error);
  }
});

router.get('/user-app/listar/extras/delivery/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const [result] = await db.query('select * from extras where DELIVERY_ID = ?', [id]);
    return res.status(200).json(result);
  } catch (error) {
    console.error('Erro ao listar extras do delivery:', error);
    return res.status(500).send(error);
  }
});

router.get('/user-app/extra/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const [result] = await db.query('select * from extras where EXTRA_ID = ?', [id]);
    if (result.length === 0) {
      return res.status(404).json({ error: 'Extra não encontrado' });
    }
    return res.status(200).json(result[0]);
  } catch (error) {
    console.error('Erro ao buscar extra:', error);
    return res.status(400).send(error);
  }
});

router.post('/user-app/add/pedido', async (req, res) => {
  try {
    const {
      DELIVERY_ID,
      USER_ID,
      VR_SUBTOTAL,
      TAXA_ENTREGA,
      VR_TOTAL,
      PUSH_TOKEN,
      STATUS,
      ENDERECO_ENTREGA,
      LATITUDE,
      LONGITUDE,
      ITENS      
    } = req.body;
      const [pedidoResult] = await db.query(
        `insert into pedidos (DELIVERY_ID, USER_ID, DATA, VR_SUBTOTAL, TAXA_ENTREGA, VR_TOTAL, STATUS, ENDERECO_ENTREGA, LATITUDE, LONGITUDE, PUSH_TOKEN) 
         values (?, ?, NOW(), ?, ?, ?, ?, ?, ?, ?, ?)`,
        [DELIVERY_ID, USER_ID, VR_SUBTOTAL, TAXA_ENTREGA, VR_TOTAL, STATUS, ENDERECO_ENTREGA, LATITUDE, LONGITUDE, PUSH_TOKEN]
      );
    const PEDIDO_ID = pedidoResult.insertId;
    for (const item of ITENS) {
      await db.query(
        `insert into itens (PEDIDO_ID, PRODUTO_ID, QTD, ACRESCIMOS, OBS, VR_UNITARIO, VR_ACRESCIMOS, TOTAL) 
         values (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          PEDIDO_ID,
          item.PRODUTO_ID,
          item.QTD,
          JSON.stringify(item.ACRESCIMOS || []),
          item.OBS || '',
          item.VR_UNITARIO || 0,
          item.VR_ACRESCIMOS || 0,
          item.TOTAL
        ]
      );
    }
    return res.status(201).json({
      PEDIDO_ID,
      message: 'Pedido criado com sucesso'
    });
  } catch (error) {
    console.error('Erro ao criar pedido:', error);
    return res.status(500).json({
      error: 'Erro ao criar pedido',
      details: error.message
    });
  }
});

router.get('/user-app/listar/pedidos/usuario/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const [result] = await db.query(`
      select p.*, d.DELIVERY_NOME, d.URL_IMAGEM as DELIVERY_IMG
      from pedidos p 
      join deliveries d ON (d.DELIVERY_ID = p.DELIVERY_ID)
      where p.USER_ID = ? 
      order by p.DATA desc
    `, [id]);
    return res.status(200).json(result);
  } catch (error) {
    console.error('Erro ao listar pedidos do usuário:', error);
    return res.status(500).send(error);
  }
});

router.get('/user-app/pedido/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const [result] = await db.query(`
      select p.PEDIDO_ID, 
      p.DELIVERY_ID, d.DELIVERY_NOME, d.URL_IMAGEM as imagem_delivery, d.TELEFONE as telefone_delivery, 
      concat(d.ENDERECO, ', ', d.NUMERO, ' ', d.COMPLEMENTO, ', ', d.BAIRRO, ', ', d.CIDADE, '-', d.UF, ', ', d.CEP) as endereco_delivery, 
      date_format(p.DATA, '%d/%m/%Y %H:%i:%s') as data_pedido, 
      concat(u.NOME, ' ', u.SOBRENOME) as nome_cliente, u.TELEFONE as telefone_cliente, 
      p.ENDERECO_ENTREGA, p.LATITUDE, p.LONGITUDE, 
      p.STATUS, p.PUSH_TOKEN, p.VR_SUBTOTAL, p.TAXA_ENTREGA, p.VR_TOTAL, 
      i.ITEM_ID, pp.PRODUTO_NOME, pp.URL_IMAGEM as imagem_produto, pp.VR_UNITARIO, i.QTD, i.ACRESCIMOS, i.OBS, i.VR_ACRESCIMOS, i.TOTAL 
      FROM pedidos p 
      join usuarios u ON (u.USER_ID = p.USER_ID) 
      join itens i ON (i.PEDIDO_ID = p.PEDIDO_ID) 
      join produtos pp ON (pp.PRODUTO_ID = i.PRODUTO_ID) 
      join deliveries d ON (d.DELIVERY_ID = p.DELIVERY_ID) 
      where p.PEDIDO_ID = ?
    `, [id]);
    if (result.length === 0) {
      return res.status(404).json({ error: 'Pedido não encontrado' });
    }
    const pedidos = [];
    result.forEach((pedidoResult) => {
      const existingPedido = pedidos.find(p => p.PEDIDO_ID === pedidoResult.PEDIDO_ID);
      if (existingPedido) {
        existingPedido.ITENS.push({
          ITEM_ID: pedidoResult.ITEM_ID,
          PRODUTO: pedidoResult.PRODUTO_NOME,
          URL_IMAGEM: pedidoResult.imagem_produto,
          VR_UNITARIO: pedidoResult.VR_UNITARIO,
          ACRESCIMOS: JSON.parse(pedidoResult.ACRESCIMOS || '[]'),
          OBS: pedidoResult.OBS,
          VR_ACRESCIMOS: pedidoResult.VR_ACRESCIMOS,
          QTD: pedidoResult.QTD,
          TOTAL: pedidoResult.TOTAL
        });
      } else {
        pedidos.push({
          PEDIDO_ID: pedidoResult.PEDIDO_ID,
          DATA: pedidoResult.data_pedido,
          CLIENTE_NOME: pedidoResult.nome_cliente,
          ENDERECO_ENTREGA: pedidoResult.ENDERECO_ENTREGA,
          LATITUDE: pedidoResult.LATITUDE,
          LONGITUDE: pedidoResult.LONGITUDE,
          TELEFONE: pedidoResult.telefone_cliente,
          DELIVERY_ID: pedidoResult.DELIVERY_ID,
          DELIVERY_NOME: pedidoResult.DELIVERY_NOME,
          DELIVERY_IMG: pedidoResult.imagem_delivery,
          DELIVERY_TELEFONE: pedidoResult.telefone_delivery,
          DELIVERY_ENDERECO: pedidoResult.endereco_delivery,
          VR_SUBTOTAL: pedidoResult.VR_SUBTOTAL,
          TAXA_ENTREGA: pedidoResult.TAXA_ENTREGA,
          VR_TOTAL: pedidoResult.VR_TOTAL,
          STATUS: pedidoResult.STATUS,
          PUSH_TOKEN: pedidoResult.PUSH_TOKEN,
          ITENS: [{
            ITEM_ID: pedidoResult.ITEM_ID,
            PRODUTO: pedidoResult.PRODUTO_NOME,
            URL_IMAGEM: pedidoResult.imagem_produto,
            VR_UNITARIO: pedidoResult.VR_UNITARIO,
            ACRESCIMOS: JSON.parse(pedidoResult.ACRESCIMOS || '[]'),
            OBS: pedidoResult.OBS,
            VR_ACRESCIMOS: pedidoResult.VR_ACRESCIMOS,
            QTD: pedidoResult.QTD,
            TOTAL: pedidoResult.TOTAL
          }]
        });
      }
    });
    return res.status(200).json(pedidos[0]);
  } catch (error) {
    console.error('Erro ao buscar pedido:', error);
    return res.status(500).send(error);
  }
});

router.put('/user-app/update/status/pedido', async (req, res) => {
  const { orderId, status } = req.body;
  try {
    if (!orderId || !status) {
      return res.status(400).json({
        error: 'Parâmetros obrigatórios ausentes',
        details: 'orderId e status são obrigatórios'
      });
    }
    await db.query(
      'update pedidos set STATUS = ? where PEDIDO_ID = ?',
      [status, orderId]
    );
    return res.status(200).json({
      message: 'Status do pedido atualizado com sucesso',
      orderId,
      status
    });
  } catch (error) {
    console.error('Erro ao atualizar status do pedido:', error);
    return res.status(500).json({
      error: 'Erro ao atualizar status do pedido',
      details: error.message
    });
  }
});

module.exports = router;
