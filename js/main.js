// PROJECT ONEKANA — Interactions & Micro-animations

document.addEventListener('DOMContentLoaded', () => {
    // Shared body-scroll lock — reference counted so the mobile nav drawer
    // and the athlete modal never clobber each other's lock/unlock if both
    // happen to be toggled in the same session.
    let scrollLockCount = 0;
    const lockScroll = () => {
        scrollLockCount += 1;
        document.body.style.overflow = 'hidden';
    };
    const unlockScroll = () => {
        scrollLockCount = Math.max(0, scrollLockCount - 1);
        if (scrollLockCount === 0) {
            document.body.style.overflow = '';
        }
    };

    // Scroll reveal observer
    const revealTargets = document.querySelectorAll(
        '.door-card, .action-tile, .val-card, .cta-band-title, .why-huge-title, .why-callout, .paths-heading, .actions-heading, .values-heading, .manifesto-lead, .manifesto-quote, .aud-row, .passport-card'
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

    // ---------- Hamburger / mobile nav drawer ----------
    const burger = document.getElementById('navBurger');
    const navLinks = document.getElementById('navLinks');

    if (burger && navLinks && nav) {
        // Position the dropdown exactly under the nav, whatever its real
        // rendered height is (differs slightly between iOS/Android chrome,
        // font metrics and safe-area insets) — avoids a hardcoded offset
        // that would drift on one platform but not the other.
        const syncNavHeight = () => {
            document.documentElement.style.setProperty('--nav-h', `${nav.offsetHeight}px`);
        };
        syncNavHeight();
        window.addEventListener('resize', syncNavHeight);
        window.addEventListener('orientationchange', syncNavHeight);

        let menuOpen = false;

        const closeMenu = () => {
            if (!menuOpen) return;
            menuOpen = false;
            navLinks.classList.remove('open');
            burger.setAttribute('aria-expanded', 'false');
            unlockScroll();
        };

        const openMenu = () => {
            if (menuOpen) return;
            menuOpen = true;
            syncNavHeight();
            navLinks.classList.add('open');
            burger.setAttribute('aria-expanded', 'true');
            lockScroll();
        };

        burger.addEventListener('click', () => {
            menuOpen ? closeMenu() : openMenu();
        });

        // Close after tapping any link inside the drawer
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', closeMenu);
        });

        // Close on Escape, and if the viewport grows back to desktop width
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeMenu();
        });
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) closeMenu();
        });
    }

    // ---------- Athlete passport modal ----------
    const ATHLETES = {
        daniel: {
            name: 'DANIEL K.',
            tag: 'ITEN, KENYA — DOB 2004',
            dist: 'MARATHON',
            img: 'images/runners-group.jpg',
            pb: '2:11:48',
            age: '22',
            alt: '2,400 M',
            km: '180 KM',
            group: 'ITEN HARRIERS',
            status: 'UNSIGNED',
            bio: 'Daniel grew up herding on the edges of the Rift Valley and joined a local training camp at 17. He has quietly built into one of the most consistent marathon prospects in Iten — without an agent, a sponsor, or a single international start.',
            notes: 'Classic negative-split closer. Undefeated in his last three regional road races. Coaches highlight his discipline and low injury profile — high ceiling with structured international exposure.',
            needs: ['Race entries', 'Travel support', 'Nutrition']
        },
        mercy: {
            name: 'MERCY C.',
            tag: 'KAPCHORWA, UGANDA — DOB 2006',
            dist: '10,000M',
            img: 'images/athlete-xc.jpg',
            pb: '32:14',
            age: '19',
            alt: '2,100 M',
            km: '140 KM',
            group: 'KAPCHORWA TC',
            status: 'UNSIGNED',
            bio: 'Mercy trains on the mountain trails above Kapchorwa before school hours. She won the district cross-country title twice and translates effortlessly from hills to track — a range scouts rarely see this early.',
            notes: 'Exceptional hill strength and finishing kick. Youngest athlete in the passport — long runway for development. Strong federation interest expected within 12 months.',
            needs: ['Shoes & kit', 'Track access', 'Physio support']
        },
        samuel: {
            name: 'SAMUEL K.',
            tag: 'ELDORET, KENYA — DOB 2003',
            dist: 'HALF MARATHON',
            img: 'images/athlete-pack.jpg',
            pb: '61:20',
            age: '21',
            alt: '2,100 M',
            km: '160 KM',
            group: 'ELDORET ROAD CLUB',
            status: 'UNSIGNED',
            bio: 'A former pacesetter for elite camps, Samuel stepped out of the shadows last season with a 61:20 half marathon on a hilly course. He knows championship rhythm because he has set it for others.',
            notes: 'Pacing intelligence beyond his years — reads races like a veteran. Ready-made for European road circuits. Representation interest likely after one strong international result.',
            needs: ['International race exposure', 'Travel', 'Race entries']
        },
        faith: {
            name: 'FAITH N.',
            tag: 'KAPCHORWA, UGANDA — DOB 2005',
            dist: '5,000M',
            img: 'images/athlete-trail.jpg',
            pb: '15:42',
            age: '20',
            alt: '2,100 M',
            km: '130 KM',
            group: 'KAPCHORWA TC',
            status: 'UNSIGNED',
            bio: 'Faith switched from netball to running at 16 and climbed fast — district champion within two seasons. Her 15:42 was set on a basic cinder track with borrowed spikes.',
            notes: 'Raw speed with minimal formal training history — the upside case of the passport. A proper track season and spikes alone could rewrite her PBs.',
            needs: ['Spikes & gear', 'Track season support', 'Physio']
        },
        vincent: {
            name: 'VINCENT K.',
            tag: 'ITEN, KENYA — DOB 2002',
            dist: '3,000M SC',
            img: 'images/athlete-steeple.jpg',
            pb: '8:24',
            age: '23',
            alt: '2,400 M',
            km: '150 KM',
            group: 'ITEN HARRIERS',
            status: 'UNSIGNED',
            bio: 'Vincent is a barrier technician — self-coached on water-jump technique using video replays. His 8:24 steeplechase came in a domestic meet with no rabbit and no travel budget.',
            notes: 'Steeplechase specialists are rare and valuable. Technically polished, tactically fearless. One funded season of qualifiers could put him on the continental radar.',
            needs: ['Qualifier travel', 'Race entries', 'Coaching stipend']
        },
        joyce: {
            name: 'JOYCE A.',
            tag: 'MBALE, UGANDA — DOB 2001',
            dist: 'MARATHON',
            img: 'images/kipchoge-berlin.jpg',
            pb: '2:29:35',
            age: '24',
            alt: '1,900 M',
            km: '170 KM',
            group: 'MBALE ROAD RUNNERS',
            status: 'UNSIGNED',
            bio: 'Joyce balances training with work at her family’s market stall in Mbale. She ran 2:29 on a self-built training plan — no pacers, no nutrition program, no off-season camp.',
            notes: 'Remarkable engine built without structure — arguably the highest marginal gain available in the passport. A single supported training camp could move her into national-team contention.',
            needs: ['Training camp support', 'Nutrition', 'Shoes & kit']
        }
    };

    const overlay = document.getElementById('athOverlay');
    if (overlay) {
        const fields = {
            tag: document.getElementById('athTag'),
            name: document.getElementById('athName'),
            dist: document.getElementById('athDist'),
            img: document.getElementById('athImg'),
            pb: document.getElementById('athPb'),
            age: document.getElementById('athAge'),
            alt: document.getElementById('athAlt'),
            km: document.getElementById('athKm'),
            group: document.getElementById('athGroup'),
            status: document.getElementById('athStatus'),
            bio: document.getElementById('athBio'),
            notes: document.getElementById('athNotes'),
            needs: document.getElementById('athNeeds'),
            cta: document.getElementById('athCta')
        };

        let modalOpen = false;

        const openModal = (key) => {
            const a = ATHLETES[key];
            if (!a) return;
            fields.tag.textContent = a.tag;
            fields.name.textContent = a.name;
            fields.dist.textContent = a.dist;
            fields.img.src = a.img;
            fields.img.alt = a.name;
            fields.pb.textContent = a.pb;
            fields.age.textContent = a.age;
            fields.alt.textContent = a.alt;
            fields.km.textContent = a.km;
            fields.group.textContent = a.group;
            fields.status.textContent = a.status;
            fields.bio.textContent = a.bio;
            fields.notes.textContent = a.notes;
            fields.needs.innerHTML = a.needs.map(n => `<li>${n}</li>`).join('');
            fields.cta.href = `mailto:contact@onekana.run?subject=ONEKANA%20Athlete%20—%20${encodeURIComponent(a.name)}`;
            overlay.classList.add('open');
            overlay.setAttribute('aria-hidden', 'false');
            modalOpen = true;
            lockScroll();
        };

        const closeModal = () => {
            if (!modalOpen) return;
            modalOpen = false;
            overlay.classList.remove('open');
            overlay.setAttribute('aria-hidden', 'true');
            unlockScroll();
        };

        document.querySelectorAll('.passport-card').forEach(card => {
            card.addEventListener('click', () => openModal(card.dataset.athlete));
        });

        document.getElementById('athClose').addEventListener('click', closeModal);
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) closeModal();
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && overlay.classList.contains('open')) closeModal();
        });
    }
});
