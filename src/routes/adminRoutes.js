const express = require('express')
const router =express.Router()
const path = require('path')

const {authAdmin} = require('../validators/validateAdmin')

const adminController =require('../controllers/adminController')
const adminPageController =require ('../controllers/adminPagesController')

const adminAuth= require('../middlewares/authMiddleware')
const { checkRateLimit } = require('../middlewares/rateLimitMiddleware')

const { getAllDeliveries } = require('../models/adminPagesModel')

// validation du formulaire d'authentification admin


router.post('/auth', checkRateLimit, authAdmin, adminController.loginAdmin)
// router.get('/auth', adminController.showAuthFormular)
router.get('/auth/status', adminController.getAuthStatus)

router.use(adminAuth)

router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Erreur destroy session:', err);
            return res.status(500).send('Erreur lors de la déconnexion');
        }
        res.clearCookie('connect.sid');
        res.status(200).json({ message: 'Déconnecté avec succès' });
    });
});

router.get('/dashboard',(req,res)=>{
    res.render('adminZiza/dashboard')
})
router.get('/dashboard-stats',adminPageController.overview)


router.get('/livraison',(req,res)=>{
    res.render('adminZiza/delivery-tracking')
})
router.get('/deliveries',adminPageController.getAllDeliveries)
router.get('/deliveries/:id', adminPageController.getDeliveryById);
router.patch('/deliveries/:id/confirm', adminPageController.confirmDelivery);


router.get('/service',(req,res)=>{
    res.render('adminZiza/services')
})
router.get('/services',adminPageController.getAllServices)
router.get('/services/:id_service', adminPageController.getServiceById);
router.patch('/services/:id_service/confirm', adminPageController.confirmService);


router.get('/avis',(req,res)=>{
    res.render('adminZiza/feedback')
})
router.get('/feedback',adminPageController.getAllFeedbacks)
router.delete('/feedbacks/:id_feedback',adminPageController.deleteFeedback)
router.patch('/feedbacks/:id_feedback', adminPageController.toggleFeedback);


module.exports =router

