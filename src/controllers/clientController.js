
const path =require('path')
const {firstValidation} =require('../validators/validateClient')
const {createDelivery,createService,feedbackAdding,getFeaturedFeedbacksfromModel} = require("../models/clientModel");
const { isOpenNow } = require('../middlewares/checkOpenHour'); 

/*


*/


const  checkDelivery = (req, res, next) => {
    if (isOpenNow()) {
        res.json({
            authorized: true,
            redirect: '/client/delivery'
        });
    } else {
        res.json({
            authorized: false,
            message: "Service ouvert de 6h à 21h. Revenez demain. Merci !"
        });
    }
};

const checkService = (req, res, next) => {
    if (isOpenNow()) {
        res.json({
            authorized: true,
            redirect: '/client/services'
        });
    } else {
        res.json({
            authorized: false,
            message: "Service ouvert de 6h à 21h. Revenez demain. Merci !"
        });
    }
};

const showDelivery =  (req, res) => {
    res.render('client/delivery'); 
}
const showService = (req, res) => {
    res.render('client/services'); 
}

//----------------------------------LIVRAISON  CONTROLLERS------------------

    const registerDelivery = async (req, res) => {

    const {
        senderName, senderPhone, recoveryZone,
        recipientName, recipientPhone, zone,
        packageType, hour, instruction, paymentMethod
        } = req.body;
    try {
        await createDelivery(senderName,senderPhone,recoveryZone,recipientName,recipientPhone,zone,packageType,hour,paymentMethod,instruction);
        res.status(201).json({
        message: `Merci pour votre commande ! Nous nous occupons de votre livraison dans les plus brefs delais. ` ,
        redirect:'/',
        success:true
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Erreur lors de l'enregistrement de la livraison",
            success:false
        });
    }
    };




//----------------------------------SERVICE CONTROLLERS------------------

const registerService = async(req,res)=>{
    const {
        fullname ,
        phone ,
        instruction,
        requestedService,
    }=req.body
    const proposalBudget = Number(req.body.proposalBudget);

    try {
        await createService(fullname ,phone ,requestedService,proposalBudget,instruction);
        res.status(201).json({
        message: `Votre demande de service a ete bien recu ! nous vous repondrons des que possible  ` ,
        success:true,
        redirect:'/'
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Erreur lors de l'enregistrement de  votre demande ",
            success:false
        });
    }
}

//---------------------------FEEDBACK------------------------------------------------

const feedbackSave = async(req,res)=>{
    const {name,comment}=req.body
    try {
        await feedbackAdding(name,comment);
        res.status(201).json({
        successMesssage: `Merci pour votre avis ! Nous apprécions votre retour  ` ,
        success:true
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success:false,
            error: error
        });
    }
}


const getFeaturedFeedbacks = async (req, res) => {
    try {
        const feedbacks = await getFeaturedFeedbacksfromModel();
        res.status(200).json({feedbacks});
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erreur serveur' });
    }
}

module.exports = {  
                    registerDelivery,
                    registerService,
                    checkDelivery,
                    checkService,
                    showDelivery,
                    showService,
                    feedbackSave,
                    getFeaturedFeedbacks
                        };
