// PROJECT ONEKANA — Interactions & Micro-animations

document.addEventListener('DOMContentLoaded', () => {
    // Scroll reveal observer
    const revealTargets = document.querySelectorAll(
        '.door-card, .action-tile, .val-card, .cta-band-title, .why-huge-title, .why-callout, .paths-heading, .actions-heading, .values-heading, .manifesto-lead, .manifesto-quote'
    );

    revealTargets.forEach((el, index) => {
        el.classList.add('reveal-node');
        el.style.transitionDelay = `${(index % 3) * 0.08}s`;
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('node-visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
    });

    revealTargets.forEach(el => observer.observe(el));

    // Smooth scroll for anchor navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Dynamic nav shadow on scroll
    const nav = document.querySelector('.nav');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 40) {
            nav.style.borderBottomColor = 'var(--pink-hot)';
            nav.style.boxShadow = '0 6px 20px rgba(11, 25, 17, 0.7)';
        } else {
            nav.style.borderBottomColor = 'var(--pine-border)';
            nav.style.boxShadow = 'none';
        }
    }, { passive: true });
});
