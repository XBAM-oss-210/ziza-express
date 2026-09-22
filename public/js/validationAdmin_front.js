






const authForm = document.getElementById('auth-form')
const errorMsg = document.getElementById('msg-error')
const submitBtn = document.getElementById('submit-btn')
const rateLimitMsg = document.getElementById('rate-limit-msg')
let countdownInterval = null

function formatTime(seconds) {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m}:${s.toString().padStart(2, '0')}`
}

function startCountdown(remainingSeconds) {
    const endTime = Date.now() + remainingSeconds * 1000

    submitBtn.style.display = 'none'
    rateLimitMsg.style.display = 'block'
    errorMsg.style.display = 'none'

    if (countdownInterval) clearInterval(countdownInterval)

    const update = () => {
        const secondsLeft = Math.ceil((endTime - Date.now()) / 1000)

        if (secondsLeft <= 0) {
            clearInterval(countdownInterval)
            countdownInterval = null
            rateLimitMsg.style.display = 'none'
            submitBtn.style.display = 'block'
            return
        }

        rateLimitMsg.textContent = `Vous avez fait trop de tentatives. Veuillez réessayer dans ${formatTime(secondsLeft)}`
    }

    update()
    countdownInterval = setInterval(update, 1000)
}

async function checkAuthStatus() {
    try {
        const response = await fetch('/api/admin/auth/status')
        const data = await response.json()
        if (data.blocked) {
            startCountdown(data.remainingSeconds)
        }
    } catch (error) {
        console.error('Erreur status:', error)
    }
}

checkAuthStatus()

authForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const phone = document.getElementById('phone').value.trim()
    const password = document.getElementById('password').value.trim()
    const password2 = document.getElementById('password2').value.trim()

    if (phone === '' || password === '' || password2 === '') {
        errorMsg.textContent = "Merci de remplir tous les champs";
        errorMsg.style.display = 'block';
        return
    }

    try {
        const userInput = { phone, password, password2 }

        const response = await fetch('/api/admin/auth', {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userInput)
        })

        const data = await response.json();

        if (response.status === 429) {
            startCountdown(data.remainingSeconds)
            return
        }

        if (!data.success) {
            if (data.errors) {
                const errors = data.errors
                Object.entries(errors).forEach(([field, message]) => {
                    const errorField = document.querySelector(`#error-${field}`);
                    if (errorField) {
                        errorField.textContent = message;
                    }
                    const fieldWithError = document.getElementById(field)
                    fieldWithError.addEventListener('input', () => {
                        errorField.textContent = '';
                        errorField.style.display = 'none';
                    });
                })
            }
            if (data.message) {
                errorMsg.textContent = data.message
                errorMsg.style.display = 'block';
            }
        }

    } catch (erreur) {
        console.error('Échec de la requête:', erreur.message);
    }
})

const inputFields = document.querySelectorAll('.input-field')
inputFields.forEach((inputField) => {
    inputField.addEventListener('input', () => {
        errorMsg.textContent = '';
        errorMsg.style.display = 'none';
    });
});




