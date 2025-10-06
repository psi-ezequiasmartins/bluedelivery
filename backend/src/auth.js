/**
 * auth.js
 */

const jwt = require('jsonwebtoken');
const { promisify } = require('util');

const authMiddleware = async (req, res, next) => {
    const { authorization } = req.headers;

    if (!authorization) {
        return res.status(401).json({ error: 'Token não fornecido' });
    }

    const [, token] = authorization.split(' ');
  
    try {
        const secret = process.env.JWT_SECRET || "#AB4EEAD4187EF4602BFC2E353D459195BAC1695";
        if (!secret) {
            throw new Error('JWT_SECRET não configurado');
        }
        await promisify(jwt.verify)(token, secret);
        return next();
    } catch (err) {
        console.error('Erro de autenticação:', err.message);
        return res.status(401).json({ error: 'Token inválido' });
    }
};

module.exports = authMiddleware;