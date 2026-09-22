const dayjs = require('dayjs');
const customParseFormat = require('dayjs/plugin/customParseFormat');
    dayjs.extend(customParseFormat);

    const phoneRegex = /^(70|71|75|76|77|78)[0-9]{7}$/


function firstStepVerification(name,phone,area) {
    const errors ={}
    if(!name || name.trim() ===''){
        errors.name = 'Veuillez entrer votre nom'
    }else if(name.length<3){
        errors.name =  'Le nom doit etre superieur a 3 lettres '
    }

    if(!phone || phone.trim() ===''){
        errors.phone = 'Numero   obligatoire'
    }else if (!phoneRegex.test(phone) || phone.length !== 9){
        errors.phone ="Numéro  invalide"  

    }
    if(!area  || area.trim()==='' ){
        errors.area ='Veuillez completer ce champ'
    }else if(area.length >40){
        errors.area = 'Le nom est trop long '
    }
    return errors
}


const firstValidation = (req,res,next)=>{
        const {
            senderName,
            senderPhone,
            recoveryZone,
            recipientName,
            recipientPhone,
            zone
        } = req.body;

        const senderErrors = firstStepVerification(
            senderName,
            senderPhone,
            recoveryZone
        );
        const recipientErrors = firstStepVerification(
            recipientName,
            recipientPhone,
            zone
        );
        const errors = {
            sender :senderErrors,
            recipient :recipientErrors
        };
            if (Object.keys(senderErrors).length > 0 || Object.keys(recipientErrors).length > 0) {
                return res.status(400).json({
                    errors,
                    firstValidationError:'Veuillez bien remplir les champs',
                    success:false 
                    
                });

            }
        next();

    }

    function validateHour(inputHour) {
        const parsed = dayjs(inputHour, "HH:mm", true);

        if (!parsed.isValid()) {
            return 'Veuillez entrer une heure valide';
        }
        return null;
    }

    function secondStepVerification(req) {
        const errors = {};
        const {
            packageType,
            hour,
            instruction,
            paymentMethod
        } = req.body;

        const paymentMethodAuthorized = [
            'wave',
            'orange-money',
            'cash'
        ];
        if (
            typeof paymentMethod !== 'string' ||
            !paymentMethodAuthorized.includes(paymentMethod)
        ) {
            errors.paymentMethod = 'Veuillez choisir un moyen de paiement';
        }
        if (
            typeof instruction !== 'string' ||
            instruction.trim() === ''
        ) {
            errors.instruction = 'Veuillez indiquer quelques instructions';
        }

        if (
            typeof packageType !== 'string' ||
            packageType.trim() === ''
        ) {
            errors.packageType = 'Veuillez choisir un type de colis';
        } else if (packageType.length > 35) {
            errors.packageType = 'Nom de colis invalide';
        }
        return errors
    }

    const secondValidation = (req,res,next)=>{
        const {hour} =req.body 
        const errors = secondStepVerification(req);
        const hourError = validateHour(hour);

        if (hourError ) {
            errors.hour = hourError;
        }
            
        if (Object.keys(errors).length > 0) {
            return res.status(400).json({
                errors,
                success: false
            });
        }

        next();
    }

//=--------------------VALIDATION DU FORMULAIRE SERVICE-------------------------
function dataServiceVerification(req) {
    const errors ={}

    const {
        fullname ,
        phone ,
        requestedService,
        instruction,
        proposalBudget
    }=req.body

    if(!fullname || fullname.trim() ===''){
        errors.fullname = 'Veuillez entrer votre nom'
    }else if(fullname.length<3){
        errors.fullname =  'Le nom doit etre superieur a 3 lettres '
    }

    if(!phone || phone.trim() ===''){
        errors.phone = 'Numero   obligatoire'
    }else if (!phoneRegex.test(phone) || phone.length !== 9){
        errors.phone ="Numéro  invalide"  
    }
    if(!requestedService ){
        errors.requestedService = 'Type de service  obligatoire '
    }
    if(!instruction || instruction.trim() ===''){
        errors.instruction = 'Veuillez entrer une instruction'
    }
    const budget = Number(proposalBudget);
    if(!proposalBudget || Number.isNaN(budget)  || budget <500){
        errors.proposalBudget = 'Veuillez proposer un budget '
    }


    return errors  
}



const  firstServiceDataValidation = (req,res,next)=>{

    const errors =dataServiceVerification(req)
    if (Object.keys(errors).length > 0) {
        return res.status(400).json({
            errors,
            success:false
        });
    }
    next();
}
//-------------------FEEDBACK VERIFICATION TEXTE --------------------------------
function feedbackCheck(req) {
    const errors ={}
    const {
        name ,
        comment
    }=req.body

    if(!name || name.trim() ===''){
        errors.name = 'Veuillez entrer votre nom'
    }else if(name.length<3){
        errors.name =  'Le nom doit etre superieur a 3 lettres '
    }
    if(!comment || comment.trim() ===''){
        errors.comment = 'Veuillez nous dire votre avis '
    }
    return errors
}
const  feedbackChecked = (req,res,next)=>{

    const errors =feedbackCheck(req)
    if (Object.keys(errors).length > 0) {
        return res.status(400).json({
            errors,
            success:false
        });
    }
    next();
}





module.exports = {firstValidation,secondValidation,firstServiceDataValidation,feedbackChecked};

