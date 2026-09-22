
const express = require('express');
const { 
        checkDelivery,
        checkService,
        showDelivery,
        showService,
        registerDelivery ,
        registerService,
        feedbackSave,
        getFeaturedFeedbacks} = require('../controllers/clientController');

const {checkOpenHours}=require('../middlewares/checkOpenHour')
const {firstValidation,
        secondValidation,
        firstServiceDataValidation,
        feedbackChecked
} = require('../validators/validateClient')


const router = express.Router();

//PROTECTION DES ROUTES QUI MENENT AU FORMULAIRE SERVICES ET LIVRAISON
        router.get('/api/check-delivery', checkDelivery);
        router.get('/delivery',checkOpenHours, showDelivery);

        router.get('/api/check-services', checkService);
        router.get('/services',checkOpenHours, showService);
        router.get('/feedbacks',getFeaturedFeedbacks)

// Vérification (appelée par fetch en JS) → JSON

        router.post('/delivery',firstValidation,secondValidation,registerDelivery);
        router.post('/services', firstServiceDataValidation,registerService);

        router.post('/feedback',feedbackChecked,feedbackSave)


module.exports = router;


