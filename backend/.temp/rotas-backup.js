/* Backup temporário das rotas dos apps extraídas de rotas.js em 24-09-2025 */

/**
 * src/rotas.js
 * revisado em 24-09-2025 01:16:48
 */

const express = require('express');
const authMiddleware = require('../src/auth.js');
const db = require('../src/config/database.js');
const jwt = require('jsonwebtoken');

const router = express.Router();

// WebSocket e FCM (ajuste conforme sua implementação)
// import { sendPushNotification } from './services/notifications.js';
// import { getSocketInstance } from './ws.js';

/** ROTAS PÚBLICAS PERMITIDAS S/ AUTENTICAÇÃO */

const publicRoutes = [
  '/api/ping',
  '/api/delivery/authenticate',
  '/api/user/authenticate',
  '/api/listar/categorias',
  '/api/listar/deliveries',
  '/api/listar/produtos',
  '/api/listar/extras',
  '/api/pedido/:id',
];

/** MIDDLEWARE PARA LIBERAÇÃO DE ROTAS PÚBLICAS */

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

/**  ROTAS PÚBLICAS */

router.get('/api/ping', (req, res) => {
  res.status(200).json({ message: 'Server is online', status: res.statusCode });
  console.log('JWT_SECRET (PING):', process.env.JWT_SECRET);
});

router.post('/api/delivery/authenticate', async (req, res) => {
  try {
    const { USER_ID, CHV, timezoneOffset } = req.body;

    if (!USER_ID || USER_ID === undefined) {
      return res.status(400).json({
        error: 'USER_ID é obrigatório',
        details: 'O campo USER_ID não pode estar vazio'
      });
    }

    if (!CHV || CHV === undefined) {
      return res.status(400).json({
        error: 'CHV é obrigatório',
        details: 'O campo CHV não pode estar vazio'
      });
    }

    if (timezoneOffset === undefined) {
      return res.status(400).json({
        error: 'timezoneOffset é obrigatório',
        details: 'O campo timezoneOffset é necessário para calcular o horário local'
      });
    }

    // Obtém o IP do cliente, priorizando o IP externo (x-forwarded-for)

    const rawIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const IP_ADDRESS = rawIp.includes(',') ? rawIp.split(',')[0].trim() : rawIp;

    // Verificar se o delivery existe

    const [userExists] = await db.query(
      'select DELIVERY_ID from deliveries where DELIVERY_ID = ?',
      [USER_ID]
    );

    if (!userExists || userExists.length === 0) {
      return res.status(404).json({
        error: 'Delivery não encontrado',
        details: 'O DELIVERY_ID fornecido não existe na base de dados'
      });
    }

    const serverTime = new Date();
    const localTime = new Date(serverTime.getTime() - timezoneOffset * 60000); 

    const DT_ACCESS = localTime.toISOString().slice(0, 19).replace('T', ' ');  
    const EXPIRATION_TIME = new Date(localTime.getTime() + 10800 * 1000).toISOString().slice(0, 19).replace('T', ' '); 
    
    const user = { 
      id: USER_ID, 
      dt_access: DT_ACCESS, 
      chv: CHV 
    };

    const token = jwt.sign(user, "#AB4EEAD4187EF4602BFC2E353D459195BAC1695", { 
      expiresIn: '3h', 
      algorithm: 'HS256' 
    });

    await db.query(
      `insert into userlog (USER_ID, IP_ADDRESS, DT_ACCESS, TOKEN, EXPIRATION_TIME, CHV) values (?, ?, ?, ?, ?, ?)`, 
      [USER_ID, IP_ADDRESS, DT_ACCESS, token, EXPIRATION_TIME, CHV]
    );

    return res.status(200).json({ 
      token, 
      expiresIn: 3600,
      userId: USER_ID
    });

  } catch (error) {
    console.error('Erro na autenticação do delivery:', error);
    return res.status(500).json({
      error: 'Erro interno do servidor',
      details: error.message
    });
  }
});

router.post('/api/user/authenticate', async (req, res) => {
  try {
    const { USER_ID, CHV, timezoneOffset } = req.body;

    if (!USER_ID || USER_ID === undefined) {
      return res.status(400).json({
        error: 'USER_ID é obrigatório',
        details: 'O campo USER_ID não pode estar vazio'
      });
    }

    if (!CHV || CHV === undefined) {
      return res.status(400).json({
        error: 'CHV é obrigatório',
        details: 'O campo CHV não pode estar vazio'
      });
    }

    if (timezoneOffset === undefined) {
      return res.status(400).json({
        error: 'timezoneOffset é obrigatório',
        details: 'O campo timezoneOffset é necessário para calcular o horário local'
      });
    }

    // Obtém o IP do cliente

    const rawIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const IP_ADDRESS = rawIp.includes(',') ? rawIp.split(',')[0].trim() : rawIp;
    const sanitizedIp = IP_ADDRESS.replace(/^::ffff:/, '');

    // Verificar se o usuário existe

    const [userExists] = await db.query(
      'select USER_ID from usuarios where USER_ID = ?',
      [USER_ID]
    );

    if (!userExists || userExists.length === 0) {
      return res.status(404).json({
        error: 'Usuário não encontrado',
        details: 'O USER_ID fornecido não existe na base de dados'
      });
    }

    const serverTime = new Date();
    const localTime = new Date(serverTime.getTime() - timezoneOffset * 60000); 

    const DT_ACCESS = localTime.toISOString().slice(0, 19).replace('T', ' ');  
    const EXPIRATION_TIME = new Date(localTime.getTime() + 3600 * 1000).toISOString().slice(0, 19).replace('T', ' '); 
    
    const user = { 
      id: USER_ID, 
      dt_access: DT_ACCESS, 
      chv: CHV 
    };

    // Verificar se JWT_SECRET está definido

    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET não está definido!');
      return res.status(500).json({
        error: 'Erro de configuração do servidor',
        details: 'JWT_SECRET não está configurado'
      });
    }     

    const token = jwt.sign(user, process.env.JWT_SECRET, { 
      expiresIn: '3h', 
      algorithm: 'HS256' 
    });

    await db.query(
      `insert into userlog (USER_ID, IP_ADDRESS, DT_ACCESS, TOKEN, EXPIRATION_TIME, CHV) values (?, ?, ?, ?, ?, ?)`, 
      [USER_ID, IP_ADDRESS, DT_ACCESS, token, EXPIRATION_TIME, CHV]
    );

    return res.status(200).json({ 
      token, 
      expiresIn: 3600,
      userId: USER_ID
    });

  } catch (error) {
    console.error('Erro na autenticação do usuário:', error);
    return res.status(500).json({
      error: 'Erro interno do servidor',
      details: error.message
    });
  }
});

router.get('/api/listar/categorias', async (req, res) => {
  try {
    const [result] = await db.query('select * from categorias order by ORDEM');
    return res.status(200).json(result);
  } catch (error) {
    console.error('Erro ao listar categorias:', error);
    return res.status(500).send(error);
  }
});

router.get('/api/listar/deliveries', async (req, res) => {
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

router.get('/api/listar/produtos', async (req, res) => {
  try {
    const [result] = await db.query('select * from produtos order by PRODUTO_NOME');
    return res.status(200).json(result);
  } catch (error) {
    console.error('Erro ao listar produtos:', error);
    return res.status(500).send(error);
  }
});

router.get('/api/listar/extras', async (req, res) => {
  try {
    const [result] = await db.query('select * from extras order by DESCRICAO');
    return res.status(200).json(result);
  } catch (error) {
    console.error('Erro ao listar extras:', error);
    return res.status(500).send(error);
  }
});

router.get('/api/pedido/:id', async (req, res) => {
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

/** DELIVERY-APP */

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
        order by p.DATA DESC
    `;

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
                STATUS: pedidoResult.STATUS,
                PUSH_TOKEN: pedidoResult.PUSH_TOKEN,
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

        // Parse de ACRESCIMOS
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
      PRODUTO_NOME,
      DESCRICAO,
      VR_UNITARIO,
      URL_IMAGEM,
      ITENS_EXTRAS,
      ITENS_OBS,
      DELIVERY_ID
    });
  } catch (error) {
    console.error('Erro ao adicionar produto:', error);
    return res.status(500).send(error);
  }
});

router.put('/delivery-app/update/produto/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const { PRODUTO_NOME, DESCRICAO, VR_UNITARIO, URL_IMAGEM } = req.body;
    
    await db.query(
      'update produtos set PRODUTO_NOME = ?, DESCRICAO = ?, VR_UNITARIO = ?, URL_IMAGEM = ? where PRODUTO_ID = ?',
      [PRODUTO_NOME, DESCRICAO, VR_UNITARIO, URL_IMAGEM, id]
    );

    return res.status(200).json({
      PRODUTO_ID: id,
      PRODUTO_NOME,
      DESCRICAO,
      VR_UNITARIO,
      URL_IMAGEM
    });
  } catch (error) {
    console.error('Erro ao atualizar produto:', error);
    return res.status(400).send(error);
  }
});

router.delete('/delivery-app/delete/produto/:id', async (req, res) => {
  try {
    const id = req.params.id;
    
    // Verificar se o produto existe
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
    
    // Verificar se o extra existe
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
      SITUACAO,
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
      UF
    } = req.body;

    await db.query(`
      update deliveries set 
      DELIVERY_NOME = ?, PLANO = ?, SITUACAO = ?, CATEGORIA_ID = ?, RESPONSAVEL = ?, EMAIL = ?, 
      TELEFONE = ?, HORARIO = ?, MIN_DELIVERY_TIME = ?, MAX_DELIVERY_TIME = ?, RATING = ?, 
      TAXA_ENTREGA = ?, URL_IMAGEM = ?, CEP = ?, ENDERECO = ?, NUMERO = ?, COMPLEMENTO = ?, 
      BAIRRO = ?, CIDADE = ?, UF = ? 
      where DELIVERY_ID = ?
    `, [
      DELIVERY_NOME, PLANO, SITUACAO, CATEGORIA_ID, RESPONSAVEL, EMAIL, TELEFONE, HORARIO,
      MIN_DELIVERY_TIME, MAX_DELIVERY_TIME, RATING, TAXA_ENTREGA, URL_IMAGEM, CEP, ENDERECO,
      NUMERO, COMPLEMENTO, BAIRRO, CIDADE, UF, id
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

// Rota para pré-cadastro de delivery
router.post('/delivery-app/delivery/pre-cadastro', async (req, res) => {
  try {
    const {
      DELIVERY_NOME,
      PLANO,
      SITUACAO,
      CATEGORIA_ID,
      RESPONSAVEL,
      EMAIL,
      TELEFONE,
      HORARIO,
      MIN_DELIVERY_TIME,
      MAX_DELIVERY_TIME,
      TAXA_ENTREGA,
      RATING,
      URL_IMAGEM,
      CEP,
      ENDERECO,
      NUMERO,
      COMPLEMENTO,
      BAIRRO,
      CIDADE,
      UF
    } = req.body;

    if (!DELIVERY_NOME || !EMAIL) {
      return res.status(400).json({
        error: 'Campos obrigatórios ausentes',
        details: 'DELIVERY_NOME e EMAIL são obrigatórios'
      });
    }

    const [result] = await db.query(`
      insert into deliveries (
        DELIVERY_NOME, PLANO, SITUACAO, CATEGORIA_ID, RESPONSAVEL, EMAIL, TELEFONE, HORARIO,
        MIN_DELIVERY_TIME, MAX_DELIVERY_TIME, TAXA_ENTREGA, RATING, URL_IMAGEM, CEP, ENDERECO,
        NUMERO, COMPLEMENTO, BAIRRO, CIDADE, UF
      ) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      DELIVERY_NOME, PLANO || 'BASIC', SITUACAO || 'ATIVO', CATEGORIA_ID || 101, RESPONSAVEL,
      EMAIL, TELEFONE, HORARIO, MIN_DELIVERY_TIME || 15, MAX_DELIVERY_TIME || 45,
      TAXA_ENTREGA || 5.0, RATING || 4.9, URL_IMAGEM, CEP, ENDERECO, NUMERO, COMPLEMENTO,
      BAIRRO, CIDADE, UF
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

// Rota para atualizar status de pedido - ESSENCIAL
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

/** USER-APP */

router.get('/user-app/listar/categorias', async (req, res) => {
  // Alias para rota pública
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
      itens      
    } = req.body;

    // Inserir pedido
    const [pedidoResult] = await db.query(
      `insert into pedidos (DELIVERY_ID, USER_ID, DATA, VR_SUBTOTAL, TAXA_ENTREGA, VR_TOTAL, STATUS, ENDERECO_ENTREGA, LATITUDE, LONGITUDE, PUSH_TOKEN) 
       values (?, ?, NOW(), ?, ?, ?, ?, ?, ?, ?, ?)`,
      [DELIVERY_ID, USER_ID, VR_SUBTOTAL, TAXA_ENTREGA, VR_TOTAL, PUSH_TOKEN, STATUS, ENDERECO_ENTREGA, LATITUDE, LONGITUDE]
    );

    const PEDIDO_ID = pedidoResult.insertId;

    // Itens do pedido
    for (const item of itens) {
      await db.query(
        `insert into itens (PEDIDO_ID, PRODUTO_ID, QTD, ACRESCIMOS, OBS, VR_ACRESCIMOS, TOTAL) 
         values (?, ?, ?, ?, ?, ?, ?)`,
        [
          PEDIDO_ID,
          item.PRODUTO_ID,
          item.QTD,
          JSON.stringify(item.ACRESCIMOS || []),
          item.OBS || '',
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
  // Usa a mesma lógica da rota pública
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

/** CRUD TABELA DELIVERIES */

// rota global para listar dados do delivery pelo ID

router.get('/api/delivery/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const [result] = await db.query('select * from deliveries where DELIVERY_ID = ?', [id]);
    if (result.length === 0) {
      return res.status(404).json({ error: 'Delivery não encontrado' });
    }
    return res.status(200).json(result[0]);
  } catch (error) {
    console.error('Erro ao buscar delivery:', error);
    return res.status(500).send(error);
  }
});

router.post('/api/add/delivery', async (req, res) => {
  try {
    const { DELIVERY_NOME, EMAIL } = req.body;
    
    if (!DELIVERY_NOME || !EMAIL) {
      return res.status(400).json({
        error: 'Campos obrigatórios ausentes',
        details: 'DELIVERY_NOME e EMAIL são obrigatórios'
      });
    }

    const [result] = await db.query(
      'insert into deliveries (DELIVERY_NOME, EMAIL) values (?, ?)',
      [DELIVERY_NOME, EMAIL]
    );

    return res.status(201).json({
      DELIVERY_ID: result.insertId,
      DELIVERY_NOME,
      EMAIL,
      SITUACAO: 1
    });
  } catch (error) {
    console.error('Erro ao adicionar delivery:', error);
    return res.status(400).send(error);
  }
});

router.put('/api/update/delivery/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const {
      DELIVERY_NOME,
      PLANO,
      SITUACAO,
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
      UF
    } = req.body;

    await db.query(`
      update deliveries set 
      DELIVERY_NOME = ?, PLANO = ?, SITUACAO = ?, CATEGORIA_ID = ?, RESPONSAVEL = ?, EMAIL = ?, 
      TELEFONE = ?, HORARIO = ?, MIN_DELIVERY_TIME = ?, MAX_DELIVERY_TIME = ?, RATING = ?, 
      TAXA_ENTREGA = ?, URL_IMAGEM = ?, CEP = ?, ENDERECO = ?, NUMERO = ?, COMPLEMENTO = ?, 
      BAIRRO = ?, CIDADE = ?, UF = ? 
      where DELIVERY_ID = ?
    `, [
      DELIVERY_NOME, PLANO, SITUACAO, CATEGORIA_ID, RESPONSAVEL, EMAIL, TELEFONE, HORARIO,
      MIN_DELIVERY_TIME, MAX_DELIVERY_TIME, RATING, TAXA_ENTREGA, URL_IMAGEM, CEP, ENDERECO,
      NUMERO, COMPLEMENTO, BAIRRO, CIDADE, UF, id
    ]);

    return res.status(200).json(req.body);
  } catch (error) {
    console.error('Erro ao atualizar delivery:', error);
    return res.status(500).send(error);
  }
});

router.delete('/api/delete/delivery/:id', async (req, res) => {
  try {
    const id = req.params.id;
    
    // Verificar se o delivery existe
    const [exists] = await db.query('select DELIVERY_ID from deliveries where DELIVERY_ID = ?', [id]);
    if (exists.length === 0) {
      return res.status(404).json({ error: 'Delivery não encontrado' });
    }

    await db.query('delete from deliveries where DELIVERY_ID = ?', [id]);
    return res.status(200).json({ message: 'Delivery removido com sucesso!' });
  } catch (error) {
    console.error('Erro ao remover delivery:', error);
    return res.status(400).send(error);
  }
});

/** CRUD TABELA USUARIOS */

// rota global para listar dados do usuário pelo ID

router.get('/api/user/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const [result] = await db.query('select * from usuarios where USER_ID = ?', [id]);
    if (result.length === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    return res.status(200).json(result[0]);
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    return res.status(400).send(error);
  }
});

router.get('/api/listar/usuarios', async (req, res) => {
  try {
    const [result] = await db.query('select * from usuarios order by NOME');
    return res.status(200).json(result);
  } catch (error) {
    console.error('Erro ao listar usuários:', error);
    return res.status(500).send(error);
  }
});

router.post('/api/add/usuario', async (req, res) => {
  try {
    const {
      FIREBASE_UID,
      NOME,
      SOBRENOME,
      TELEFONE,
      EMAIL,
      SENHA,
      URL_IMAGEM,
      CHAVE
    } = req.body;
    
    const [result] = await db.query(`insert into usuarios (
      FIREBASE_UID, NOME, SOBRENOME, TELEFONE, EMAIL, SENHA, URL_IMAGEM, CHAVE
      ) values (?, ?, ?, ?, ?, PASSWORD(MD5(?)), ?, ?) `, 
       [FIREBASE_UID, NOME, SOBRENOME, TELEFONE, EMAIL, SENHA, URL_IMAGEM, CHAVE]);
    return res.status(201).json({
      USER_ID: result.insertId,
      ...req.body
    });
  } catch (error) {
    console.error('Erro ao adicionar usuário:', error);
    return res.status(400).send(error);
  }
});

router.put('/api/update/usuario/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const {
      FIREBASE_UID,
      NOME,
      SOBRENOME,
      TELEFONE,
      EMAIL,
      SENHA,
      URL_IMAGEM,
      CHAVE
    } = req.body;

    await db.query(`update usuarios 
      set FIREBASE_UID = ?, NOME = ?, SOBRENOME = ?, TELEFONE = ?, EMAIL = ?, SENHA = PASSWORD(MD5(?)), 
      URL_IMAGEM = ?, CHAVE = ? where USER_ID = ? `, 
      [FIREBASE_UID, NOME, SOBRENOME, TELEFONE, EMAIL, SENHA, URL_IMAGEM, CHAVE, id]
    );

    return res.status(200).json({
      USER_ID: id,
      ...req.body
    });
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    return res.status(400).send(error);
  }
});

router.delete('/api/delete/usuario/:id', async (req, res) => {
  try {
    const id = req.params.id;
    
    // Verificar se o usuário existe
    const [exists] = await db.query('select USER_ID from usuarios where USER_ID = ?', [id]);
    if (exists.length === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    await db.query('delete from usuarios where USER_ID = ?', [id]);
    return res.status(200).json({ message: 'Usuário removido com sucesso!' });
  } catch (error) {
    console.error('Erro ao remover usuário:', error);
    return res.status(400).send(error);
  }
});

/** CRUD TABELA COURIERS */

router.get('/api/courier/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const [result] = await db.query('select * from couriers where COURIER_ID = ?', [id]);
    if (result.length === 0) {
      return res.status(404).json({ error: 'Courier não encontrado' });
    }
    return res.status(200).json(result[0]);
  } catch (error) {
    console.error('Erro ao buscar courier:', error);
    return res.status(400).send(error);
  }
});

router.post('/api/add/courier', async (req, res) => {
  try {
    const { NOME, EMAIL, TELEFONE } = req.body;
    
    if (!NOME || !EMAIL) {
      return res.status(400).json({
        error: 'Campos obrigatórios ausentes',
        details: 'NOME e EMAIL são obrigatórios'
      });
    }

    const [result] = await db.query(
      'insert into couriers (NOME, EMAIL, TELEFONE) values (?, ?, ?)',
      [NOME, EMAIL, TELEFONE || '']
    );

    return res.status(201).json({
      COURIER_ID: result.insertId,
      NOME,
      EMAIL,
      TELEFONE
    });
  } catch (error) {
    console.error('Erro ao adicionar courier:', error);
    return res.status(400).send(error);
  }
});

router.put('/api/update/courier/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const { NOME, EMAIL, TELEFONE } = req.body;
    
    await db.query(
      'update couriers set NOME = ?, EMAIL = ?, TELEFONE = ? where COURIER_ID = ?',
      [NOME, EMAIL, TELEFONE, id]
    );

    return res.status(200).json({
      COURIER_ID: id,
      NOME,
      EMAIL,
      TELEFONE
    });
  } catch (error) {
    console.error('Erro ao atualizar courier:', error);
    return res.status(400).send(error);
  }
});

router.delete('/api/delete/courier/:id', async (req, res) => {
  try {
    const id = req.params.id;
    
    // Verificar se o courier existe
    const [exists] = await db.query('select COURIER_ID from couriers where COURIER_ID = ?', [id]);
    if (exists.length === 0) {
      return res.status(404).json({ error: 'Courier não encontrado' });
    }

    await db.query('delete from couriers where COURIER_ID = ?', [id]);
    return res.status(200).json({ message: 'Courier removido com sucesso!' });
  } catch (error) {
    console.error('Erro ao remover courier:', error);
    return res.status(400).send(error);
  }
});

  module.exports = router;

/** FIM DE ARQUIVO */