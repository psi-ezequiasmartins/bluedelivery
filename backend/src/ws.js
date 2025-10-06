/**
 * Servidor WebSocket para eventos de pedidos (status)
 * src/ws.js
 */

const { Server } = require('socket.io');

let io = null;
const userSockets = new Map(); // userId -> Set(socket.id)

function setupWebSocket(server) {
  io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    }
  });

  io.on('connection', (socket) => {
    // Espera que o client envie o userId após conectar
    socket.on('registerUser', (userId) => {
      if (!userSockets.has(userId)) userSockets.set(userId, new Set());
      userSockets.get(userId).add(socket.id);
      socket.userId = userId;
    });

    socket.on('disconnect', () => {
      if (socket.userId && userSockets.has(socket.userId)) {
        userSockets.get(socket.userId).delete(socket.id);
        if (userSockets.get(socket.userId).size === 0) {
          userSockets.delete(socket.userId);
        }
      }
    });
  });
}

function emitPedidoUpdate(userId, data) {
  if (!io) return;
  const sockets = userSockets.get(String(userId));
  if (sockets) {
    for (const socketId of sockets) {
      io.to(socketId).emit('pedido_update', data);
    }
  }
}

module.exports = { setupWebSocket, emitPedidoUpdate };
