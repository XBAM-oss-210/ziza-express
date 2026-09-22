const wishService = document.getElementById('wishService');
const wishServiceContainer = document.getElementById('wishServiceContainer');
const customService = document.getElementById('customService');
const serviceMessage = document.getElementById('service-message')
const formService = document.getElementById('service-form')


    wishService.addEventListener('change', () => {
        const isOther = wishService.value === 'others';
            wishServiceContainer.hidden = !isOther;
            customService.required = isOther;

        if (!isOther) {
            customService.value = '';
        }
    });  
function getPackageValue() {
    return wishService.value === 'others' ? customService.value : wishService.value; 
}

formService.addEventListener('submit',async(e)=>{
    e.preventDefault()

    const fullname =document.getElementById('fullname').value.trim()
    const  phone =document.getElementById('phone').value.trim()
    const instruction  =document.getElementById('instruction').value.trim()
    const proposalBudget = document.getElementById("proposalBudget").value.trim()
    requestedService = getPackageValue()
    if(fullname ===''  || requestedService==='' || phone ==='' || instruction ==='' ||  proposalBudget ===''){
        serviceMessage.textContent ='Merci de remplir tout les champs '
        serviceMessage.classList.remove('hide')
        return
    }


    let serviceRequest = {}
        serviceRequest = {
        fullname ,
        phone ,
        instruction,
        requestedService,
        proposalBudget
    }
    try {
        const response = await fetch("/client/services", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(serviceRequest)
        });
        const data = await response.json();
//---------------------------------------------------------------------------------------------
console.log(response);

console.log(data)

        if(data.success){
                formService.reset()
                    serviceMessage.textContent = data.message
                    serviceMessage.classList.remove('hide')

                setTimeout(() => {
                    window.location.href = data.redirect;
                    serviceMessage.classList.add('hide')
                }, 5000);
                return
            }else{

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
                    serviceMessage.classList.remove('hide')
                    serviceMessage.textContent = data.error
                        return
                }
            }
        } catch (error) {
            console.error("Erreur lors de l'envoi :", error);
        }
//----------------------------------------------------------------------------------------------------
})


// Lorsque la personne saisie quelque chose les champs les erreus vont se supprimer automatiquement 
        const inputFields = document.querySelectorAll('.input-field')
        inputFields.forEach(inputField => {
            inputField.addEventListener('input',()=>{
                    serviceMessage.textContent=''
                    serviceMessage.classList.add('hide')
                
            })
            inputField.addEventListener('change',()=>{
                    serviceMessage.textContent=''
                    serviceMessage.classList.add('hide')                    
            })
        });
        







