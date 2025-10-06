/**
 * src/rotas.js
 * revisado em 02102025-093025
 * 
 * para verificar depois:
 * WebSocket e FCM (ajuste conforme sua implementação)
 * import { sendPushNotification } from './services/notifications.js';
 * import { getSocketInstance } from './ws.js';
 */

const express = require('express');
const authMiddleware = require('./auth.js');
const db = require('./config/database.js');
const jwt = require('jsonwebtoken');

const router = express.Router();

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
  '/api/delivery/:id',
  '/api/user/:id'
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

    const rawIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const IP_ADDRESS = rawIp.includes(',') ? rawIp.split(',')[0].trim() : rawIp;

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
      expiresIn: 10800,
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

    const rawIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const IP_ADDRESS = rawIp.includes(',') ? rawIp.split(',')[0].trim() : rawIp;

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
      expiresIn: 10800,
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
      CHV: delivery.CHV ? delivery.CHV : "0" // garantir que CHV nunca seja null (1 Ativo / 0 Inativo)
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

/** CREATE-READ-UPDATE-DELETE TABELA DELIVERIES */

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
      CHV: "1"
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
      CHV
    } = req.body;
    
    const [result] = await db.query(`insert into usuarios (
      FIREBASE_UID, NOME, SOBRENOME, TELEFONE, EMAIL, SENHA, URL_IMAGEM, CHV
      ) values (?, ?, ?, ?, ?, CONCAT('*', UPPER(SHA1(UNHEX(SHA1(MD5(?)))))), ?, ?) `,
       [FIREBASE_UID, NOME, SOBRENOME, TELEFONE, EMAIL, SENHA, URL_IMAGEM, CHV]);
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
      NOME,
      SOBRENOME,
      TELEFONE,
      EMAIL,
      URL_IMAGEM
    } = req.body;

    await db.query(`update usuarios 
      set NOME = ?, SOBRENOME = ?, TELEFONE = ?, EMAIL = ?,  URL_IMAGEM = ? where USER_ID = ? `, 
      [NOME, SOBRENOME, TELEFONE, EMAIL, URL_IMAGEM, id]
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
