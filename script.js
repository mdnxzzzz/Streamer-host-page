// 1. FORZAR INICIO EN LA PARTE SUPERIOR (Fix para el bug de scroll)
if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}
window.scrollTo(0, 0);

document.addEventListener('DOMContentLoaded', () => {
    // Re-verify scroll on DOM load
    window.scrollTo(0, 0);

    const bgMusic = document.getElementById('bg-music');
    const fsBtn = document.getElementById('fs-toggle');
    let musicStarted = false;

    // Configurar volumen inicial (30%)
    if (bgMusic) {
        bgMusic.volume = 0.3;
    }

    const startMusic = () => {
        if (!musicStarted && bgMusic) {
            bgMusic.play().then(() => {
                musicStarted = true;
                console.log("Música iniciada correctamente");
            }).catch(err => {
                console.warn("Fallo al iniciar música:", err);
            });
        }
    };

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            const doc = document.documentElement;
            if (doc.requestFullscreen) doc.requestFullscreen();
            else if (doc.mozRequestFullScreen) doc.mozRequestFullScreen();
            else if (doc.webkitRequestFullscreen) doc.webkitRequestFullscreen();
            else if (doc.msRequestFullscreen) doc.msRequestFullscreen();

            if (fsBtn) fsBtn.querySelector('i').className = 'fas fa-compress';
        } else {
            if (document.exitFullscreen) document.exitFullscreen();
            else if (document.mozCancelFullScreen) document.mozCancelFullScreen();
            else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
            else if (document.msExitFullscreen) document.msExitFullscreen();

            if (fsBtn) fsBtn.querySelector('i').className = 'fas fa-expand';
        }
    };

    if (fsBtn) {
        fsBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleFullscreen();
            startMusic();
        });
    }

    // Trigger music and fullscreen on first click anywhere (using multiple event types for reliability)
    const interactionEvents = ['mousedown', 'touchstart', 'click'];
    const initialInteraction = () => {
        startMusic();
        if (!document.fullscreenElement) {
            const doc = document.documentElement;
            if (doc.requestFullscreen) doc.requestFullscreen();
        }
        // Limpiar eventos para que solo ocurra una vez
        interactionEvents.forEach(e => document.removeEventListener(e, initialInteraction));
    };

    interactionEvents.forEach(eventType => {
        document.addEventListener(eventType, initialInteraction);
    });

    // --- ANIMATION OBSERVER ---
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px"
    };

    const animateOnScroll = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const elementsToAnimate = document.querySelectorAll('.panel, .contact-strip, header, .main-footer, .vid-card-mini');
    elementsToAnimate.forEach(el => animateOnScroll.observe(el));

});
