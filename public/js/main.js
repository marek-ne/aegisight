// =========================================
// MAIN INITIALIZATION
// =========================================
document.addEventListener('DOMContentLoaded', function () {
    const navItems = document.querySelectorAll('.pf-nav-item');
    const contentPanels = document.querySelectorAll('.pf-content-panel');
    const dropdownItems = document.querySelectorAll('.dropdown-item');
    const solutionsSection = document.getElementById('solutions');

    // --- BLOG FILTER STATE ---
    let currentCategory = [];
    let currentIndustry = [];
    let currentSearch = '';

    // --- NEW MEGA MENU LOGIC ---
    // Handle multiple mega menus (Capabilities & Industries)
    const megaMenuContainers = document.querySelectorAll('.solutions-dropdown');

    megaMenuContainers.forEach(container => {
        const items = container.querySelectorAll('.mega-menu-item');
        const panels = container.querySelectorAll('.mega-menu-panel');

        // Helper to switch tab
        function activatePanel(targetId) {
            items.forEach(i => i.classList.remove('active'));
            panels.forEach(p => p.classList.remove('active'));

            const activeItem = container.querySelector(`.mega-menu-item[data-target="${targetId}"]`);
            const activePanel = document.getElementById(targetId);

            if (activeItem) activeItem.classList.add('active');
            if (activePanel) activePanel.classList.add('active');
        }

        // Add Listeners
        items.forEach(item => {
            item.addEventListener('mouseenter', () => {
                const target = item.getAttribute('data-target');
                activatePanel(target);
            });
        });

        // Init first tab active
        if (items.length > 0) {
            const firstTarget = items[0].getAttribute('data-target');
            activatePanel(firstTarget);
        }
    });
    // --- END NEW MEGA MENU LOGIC ---

    // --- Product Family & Tab Logic ---
    const pfNavItems = document.querySelectorAll('.pf-nav-item');
    const pfPanels = document.querySelectorAll('.pf-content-panel');
    const pfSection = document.querySelector('.product-family');
    let pfInterval;
    let isPaused = false;

    // Unified function to switch tabs
    function switchTab(targetId) {
        // 1. Update Product Family Nav Items
        pfNavItems.forEach(item => {
            if (item.dataset.target === targetId) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });

        // 2. Update Panels with Animation Reset
        pfPanels.forEach(panel => {
            if (panel.id === targetId) {
                panel.style.display = 'none'; // Force reflow
                panel.offsetHeight; // Force reflow
                panel.style.display = 'block';
                panel.classList.add('active');
            } else {
                panel.classList.remove('active');
                panel.style.display = 'none';
            }
        });
    }

    // Auto-rotation logic
    function startRotation() {
        // Clear any existing interval to prevent duplicates
        if (pfInterval) clearInterval(pfInterval);

        pfInterval = setInterval(() => {
            if (!isPaused && pfNavItems.length > 0) {
                let activeIndex = -1;
                pfNavItems.forEach((item, index) => {
                    if (item.classList.contains('active')) activeIndex = index;
                });

                // Default to first if none active
                if (activeIndex === -1) activeIndex = 0;

                let nextIndex = (activeIndex + 1) % pfNavItems.length;
                const nextTarget = pfNavItems[nextIndex].dataset.target;
                switchTab(nextTarget);
            }
        }, 5000); // 5 seconds per slide
    }



    // Initialize Product Family Logic if elements exist
    if (pfNavItems.length > 0) {
        startRotation();

        // Event Listeners for Sidebar Items
        pfNavItems.forEach(item => {
            item.addEventListener('mouseenter', () => {
                const target = item.dataset.target;
                switchTab(target);
                // User interaction stops auto-rotation permanently for this session
                isPaused = true;
            });
        });

        // Pause on Hover
        if (pfSection) {
            pfSection.addEventListener('mouseenter', () => {
                isPaused = true;
            });
            pfSection.addEventListener('mouseleave', () => {
                // Determine if we should resume. 
                // Simplification for now: Resume unless user manually clicked (which sets isPaused=true).
                // Actually, let's keep it paused if they clicked, but if they just hovered, resume?
                // For simplicity/stability: If they hovered, we resume. If they CLICKED, we stay paused.
                // But the 'click' handler sets isPaused=true. 
                // So here we only resume if isPaused was set by hover? 
                // Let's just NOT resume if they clicked. But how to track 'clicked' vs 'hovered'?
                // For now, let's just NOT auto-resume on mouseleave to avoid annoying the user if they are reading.
                // Or better: Resume only if they haven't explicitly clicked.
                // Let's rely on the click handler to set a permanent pause flag if needed.
                // Re-enabling resume on mouseleave for "passive" browsing.
                // if (!userClicked) isPaused = false; 
            });
        }
    }

    // --- XAI Tooltip Logic (Terminal Style) ---
    const tooltip = document.getElementById('xai-tooltip');
    // We will dynamically rebuild the content inside the tooltip for the terminal look
    const sigBadges = document.querySelectorAll('.sig-badge');

    if (tooltip && sigBadges.length > 0) {
        sigBadges.forEach(badge => {
            badge.addEventListener('mouseenter', (e) => {
                const title = badge.dataset.xaiTitle; // e.g. "Silent Strain"
                const desc = badge.dataset.xaiDesc;
                const factors = JSON.parse(badge.dataset.xaiFactors || '[]');
                const sigId = badge.textContent.trim();

                // Rebuild Tooltip HTML structure on fly for "Terminal" look
                tooltip.innerHTML = `
                    <div class="xai-terminal-header">
                        <div class="term-header-left">
                            <span class="term-prompt">>_ XAI FORENSIC EVIDENCE</span>
                            <div class="term-sub-meta">(Explainable AI)</div>
                        </div>
                        <div class="term-auth-badge">
                            VERIFIED SIGNATURE<br>AUTHENTICATED
                        </div>
                    </div>
                    <div class="xai-terminal-body">
                        <div class="term-line">
                            <span class="line-num">01</span>
                            <span class="term-key">PATTERN_ID::</span> <span class="term-val">${title.toUpperCase().replace(/ /g, '_')}</span>
                        </div>
                        <div class="term-line">
                            <span class="line-num">02</span>
                            <span class="term-key">AI_SIGNAL::</span> <span class="term-val">${sigId}</span>
                        </div>
                        <div class="term-line">
                            <span class="line-num">03</span>
                            <span class="term-comment">// Analysis: ${desc}</span>
                        </div>
                        <div class="term-line spacer"></div>
                        ${factors.map((f, i) => `
                        <div class="term-line">
                            <span class="line-num">0${i + 4}</span>
                            <span class="term-key">FACTOR::</span> <span class="term-text">${f}</span>
                        </div>
                        `).join('')}
                    </div>
                `;

                // Show
                tooltip.classList.add('visible');
                moveTooltip(e);
            });

            badge.addEventListener('mousemove', (e) => {
                moveTooltip(e);
            });

            badge.addEventListener('mouseleave', () => {
                tooltip.classList.remove('visible');
            });
        });

        function moveTooltip(e) {
            // Position to the right and slightly down from cursor
            let x = e.clientX + 20;
            let y = e.clientY + 20;

            // Boundary check: Flip if too close to right/bottom edges
            const tooltipWidth = 450; // Approx max width
            const tooltipHeight = 250;

            if (x + tooltipWidth > window.innerWidth) {
                x = e.clientX - tooltipWidth - 10;
            }
            if (y + tooltipHeight > window.innerHeight) {
                y = e.clientY - tooltipHeight;
            }

            tooltip.style.left = `${x}px`;
            tooltip.style.top = `${y}px`;
        }
    }

    // --- Interaction for Header Dropdowns (linking to tabs) ---
    // This replaces the old 'openTab' usage for dropdowns
    function openTab(targetId) {
        // Just alias to switchTab
        switchTab(targetId);

        // Scroll to section if needed
        const section = document.getElementById('solutions');
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
        }
    }

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


    // =========================================
    // TEAM ACCORDION LOGIC
    // =========================================
    const teamCards = document.querySelectorAll('.team-card');

    if (teamCards.length > 0) {
        teamCards.forEach(card => {
            card.addEventListener('click', () => {
                // Remove active class from all other cards
                teamCards.forEach(c => {
                    if (c !== card) {
                        c.classList.remove('active');
                    }
                });

                // Toggle active class on clicked card
                // Always keep one active for this accordion style
                card.classList.add('active');
            });

            // Allow keyboard navigation
            card.setAttribute('tabindex', '0');
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    card.click();
                }
            });
        });
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

    // =========================================
    // CONTACT FORM LOGIC
    // =========================================
    function setupContactForm(formId, successMsgId) {
        const contactForm = document.getElementById(formId);
        if (contactForm) {
            contactForm.addEventListener('submit', async function (e) {
                e.preventDefault();

                const formData = new FormData(this);
                const data = Object.fromEntries(formData.entries());

                // Fix for multiple checkboxes: explicitly get all values for 'pillars'
                data.pillars = formData.getAll('pillars');
                const submitBtn = this.querySelector('.submit-btn');
                const originalBtnText = submitBtn.textContent;

                submitBtn.disabled = true;
                submitBtn.textContent = 'Sending...';

                try {
                    const response = await fetch('/api/contact', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(data)
                    });

                    if (response.ok) {
                        this.style.display = 'none';
                        const successMsg = document.getElementById(successMsgId);
                        if (successMsg) successMsg.style.display = 'block';
                    } else {
                        const result = await response.json();
                        alert(result.error || 'Failed to send message. Please try again.');
                        submitBtn.disabled = false;
                        submitBtn.textContent = originalBtnText;
                    }
                } catch (error) {
                    console.error('Error:', error);
                    alert('An error occurred. Please try again.');
                    submitBtn.disabled = false;
                    submitBtn.textContent = originalBtnText;
                }
            });
        }
    }

    // Initialize for standard contact page and about page
    setupContactForm('contactForm', 'formSuccess');

    // Initialize for main landing page (different IDs)
    setupContactForm('contactFormMain', 'formSuccessMain');

    // --- Timeline Scroll Animation ---
    const timelineSection = document.querySelector('.how-it-works-section');
    const timelineLine = document.querySelector('.timeline-line');
    const timelineProgress = document.getElementById('timelineProgress');
    const timelineSteps = document.querySelectorAll('.timeline-step');

    if (timelineSection && timelineProgress) {
        // 1. Line Progress
        window.addEventListener('scroll', () => {
            const sectionRect = timelineSection.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            const sectionTop = sectionRect.top;
            const sectionHeight = sectionRect.height;
            let scrollPercent = 0;
            const startPoint = windowHeight * 0.75;
            const scrolled = startPoint - sectionTop;

            if (scrolled > 0) {
                scrollPercent = (scrolled / sectionHeight) * 100;
            }
            scrollPercent = Math.min(Math.max(scrollPercent, 0), 100);
            timelineProgress.style.height = `${scrollPercent}%`;
        });

        // 2. Step Reveal (Intersection Observer)
        const stepObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                }
            });
        }, {
            threshold: 0.3
        });

        timelineSteps.forEach(step => {
            stepObserver.observe(step);
        });
    }


    // =========================================
    // CUSTOM CURSOR LOGIC (Big Pointer)
    // =========================================
    const cursor = document.querySelector('.custom-cursor');

    if (cursor) {
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
        });

        // Add hover effect for clickable elements
        // Re-query dynamically to catch all elements
        function updateHoverListeners() {
            const clickableElements = document.querySelectorAll('a, button, .pf-nav-item, .risk-row, input, select, textarea, .mega-menu-item'); // Added mega-menu items
            clickableElements.forEach(el => {
                el.addEventListener('mouseenter', () => cursor.classList.add('hovered'));
                el.addEventListener('mouseleave', () => cursor.classList.remove('hovered'));
            });
        }

        updateHoverListeners();

        // Ensure cursor is visible when mouse moves
        document.addEventListener('mousemove', () => {
            if (cursor.style.opacity === '0') cursor.style.opacity = '1';
        });

        // Hide when leaving window
        document.addEventListener('mouseout', (e) => {
            if (!e.relatedTarget && !e.toElement) {
                cursor.style.opacity = '0';
            }
        });
    }

    // =========================================
    // SCALE ON SCROLL LOGIC
    // =========================================
    const scaleBox = document.querySelector('.inner-black');
    if (scaleBox) {
        window.addEventListener('scroll', () => {
            const rect = scaleBox.getBoundingClientRect();
            const winHeight = window.innerHeight;

            // Logic: Scale from 0.85 to 1.0 as the box moves from bottom of screen to center
            // Start scaling when top of box enters viewport
            const enterPoint = winHeight * 0.9;
            const fullPoint = winHeight * 0.2; // Higher up

            let progress = (enterPoint - rect.top) / (enterPoint - fullPoint);

            // Clamp progress
            progress = Math.min(Math.max(progress, 0), 1);

            // Map progress to scale range 0.6 -> 1.0
            const scale = 0.6 + (progress * 0.4);

            scaleBox.style.transform = `scale3d(${scale}, ${scale}, 1)`;

        }, { passive: true });
    }

    // =========================================
    // BLOG SEARCH & FILTER (New Logic)
    // =========================================
    const dropdowns = document.querySelectorAll('.custom-dropdown');
    const blogSearchInput = document.getElementById('blogSearch');
    // const blogCards removed - ensuring dynamic query
    const visibleCountEl = document.getElementById('visibleCount');
    const totalCountEl = document.getElementById('totalCount');

    // Initial count handled by blogs-list.js after fetch


    updateResults();

    // 1. Dropdown Logic
    if (dropdowns.length > 0) {
        // Close all if clicked outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.custom-dropdown')) {
                dropdowns.forEach(d => d.classList.remove('active'));
            }
        });

        dropdowns.forEach(dropdown => {
            const trigger = dropdown.querySelector('.dropdown-trigger');
            const menu = dropdown.querySelector('.dropdown-menu');
            const labelSpan = trigger.querySelector('span');
            const defaultLabel = labelSpan.textContent;
            const filterType = dropdown.getAttribute('data-filter-type');
            const checkboxes = menu.querySelectorAll('input[type="checkbox"]');

            // Toggle Menu
            trigger.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                // Close others
                dropdowns.forEach(d => {
                    if (d !== dropdown) d.classList.remove('active');
                });
                dropdown.classList.toggle('active');
            });

            // Checkbox Selection Logic (Standard Native Behavior)
            checkboxes.forEach(chk => {
                // Use 'change' event which fires when checked state changes (clicked or labelled)
                chk.addEventListener('change', () => {
                    updateAllFilters();
                });

                // Prevent click propagation to avoid closing dropdown if logic existed
                chk.addEventListener('click', (e) => {
                    e.stopPropagation();
                });
            });

            function updateAllFilters() {
                // Recalculate based on ALL checkboxes in this dropdown
                const allCheckboxes = menu.querySelectorAll('input[type="checkbox"]');
                const selectedValues = Array.from(allCheckboxes)
                    .filter(c => c.checked)
                    .map(c => c.value);

                if (filterType === 'category') currentCategory = selectedValues;
                if (filterType === 'industry') currentIndustry = selectedValues;

                // Update UI Button Text
                if (selectedValues.length === 0) {
                    labelSpan.textContent = defaultLabel;
                    trigger.style.color = '#1a2b44';
                    trigger.style.background = '#ffffff';
                } else {
                    labelSpan.textContent = `${defaultLabel}: ${selectedValues.length}`;
                    trigger.style.color = '#ffffff';
                    trigger.style.background = '#007aff';
                }

                // Filter immediately
                filterBlogs();
            }
        });
    }

    // 2. Search Logic
    if (blogSearchInput) {
        blogSearchInput.addEventListener('input', (e) => {
            currentSearch = e.target.value.toLowerCase().trim();
            filterBlogs();
        });
    }

    // 3. Main Filter Function
    function filterBlogs() {
        // PAGINATION SUPPORT:
        // If blogs-list.js is loaded and exposes applyBlogFilter, use it.
        // This avoids DOM scanning conflict with pagination.
        if (typeof window.applyBlogFilter === 'function') {
            window.applyBlogFilter({
                category: currentCategory,
                industry: currentIndustry,
                search: currentSearch
            });
            // Update results count is handled by the pagination logic rendering
            return;
        }

        // LEGACY DOM FILTER (Fallback for non-paginated pages or if JS isn't ready)
        // QUERY DYNAMICALLY: Cards are loaded async, so we must find them now
        const currentCards = document.querySelectorAll('.blog-card');
        let visibleCount = 0;

        currentCards.forEach(card => {
            const category = card.getAttribute('data-category');
            const industry = card.getAttribute('data-industry');

            const title = card.querySelector('h3').textContent.toLowerCase();
            const excerpt = card.querySelector('p').textContent.toLowerCase();

            // Match Logic:
            // If arrays are empty, it means "All" (show everything)
            // Otherwise, check if the card's category is IN the selected array
            const matchesCategory = (currentCategory.length === 0 || currentCategory.includes(category));

            const matchesIndustry = (currentIndustry.length === 0 || currentIndustry.includes(industry));

            const tagsAttr = card.getAttribute('data-tags') || '';
            const matchesSearch = (title.includes(currentSearch) || excerpt.includes(currentSearch) || tagsAttr.includes(currentSearch));

            if (matchesCategory && matchesIndustry && matchesSearch) {
                card.style.display = 'flex';
                setTimeout(() => card.style.opacity = '1', 10);
                visibleCount++;
            } else {
                card.style.display = 'none';
                card.style.opacity = '0';
            }
        });

        updateResults(visibleCount);
    }

    function updateResults(count = null) {
        // If pagination manages this, we might not need to touch it here, but it doesn't hurt.
        // blogs-list.js updates it inside renderPage().
        const currentCards = document.querySelectorAll('.blog-card');
        if (visibleCountEl && typeof window.applyBlogFilter !== 'function') {
            visibleCountEl.textContent = count !== null ? count : currentCards.length;
        }
    }
});
