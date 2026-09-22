const pool = require('../config/database')

    const createDelivery = async (senderName ,senderPhone,recoveryZone,recipientName,recipientPhone, Zone ,packageType,hour,paymentMethod,instruction,statut) => {
    const result = await pool.query(
        `INSERT INTO deliveries (sender_name ,sender_phone,recovery_zone,recipient_name,recipient_phone, zone ,package_type,hour,payment_method,instruction,statut)
        VALUES ($1, $2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
        RETURNING *`,
        [senderName ,senderPhone,recoveryZone,recipientName,recipientPhone, Zone ,packageType,hour,paymentMethod,instruction,statut]
    );

    return result.rows[0];
    };

    const createService = async (fullname ,phone ,requestedService,proposalBudget,instruction) => {
    const result = await pool.query(
        `INSERT INTO  services(requester_name ,requester_phone ,service,proposed_price,service_details)
        VALUES ($1, $2,$3,$4,$5)
        RETURNING *`,
        [fullname ,phone,requestedService,proposalBudget,instruction]
    );

    return result.rows[0];
    };

    const feedbackAdding = async (name ,comment) => {
    const result = await pool.query(
        `INSERT INTO  feedbacks(feedback_sender,comments )
        VALUES ($1, $2)
        RETURNING *`,
        [name,comment ]
    );

    return result.rows[0];
    };

const getFeaturedFeedbacksfromModel = async () => {
    const result = await pool.query(
        `SELECT * FROM feedbacks WHERE is_featured = true ORDER BY created_at DESC ;`
    );

    return result.rows;
};


    module.exports = {
    createDelivery,createService,feedbackAdding,getFeaturedFeedbacksfromModel
    };
