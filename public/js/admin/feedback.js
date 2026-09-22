
window.addEventListener("DOMContentLoaded", async () => {
    try {
        const response = await fetch ('/admin_ziza/feedback')
        const data =  await response.json()
        if(data.feedbacks && data.feedbacks.length > 0){
            const feedbackContainer = document.getElementById('feedback-container')
            const feedbackCount = document.getElementById('feedback-count')
            const feedbacks = data.feedbacks
            const noneFeedback = document.getElementById('none-feedback')

            feedbackCount.textContent = data.countFeedback
            noneFeedback.classList.add('hide')

            feedbacks.forEach((f) => {
            const feedbackCard = document.createElement('div');
            feedbackCard.classList.add('feedback-card')

            feedbackCard.innerHTML = `
                <span class="name">${f.feedback_sender}</span>
                <p class="comment">${f.comments}</p>
                <button type="button" class="delete-btn" data-id="${f.id_feedback}" title="Supprimer">
                    <i class="fa-solid fa-trash"></i>
                </button>
                <button type="button" class="add-home-section" data-id="${f.id_feedback}"> 
                    <i class="fa-solid fa-square-plus"></i>${f.isFeatured ? 'Retirer de' : 'Ajouter à'} l'accueil
                </button>
            `; 
        
            feedbackContainer.appendChild(feedbackCard); 
                if(!noneFeedback.classList.contains('hide')){
                    noneFeedback.classList.add('hide')
                    }
        })
        document.querySelectorAll('.delete-btn').forEach((deleteBtn) => {
            deleteBtn.addEventListener('click', () => deleteFeedback(deleteBtn.dataset.id));
        });

        document.querySelectorAll('.add-home-section').forEach((btn) => {
            btn.addEventListener('click', () => addFeedbackToHome(btn.dataset.id, btn));
        });


        }
    } catch (error) {
        console.error('erreur lors de la recuperation des feedbacks',error);   
    }

})

async function deleteFeedback(id) {
    try {
        const response = await fetch(`/admin_ziza/feedbacks/${id}`, {
            method: 'DELETE'
        });
    if (!response.ok) throw new Error('Erreur lors de la suppression du message');    
    document.querySelector(`.delete-btn[data-id="${id}"]`)
        ?.closest('.feedback-card')
        ?.remove();
    
    } catch (error) {
        console.error(error);
        
    }
}

async function addFeedbackToHome(id,btnElement) {
    try {
        const response = await fetch(`/admin_ziza/feedbacks/${id}`,{
            method: 'PATCH'
        });
    if (!response.ok) throw new Error("Erreur lors de l'ajout  a l'accueil"); 
        const data = await response.json();
        console.log("Réponse du serveur :", data);

        const isFeatured = data.feedback.is_featured;
        btnElement.innerHTML = `
            <i class="fa-solid fa-square"></i> 
            ${isFeatured ? 'Retirer de' : 'Ajouter à'} l'accueil
        `;

    } catch (error) {
        console.error(error);
        alert("Impossible de mettre à jour ce feedback.");


    }
}