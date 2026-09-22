const confirmDeliveryBtn = document.getElementById('confirm-delivery-btn')
const confirmServiceBtn = document.getElementById('confirm-service-btn')
const closeDialogBtn = document.getElementById('closeDialogBtn')
const closeServiceDialogBtn = document.getElementById('closeServiceDialogBtn')
 
let currentDeliveryId = null
let currentServiceId = null
 
const detailDialog = document.getElementById('detailDialog')
const detailsContent  = document.getElementById('detailsContent')
const servicedetailsContent = document.getElementById('servicedetailsContent')
const serviceDetailDialog = document.getElementById('serviceDetailDialog')
 
const noneDelivery = document.getElementById('none-delivery')
const deliveryTableBody = document.getElementById('delivery-table-body')
const tableDelivery = document.getElementById('delivery-table')
 
const serviceTable =  document.getElementById('services-table')
const noneService = document.getElementById('none-service')
const serviceTableBody = document.getElementById('services-table-body')
 
 
//------------------------LIVRAISON EN ATTENTE -------------------------------------
 
window.addEventListener("DOMContentLoaded", async () => {
 
    const greetAdmin = document.getElementById('greet')
    greetAdmin.textContent = greeting();
 
    try {
        const response = await fetch('/admin_ziza/dashboard-stats');
        const data = await response.json();
 
        const dailyOrder = document.getElementById('daily-order')
        const weeklyOrder =  document.getElementById('weekly-order')
        const monthlyOrder = document.getElementById('monthly-order')
 
        dailyOrder.textContent =  data.deliveryStat.dailyDeliveryCount
        weeklyOrder.textContent = data.deliveryStat.weeklyDeliveryCount
        monthlyOrder.textContent = data.deliveryStat.monthDeliveryCount
 
        if (data.deliveryStat.lastDeliveries && data.deliveryStat.lastDeliveries.length > 0){
 
            const deliveries = data.deliveryStat.lastDeliveries
            tableDelivery.classList.remove('hide')
            noneDelivery.classList.add('hide')
 
            deliveries.forEach((d, index) => {

                const frontendId = deliveries.length - index

                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${frontendId}</td>
                    <td>${d.sender_name}</td>
                    <td>${d.sender_phone}</td>
                    <td>${formatDateTime(d.date_creation)}</td>
                    <td><button class="detail-btn" data-id="${d.id_delivery}">Voir les details</button></td>
                    <td><button class="delivery-treat-btn" data-id="${d.id_delivery}">Traiter </button></td>
                    `;
                deliveryTableBody.appendChild(tr);
            })
 
            document.querySelectorAll('.detail-btn').forEach((btn) => {
                btn.addEventListener('click', () => showDetails(btn.dataset.id));
            });
 
            // Comportement par défaut : "Traiter" ouvre la même modale que "Voir les details",
            // c'est le bouton "Confirmer la livraison" dans la modale qui fait l'action réelle.
            document.querySelectorAll('.delivery-treat-btn').forEach((btn) => {
                btn.addEventListener('click', () => showDetails(btn.dataset.id));
            });
        }
 
        if (data.deliveryStat.lastServices && data.deliveryStat.lastServices.length > 0){
 
            const services = data.deliveryStat.lastServices
            serviceTable.classList.remove('hide')
            noneService.classList.add('hide')
 
            services.forEach((s, index) => {
                const frontendId = services.length - index

                const trService = document.createElement('tr');
                trService.innerHTML = `
                    <td>${frontendId}</td>
                    <td>${s.requester_name}</td>
                    <td>${s.requester_phone}</td>
                    <td>${s.service}</td>
                    <td><button class="service-detail-btn" data-id="${s.id_service}">Voir les details</button></td>
                    <td><button class="service-treat-btn" data-id="${s.id_service}">Traiter </button></td>
                    `;
                serviceTableBody.appendChild(trService);
            })
 
            document.querySelectorAll('.service-detail-btn').forEach((serviceBtn) => {
                serviceBtn.addEventListener('click', () => showServiceDetails(serviceBtn.dataset.id));
            });
 
            document.querySelectorAll('.service-treat-btn').forEach((btn) => {
                btn.addEventListener('click', () => showServiceDetails(btn.dataset.id));
            });
        }
 
        if (data.deliveryStat.lastFeedbacks && data.deliveryStat.lastFeedbacks.length > 0){
            const feedbackContainer = document.getElementById('feedback-container')
            const noneFeedback = document.getElementById('none-feedback')
 
            const feedbacks = data.deliveryStat.lastFeedbacks
            noneFeedback.classList.add('hide')
 
            feedbacks.forEach((f) => {

                const isFeatured = !!f.is_featured
 
                const feedbackCard = document.createElement('div');
                feedbackCard.classList.add('feedback-card')
                feedbackCard.innerHTML = `
                    <span class="name">${f.feedback_sender}</span>
                    <p class="comment">${f.comments}</p>
                    <button type="button" class="delete-btn" title="Supprimer" data-id="${f.id_feedback}"><i class="fa-solid fa-trash"></i></button>
                    <button type="button" class="add-home-section" data-id="${f.id_feedback}">
                        <i class="fa-solid fa-square-plus"></i>${isFeatured ? 'Retirer de' : 'Ajouter à'} l'accueil
                    </button>
                    `;
                feedbackContainer.appendChild(feedbackCard);
            })
 
            document.querySelectorAll('.delete-btn').forEach((deleteBtn) => {
                deleteBtn.addEventListener('click', () => deleteFeedback(deleteBtn.dataset.id));
            });
 
            // BUG corrigé : on passe bien btn.dataset.id (et non l'inexistant addHomeBtn)
            document.querySelectorAll('.add-home-section').forEach((btn) => {
                btn.addEventListener('click', () => addFeedbackToHome(btn.dataset.id, btn));
            });
        }
 
    } catch (error) {
        console.error("erreur Lors de la recuperation des donnees de livraison  ", error);
    }
});
 
 
//  Détails d'une Livraison-  Services - Feedbacks - avec dialogue box
 
async function showDetails(id) {
    try {
        const response = await fetch(`/admin_ziza/deliveries/${id}`);
        if (!response.ok) throw new Error('Erreur lors de la récupération des détails');
        const deliveryData = await response.json();
        currentDeliveryId = id
 
        detailsContent.innerHTML = `
            <p><strong>Expediteur  </strong></p>
                <p><strong>Nom Complet :</strong> ${deliveryData.sender_name}</p>
                <p><strong>Numero de Telephone  :</strong> ${deliveryData.sender_phone}</p>
                <p><strong>A recuperer a  :</strong> ${deliveryData.recovery_zone}</p>
 
            <p><strong>Destinataire   </strong></p>
                <p><strong>Nom Complet :</strong> ${deliveryData.recipient_name}</p>
                <p><strong>Téléphone :</strong> ${deliveryData.recipient_phone}</p>
                <p><strong> A livrer a :</strong> ${deliveryData.zone}</p>
            <p><strong>Information sur la colis</strong> </p>
            <p><strong>Type de Colis :</strong> ${deliveryData.package_type}</p>
            <p><strong>Heure de livraison souhaite :</strong> ${deliveryData.hour}</p>
            <p><strong>Moyen de paiement :</strong> ${deliveryData.payment_method}</p>
            <p><strong>Statut :</strong> ${deliveryData.statut}</p>
            `;
 
        detailDialog.showModal();
    } catch (err) {
        console.error(err);
    }
}
 
async function showServiceDetails(id) {
    try {
        const response = await fetch(`/admin_ziza/services/${id}`);
        if (!response.ok) throw new Error('Erreur lors de la récupération des détails');
        const serviceData = await response.json();
        currentServiceId = id
 
        servicedetailsContent.innerHTML = `
            <p><strong>ID :</strong> ${serviceData.id_service}</p>
                <p><strong>Nom Complet :</strong> ${serviceData.requester_name}</p>
                <p><strong>Numero de Telephone  :</strong> ${serviceData.requester_phone}</p>
                <p><strong>Service :</strong> ${serviceData.service}</p>
                <p><strong>Prix propose :</strong> ${serviceData.proposed_price}</p>
                <p><strong>Details :</strong> ${serviceData.service_details}</p>
                <p><strong>Cree le :</strong> ${serviceData.created_at}</p>
            `;
 
        serviceDetailDialog.showModal();
    } catch (error) {
        console.error(error);
    }
}
 
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
 
async function addFeedbackToHome(id, btnElement) {
    try {
        const response = await fetch(`/admin_ziza/feedbacks/${id}`, {
            method: 'PATCH'
        });
        if (!response.ok) throw new Error("Erreur lors de l'ajout  a l'accueil");
        const data = await response.json();
        const isFeatured = data.feedback.is_featured;
        btnElement.innerHTML = `
            <i class="fa-solid fa-square-plus"></i>
            ${isFeatured ? 'Retirer de' : 'Ajouter à'} l'accueil
        `;
 
    } catch (error) {
        console.error(error);
        alert("Impossible de mettre à jour ce feedback.");
    }
}
 
async function confirmDelivery(id) {
    try {
        const response = await fetch(`/admin_ziza/deliveries/${id}/confirm`, {
            method: 'PATCH'
        });
        if (!response.ok) throw new Error('Erreur lors de la confirmation de la livraison');
            const statutP = detailsContent.querySelector('p:last-child');
        if (statutP) statutP.innerHTML = `<strong>Statut :</strong> delivered`;
        detailDialog.close();

        // On retire uniquement le bouton "Traiter", "Voir les details" reste visible
        document.querySelector(`.delivery-treat-btn[data-id="${id}"]`)?.remove();

    } catch (error) {
        console.error(error);
        alert("Impossible de confirmer cette livraison.");
    }
}
 
async function confirmService(id) {
    try {
        const response = await fetch(`/admin_ziza/services/${id}/confirm`, {
            method: 'PATCH'
        });
        if (!response.ok) throw new Error('Erreur lors de la confirmation du service');
 
        serviceDetailDialog.close();
        document.querySelector(`.service-detail-btn[data-id="${id}"]`)?.closest('tr')?.remove();
 
        if (serviceTableBody.children.length === 0) {
            serviceTable.classList.add('hide');
            noneService.classList.remove('hide');
        }
    } catch (error) {
        console.error(error);
        alert("Impossible de confirmer ce service.");
    }
}
 
 
//------------------------ECOUTEUR D'EVENEMENT QUI FERME LES DIALOGUES ----------------------------
 
closeDialogBtn.addEventListener('click', () => detailDialog.close());
closeServiceDialogBtn.addEventListener('click', () => serviceDetailDialog.close());
 
confirmDeliveryBtn.addEventListener('click', () => {
    if (currentDeliveryId !== null) confirmDelivery(currentDeliveryId);
});
 
confirmServiceBtn.addEventListener('click', () => {
    if (currentServiceId !== null) confirmService(currentServiceId);
});
 
 
//--------------------------------SALUTATION ---------------------------------------------------
 
function greeting() {
 
    const now = new Date();
    const formatter = new Intl.DateTimeFormat('fr-FR', {
        timeZone: 'Africa/Dakar',
        hour: '2-digit',
        hour12: false
    });
    const parties = formatter.formatToParts(now);
    const hour = Number(parties.find(p => p.type === 'hour').value);
 
    let greet
    // BUG corrigé : bornes ajustées (>= / <=) pour couvrir toutes les heures 0-23 sans trou (ex: 10h, 18h, 21h tombaient dans le "else" avant)
    if (hour >= 6 && hour < 10) {
        greet = 'Fall ziar naka matinal  bi. Athieu diouk lidianeti dji xaliss '
    } else if (hour >= 10 && hour < 18) {
        greet = 'Aytieu liguey rek Fall kay xole nax ame nga livraison wla job  '
    } else if (hour >= 18 && hour < 21) {
        greet = 'Legui heure wathie diote  deme waxtane ak bae 😉 '
    } else if (hour >= 21 && hour < 23) {
        greet = 'Bonsoir monsieur Aziz  !'
    } else {
        greet = 'Loy oute fi  heure bi way demal sawi teh teudi saway '
    }
    return greet
}

function formatDateTime(rawDate) {
    if (!rawDate) return ''
    const date = new Date(rawDate)
    if (isNaN(date)) return rawDate // si jamais ce n'est pas une date valide, on affiche tel quel

    return new Intl.DateTimeFormat('fr-FR', {
        timeZone: 'Africa/Dakar',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }).format(date)
}