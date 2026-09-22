document.addEventListener('DOMContentLoaded', () => {
    const cinematicLayers = document.querySelectorAll('.cinematic-layer');
    const cinematicThemes = [
        { background: 'theme-aurora', interface: 'theme-ios-sierra' },
        { background: 'theme-midnight', interface: 'theme-macos-sequoia' },
        { background: 'theme-ocean', interface: 'theme-hyperos-mint' },
        { background: 'theme-violet', interface: 'theme-hyperos-sunset' }
    ];
    const themeInterval = 120000;
    let cinematicThemeIndex = 0;
    let activeCinematicLayer = 0;

    const showCinematicTheme = (themeIndex) => {
        const theme = cinematicThemes[themeIndex];
        const incomingLayer = (activeCinematicLayer + 1) % cinematicLayers.length;
        const outgoingLayer = cinematicLayers[activeCinematicLayer];
        const nextLayer = cinematicLayers[incomingLayer];

        cinematicThemes.forEach((profile) => nextLayer.classList.remove(profile.background));
        cinematicThemes.forEach((profile) => document.body.classList.remove(profile.interface));
        nextLayer.classList.add(theme.background, 'is-active');
        document.body.classList.add(theme.interface);
        outgoingLayer.classList.remove('is-active');
        activeCinematicLayer = incomingLayer;
        cinematicThemeIndex = themeIndex;
    };

    document.body.classList.add(cinematicThemes[cinematicThemeIndex].interface);
    cinematicLayers[activeCinematicLayer]?.classList.add('is-active');

    let cinematicTimer = window.setInterval(() => {
        showCinematicTheme((cinematicThemeIndex + 1) % cinematicThemes.length);
    }, themeInterval);

    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            window.clearInterval(cinematicTimer);
            return;
        }

        cinematicTimer = window.setInterval(() => {
            showCinematicTheme((cinematicThemeIndex + 1) % cinematicThemes.length);
        }, themeInterval);
    });

    const yearElement = document.getElementById('year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }

    const sidebar = document.querySelector('.portfolio-sidebar');
    const sidebarToggle = document.querySelector('.sidebar-toggle');
    const sidebarCollapse = document.querySelector('.sidebar-collapse');
    const sidebarBackdrop = document.querySelector('.sidebar-backdrop');
    const sidebarLinks = document.querySelectorAll('.sidebar-link');
    const mobileQuery = window.matchMedia('(max-width: 768px)');
    const portfolioSections = document.querySelectorAll('.container > section');
    const homeSection = document.getElementById('home');

    const showSection = (sectionId) => {
        document.body.classList.toggle('section-view-active', sectionId !== 'home');

        portfolioSections.forEach((section) => {
            section.classList.toggle('section-active', section.id === sectionId);
        });

        if (sectionId === 'home') {
            homeSection?.classList.add('visible');
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        const selectedSection = document.getElementById(sectionId);
        selectedSection?.classList.add('visible');
        selectedSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    const setSidebarState = (isOpen) => {
        const isMobile = mobileQuery.matches;
        document.body.classList.toggle('sidebar-expanded', isOpen && !isMobile);
        document.body.classList.toggle('sidebar-mobile-open', isOpen && isMobile);
        sidebarToggle?.setAttribute('aria-expanded', String(isOpen));
        sidebarToggle?.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
        sidebarCollapse?.setAttribute('aria-expanded', String(isOpen));
    };

    sidebarToggle?.addEventListener('click', () => {
        const isOpen = mobileQuery.matches
            ? document.body.classList.contains('sidebar-mobile-open')
            : document.body.classList.contains('sidebar-expanded');
        setSidebarState(!isOpen);
    });

    sidebarCollapse?.addEventListener('click', () => setSidebarState(false));
    sidebarBackdrop?.addEventListener('click', () => setSidebarState(false));

    sidebarLinks.forEach((link) => {
        link.addEventListener('click', () => {
            const sectionId = link.getAttribute('href')?.slice(1);
            sidebarLinks.forEach((item) => item.classList.remove('active'));
            link.classList.add('active');
            if (sectionId) {
                showSection(sectionId);
            }
            setSidebarState(false);
        });
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            setSidebarState(false);
        }
    });

    mobileQuery.addEventListener('change', () => setSidebarState(false));

    const revealElements = document.querySelectorAll('.reveal');

    const revealObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    revealObserver.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.15 }
    );

    revealElements.forEach((element) => revealObserver.observe(element));
});
