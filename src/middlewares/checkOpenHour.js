

function isOpenNow() {
    const now = new Date();
    const formatter = new Intl.DateTimeFormat('fr-FR', {
        timeZone: 'Africa/Dakar',
        hour: '2-digit',
        hour12: false
    });
    const parties = formatter.formatToParts(now);
    const hour = Number(parties.find(p => p.type === 'hour').value);
    return hour>= 6 && hour < 21;
}

const checkOpenHours = (req, res, next) => {
    if (!isOpenNow()) {
        return res.status(403).json({
            authorized: false,
            message: "Service ouvert de 6h à 21h. Revenez demain. Merci !"
        });
    }
    next();

};

module.exports = { checkOpenHours,isOpenNow };

