const callBtn = document.querySelector("#call-btn");
const urgencecallBtn = document.querySelector("#urgence-call-btn");
const wtspUrgencecallBtn = document.querySelector("#wtsp-urgence-call-btn");
    if(callBtn){
        callBtn.addEventListener("click", () => {
            window.location.href = "tel:+704758707";
        });
    }

if(urgencecallBtn){
    urgencecallBtn.addEventListener("click", () => {
    window.location.href = "tel:+704758707";
    
});
}
if(wtspUrgencecallBtn){
    wtspUrgencecallBtn.addEventListener("click", () => {
        window.location.href = "https://wa.me/221704758707";
    });
}
