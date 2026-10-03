// Eviana Salon — landing page script
document.addEventListener('DOMContentLoaded', function () {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navBackdrop = document.getElementById('navBackdrop');

    function isDrawerOpen() {
        return navMenu && navMenu.classList.contains('is-open');
    }

    function openDrawer() {
        if (!navMenu) return;
        navMenu.classList.add('is-open');
        document.body.classList.add('nav-open');
        if (navToggle) {
            navToggle.setAttribute('aria-expanded', 'true');
            navToggle.setAttribute('aria-label', 'Tutup menu navigasi');
        }
        if (navBackdrop) navBackdrop.hidden = false;
        // Fokus masuk ke menu sehingga penutupan via keyboard (Esc) accessible
        if (navMenu.contains(document.activeElement) === false) {
            var firstLink = navMenu.querySelector('.nav-link');
            if (firstLink) firstLink.focus();
        }
    }

    function closeDrawer() {
        if (!navMenu) return;
        navMenu.classList.remove('is-open');
        document.body.classList.remove('nav-open');
        if (navToggle) {
            navToggle.setAttribute('aria-expanded', 'false');
            navToggle.setAttribute('aria-label', 'Buka menu navigasi');
        }
        if (navBackdrop) navBackdrop.hidden = true;
    }

    [navToggle, navBackdrop].forEach(function (el) {
        if (!el) return;
        el.addEventListener('click', function () {
            isDrawerOpen() ? closeDrawer() : openDrawer();
        });
    });

    // Tutup drawer setelah memilih link (navigasi berjalan normal)
    if (navMenu) {
        navMenu.addEventListener('click', function (e) {
            if (e.target.closest('.nav-link')) closeDrawer();
        });
    }

    // Penutupan via keyboard
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && isDrawerOpen()) {
            e.preventDefault();
            closeDrawer();
            if (navToggle) navToggle.focus();
        }
    });

    // Bila melebar ke desktop (>=1025px), tutup drawer & reset state
    window.addEventListener('resize', function () {
        if (window.matchMedia('(min-width: 1025px)').matches && isDrawerOpen()) {
            closeDrawer();
        }
    });

    // Pindah navigasi anti-gagal: hanya handle hash yang benar-benar ada.
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            if (this.getAttribute('href') === '#') return;
            var target = document.querySelector(this.getAttribute('href'));
            if (!target) {
                e.preventDefault();
                return;
            }
            // scrollIntoView sudah ditangani CSS scroll-behavior:smooth.
        });
    });

    // Scrollspy: tandai link aktif sesuai section terlihat.
    var sections = document.querySelectorAll('main section[id]');
    var navLinks = document.querySelectorAll('.nav-menu .nav-link');
    if ('IntersectionObserver' in window && sections.length && navLinks.length) {
        var linksById = {};
        navLinks.forEach(function (l) {
            linksById[l.getAttribute('href').slice(1)] = l;
        });
        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                navLinks.forEach(function (l) { l.classList.remove('is-active'); });
                var active = linksById[entry.target.id];
                if (active) active.classList.add('is-active');
            });
        }, { rootMargin: '-45% 0px -50% 0px' });
        sections.forEach(function (s) { observer.observe(s); });
    }
});