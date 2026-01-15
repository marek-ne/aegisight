const fs = require('fs');
const path = require('path');
const { parseTxtPost, normalizeMetadata } = require('../src/utils/postParser');

const postsDir = path.join(__dirname, '../public/content/posts');

// Main: Generate JSON/HTML from TXT and Create Master Index
console.log('Scanning for TXT posts in:', postsDir);

fs.readdir(postsDir, (err, files) => {
    if (err) {
        console.error('Error reading dir:', err);
        process.exit(1);
    }

    const allPosts = [];

    // 1. Process Existing JSON files (Legacy or Manual)
    files.filter(f => f.endsWith('.json') && f !== 'all-posts.json').forEach(file => {
        try {
            const data = JSON.parse(fs.readFileSync(path.join(postsDir, file), 'utf8'));
            data.slug = file.replace('.json', '');

            // Normalize Legacy JSON
            normalizeMetadata(data, data.title); // Use title as fallback content text

            allPosts.push(data);
        } catch (e) {
            console.error('Skipping invalid JSON:', file);
        }
    });

    // 2. Process TXT files
    files.filter(f => f.endsWith('.txt')).forEach(file => {
        const slug = file.replace('.txt', '');
        console.log(`Processing: ${slug}`);

        const txtPath = path.join(postsDir, file);
        const parsed = parseTxtPost(txtPath, slug);

        if (parsed) {
            // Write Individual HTML for fallback/SEO
            const htmlPath = path.join(postsDir, `${slug}.html`);
            fs.writeFileSync(htmlPath, parsed.html);
            console.log(`  -> Generated HTML`);

            // Add to Master Index
            // Check if we already have this slug from JSON (overwrite if so, or skip?)
            // Let's assume TXT is source of truth if transparent transition.
            const existingIndex = allPosts.findIndex(p => p.slug === slug);
            if (existingIndex !== -1) {
                allPosts[existingIndex] = parsed.meta;
            } else {
                allPosts.push(parsed.meta);
            }
        }
    });

    // 3. Sort by Date (Newest First)
    allPosts.sort((a, b) => new Date(b.date) - new Date(a.date));

    // 4. Write Master Index
    const indexPath = path.join(postsDir, 'all-posts.json');
    fs.writeFileSync(indexPath, JSON.stringify(allPosts, null, 4));
    console.log(`Index generated with ${allPosts.length} posts at ${indexPath}`);

    console.log('Done!');
});
