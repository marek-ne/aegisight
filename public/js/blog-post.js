document.addEventListener('DOMContentLoaded', async () => {

    // 1. Theme Toggle Logic
    const themeBtn = document.getElementById('theme-toggle');
    const toggleIconSun = themeBtn ? themeBtn.querySelector('.icon-sun') : null;
    const toggleIconMoon = themeBtn ? themeBtn.querySelector('.icon-moon') : null;

    // Check saved preference
    const savedTheme = localStorage.getItem('blog-theme');

    const applyTheme = (mode) => {
        if (mode === 'dark') {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
        localStorage.setItem('blog-theme', mode);
    };

    if (savedTheme === 'dark') {
        applyTheme('dark');
    }

    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            const isDark = document.body.classList.contains('dark-mode');
            applyTheme(isDark ? 'light' : 'dark');
        });
    }

    // Scroll To Top Logic
    const scrollTopBtn = document.querySelector('.sticky-scroll-top');
    if (scrollTopBtn) {
        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // 2. Parse URL for Slug
    // Path is /post/some-slug
    const path = window.location.pathname;
    const slug = path.split('/post/')[1];

    if (!slug) {
        document.getElementById('postTitle').textContent = 'Article Not Found';
        return;
    }

    try {
        // 3. Fetch Post Data (Unified API)
        const res = await fetch(`/api/post/${slug}`);
        if (!res.ok) throw new Error('Post not found');

        const data = await res.json();
        const meta = data.meta;
        const contentHtml = data.content;

        // 5. Populate DOM
        document.title = `${meta.title} | Aegisight Blog`;
        document.getElementById('postTitle').textContent = meta.title;

        // Social Share Logic
        const currentUrl = encodeURIComponent(window.location.href);
        const currentTitle = encodeURIComponent(meta.title);

        const twitterBtn = document.getElementById('share-twitter');
        if (twitterBtn) twitterBtn.href = `https://twitter.com/intent/tweet?text=${currentTitle}&url=${currentUrl}`;

        const fbBtn = document.getElementById('share-facebook');
        if (fbBtn) fbBtn.href = `https://www.facebook.com/sharer/sharer.php?u=${currentUrl}`;

        const linkedinBtn = document.getElementById('share-linkedin');
        if (linkedinBtn) linkedinBtn.href = `https://www.linkedin.com/shareArticle?mini=true&url=${currentUrl}&title=${currentTitle}`;

        // Hero Image Logic
        const heroImg = document.querySelector('.blog-page-hero_img');
        if (heroImg && meta.image) {
            heroImg.src = meta.image;
            heroImg.alt = meta.title;
        }

        // Tags (Sidebar)
        const tagsContainer = document.getElementById('postTagsSidebar');
        if (tagsContainer && meta.tags) {
            tagsContainer.innerHTML = meta.tags.map(tag => `<span class="tag">${tag}</span>`).join('');
        }

        // Category (Sidebar)
        const catContainer = document.getElementById('postCategorySidebar');
        if (catContainer && meta.category) {
            // Check if array or string
            const cats = Array.isArray(meta.category) ? meta.category : [meta.category];
            catContainer.innerHTML = cats.map(c => `<span class="category-item">${c}</span>`).join('');
        }

        // Author Population
        const safeSetText = (id, text) => { const el = document.getElementById(id); if (el) el.textContent = text; };
        const safeSetSrc = (id, src) => { const el = document.getElementById(id); if (el) el.style.backgroundImage = `url('${src}')`; }; // Avatar is BG image in new template
        const safeSetHref = (id, href) => { const el = document.getElementById(id); if (el) el.href = href; };

        // Sidebar
        safeSetText('authorNameLarge', meta.author.name);
        safeSetText('authorTitle', meta.author.title);
        safeSetHref('authorLinkedIn', meta.author.linkedin);
        safeSetText('authorBioMobile', meta.author.bio); // Using bio-text class but ID passed

        // Images
        if (meta.author.image) {
            const avatarEl = document.getElementById('authorImgLarge');
            if (avatarEl) avatarEl.style.backgroundImage = `url('${meta.author.image}')`;
        }

        // Inject Body
        const articleBody = document.getElementById('blog-rich-text');
        // Keep the H1 in the Hero, remove it from body if present, or just inject.
        // The fetch content usually contains H2s and Ps.
        articleBody.innerHTML = contentHtml;

        // 6. Generate Table of Contents (Improved Logic)
        generateToC();

    } catch (error) {
        console.error(error);
        document.getElementById('postTitle').textContent = 'Error Loading Article';
        const body = document.getElementById('blog-rich-text');
        if (body) body.innerHTML = '<p>Sorry, we could not load this post.</p>';
    }

    // 7. Load "Our Latest Blogs" (Bottom Section)
    loadLatestBlogs(slug);
});

async function loadLatestBlogs(currentSlug) {
    const grid = document.querySelector('.blog-list-grid');
    if (!grid) return;

    try {
        const res = await fetch('/api/posts');
        if (!res.ok) return;

        let posts = await res.json();

        // Filter out current post
        posts = posts.filter(p => p.slug !== currentSlug);

        // Take top 3
        const latest = posts.slice(0, 3);

        grid.innerHTML = '';

        latest.forEach(post => {
            const cardLink = document.createElement('a');
            cardLink.href = `/post/${post.slug}`;
            cardLink.className = 'blog-card-link';

            // Use image from post or fallback
            // Note: some posts might not have 'image' field if minimal JSON or TXT
            const imgUrl = post.image || '/pics/social-share.jpg';

            cardLink.innerHTML = `
                <div class="blog-card-image-wrapper">
                    <img src="${imgUrl}" alt="${post.title}" class="blog-card-image">
                </div>
                <div class="blog-card-content">
                    <h3 class="blog-card-title">${post.title}</h3>
                    <div class="blog-card-arrow">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                            xmlns="http://www.w3.org/2000/svg">
                            <path d="M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round" />
                            <path d="M12 5L19 12L12 19" stroke="currentColor" stroke-width="2"
                                stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                    </div>
                </div>
            `;

            grid.appendChild(cardLink);
        });

    } catch (err) {
        console.error('Failed to load latest blogs', err);
    }
}

// ToC Logic from toc-demo.html
function generateToC() {
    const tocList = document.getElementById('toc-list');
    const content = document.getElementById('blog-rich-text');
    if (!content || !tocList) return;

    const headings = content.querySelectorAll('h2, h3');

    let h2Count = 0;
    let h3Count = 0;
    let lastH2Li = null;

    headings.forEach((heading, index) => {

        // 1. Prepare Clean Text (for ID and display)
        // Strip existing numbering (e.g., "1. ", "2.1. ")
        let cleanText = heading.innerText.replace(/^\d+(\.\d+)*\.?\s*/, '').trim();

        // 2. Generate Semantic ID
        // e.g. "The Paradox of Observability" -> "the-paradox-of-observability"
        let slug = cleanText
            .toLowerCase()
            .replace(/[^\w\s-]/g, '') // Remove non-word chars
            .replace(/\s+/g, '-')     // Replace spaces with -
            .replace(/-+/g, '-');     // Collapse dashes

        // Unique ID fallback
        if (!slug || document.getElementById(slug)) {
            slug = `${slug}-${index}`;
        }

        if (!heading.id) heading.id = slug;

        // 3. Add Numbering to Visual Text
        let numbering = '';
        if (heading.tagName === 'H2') {
            h2Count++;
            h3Count = 0;
            numbering = `${h2Count}. `;
        } else if (heading.tagName === 'H3') {
            h3Count++;
            numbering = `${h2Count}.${h3Count}. `;
        }

        if (!heading.innerText.startsWith(numbering.trim())) {
            heading.innerText = numbering + cleanText;
        }

        // 4. Create ToC Item
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = `#${heading.id}`;
        a.textContent = heading.innerText;
        a.classList.add('toc-link');

        a.addEventListener('click', (e) => {
            e.preventDefault();
            // Update URL
            history.pushState(null, null, `#${heading.id}`);

            // Function to handle scroll with offset
            scrollToElement(heading.id);
        });

        li.appendChild(a);

        if (heading.tagName === 'H2') {
            tocList.appendChild(li);
            lastH2Li = li;
        } else if (heading.tagName === 'H3' && lastH2Li) {
            let subOl = lastH2Li.querySelector('ol');
            if (!subOl) {
                subOl = document.createElement('ol');
                lastH2Li.appendChild(subOl);
            }
            subOl.appendChild(li);
        }
    });

    // 5. Handle Initial Hash Scroll (Deep Linking)
    if (window.location.hash) {
        // Tiny timeout to ensure layout is stable
        setTimeout(() => {
            const id = window.location.hash.substring(1);
            if (document.getElementById(id)) {
                scrollToElement(id);
            }
        }, 100);
    }

    function scrollToElement(id) {
        const targetElement = document.getElementById(id);
        if (!targetElement) return;

        const offset = window.innerHeight * 0.20;
        const bodyRect = document.body.getBoundingClientRect().top;
        const elementRect = targetElement.getBoundingClientRect().top;
        const elementPosition = elementRect - bodyRect;
        const offsetPosition = elementPosition - offset;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }

    const observerOptions = {
        rootMargin: "-20% 0px -70% 0px",
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.id;

                document.querySelectorAll('.is-active-item').forEach(li =>
                    li.classList.remove('is-active-item'));
                document.querySelectorAll('.toc-link').forEach(link =>
                    link.classList.remove('active-link'));
                document.querySelectorAll('#toc-list li').forEach(li =>
                    li.classList.remove('is-expanded'));

                const activeLink = document.querySelector(`.toc-link[href="#${id}"]`);
                if (activeLink) {
                    activeLink.classList.add('active-link');

                    const immediateLi = activeLink.closest('li');
                    if (immediateLi) immediateLi.classList.add('is-active-item');

                    let parentLi = immediateLi;
                    if (parentLi.parentElement.tagName === 'OL' && parentLi.parentElement.id !== 'toc-list') {
                        const h2Li = parentLi.parentElement.closest('li');
                        if (h2Li) h2Li.classList.add('is-expanded');
                    } else {
                        parentLi.classList.add('is-expanded');
                    }
                }
            }
        });
    }, observerOptions);

    headings.forEach(h => observer.observe(h));
}
