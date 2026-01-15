---
description: How to add a new blog post to the Aegisight website
---

# Create a New Blog Post

The Aegisight blog system is designed to be simple. You do NOT need to write code. You only need to create two text files (one for metadata, one for content) and upload your images.

## Step 1: Choose a "Slug"
The "slug" is the URL-friendly name of your post.
*   **Example Title**: "The Future of AI"
*   **Slug**: `the-future-of-ai`
*   **Final URL**: `aegisight.ai/post/the-future-of-ai`

## Step 2: Create the Metadata File
Create a new file in `/public/content/posts/` named `[slug].json`.

**Example Path**: `/public/content/posts/the-future-of-ai.json`

**Template (Copy & Paste):**
```json
{
    "title": "The Future of AI is Agentic",
    "date": "October 24, 2025",
    "category": "AI Insights",
    "tags": [
        "Agents",
        "Automation",
        "Future Tech"
    ],
    "author": {
        "name": "Marek Nerko",
        "title": "Founder & CEO",
        "bio": "Marek is leading the charge in autonomous enterprise AI solutions.",
        "image": "/pics/team/marek.jpg",
        "email": "marek@aegisight.ai",
        "linkedin": "https://linkedin.com/in/mareknerko"
    }
}
```

## Step 3: Create the Content File
Create a new file in `/public/content/posts/` named `[slug].html`.

**Example Path**: `/public/content/posts/the-future-of-ai.html`

**Instructions**:
*   Write standard HTML content.
*   Use `<h2>` for main sections (these will automatically appear in the Table of Contents).
*   Use `<h3>` for sub-sections (nested in ToC).
*   Use `<p>` for paragraphs.
*   Use `<img>` for images.

**Template:**
```html
<p>
    The era of static software is over. Agentic AI is rewriting the rules of...
</p>

<h2>1. What is an Agent?</h2>
<p>
    Unlike chatbots, agents can take action...
</p>
<img src="/assets/images/agent-diagram.png" alt="Agent Diagram" style="width: 100%; border-radius: 12px; margin: 2rem 0;">

<h3>1.1. Autonomy vs. Automation</h3>
<p>
    While automation follows a script, autonomy decides the script...
</p>

<h2>2. Conclusion</h2>
<p>
    The future is bright.
</p>
```

## Step 4: Add Images (Optional)
1.  Upload your image files to `/public/assets/images/`.
2.  Reference them in your HTML file using the path: `/assets/images/your-image.jpg`.

## Step 5: Verify
Go to `http://localhost:3003/post/the-future-of-ai` to see your new post live!
