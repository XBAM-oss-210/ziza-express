const adminAuth = (req, res, next) => {
    if (!req.session.adminId) {
        return res.render('client/closed');
    }

    next();
    };
module.exports = adminAuth


