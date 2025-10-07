/**
 * src/config/database.js
*/

const mysql = require('mysql');
require('dotenv').config();

// Criar conexão com pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'bluedelivery',
  password: process.env.DB_PASSWORD || 'AB4EEAD4187EF4602BFC2E353D459195BAC1695E',
  database: process.env.DB_NAME || 'bluedelivery',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Função para promisificar as queries
const query = (sql, params) => {
  return new Promise((resolve, reject) => {
    pool.query(sql, params, (error, results) => {
      if (error) {
        return reject(error);
      }
      return resolve([results]);
    });
  });
};

// Exporta o objeto com método query promisificado
module.exports = { query };
