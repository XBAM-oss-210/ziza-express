document.addEventListener('DOMContentLoaded', () => {

    // ---------- Déconnexion (uniquement si le bouton existe sur cette page) ----------
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async () => {
            const res = await fetch('/api/admin/logout', { method: 'POST' });
            if (res.ok) {
                window.location.href = '/api/admin/auth';
            }
        });
    }

    // ---------- Hamburger / menu mobile ----------
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (!hamburger || !navLinks) return;

    // Ouvrir / fermer le menu au clic sur le hamburger
    hamburger.addEventListener('click', (e) => {
        e.stopPropagation();
        navLinks.classList.toggle('active');
    });

    // Fermer le menu quand on clique sur un lien (mobile)
    navLinks.querySelectorAll('.nav-link').forEach((link) => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
        });
    });

    // Fermer le menu si on clique en dehors de la navbar
    document.addEventListener('click', (e) => {
        const clickedOutside = !navLinks.contains(e.target) && e.target !== hamburger;
        if (navLinks.classList.contains('active') && clickedOutside) {
            navLinks.classList.remove('active');
        }
    });

    // Si on repasse en desktop, on nettoie l'état mobile
    window.addEventListener('resize', () => {
        if (window.innerWidth >= 769) {
            navLinks.classList.remove('active');
        }
    });
});