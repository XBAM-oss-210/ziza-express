const path = require('path')
const adminModel = require('../models/adminModel')
const rateLimitModel = require('../models/rateLimitModel')
const { getClientIp } = require('../middlewares/rateLimitMiddleware')
const bcrypt = require('bcrypt');

const loginAdmin = async (req, res) => {
    const ip = getClientIp(req);

    try {
        const { phone, password } = req.body;
        const existingAdmin = await adminModel.getAdmin();

        if (existingAdmin) {
            const admin = await adminModel.verifyAdmin(phone)
            if (!admin) {
                await rateLimitModel.registerFailedAttempt(ip);
                return res.status(401).json({ message: 'Identifiants invalides', success: false });
            }

            const passwordCorrect = await bcrypt.compare(password, admin.password_hash);
            if (!passwordCorrect) {
                await rateLimitModel.registerFailedAttempt(ip);
                return res.status(401).json({ message: 'Identifiants invalides', success: false });
            }

            await rateLimitModel.resetAttempts(ip);
            req.session.adminId = admin.id
            return res.status(200).json({ success: true });

        } else {
            const newAdmin = await adminModel.createAdmin(phone, password);
            return res.status(201).json({ success: true });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Erreur serveur.Reactualisez la page",
            success: false
        });
    }
};

const getAuthStatus = async (req, res) => {
    try {
        const ip = getClientIp(req);
        const record = await rateLimitModel.getRateLimit(ip);

        if (record && record.blocked_until && new Date(record.blocked_until) > new Date()) {
            const remainingSeconds = Math.ceil((new Date(record.blocked_until) - new Date()) / 1000);
            return res.status(200).json({ blocked: true, remainingSeconds });
        }

        return res.status(200).json({ blocked: false });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur serveur', success: false });
    }
};

function showAuthFormular(req, res) {
    res.sendFile(path.join(__dirname, '../../views/adminZiza/auth.html'));
}

module.exports = { loginAdmin, showAuthFormular, getAuthStatus }