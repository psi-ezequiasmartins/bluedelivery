/**
 * Rotas do CourierApp extraídas de rotas.js (se houver)
 */

const express = require('express');
const authMiddleware = require('./auth.js');
const db = require('./config/database.js');
const router = express.Router();

// ROTAS PÚBLICAS COURIER-APP (ajuste conforme necessário)
const publicRoutes = [
	// Exemplo: '/courier-app/ping', etc.
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

// --- Rotas COURIER-APP ---
// (No momento, apenas CRUD global de couriers está presente. Adicione rotas específicas aqui se necessário)

module.exports = router;
