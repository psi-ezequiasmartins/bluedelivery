/**
 * src/index.js - server-backend (revisado em 02102025-092808)
 */

require('dotenv').config()
const express = require("express");
const cors = require("cors");
const http = require('http');
const { setupWebSocket } = require('./ws');

const public_routes = require('./public_routes');
const deliveryapp_routes = require('./routes_deliveryapp');
const courierapp_routes = require('./routes_courierapp');
const userapp_routes = require('./routes_userapp');
const pagseguro = require('./services/pagseguro');
const pix = require('./services/pix');
const sendmail = require('./services/sendmail');
const app = express();

app.use(cors());
app.use(express.json());
app.use('/', public_routes);
app.use('/', deliveryapp_routes);
app.use('/', courierapp_routes);
app.use('/', userapp_routes);
app.use(pix);
app.use(pagseguro);
app.use(sendmail);

console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'Configurado' : 'Não configurado');
console.log('JWT_SECRET:', process.env.JWT_SECRET);

const PORT = process.env.SERVER_PORT || 33570;
const server = http.createServer(app);
setupWebSocket(server);
server.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`)
});
