const pool = require('../config/database')
//-----------------------------------DASHBOARD--------------------------------------------

    const countDeliveriesToday = async () => {
        const result = await pool.query(`
            SELECT COUNT(*)
            FROM deliveries
            WHERE date_creation >= CURRENT_DATE
            AND date_creation < CURRENT_DATE + INTERVAL '1 day'
        `);

        return parseInt(result.rows[0].count);
        };
    const countDeliveriesWeek= async () => {
        const result = await pool.query(`
            SELECT COUNT(*)
            FROM deliveries
            WHERE date_creation >= CURRENT_DATE - INTERVAL '6 days'
            AND date_creation < CURRENT_DATE + INTERVAL '1 day'
        `);

        return parseInt(result.rows[0].count);
        };


    const countDeliveriesMonth= async () => {
        const result = await pool.query(`
            SELECT COUNT(*)
            FROM deliveries
            WHERE date_creation >= DATE_TRUNC('month', CURRENT_DATE)

        `);

        return parseInt(result.rows[0].count);
        };


    const getById = async (id_delivery) => {
        const result = await pool.query('SELECT * FROM deliveries WHERE id_delivery = $1', [id_delivery]);
        return result.rows[0];
    }
    const getserviceById = async (id_service) => {
        const result = await pool.query('SELECT * FROM services WHERE id_service = $1', [id_service]);
        return result.rows[0];
    }
    const getDailyDeliveries  = async () => {
        const result = await pool.query(`
            SELECT *  
            FROM deliveries
            WHERE date_creation >= CURRENT_DATE
            AND date_creation < CURRENT_DATE + INTERVAL '1 day'
            ORDER BY date_creation DESC;

        `);

        return result.rows;
        };

    const getDailyServices  = async () => {
        const result = await pool.query(`
            SELECT *
            FROM services
            WHERE created_at >= CURRENT_DATE
            AND created_at < CURRENT_DATE + INTERVAL '1 day'
            ORDER BY created_at DESC;

        `);

        return result.rows;
        };


    const getDailyFeedbacks  = async () => {
        const result = await pool.query(`
            SELECT *
            FROM feedbacks
            WHERE created_at >= CURRENT_DATE
            AND created_at < CURRENT_DATE + INTERVAL '1 day'
            ORDER BY created_at DESC;

        `);

        return result.rows;
        };


const confirmDelivery = async (id_delivery) => {
    const result = await pool.query(
        `UPDATE deliveries 
            SET statut = 'delivered' 
            WHERE id_delivery = $1 
            RETURNING *;`,
        [id_delivery]
    );

    return result.rows[0];
};
const confirmService = async (id_service) => {
    const result = await pool.query(
        `UPDATE services 
            SET statut = 'resolved' 
            WHERE id_service = $1 
            RETURNING *;`,
        [id_service]
    );

    return result.rows[0];
};

const deleteFeedbackById = async (id) => {
    const result = await pool.query(
        `DELETE FROM feedbacks WHERE id_feedback = $1 RETURNING *;`,
        [id]
    );


    return result.rows[0]; // renvoie la ligne supprimée, ou undefined si rien trouvé
};

const toggleFeedbackFeatured = async (id) => {
    const result = await pool.query(
    `UPDATE feedbacks 
        SET is_featured = NOT is_featured 
        WHERE id_feedback = $1 
        RETURNING *;`,
    [id]
    );

    return result.rows[0];
};


//-------------------------------DELIVERY -TRACKING-----------------------------------------
    const getAllDeliveries  = async () => {
        const result = await pool.query(`
            SELECT *  
            FROM deliveries
            ORDER BY date_creation DESC;
        `);

        return result.rows;
        };
//-----------------------------------SERVICES ----------------------------------------------
    const getAllServices  = async () => {
        const result = await pool.query(`
            SELECT *  
            FROM services
            ORDER BY created_at DESC;
        `);

        return result.rows;
        };
//----------------------------------FEEDBACK -----------------------------------------------
    const getAllFeedbacks  = async () => {
        const result = await pool.query(`
            SELECT *  
            FROM feedbacks
            ORDER BY created_at DESC;
        `);

        return result.rows;
        };

    const countFeedback= async () => {
        const result = await pool.query(`
            SELECT COUNT(*)
            FROM feedbacks
        `);

        return parseInt(result.rows[0].count);
        };



module.exports = {
    confirmDelivery,
    confirmService,
    
    countDeliveriesToday,
    countDeliveriesWeek,
    countDeliveriesMonth,

    getById,
    getserviceById,
    deleteFeedbackById,

    toggleFeedbackFeatured,

    getDailyDeliveries,
    getDailyServices,
    getDailyFeedbacks,

    getAllDeliveries,
    getAllServices,
    getAllFeedbacks,

    countFeedback
}
