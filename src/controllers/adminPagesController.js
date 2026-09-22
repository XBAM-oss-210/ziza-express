
const adminPagesModel =require('../models/adminPagesModel')


//-----------------------------DASHBOARD -------------------------------------------------

const overview =async (req,res) => {
    const deliveryStat ={}

    try {
        const dailyDeliveryCount = await adminPagesModel.countDeliveriesToday()
        const weeklyDeliveryCount  = await adminPagesModel.countDeliveriesWeek()
        const monthDeliveryCount=  await adminPagesModel.countDeliveriesMonth()

        deliveryStat.dailyDeliveryCount = dailyDeliveryCount || '-';
        deliveryStat.weeklyDeliveryCount = weeklyDeliveryCount || '-';
        deliveryStat.monthDeliveryCount = monthDeliveryCount || '-';

    

        deliveryStat.lastDeliveries = await adminPagesModel.getDailyDeliveries()
        deliveryStat.lastServices = await adminPagesModel.getDailyServices()
        deliveryStat.lastFeedbacks = await adminPagesModel.getDailyFeedbacks()        
            res.status(200).json({
                deliveryStat 
    })

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erreur serveur' });
    }
}
    const getDeliveryById= async (req, res) => {
        try {
            const delivery = await adminPagesModel.getById(req.params.id);
            if (!delivery) {
                return res.status(404).json({ message: ' Livraison Introuvable ' });
            }
            res.status(200).json(delivery);
        } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Erreur serveur' });
        }
    }
    
const confirmDelivery = async (req, res) => {
    try {
        const delivery = await adminPagesModel.confirmDelivery(req.params.id);
        if (!delivery) {
            return res.status(404).json({ message: 'Livraison Introuvable' });
        }
        res.status(200).json({ delivery });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erreur serveur' });
    }
}
    const getServiceById= async (req, res) => {
        try {
            const service = await adminPagesModel.getserviceById(req.params.id_service);
            if (!service) {
                return res.status(404).json({ message: ' Service Introuvable ' });
            }
            res.status(200).json(service);
        } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Erreur serveur' });
        }
    }
const confirmService = async (req, res) => {
    try {
        const service = await adminPagesModel.confirmService(req.params.id_service);
        if (!service) {
            return res.status(404).json({ message: 'Service Introuvable' });
        }
        res.status(200).json({ service });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erreur serveur' });
    }
}

    const deleteFeedback = async (req, res) => {
    try {
        const deleted = await adminPagesModel.deleteFeedbackById(req.params.id_feedback);
        if (!deleted) {
            return res.status(404).json({ message: 'Feedback introuvable' });
        }
        res.status(200).json({ message: 'Feedback supprimé avec succès' });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erreur serveur' });
    }
}

const toggleFeedback = async (req, res) => {
    try {
        const updated = await adminPagesModel.toggleFeedbackFeatured(req.params.id_feedback);
        if (!updated) {
            return res.status(404).json({ message: 'Feedback introuvable' });
        }
        res.status(200).json({ 
            message: updated.is_featured 
                ? 'Feedback ajouté à l\'accueil' 
                : 'Feedback retiré de l\'accueil', 
            feedback: updated
});

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erreur serveur' });
    }
}

const getFeaturedFeedbacks = async (req, res) => {
    try {
        const feedbacks = await adminPagesModel.getFeaturedFeedbacks();
        res.status(200).json(feedbacks);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erreur serveur' });
    }
}
//-------------------------------DELIVERY -TRACKING-----------------------------------------

const getAllDeliveries = async (req, res) => {
    try {
        const deliveries = await adminPagesModel.getAllDeliveries();
        res.status(200).json({ deliveries });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};
//----------------------------------FEEDBACK -----------------------------------------------

const getAllFeedbacks= async (req, res) => {
    try {
        const feedbacks = await adminPagesModel.getAllFeedbacks();
        const countFeedback = await  adminPagesModel.countFeedback()
        res.status(200).json({ feedbacks,countFeedback });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};
//-----------------------------------SERVICES ----------------------------------------------

const getAllServices= async (req, res) => {
    try {
        const services = await adminPagesModel.getAllServices();
        res.status(200).json({ services });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

module.exports = {
    overview,
    
    confirmDelivery,
    confirmService,
    getDeliveryById,
    getServiceById,

    toggleFeedback,
    getFeaturedFeedbacks,
    deleteFeedback,

    getAllDeliveries,
    getAllServices,
    getAllFeedbacks

}