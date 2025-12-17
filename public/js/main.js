document.addEventListener('DOMContentLoaded', function () {
    const navItems = document.querySelectorAll('.pf-nav-item');
    const contentPanels = document.querySelectorAll('.pf-content-panel');
    const dropdownItems = document.querySelectorAll('.dropdown-item');
    const solutionsSection = document.getElementById('solutions');

    // --- NEW MEGA MENU LOGIC ---
    const megaMenuItems = document.querySelectorAll('.mega-menu-item');
    const megaMenuPanels = document.querySelectorAll('.mega-menu-panel');

    function openMegaPanel(targetId) {
        // Deactivate all items and panels
        megaMenuItems.forEach(item => item.classList.remove('active'));
        megaMenuPanels.forEach(panel => panel.classList.remove('active'));

        // Activate the correct one
        const targetPanel = document.getElementById(targetId); // Direct ID match
        const targetItem = document.querySelector(`.mega-menu-item[data-target="${targetId}"]`);

        if (targetPanel) {
            targetPanel.classList.add('active');
        }
        if (targetItem) {
            targetItem.classList.add('active');
        }
    }

    // Add mouseover listener for the new menu items
    megaMenuItems.forEach(item => {
        item.addEventListener('mouseover', function () {
            const targetId = this.getAttribute('data-target');
            openMegaPanel(targetId);
        });
    });

    // Set the first item as active by default when menu opens
    if (megaMenuItems.length > 0) {
        openMegaPanel(megaMenuItems[0].getAttribute('data-target'));
    }
    // --- END NEW MEGA MENU LOGIC ---

    function openTab(targetId) {
        // Find the corresponding nav item and click it
        const navItem = document.querySelector(`.pf-nav-item[data-target="${targetId}"]`);
        if (navItem) {
            // Remove active class from all nav items
            navItems.forEach(nav => nav.classList.remove('active'));
            // Add active class to clicked item
            navItem.classList.add('active');

            // Hide all content panels
            contentPanels.forEach(panel => {
                panel.classList.remove('active');
            });

            // Show the target content panel
            const targetPanel = document.getElementById(targetId);
            if (targetPanel) {
                targetPanel.classList.add('active');
            } else {
                console.error('Target panel not found:', targetId);
            }
        } else {
            console.error('Target nav item not found:', targetId);
        }
    }

    // Listener for the main tab navigation
    navItems.forEach(item => {
        item.addEventListener('click', function () {
            const targetId = this.getAttribute('data-target');
            openTab(targetId);
        });
    });

    // Listener for the new header dropdown navigation
    // UPDATED: Use mouseenter for hover effect instead of click
    dropdownItems.forEach(item => {
        item.addEventListener('mouseenter', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('data-target');

            // Open the correct tab immediately on hover
            openTab(targetId);
        });

        // Keep click as a fallback or for touch devices
        item.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('data-target');
            openTab(targetId);
        });
    });

    // --- COOKIE CONSENT LOGIC ---
    const cookieBanner = document.getElementById('cookie-banner');
    const cookieModal = document.getElementById('cookie-modal');
    const customizeBtn = document.getElementById('cookie-customize');
    const rejectBtn = document.getElementById('cookie-reject');
    const acceptBtn = document.getElementById('cookie-accept');
    const modalCloseBtn = document.getElementById('cookie-close');
    const modalRejectBtn = document.getElementById('cookie-modal-reject');
    const modalSaveBtn = document.getElementById('cookie-modal-save');
    const modalAcceptBtn = document.getElementById('cookie-modal-accept');
    const catHeaders = document.querySelectorAll('.cookie-cat-header');

    // Check if consent is already stored
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
        // Show banner if no consent stored
        if (cookieBanner) cookieBanner.style.display = 'block';
    }

    // Function to save consent
    function saveConsent(preferences) {
        localStorage.setItem('cookieConsent', JSON.stringify(preferences));
        if (cookieBanner) cookieBanner.style.display = 'none';
        if (cookieModal) cookieModal.style.display = 'none';
        // Here you would trigger scripts based on preferences
        console.log('Consent saved:', preferences);
    }

    // Open Modal
    if (customizeBtn) {
        customizeBtn.addEventListener('click', () => {
            if (cookieModal) cookieModal.style.display = 'flex';
        });
    }

    // Close Modal
    if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', () => {
            if (cookieModal) cookieModal.style.display = 'none';
        });
    }

    // Accept All (Banner & Modal)
    const handleAcceptAll = () => {
        saveConsent({
            necessary: true,
            functional: true,
            analytics: true,
            performance: true
        });
    };
    if (acceptBtn) acceptBtn.addEventListener('click', handleAcceptAll);
    if (modalAcceptBtn) modalAcceptBtn.addEventListener('click', handleAcceptAll);

    // Reject All (Banner & Modal)
    const handleRejectAll = () => {
        saveConsent({
            necessary: true,
            functional: false,
            analytics: false,
            performance: false
        });
    };
    if (rejectBtn) rejectBtn.addEventListener('click', handleRejectAll);
    if (modalRejectBtn) modalRejectBtn.addEventListener('click', handleRejectAll);

    // Save Preferences (Modal)
    if (modalSaveBtn) {
        modalSaveBtn.addEventListener('click', () => {
            const functional = document.getElementById('consent-functional').checked;
            const analytics = document.getElementById('consent-analytics').checked;
            const performance = document.getElementById('consent-performance').checked;
            saveConsent({
                necessary: true,
                functional: functional,
                analytics: analytics,
                performance: performance
            });
        });
    }

    // Accordion Logic
    catHeaders.forEach(header => {
        header.addEventListener('click', function () {
            const desc = this.nextElementSibling;
            const toggle = this.querySelector('.cat-toggle');

            if (desc.classList.contains('hidden')) {
                desc.classList.remove('hidden');
                toggle.classList.add('expanded');
            } else {
                desc.classList.add('hidden');
                toggle.classList.remove('expanded');
            }
        });
    });

    // --- SCROLL LOGIC FOR MENU ---
    let lastScrollTop = 0;
    const header = document.querySelector('header');
    const scrollThreshold = 400; // UPDATED: Increased threshold to delay hiding

    window.addEventListener('scroll', function () {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        if (scrollTop > lastScrollTop && scrollTop > scrollThreshold) {
            // Scrolling DOWN
            header.classList.add('nav-hidden');
        } else {
            // Scrolling UP
            header.classList.remove('nav-hidden');
        }

        // Add solid background when scrolled
        if (scrollTop > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop; // For Mobile or negative scrolling
    }, { passive: true });


    // --- AUTHENTICATION STATE CHECK ---
    // --- AUTHENTICATION STATE CHECK ---
    // Check if user is logged in and update UI accordingly
    async function checkAuthStatus() {
        try {
            const response = await fetch('/api/auth/me');
            if (response.ok) {
                const data = await response.json();
                const user = data.user;

                if (user) {
                    console.log('User authenticated:', user.email);

                    // 1. Update Main Nav Button (Keep visible, change text)
                    const navButtons = document.querySelectorAll('.client-login-btn');
                    navButtons.forEach(btn => {
                        btn.style.display = 'flex'; // Ensure it's visible
                        btn.textContent = 'My Aegisight';
                        btn.href = '/dashboard';
                        btn.classList.add('authenticated');
                    });

                    // 2. Show Profile Dropdown
                    const profileDropdown = document.getElementById('profileDropdown');
                    if (profileDropdown) {
                        profileDropdown.style.display = 'flex';

                        // Update Profile Info
                        const fullName = `${user.firstName} ${user.lastName}`;
                        const initials = (user.firstName.charAt(0) + user.lastName.charAt(0)).toUpperCase();

                        document.getElementById('navAvatar').textContent = initials;
                        document.getElementById('menuAvatar').textContent = initials;
                        document.getElementById('menuName').textContent = fullName;
                        document.getElementById('menuEmail').textContent = user.email;
                    }

                    // 3. Update Mega Menu Promo Card (Optional, keeping as fallback)
                    const loginPromoCards = document.querySelectorAll('a.promo-card[href="/account"], a.promo-card[href^="/login"]');
                    loginPromoCards.forEach(card => {
                        const titleEl = card.querySelector('strong');
                        const descEl = card.querySelector('small');
                        if (titleEl) titleEl.textContent = 'My Aegisight';
                        if (descEl) descEl.textContent = `Welcome back, ${user.firstName || 'User'}`;
                        card.href = '/dashboard';
                    });
                }
            }
        } catch (error) {
            // User likely not logged in or network error, keep default "Client Login"
        }
    }

    // Logout Handler
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            try {
                const response = await fetch('/api/auth/logout', { method: 'POST' });
                if (response.ok) {
                    window.location.href = '/login';
                }
            } catch (error) {
                console.error('Logout failed:', error);
            }
        });
    }

    // Run auth check
    checkAuthStatus();

});
