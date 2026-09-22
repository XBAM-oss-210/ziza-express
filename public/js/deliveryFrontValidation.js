
    const packageInfo = document.getElementById('package-info');
    const contactInfo = document.getElementById('delivery-contact');

    const contactForm = document.getElementById('contactForm');
    const packageForm= document.getElementById('packageForm');
    
    const packageTypes = document.getElementById('packageTypes');
    const customPackageContainer = document.getElementById('customPackageContainer');
    const customPackage = document.getElementById('customPackage');
    
    const deliveryZone = document.getElementById('deliveryZone');
    const customZoneContainer = document.getElementById('customZoneContainer');
    const customZone = document.getElementById('customZone');

    const contactformError = document.querySelector('#delivery-contact .form-error');
    const packageformError = document.querySelector('#package-info .form-error');
//--------------------------------------------FONCTION QUI PERMET DE CHOISIR UNE VALEUR ENTRE SAISIE OU SELECT
function getZoneValue() {
    return deliveryZone.value === 'autre' ? customZone.value : deliveryZone.value;
}
function getPackageValue() {
    return packageTypes.value === 'autres' ? customPackage.value : packageTypes.value; 
}

//--------------------Ecouteur d'evenement pour ecouter le changement en formulaire du select ou pas 
    deliveryZone.addEventListener('change', () => {
        const isOther = deliveryZone.value === 'autre';
            customZoneContainer.hidden = !isOther;
            customZone.required = isOther;
        if (isOther) {
            customZone.value = '';
            customZone.focus();
        }
    });

    packageTypes.addEventListener('change', () => {
        const isOther = packageTypes.value === 'autres';
            customPackageContainer.hidden = !isOther;
            customPackage.required = isOther;

        if (isOther) {
            customPackage.value = '';
            customPackage.focus()
        }
    });  

let userData={}
//-------------------------validation premier  formulaires 
    contactForm.addEventListener('submit',(e)=>{
        const senderName = document.getElementById('sender-name').value.trim()
        const senderPhone = document.getElementById('sender-phone').value.trim()
        const recoveryZone  = document.getElementById('recoveryZone').value.trim()
        const recipientName = document.getElementById('recipient-name').value.trim()
        const recipientPhone = document.getElementById('recipient-phone').value.trim()

        const zone = getZoneValue();


        e.preventDefault()
        if(senderName ==='' || senderPhone==='' || recoveryZone ==="" || recipientName ===  "" || recipientPhone === "" ||  !zone ){
            contactformError.textContent = 'Merci de remplir tous les champs';
            contactformError.classList.remove('hide');
                return   
        }
        userData ={
            senderName,
            senderPhone,
            recoveryZone,
            recipientName,
            recipientPhone,
            zone
        }

        contactInfo.classList.add('hide')
        packageInfo.classList.remove('hide')
        packageInfo.classList.add('show')

    })
//-----------------------------------VALIDATION DES INFORMATIONS SUR LE PACKET 


        packageForm.addEventListener('submit',async(e)=>{
            e.preventDefault()

            const paymentMethod = document.querySelector('.payment-method:checked')?.value.trim();
            const instruction = document.getElementById('instruction').value.trim();
            const hour = document.getElementById('hour').value;
            const packageType = getPackageValue().trim();


            if(!paymentMethod || !instruction  ||  !hour   ||  !packageType){
                packageformError.textContent = 'Merci de remplir tous les champs';
                packageformError.classList.remove('hide');
                return   
            }
            userData = {
            ...userData,
            paymentMethod,
            instruction,
            hour,
            packageType
        };

        try {
            const response = await fetch('/client/delivery', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData)
            });
            const data = await response.json();
            console.log(response);
            console.log('reponse du serveur :',data);


            if(data.success){
                packageForm.reset()
                contactForm.reset() 

                    const successMsg = document.getElementById('success')
                    successMsg.textContent = data.message
                    successMsg.classList.remove('hide')

                setTimeout(() => {
                    window.location.href = data.redirect;
                    successMsg.classList.add('hide')
                }, 3000);
                return
            }else{
                if(data.firstValidationError){
    
                    packageInfo.classList.add('hide')
                    packageInfo.classList.remove('show')
                    contactInfo.classList.remove('hide')

                    contactformError.textContent = data.firstValidationError
                    contactformError.classList.remove('hide')
                    packageForm.reset()
                    
                    return
//----------------------------------------------------------------
                }
                if(data.errors){
                    const errors = data.errors
                    Object.entries(errors).forEach(([field, message]) => {
                        const errorField = document.querySelector(`#error-${field}`);
                        if (errorField) {
                            errorField.textContent = message;
                        }
                    const fieldWithError =document.getElementById(field)

                    if (!fieldWithError) return;

                    const eventType = (fieldWithError.tagName === 'SELECT' || fieldWithError.type === 'radio')
                        ? 'change'
                        : 'input';

                    fieldWithError.addEventListener(eventType, () => {
                        errorField.textContent = '';
                    }, { once: true });

                    })
                    return
                }

            if(data.error){
                packageformError.classList.remove('hide')
                packageformError.textContent = "Erreur lors de l'enregistrement de la livraison"
            }
            }
        } catch (error) {
            console.error("Erreur lors de l'envoi :", error);
        }
    })

// Lorsque la personne saisie quelque chose les champs les erreus vont se supprimer automatiquement 
        const inputFields = document.querySelectorAll('.input-field')
        inputFields.forEach(inputField => {
            inputField.addEventListener('input',()=>{
                if(packageForm.contains(inputField)){
                    packageformError.textContent=''
                    packageformError.classList.add('hide')
                }else{
                    contactformError.textContent=''
                    contactformError.classList.add('hide')                    
                }

            })
            inputField.addEventListener('change',()=>{
                if(packageformError.contains(inputField)){
                    packageformError.textContent=''
                    packageformError.classList.add('hide')
                }else{
                    contactformError.textContent=''
                    contactformError.classList.add('hide')                    
                }               
            })

        });





    
        