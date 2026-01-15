const fs = require('fs');

const VALID_CATEGORIES = {
    'science': ['science', 'prediction', 'predictive'],
    'forensics': ['forensic', 'investigation', 'analysis'],
    'architecture': ['architecture', 'sovereignty', 'infrastructure'],
    'strategic': ['strategic', 'resilience', 'strategy']
};

const VALID_INDUSTRIES = [
    'automobile', 'education', 'fintech', 'agriculture', 'healthcare',
    'hospitality', 'iot', 'legal', 'manufacturing', 'marketing',
    'oil_gas', 'real_estate', 'retail', 'supply_chain', 'travel'
];

/**
 * Parses a TXT blog post file.
 * @param {string} filePath - Absolute path to the .txt file
 * @param {string} slug - The slug for the post
 * @returns {Object|null} - Returns { meta, html } or null on error
 */
function parseTxtPost(filePath, slug) {
    try {
        const rawContent = fs.readFileSync(filePath, 'utf8');
        const lines = rawContent.split('\n');

        const metadata = {
            slug: slug,
            title: 'Untitled Post',
            date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: '2-digit' }),
            category: 'forensics', // Default safer option
            tags: [],
            author: {
                name: "Aegisight Team",
                title: "Contributor",
                bio: "Insights from the Aegisight team."
            },
            readTime: '5 min read',
            image: '/pics/social-share.jpg'
        };

        // NEW: Check for JSON Frontmatter (Common in "Enhanced" posts)
        // We look for ```json { ... } ``` pattern
        const jsonMatch = rawContent.match(/```json\s*([\s\S]*?)\s*```/);
        let startLineIndex = 0;

        if (jsonMatch && jsonMatch[1]) {
            try {
                const jsonMeta = JSON.parse(jsonMatch[1]);
                Object.assign(metadata, jsonMeta); // Override defaults

                // Find where the JSON ends so we can start parsing content AFTER it
                // We split rawContent by the full match to find the "post-match" part
                const parts = rawContent.split(jsonMatch[0]);
                if (parts.length > 1) {
                    // Re-split just the content part into lines for the standard loop
                    // We ignore everything BEFORE the JSON block (the meta-commentary)
                    const contentPart = parts.slice(1).join(jsonMatch[0]);
                    lines.length = 0; // Clear existing lines
                    lines.push(...contentPart.split('\n'));
                }
            } catch (e) {
                console.warn('Found JSON block but failed to parse:', e.message);
            }
        }

        let contentLines = [];
        let isContent = false;
        let foundTitle = false;

        lines.forEach(line => {
            let trimmed = line.trim();
            if (!trimmed) return;

            // 1. Skip everything until we find the Title (H1)
            // If we already have a title from JSON, we treat headers as content or title confirmation
            if (!foundTitle) {
                // If title was set via JSON, we consider it "found" for logic purposes, 
                // but we still let it check for H1 to skip the H1 line in content?
                if (metadata.title !== 'Untitled Post') {
                    foundTitle = true;
                    // Continue to check if this specific line is H1 to skip it or process it
                }

                if (trimmed.includes('H1:')) {
                    // Extract Title: Remove #, **, H1:
                    let title = trimmed.replace(/#+\s*/, '').replace(/\*\*/g, '').replace('H1:', '').trim();
                    if (metadata.title === 'Untitled Post') {
                        metadata.title = title;
                    }
                    foundTitle = true;
                    // Dont return contentLines push yet
                    return;
                }
                // If we have JSON title, and this line isn't H1, it might be content or separator
                if (foundTitle) {
                    // fall through to next checks
                } else {
                    return; // Skip pre-title noise
                }
            }

            // 2. Metadata / Content Separation
            if (foundTitle && !isContent) {
                if (trimmed.startsWith('---') || trimmed.startsWith('___')) {
                    isContent = true;
                    return;
                }
                if (trimmed.includes('H2:') || trimmed.startsWith('## ')) {
                    isContent = true;
                    // Don't return, let the content parser handle this line
                }
                else {
                    const cleanLine = trimmed.replace(/^[\*\-]\s+/, '').replace(/\*\*/g, '');

                    if (cleanLine.startsWith('Slug:')) { }
                    else if (cleanLine.startsWith('Category:')) {
                        metadata.category = cleanLine.replace('Category:', '').trim();
                    }
                    else if (cleanLine.startsWith('Tags:')) {
                        metadata.tags = cleanLine.replace('Tags:', '').split(',').map(t => t.trim());
                    }
                    else if (cleanLine.startsWith('Author Title:')) {
                        metadata.author.title = cleanLine.replace('Author Title:', '').trim();
                    }
                    else if (cleanLine.startsWith('Author Bio:')) {
                        metadata.author.bio = cleanLine.replace('Author Bio:', '').trim();
                    }
                    else if (cleanLine.startsWith('Author Image:') || cleanLine.startsWith('Avatar:')) {
                        metadata.author.image = cleanLine.replace('Author Image:', '').replace('Avatar:', '').trim();
                    }
                    else if (cleanLine.startsWith('Author LinkedIn:') || cleanLine.startsWith('LinkedIn:')) {
                        metadata.author.linkedin = cleanLine.replace('Author LinkedIn:', '').replace('LinkedIn:', '').trim();
                    }
                    else if (cleanLine.startsWith('Author:')) {
                        metadata.author.name = cleanLine.replace('Author:', '').trim();
                    }
                    else if (cleanLine.startsWith('Image:') || cleanLine.startsWith('Hero Image:')) {
                        metadata.image = cleanLine.replace('Hero Image:', '').replace('Image:', '').trim();
                    }
                    else if (cleanLine.startsWith('Date:')) {
                        metadata.date = cleanLine.replace('Date:', '').trim();
                    }
                    else if (cleanLine.includes('Read Time:')) {
                        metadata.readTime = cleanLine.replace(/.*Read Time:/, '').trim();
                    }
                    return;
                }
            }

            // 3. Content Parsing
            if (isContent) {
                let level = 0;
                let text = trimmed;
                const cleanHeader = (s) => s.replace(/\*\*/g, '').trim();

                if (trimmed.includes('H2:') || trimmed.startsWith('## ')) {
                    level = 2;
                    text = cleanHeader(trimmed.replace(/^#+\s*/, '').replace('H2:', ''));
                } else if (trimmed.includes('H3:') || trimmed.startsWith('### ')) {
                    level = 3;
                    text = cleanHeader(trimmed.replace(/^#+\s*/, '').replace('H3:', ''));
                }

                const formatText = (s) => {
                    return s
                        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                        .replace(/\*(.*?)\*/g, '<em>$1</em>')
                        .replace(/`(.*?)`/g, '<code>$1</code>');
                };

                if (level === 2) {
                    contentLines.push(`<h2>${text}</h2>`);
                } else if (level === 3) {
                    contentLines.push(`<h3>${text}</h3>`);
                } else {
                    if (trimmed.startsWith('---') || trimmed.startsWith('___')) return;
                    contentLines.push(`<p>${formatText(trimmed)}</p>`);
                }
            }
        });

        // --- NORMALIZATION STEP ---
        normalizeMetadata(metadata, contentLines.join(' '));

        // Debug fallback date if missing
        if (!metadata.date) {
            metadata.date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: '2-digit' });
        }

        return { meta: metadata, html: contentLines.join('\n') };

    } catch (err) {
        console.error('Error parsing TXT post:', filePath, err);
        return null;
    }
}

/**
 * Normalizes post metadata to ensure valid categories and industries.
 * @param {Object} metadata - The metadata object to mutate
 * @param {string} fullText - Full text content for fuzzy matching
 */
function normalizeMetadata(metadata, fullText = '') {
    // 1. Normalize Category
    const rawCat = (metadata.category || '').toLowerCase();
    let normalizedCat = 'science'; // Default fallback

    // Find matching key via basic mapping
    for (const [key, keywords] of Object.entries(VALID_CATEGORIES)) {
        if (keywords.some(k => rawCat.includes(k))) {
            normalizedCat = key;
            break;
        }
    }
    metadata.category = normalizedCat;

    // 2. Ensure Industry in Tags
    if (!metadata.tags) metadata.tags = [];
    let hasIndustry = false;
    const normalizedTags = metadata.tags.map(t => t.toLowerCase());

    // Check if existing tags cover an industry
    for (const ind of VALID_INDUSTRIES) {
        if (normalizedTags.some(t => t.includes(ind) || MINOR_MAPPINGS(t, ind))) {
            hasIndustry = true;
            break;
        }
    }

    // Helper for simple fuzzy industry matching
    function MINOR_MAPPINGS(tag, industry) {
        if (industry === 'fintech' && (tag.includes('bank') || tag.includes('finance') || tag.includes('money'))) return true;
        if (industry === 'oil_gas' && (tag.includes('energy') || tag.includes('oil'))) return true;
        if (industry === 'healthcare' && (tag.includes('medical') || tag.includes('health'))) return true;
        return false;
    }

    if (!hasIndustry) {
        let inferredIndustry = null;
        const lowerText = (fullText + ' ' + (metadata.title || '')).toLowerCase();

        for (const ind of VALID_INDUSTRIES) {
            if (lowerText.includes(ind)) {
                inferredIndustry = ind;
                break;
            }
        }
        if (!inferredIndustry) {
            if (lowerText.includes('bank') || lowerText.includes('finance')) inferredIndustry = 'fintech';
            else if (lowerText.includes('hospital') || lowerText.includes('doctor')) inferredIndustry = 'healthcare';
            else if (lowerText.includes('factory') || lowerText.includes('production')) inferredIndustry = 'manufacturing';
        }

        // Fallback: Hash of slug
        if (!inferredIndustry) {
            const slug = metadata.slug || 'default';
            const hash = slug.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
            inferredIndustry = VALID_INDUSTRIES[hash % VALID_INDUSTRIES.length];
        }

        metadata.tags.push(inferredIndustry);
    }
}

module.exports = { parseTxtPost, normalizeMetadata };
