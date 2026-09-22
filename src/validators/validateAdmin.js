
const authAdmin = (req, res, next) => {
    const {phone,password,password2}  =req.body
    const phoneRegex = /^(70|71|75|76|77|78)[0-9]{7}$/
    const errors ={}

    if(!phone || phone.trim() ===''){
        errors.phone = 'Numero   obligatoire'
    }else if (!phoneRegex.test(phone) || phone.length !== 9){
        errors.phone ="Numéro  invalide"  
    }
    if (!password || password.trim() === "") {
        errors.password = "Le mot de passe est obligatoire";
    } else { 
        if (password.length < 8) {
            errors.password = "Le mot de passe doit contenir au moins 8 caractères";
        } 
    }
    if (!password2 || password2.trim() === "") {
        errors.password2 ="La confirmation du mot de passe est obligatoire";
    } else if (password !== password2) {
        errors.password2 ="Les mots de passe doivent correspondre ";
    }
    

    if (Object.keys(errors).length > 0) {
        return res.status(400).json({
            errors:errors,
            success:false
        });
    }
    next();
};


module.exports = {authAdmin};