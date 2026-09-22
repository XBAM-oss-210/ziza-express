const refreshBtn= document.getElementById('refresh-btn')
const closeBtn = document.getElementById('close-btn')
detailDialog  =document.getElementById('detail-dialog')

refreshBtn.addEventListener('click',()=>{
    location.reload()
})
closeBtn.addEventListener('click',()=>{
    detailDialog.close()
})
let dataDisplayed = [];

window.addEventListener("DOMContentLoaded", async () => {

    try {
        const response = await fetch('/admin_ziza/deliveries');
        const data = await response.json();
        

            const noneAllDelivery = document.getElementById('none-Alldelivery')
            const tableDelivery = document.getElementById('table-delivery')
            if (data.deliveries && data.deliveries.length > 0){

                if(!noneAllDelivery.classList.contains('hide')){
                    noneAllDelivery.classList.add('hide')
                }
                const deliveries = data.deliveries
                tableDelivery.classList.remove('hide')
                dataDisplayed =data .deliveries           
                displayTable (dataDisplayed) 

        }
        }catch (error) {
        console.error("erreur Lors de la recuperation des donnees de livraison  ",error);
    }
});


async function showDetails(id) {
    try {
        const response = await fetch(`/admin_ziza/deliveries/${id}`);
        if (!response.ok) throw new Error('Erreur lors de la récupération des détails');
        const deliveryData = await response.json();
        const detailContent = document.getElementById('detail-content')
        detailContent.innerHTML = `
            <p><strong>Expediteur  </strong></p>         
                <p><strong>Nom Complet :</strong> ${deliveryData.sender_name}</p>
                <p><strong>Numero de Telephone  :</strong> ${deliveryData.sender_phone}</p>
                <p><strong>A recuperer a  :</strong> ${deliveryData.recovery_zone }</p>
                
            <p><strong>Destinataire   </strong></p>
                <p><strong>Nom Complet :</strong> ${deliveryData.recipient_name }</p>
                <p><strong>Téléphone :</strong> ${deliveryData.recipient_phone }</p>
                <p><strong> A livrer a :</strong> ${deliveryData.zone }</p>
            <p><strong>Information sur la colis</strong> </p>
            <p><strong>Type de Colis :</strong> ${deliveryData.package_type }</p>
            <p><strong>Heure de livraison souhaite :</strong> ${deliveryData.hour }</p>
            <p><strong>Moyen de paiement :</strong> ${deliveryData.payment_method }</p>
            <p><strong>Statut :</strong> ${deliveryData.statut }</p>
            `;

        detailDialog.showModal();
    } catch (err) {
        console.error(err);
    }
}


function displayTable(data) {
    const deliveryTableBody = document.getElementById('delivery-table-body');
    deliveryTableBody.innerHTML = '';

    data.forEach((d, index) => {
        const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${index + 1}</td>
                <td>${d.sender_name}</td>
                <td>${d.sender_phone}</td>
                <td><button class="detail-btn" data-id="${d.id_delivery}">Voir les details</button></td>
                <td>${d.statut !== 'delivered' ? `<button class="delivery-treat-btn" data-id="${d.id_delivery}">Traiter </button>` : ''}</td>
            `;
        deliveryTableBody.appendChild(tr);
    });

        document.querySelectorAll('.detail-btn').forEach((btn) => {
            btn.addEventListener('click', () => showDetails(btn.dataset.id));
        });

        document.querySelectorAll('.delivery-treat-btn').forEach((btn) => {
            btn.addEventListener('click', () => confirmDelivery(btn.dataset.id));
        });
}

async function confirmDelivery(id) {
    try {
        const response = await fetch(`/admin_ziza/deliveries/${id}/confirm`, {
            method: 'PATCH'
        });
        if (!response.ok) throw new Error('Erreur lors de la confirmation de la livraison');

        const updated = await response.json();

        // Met à jour le statut en mémoire pour que le filtre reste cohérent
        const item = dataDisplayed.find(d => d.id_delivery == id);
        if (item) item.statut = updated.delivery.statut;

        // Retire uniquement le bouton "Traiter", "Voir les details" reste
        document.querySelector(`.delivery-treat-btn[data-id="${id}"]`)?.remove();

    } catch (error) {
        console.error(error);
        alert("Impossible de confirmer cette livraison.");
    }
}




    function filterData() {
    const value = document.querySelector('#filter').value;
    let result;

    const now = new Date();

    switch (value) {
        case 'pending':
        result = dataDisplayed.filter(d => d.statut === 'pending');
        break;

        case 'delivered':
        result = dataDisplayed.filter(d => d.statut === 'delivered');
        break;

        case 'today':
        result = dataDisplayed.filter(d => {
            const dateItem = new Date(d.date_creation);
            return dateItem.toDateString() === now.toDateString();
        });
        break;

        case 'week':
        result = dataDisplayed.filter(d => {
            const dateItem = new Date(d.date_creation);
            const startweek = new Date(now);
            const jour = now.getDay();
            const decalage = jour === 0 ? 6 : jour - 1;

            startweek.setDate(now.getDate() - decalage);
            startweek.setHours(0, 0, 0, 0);

            const endWeek = new Date(startweek);
            endWeek.setDate(startweek.getDate() + 7);

            return dateItem >= startweek && dateItem < endWeek;
        });
        break;

        case 'month':
        result= dataDisplayed.filter(d => {
            const dateItem = new Date(d.date_creation);
            return dateItem.getMonth() === now.getMonth() &&
                dateItem.getFullYear() === now.getFullYear();
        });
        break;

        default:  
        result =dataDisplayed;
    }
    displayTable(result);
    }
    document.querySelector('#filter').addEventListener('change', filterData);



























