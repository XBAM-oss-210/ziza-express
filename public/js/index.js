//-------------------------------------------------------------------------------------------
const unaccessMsg = document.getElementById('unaccess-msg')
const closeBtn = document.getElementById('close-btn');
//----------------------BOUTON DE FERMETURE DE DIALOGUE BOX
    closeBtn.addEventListener('click',()=>{
        unaccessMsg.classList.add('hide')
    })

//----------------------------------------------------------------------------------------
const slides = document.querySelectorAll(".slide");
let index = 0;

if (slides.length > 0) {
    setInterval(() => {
        slides[index].classList.remove("active");
        index++;
        if (index >= slides.length) {
            index = 0;
        }
        slides[index].classList.add("active");
    }, 7000);
}
// -------------------------------------------------------------------------------------------
                        /*ANIMATION */

    const boxes = document.querySelectorAll(".service");

    boxes.forEach((box) => {
        const activate = () => box.classList.add("active");
        const deactivate = () => box.classList.remove("active");

        box.addEventListener("mouseenter", activate);
        box.addEventListener("mouseleave", deactivate);

        box.addEventListener("touchstart", activate);
        box.addEventListener("touchend", deactivate);
        box.addEventListener("touchcancel", deactivate);
        });


//------------------------SE DEROULE A LA CHARGEMENT DE LA PAGE --------------------------------
window.addEventListener("DOMContentLoaded", async () => {
    try {
        const clientFeedback = document.getElementById('client-feedback')
        const response = await fetch('client/feedbacks')
        const data = await response.json()
        
        if (data.feedbacks  &&  data.feedbacks.length>0) {
            const feedbacks = data.feedbacks;
            feedbacks.forEach((f) => {
            const feedbackCard = document.createElement('div');
            feedbackCard.innerHTML = `
                <span class="name">${f.feedback_sender}</span>
                <p class="comment">${f.comments}</p>
                `; 
            clientFeedback.appendChild(feedbackCard); 

            })
        }       
        
    } catch (error) {
        console.error(error)
    }
})

//----------------FONCTION DE VERIFICATION DE L'HEURE AVANT D'ACCEDER AU FORMULIARE ---------------


const verifyAccess = async(routeApi)=>{
    const unaccessMsgText = document.getElementById('unaccess-msg-text')


        try {
            const reponse = await fetch(routeApi, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            });

            const data = await reponse.json();
            console.log(data);
            
                                
            if (data.authorized ){
                window.location.href = data.redirect  

            } else{
                unaccessMsgText.textContent = data.message;
                unaccessMsg.classList.remove('hide');
            }
        } catch (erreur) {
            console.error('Erreur lors de la requête :', erreur);
        }     
        }

        const  feedformError =document.getElementById("feed-form-error") 
        const deliveryBtn = document.getElementById('delivery-btn');
        const serviceBtn =document.getElementById('service-btn')
        const feedbackBtn =document.getElementById('feedback-btn')


        deliveryBtn.addEventListener('click',()=>{
            verifyAccess('/client/api/check-delivery')
        })
        serviceBtn.addEventListener('click',()=>{
            verifyAccess('/client/api/check-services')
        })


        const feedbackForm = document.getElementById('feedback-form')
        feedbackForm.addEventListener('submit',async(e)=>{
            e.preventDefault()

    const name = document.getElementById('name').value.trim()
    const comment  = document.getElementById('comment').value.trim()
    
    if (name=== '' || comment  === '') {
            feedformError.classList.remove('hide');
            feedformError.classList.remove('message-success');
            feedformError.classList.add('message-error');
            feedformError.textContent = "Merci de remplir tous les champs";
    }
    try {
        const feedbackInput ={
                name,
                comment
            }
        const feedResponse = await fetch('/client/feedback',{
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(feedbackInput)
})

        const feedData = await feedResponse.json();
        
        if(!feedData.success){
            if(feedData.errors){
                errors =feedData.errors

            Object.entries(errors).forEach(([field, message]) => {
                const errorField = document.querySelector(`#error-${field}`);
                if (errorField) {
                    errorField.textContent = message;
                }
            const fieldWithError =document.getElementById(field)
            fieldWithError.addEventListener('input', () => {
                errorField.textContent = '';
                errorField.style.display = 'none';
            });
            })
            }
            if(feedData.message){
                feedformError.classList.remove('message-success');
                feedformError.classList.add('message-error');

                feedformError.textContent = feedData.message;
                feedformError.classList.remove('hide');
            }
        }  else{
                feedbackForm.reset()
                const successMsg = document.getElementById('success-msg')
                    successMsg.classList.remove('hide');
                    successMsg.classList.remove('message-error');
                    successMsg.classList.add('message-success');

                    successMsg.textContent = feedData.successMessage;

                    setTimeout(() => {
                        successMsg.textContent = '';
                        successMsg.classList.add('hide');
                    }, 3000);

        }
        
    } catch (erreur) {
        console.error('Échec de la requête:', erreur.message);
    }
        })

        const feedbackFields = document.querySelectorAll('.feedback-input')
        feedbackFields.forEach(inputField => {
            inputField.addEventListener('input',()=>{
                feedformError.textContent=''
                feedformError.classList.add('hide')
            })
        })



