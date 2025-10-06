/**
 * Rotas do DeliveryApp extraídas de rotas.js
 */

const express = require('express');
const authMiddleware = require('../src/auth.js');
const db = require('../src/config/database.js');
const router = express.Router();

// ROTAS PÚBLICAS DELIVERY-APP (ajuste conforme necessário)
const publicRoutes = [
  // Exemplo: '/delivery-app/ping', etc.
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

/** ROTAS DELIVERY-APP */

router.get('/delivery-app/listar/pedidos/delivery/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const [result] = await db.query(`
      select p.*, 
      concat(u.NOME, ' ', u.SOBRENOME) as nome_cliente, u.TELEFONE as telefone_cliente,
      date_format(p.DATA, '%d/%m/%Y %H:%i:%s') as data_pedido
      from pedidos p 
      join usuarios u ON (u.USER_ID = p.USER_ID)
      where p.DELIVERY_ID = ? 
      order by p.DATA desc
    `, [id]);
    return res.status(200).json(result);
  } catch (error) {
    console.error('Erro ao listar pedidos do delivery:', error);
    return res.status(500).send(error);
  }
});

router.get('/delivery-app/pedidos/abertos/delivery/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const ssql = `select
        p.PEDIDO_ID, p.DELIVERY_ID, p.USER_ID,
        date_format(p.DATA, '%d/%m/%Y %H:%i:%s') as data_pedido, 
        p.STATUS, p.PUSH_TOKEN,
        concat(u.NOME, ' ', u.SOBRENOME) as nome_cliente,
        u.TELEFONE as telefone_cliente,
        p.ENDERECO_ENTREGA, p.LATITUDE, p.LONGITUDE,    
        p.VR_SUBTOTAL, p.TAXA_ENTREGA, p.VR_TOTAL, 
        i.ITEM_ID, o.PRODUTO_NOME, o.URL_IMAGEM, i.QTD, i.ACRESCIMOS, i.OBS
        from pedidos p
        join usuarios u on (u.USER_ID = p.USER_ID)
        join itens i on (i.PEDIDO_ID = p.PEDIDO_ID)
        join produtos o on (o.PRODUTO_ID = i.PRODUTO_ID)
        where p.DELIVERY_ID = ? and p.STATUS <> 'FINALIZADO'
        order by p.DATA DESC`;
    const [result] = await db.query(ssql, [id]);
    if (result.length === 0) {
      return res.status(404).json({ error: 'Nenhum pedido aberto encontrado para este delivery' });
    }
    const pedidos = [];
    result.forEach((pedidoResult) => {
        const pedido_ID = pedidoResult.PEDIDO_ID;
        let pedido = pedidos.find((p) => p.PEDIDO_ID === pedido_ID);
        if (!pedido) {
            pedido = {
                PEDIDO_ID: pedido_ID,
                DATA: pedidoResult.data_pedido,
                PUSH_TOKEN: pedidoResult.PUSH_TOKEN,
                STATUS: pedidoResult.STATUS,
                USER_ID: pedidoResult.USER_ID,
                CLIENTE: pedidoResult.nome_cliente,
                TELEFONE: pedidoResult.telefone_cliente,
                ENDERECO_ENTREGA: pedidoResult.ENDERECO_ENTREGA,
                LATITUDE: pedidoResult.LATITUDE,
                LONGITUDE: pedidoResult.LONGITUDE,
                VR_SUBTOTAL: pedidoResult.VR_SUBTOTAL,
                TAXA_ENTREGA: pedidoResult.TAXA_ENTREGA,
                VR_TOTAL: pedidoResult.VR_TOTAL,
                ITENS: [],
            };
            pedidos.push(pedido);
        }
        let acrescimos = [];
        try {
            if (pedidoResult.ACRESCIMOS && typeof pedidoResult.ACRESCIMOS === 'string') {
                acrescimos = JSON.parse(pedidoResult.ACRESCIMOS);
            } else if (typeof pedidoResult.ACRESCIMOS === 'object') {
                acrescimos = pedidoResult.ACRESCIMOS;
            }
        } catch (error) {
            console.error('Erro ao fazer parse de ACRESCIMOS:', error.message);
            acrescimos = [];
        }
        pedido.ITENS.push({
            ITEM_ID: pedidoResult.ITEM_ID,
            PRODUTO_NOME: pedidoResult.PRODUTO_NOME.toUpperCase(),
            URL_IMAGEM: pedidoResult.URL_IMAGEM,
            QTD: pedidoResult.QTD,
            ACRESCIMOS: acrescimos,
            OBS: pedidoResult.OBS,
        });
    });
    return res.status(200).json(pedidos);
  } catch (error) {
    console.error('Erro ao listar pedidos abertos do delivery:', error);
    return res.status(500).send(error);
  }
});

router.get('/delivery-app/listar/produtos/delivery/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const [result] = await db.query('select * from produtos where DELIVERY_ID = ? order by PRODUTO_NOME', [id]);
    return res.status(200).json(result);
  } catch (error) {
    console.error('Erro ao listar produtos do delivery:', error);
    return res.status(500).send(error);
  }
});

router.get('/delivery-app/produto/:id', async (req, res) => {
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

router.post('/delivery-app/add/produto', async (req, res) => {
  try {
    const { PRODUTO_NOME, DESCRICAO, VR_UNITARIO, URL_IMAGEM, ITENS_EXTRAS, ITENS_OBS, DELIVERY_ID } = req.body;
    if (!PRODUTO_NOME || !DELIVERY_ID) {
      return res.status(400).json({
        error: 'Campos obrigatórios ausentes',
        details: 'PRODUTO_NOME e DELIVERY_ID são obrigatórios'
      });
    }
    const [result] = await db.query(
      'insert into produtos (PRODUTO_NOME, DESCRICAO, VR_UNITARIO, URL_IMAGEM, ITENS_EXTRAS, ITENS_OBS, DELIVERY_ID) values (?, ?, ?, ?, ?, ?, ?)',
      [PRODUTO_NOME, DESCRICAO || '', VR_UNITARIO || 0, URL_IMAGEM || '', ITENS_EXTRAS || 'S', ITENS_OBS || 'S', DELIVERY_ID]
    );
    return res.status(201).json({
      PRODUTO_ID: result.insertId,
      DELIVERY_ID,
      PRODUTO_NOME,
      DESCRICAO,
      VR_UNITARIO,
      URL_IMAGEM,
      ITENS_EXTRAS,
      ITENS_OBS
    });
  } catch (error) {
    console.error('Erro ao adicionar produto:', error);
    return res.status(500).send(error);
  }
});

router.put('/delivery-app/update/produto/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const { PRODUTO_NOME, DESCRICAO, VR_UNITARIO, URL_IMAGEM, ITENS_EXTRAS, ITENS_OBS } = req.body;
    await db.query(
      'update produtos set PRODUTO_NOME = ?, DESCRICAO = ?, VR_UNITARIO = ?, URL_IMAGEM = ?, ITENS_EXTRAS = ?, ITENS_OBS = ? where PRODUTO_ID = ?',
      [PRODUTO_NOME, DESCRICAO, VR_UNITARIO, URL_IMAGEM, ITENS_EXTRAS, ITENS_OBS, id]
    );
    return res.status(200).json({
      PRODUTO_ID: id,
      PRODUTO_NOME,
      DESCRICAO,
      VR_UNITARIO,
      URL_IMAGEM,
      ITENS_EXTRAS,
      ITENS_OBS      
    });
  } catch (error) {
    console.error('Erro ao atualizar produto:', error);
    return res.status(400).send(error);
  }
});

router.delete('/delivery-app/delete/produto/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const [exists] = await db.query('select PRODUTO_ID from produtos where PRODUTO_ID = ?', [id]);
    if (exists.length === 0) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }
    await db.query('delete from produtos where PRODUTO_ID = ?', [id]);
    return res.status(200).json({ message: 'Produto removido com sucesso!' });
  } catch (error) {
    console.error('Erro ao remover produto:', error);
    return res.status(400).send(error);
  }
});

router.put('/delivery-app/update/imagem/produto/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const { url_imagem } = req.body;
    if (!url_imagem) {
      return res.status(400).json({
        error: 'URL da imagem é obrigatória',
        details: 'O campo url_imagem não pode estar vazio'
      });
    }
    await db.query('update produtos set URL_IMAGEM = ? where PRODUTO_ID = ?', [url_imagem, id]);
    return res.status(200).json({ url_imagem });
  } catch (error) {
    console.error('Erro ao atualizar imagem do produto:', error);
    return res.status(500).send(error);
  }
});

router.get('/delivery-app/listar/extras/delivery/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const [result] = await db.query('select * from extras where DELIVERY_ID = ? order by DESCRICAO', [id]);
    return res.status(200).json(result);
  } catch (error) {
    console.error('Erro ao listar extras do delivery:', error);
    return res.status(500).send(error);
  }
});

router.get('/delivery-app/extra/:id', async (req, res) => {
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

router.post('/delivery-app/add/extra', async (req, res) => {
  try {
    const { DESCRICAO, VR_UNITARIO, DELIVERY_ID } = req.body;
    if (!DESCRICAO || !DELIVERY_ID) {
      return res.status(400).json({
        error: 'Campos obrigatórios ausentes',
        details: 'DESCRICAO e DELIVERY_ID são obrigatórios'
      });
    }
    const [result] = await db.query(
      'insert into extras (DESCRICAO, VR_UNITARIO, DELIVERY_ID) values (?, ?, ?)',
      [DESCRICAO, VR_UNITARIO || 0, DELIVERY_ID]
    );
    return res.status(201).json({
      EXTRA_ID: result.insertId,
      DESCRICAO,
      VR_UNITARIO,
      DELIVERY_ID
    });
  } catch (error) {
    console.error('Erro ao adicionar extra:', error);
    return res.status(500).send(error);
  }
});

router.put('/delivery-app/update/extra/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const { DESCRICAO, VR_UNITARIO } = req.body;
    await db.query(
      'update extras set DESCRICAO = ?, VR_UNITARIO = ? where EXTRA_ID = ?',
      [DESCRICAO, VR_UNITARIO, id]
    );
    return res.status(200).json({
      EXTRA_ID: id,
      DESCRICAO,
      VR_UNITARIO
    });
  } catch (error) {
    console.error('Erro ao atualizar extra:', error);
    return res.status(400).send(error);
  }
});

router.delete('/delivery-app/delete/extra/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const [exists] = await db.query('select EXTRA_ID from extras where EXTRA_ID = ?', [id]);
    if (exists.length === 0) {
      return res.status(404).json({ error: 'Extra não encontrado' });
    }
    await db.query('delete from extras where EXTRA_ID = ?', [id]);
    return res.status(200).json({ message: 'Item extra removido com sucesso!' });
  } catch (error) {
    console.error('Erro ao remover extra:', error);
    return res.status(400).send(error);
  }
});

router.put('/delivery-app/update/delivery/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const {
      DELIVERY_NOME,
      PLANO,
      CATEGORIA_ID,
      RESPONSAVEL,
      EMAIL,
      TELEFONE,
      HORARIO,
      MIN_DELIVERY_TIME,
      MAX_DELIVERY_TIME,
      RATING,
      TAXA_ENTREGA,
      URL_IMAGEM,
      CEP,
      ENDERECO,
      NUMERO,
      COMPLEMENTO,
      BAIRRO,
      CIDADE,
      UF,
      CHV
    } = req.body;
    await db.query(`
      update deliveries set 
      DELIVERY_NOME = ?, PLANO = ?, CATEGORIA_ID = ?, RESPONSAVEL = ?, EMAIL = ?, 
      TELEFONE = ?, HORARIO = ?, MIN_DELIVERY_TIME = ?, MAX_DELIVERY_TIME = ?, RATING = ?, 
      TAXA_ENTREGA = ?, URL_IMAGEM = ?, CEP = ?, ENDERECO = ?, NUMERO = ?, COMPLEMENTO = ?, 
      BAIRRO = ?, CIDADE = ?, UF = ?, CHV = ? 
      where DELIVERY_ID = ?
    `, [
      DELIVERY_NOME, PLANO, CATEGORIA_ID, RESPONSAVEL, EMAIL, TELEFONE, HORARIO,
      MIN_DELIVERY_TIME, MAX_DELIVERY_TIME, RATING, TAXA_ENTREGA, URL_IMAGEM, CEP, ENDERECO,
      NUMERO, COMPLEMENTO, BAIRRO, CIDADE, UF, CHV, id
    ]);
    return res.status(200).json(req.body);
  } catch (error) {
    console.error('Erro ao atualizar delivery:', error);
    return res.status(500).send(error);
  }
});

router.get('/delivery-app/taxa/delivery/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const [result] = await db.query('select * from taxa where DELIVERY_ID = ?', [id]);
    if (result.length === 0) {
      return res.status(404).json({ error: 'Taxa não encontrada para este delivery' });
    }
    return res.status(200).json(result[0]);
  } catch (error) {
    console.error('Erro ao buscar taxa do delivery:', error);
    return res.status(500).send(error);
  }
});

router.post('/delivery-app/delivery/pre-cadastro', async (req, res) => {
  try {
    const {
      DELIVERY_NOME, PLANO, CATEGORIA_ID, RESPONSAVEL, EMAIL, TELEFONE, HORARIO,
      MIN_DELIVERY_TIME, MAX_DELIVERY_TIME, TAXA_ENTREGA, RATING, URL_IMAGEM, CEP, ENDERECO,
      NUMERO, COMPLEMENTO, BAIRRO, CIDADE, UF, CHV
    } = req.body;
    if (!DELIVERY_NOME || !EMAIL) {
      return res.status(400).json({
        error: 'Campos obrigatórios ausentes',
        details: 'DELIVERY_NOME e EMAIL são obrigatórios'
      });
    }
    const [result] = await db.query(
      `insert into deliveries (
        DELIVERY_NOME, PLANO, CATEGORIA_ID, RESPONSAVEL, EMAIL, TELEFONE, HORARIO,
        MIN_DELIVERY_TIME, MAX_DELIVERY_TIME, TAXA_ENTREGA, RATING, URL_IMAGEM, CEP, ENDERECO,
        NUMERO, COMPLEMENTO, BAIRRO, CIDADE, UF, CHV
      ) values (
       ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
      )`, 
      [
        DELIVERY_NOME, PLANO || 'BASIC', CATEGORIA_ID || 101, RESPONSAVEL,
        EMAIL, TELEFONE, HORARIO, MIN_DELIVERY_TIME || 15, MAX_DELIVERY_TIME || 45,
        TAXA_ENTREGA || 5.0, RATING || 4.9, URL_IMAGEM, CEP, ENDERECO, NUMERO, COMPLEMENTO,
        BAIRRO, CIDADE, UF, CHV || "1"
      ]);
    return res.status(201).json({
      DELIVERY_ID: result.insertId,
      message: 'Pré-cadastro realizado com sucesso'
    });
  } catch (error) {
    console.error('Erro ao realizar pré-cadastro:', error);
    return res.status(500).send(error);
  }
});

router.put('/delivery-app/update/status/pedido', async (req, res) => {
  const { orderId, status } = req.body;
  try {
    if (!orderId || !status) {
      return res.status(400).json({
        error: 'Campos obrigatórios ausentes',
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
