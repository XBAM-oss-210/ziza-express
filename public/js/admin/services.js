const serviceTable = document.getElementById('service-table') 
const serviceTableBody = document.getElementById('service-table-body')
const noneService = document.getElementById('none-service')

const serviceDetailDialog = document.getElementById('dialog-service')
const servicedetailContent = document.getElementById('detail-content')
const dialogCloseBtn =document.getElementById('close-btn')
    window.addEventListener("DOMContentLoaded", async () => {
        try {
            const response = await fetch('/admin_ziza/services')             
            const data = await response.json()
            
            if(data.services && data.services.length > 0){

                const services = data.services
                serviceTable.classList.remove('hide')
                
                if(!noneService.classList.contains('hide')){
                        noneService.classList.add('hide')
                        }
                services.forEach((s, index) => {
                    const trService = document.createElement('tr');
                    trService.innerHTML = `
                        <td>${index + 1}</td>
                        <td>${s.requester_name}</td> 
                        <td>${s.requester_phone}</td>
                        <td>${s.service}</td>
                        <td><button class="service-detail-btn" data-id="${s.id_service}">Voir les details</button></td>
<td>${s.statut !== 'resolved' ? `<button class="service-treat-btn" data-id="${s.id_service}">Traiter </button>` : ''}</td>                    `;
                    serviceTableBody.appendChild(trService); 
                });
            document.querySelectorAll('.service-detail-btn').forEach((serviceBtn) => {
                serviceBtn.addEventListener('click', () => showServiceDetails(serviceBtn.dataset.id));
            });
            document.querySelectorAll('.service-treat-btn').forEach((btn) => {
                btn.addEventListener('click', () => confirmService(btn.dataset.id));
            });            
        }

    } catch (error) {
            console.error("erreur Lors de la recuperation des donnees de services  ",error);
    }
    })

async function showServiceDetails(id) {
    try {
        const response = await fetch(`/admin_ziza/services/${id}`);
        const serviceData = await response.json();
        console.log('service:',response)
        console.log('donnees recu:',serviceData);
        

        if (!response.ok) throw new Error('Erreur lors de la récupération des détails');
        servicedetailContent.innerHTML = `
                <p><strong>Nom Complet :</strong> ${serviceData.requester_name}</p>
                <p><strong>Numero de Telephone  :</strong> ${serviceData.requester_phone}</p>
                <p><strong>Service :</strong> ${serviceData.service }</p>
                <p><strong>Prix proposé :</strong> ${serviceData.proposed_price }</p>
                <p><strong>Détails du service :</strong> ${serviceData.service_details }</p>
                <p><strong> A livrer a :</strong> ${serviceData.created_at }</p>
            `;

        serviceDetailDialog.showModal();        
    } catch (error) {
        console.error(error);

    }
}
async function confirmService(id) {
    try {
        const response = await fetch(`/admin_ziza/services/${id}/confirm`, {
            method: 'PATCH'
        });
        if (!response.ok) throw new Error('Erreur lors de la confirmation du service');

        document.querySelector(`.service-treat-btn[data-id="${id}"]`)?.remove();

    } catch (error) {
        console.error(error);
        alert("Impossible de confirmer ce service.");
    }
}

dialogCloseBtn.addEventListener('click',()=>{
    serviceDetailDialog.close()
})
