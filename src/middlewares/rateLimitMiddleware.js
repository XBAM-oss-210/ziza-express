const rateLimitModel = require('../models/rateLimitModel');

const getClientIp = (req) => req.ip;

const checkRateLimit = async (req, res, next) => {
    try {
        const ip = getClientIp(req);
        const record = await rateLimitModel.getRateLimit(ip);

        if (record && record.blocked_until && new Date(record.blocked_until) > new Date()) {
            const remainingSeconds = Math.ceil(
                (new Date(record.blocked_until) - new Date()) / 1000
            );
            return res.status(429).json({
                success: false,
                blocked: true,
                remainingSeconds,
                message: 'Vous avez fait trop de tentatives. Veuillez réessayer plus tard.'
            });
        }

        next();
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur serveur. Réactualisez la page', success: false });
    }
};

module.exports = { checkRateLimit, getClientIp };