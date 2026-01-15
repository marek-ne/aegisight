const POSTS_PER_PAGE = 15;
let allPosts = [];
let filteredPosts = [];
let currentPage = 1;

document.addEventListener('DOMContentLoaded', async () => {
    const grid = document.querySelector('.blog-grid');
    const visibleCountSpan = document.getElementById('visibleCount');
    const totalCountSpan = document.getElementById('totalCount');

    if (!grid) return;

    try {
        const res = await fetch('/api/posts');
        if (!res.ok) throw new Error('Failed to fetch posts');
        allPosts = await res.json();

        // Initial State: All posts are visible
        filteredPosts = [...allPosts];

        // Update Total Count
        if (totalCountSpan) totalCountSpan.textContent = allPosts.length;

        // Render Page 1
        renderPage(1);

        // NOW check for URL tags, ensuring the DOM is fully populated first
        checkUrlForTag();

    } catch (err) {
        console.error('Error loading blogs:', err);
        grid.innerHTML = '<p>Unable to load blog posts at this time.</p>';
    }
});

function renderPage(page) {
    currentPage = page;
    const grid = document.querySelector('.blog-grid');
    const visibleCountSpan = document.getElementById('visibleCount');

    // Calculate Slice
    const start = (page - 1) * POSTS_PER_PAGE;
    const end = start + POSTS_PER_PAGE;
    const pagePosts = filteredPosts.slice(start, end);

    // Update Visible Count (Contextual: "Showing 15 of 45 posts")
    // Actually, UX convention is usually "Showing 1-15 of 45" or just total count.
    // The previous request asked for "Showing X post(s) (out of Y total)".
    // Let's keep it consistent: X is visible *now* on this page? Or Matches? 
    // Usually "Showing matches". Let's show filtered count.
    if (visibleCountSpan) visibleCountSpan.textContent = filteredPosts.length;

    // Clear Grid
    grid.innerHTML = '';

    if (pagePosts.length === 0) {
        grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center;">No posts found matching your criteria.</p>';
        renderPaginationControls();
        return;
    }

    // Render Cards
    pagePosts.forEach(post => {
        // Data Attributes for Filtering
        const categorySlug = normalizeCategory(post.category);
        const industrySlug = detectIndustry(post.tags);

        const article = document.createElement('article');
        article.className = 'blog-card';
        // Keep attributes for search logic, although we might need to update search logic to filter *data* not DOM
        // BUT: The current search logic (main.js) scans the DOM. This breaks with pagination because hidden pages aren't in DOM.
        // WE MUST UPDATE FILTER LOGIC TO WORK ON DATA, OR RENDER ALL AND HIDE (Bad for perf), OR UPDATE main.js.
        // Given complexity, let's make filterByTag update `filteredPosts` and re-render.

        const tagsString = (post.tags || []).join(',').toLowerCase();
        article.setAttribute('data-category', categorySlug);
        article.setAttribute('data-industry', industrySlug);
        article.setAttribute('data-tags', tagsString);

        const imageUrl = post.image || '/assets/images/placeholder_card1.jpg';
        const levelTag = post.level ? `<div class="level-tag">Level: ${post.level}</div>` : '';

        article.innerHTML = `
            <div class="blog-img-wrapper">
                <img src="${imageUrl}" alt="${post.title}">
                <span class="blog-tag">${post.category}</span>
            </div>
            <div class="blog-content">
                ${levelTag}
                <h3><a href="/post/${post.slug}">${post.title}</a></h3>
                <p>${post.excerpt || 'Click to read more...'}</p>
                
                <div class="blog-card-tags">
                    ${(post.tags || []).map(tag =>
            `<span class="card-tag" onclick="filterByTag('${tag}')">#${tag}</span>`
        ).join('')}
                </div>

                <div class="blog-meta">
                    <span>Aegisight AI Insight ${formatDate(post.date)}</span> • <span>${post.readTime || '5 min read'}</span>
                </div>
            </div>
        `;

        grid.appendChild(article);
    });

    renderPaginationControls();

    // Scroll to top of grid
    const filterSection = document.querySelector('.blog-filter-section');
    if (filterSection && page > 1) {
        filterSection.scrollIntoView({ behavior: 'smooth' });
    }
}

function renderPaginationControls() {
    const container = document.getElementById('pagination-controls');
    if (!container) return;

    container.innerHTML = '';
    const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);

    // OLD CHECK: if (totalPages <= 1) return;
    // We want to show it even if only 1 page exists.
    if (totalPages === 0) return;

    // Previous / Next Logic
    // Start with strict 1, 2, 3 ... 101 Next style requested
    function createBtn(label, pageNum, isActive = false, isDisabled = false) {
        const btn = document.createElement('button');
        btn.className = `page-btn ${isActive ? 'active' : ''}`;
        btn.textContent = label;
        if (isDisabled) {
            btn.disabled = true;
        } else {
            btn.onclick = () => renderPage(pageNum);
        }
        return btn;
    }

    // Logic for "1 2 3 4 5 ... 101 Next >"
    // Let's implement dynamic window: [1] ... [current-1] [current] [current+1] ... [last]

    // Always show Page 1
    container.appendChild(createBtn('1', 1, currentPage === 1));

    // Start of window
    let startPage = Math.max(2, currentPage - 2);
    let endPage = Math.min(totalPages - 1, currentPage + 2);

    if (startPage > 2) {
        const dots = document.createElement('span');
        dots.className = 'page-dots';
        dots.textContent = '...';
        container.appendChild(dots);
    }

    for (let i = startPage; i <= endPage; i++) {
        container.appendChild(createBtn(i, i, currentPage === i));
    }

    if (endPage < totalPages - 1) {
        const dots = document.createElement('span');
        dots.className = 'page-dots';
        dots.textContent = '...';
        container.appendChild(dots);
    }

    // Always show Last Page if > 1
    if (totalPages > 1) {
        container.appendChild(createBtn(totalPages, totalPages, currentPage === totalPages));
    }

    // Next Button
    const nextBtn = createBtn('Next >', currentPage + 1, false, currentPage === totalPages);
    container.appendChild(nextBtn);
}


function normalizeCategory(cat) {
    if (!cat) return 'other';
    const lower = cat.toLowerCase();
    if (lower.includes('forensic')) return 'forensics';
    if (lower.includes('science')) return 'science';
    if (lower.includes('architect')) return 'architecture';
    if (lower.includes('strategic')) return 'strategic';
    return 'other';
}

function detectIndustry(tags) {
    if (!tags || !Array.isArray(tags)) return 'other';
    const lowerTags = tags.map(t => t.toLowerCase());

    if (lowerTags.some(t => t.includes('financ') || t.includes('bank'))) return 'fintech';
    if (lowerTags.some(t => t.includes('health'))) return 'healthcare';
    if (lowerTags.some(t => t.includes('retail'))) return 'retail';
    if (lowerTags.some(t => t.includes('manufact'))) return 'manufacturing';
    if (lowerTags.some(t => t.includes('iot'))) return 'iot';

    return 'other';
}

function slugify(text) {
    return text.toString().toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '');
}

function deslugify(slug) {
    return slug.replace(/-/g, ' ');
}

window.filterByTag = function (tag) {
    const slug = slugify(tag);
    window.location.href = `/blog-categories/${slug}`;
};

function formatDate(dateStr) {
    try {
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return dateStr;
        const monthShort = date.toLocaleString('default', { month: 'short' });
        const year = date.getFullYear();
        return `${monthShort} ${year}`;
    } catch (e) {
        return dateStr;
    }
}

function checkUrlForTag() {
    const path = window.location.pathname;
    const prefix = '/blog-categories/';

    if (path.startsWith(prefix)) {
        const slug = path.replace(prefix, '');
        let tag = decodeURIComponent(slug);

        if (tag.includes('-') && !tag.includes(' ')) {
            tag = deslugify(tag);
        }

        const searchInput = document.getElementById('blogSearch');
        if (searchInput && tag) {
            document.title = `${tag.charAt(0).toUpperCase() + tag.slice(1)} - Aegisight Insights`;
            searchInput.value = tag;
            searchInput.dispatchEvent(new Event('input'));

            const filterSection = document.querySelector('.blog-filter-section');
            if (filterSection) filterSection.scrollIntoView({ behavior: 'smooth' });
        }
    }
}

// EXPOSE SEARCH API for main.js or other scripts
// This allows main.js to perform filtering on our data model instead of DOM
window.applyBlogFilter = function (criteria) {
    // criteria: { category: [], industry: [], search: '' }

    filteredPosts = allPosts.filter(post => {
        const postCat = normalizeCategory(post.category);
        const postInd = detectIndustry(post.tags);
        const tagsString = (post.tags || []).join(',').toLowerCase();
        const searchContent = (post.title + ' ' + (post.excerpt || '') + ' ' + tagsString).toLowerCase();

        // 1. Category
        if (criteria.category && criteria.category.length > 0 && !criteria.category.includes(postCat)) {
            return false;
        }

        // 2. Industry
        if (criteria.industry && criteria.industry.length > 0 && !criteria.industry.includes(postInd)) {
            return false;
        }

        // 3. Search
        if (criteria.search && !searchContent.includes(criteria.search.toLowerCase())) {
            return false;
        }

        return true;
    });

    renderPage(1);
}
