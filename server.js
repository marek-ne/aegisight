// Load environment variables from .env file - MUST BE FIRST
require('dotenv').config();

const express = require('express');
const helmet = require('helmet');
const path = require('path');
const fs = require('fs');
const compression = require('compression');
const nodemailer = require('nodemailer');

// Authentication requires
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('./config/passport');
const authRoutes = require('./routes/auth');
const dashboardRoutes = require('./routes/dashboard');
const riskRoutes = require('./routes/risk');
const User = require('./models/User');

const app = express();
const PORT = process.env.PORT || 3003;

// Security headers with CSP configured for analytics
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: [
                "'self'",
                "'unsafe-inline'",
                "https://www.googletagmanager.com",
                "https://www.google-analytics.com",
                "https://*.clarity.ms",
                "https://www.google.com/recaptcha/",
                "https://www.gstatic.com/recaptcha/",
                "https://accounts.google.com",
                "https://cdn.jsdelivr.net",
                "https://cdn.tailwindcss.com"
            ],
            imgSrc: ["'self'", "data:", "https:", "https://*.google-analytics.com", "https://*.googletagmanager.com", "https://*.googleusercontent.com"],
            connectSrc: [
                "'self'",
                "https://*.google-analytics.com",
                "https://*.analytics.google.com",
                "https://*.googletagmanager.com",
                "https://*.clarity.ms",
                "https://generativelanguage.googleapis.com"
            ],
            frameSrc: ["https://www.googletagmanager.com", "https://www.google.com/recaptcha/", "https://accounts.google.com"],
            styleSrc: ["'self'", "https:", "'unsafe-inline'"],
            fontSrc: ["'self'", "https:", "data:"],
            scriptSrcAttr: ["'unsafe-inline'"]
        }
    },
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// Gzip/Brotli compression
app.use(compression());

// Authentication middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
    secret: process.env.SESSION_SECRET || 'fallback-secret-change-me',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000
    }
}));
app.use(passport.initialize());
app.use(passport.session());

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public'), {
    maxAge: '0',
    etag: false
}));

// Mount authentication routes
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/risk', riskRoutes);
app.use('/api', require('./routes/api'));

// Serve Sentinel Onboarding App
app.use('/onboarding', express.static(path.join(__dirname, 'public', 'onboarding')));
app.get(/\/onboarding\/.*/, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'onboarding', 'index.html'));
});

// Dashboard route
app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'dashboard_mvp.html'));
});

// Existing routes
app.get('/widget-isolation', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'widget-isolation.html'));
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// Blogs Page
app.get('/blogs', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'blogs.html'));
});

// Category/Tag Route (Serves same view, client-side filters)
app.get('/blog-categories/:tag', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'blogs.html'));
});

// Load Shared Parser
const { parseTxtPost } = require('./src/utils/postParser');

// API: List all blog posts (Optimized)
app.get('/api/posts', (req, res) => {
    const postsDir = path.join(__dirname, 'public', 'content', 'posts');
    const indexPath = path.join(postsDir, 'all-posts.json');

    // Fast Path: Read pre-built index
    if (fs.existsSync(indexPath)) {
        try {
            const allPosts = JSON.parse(fs.readFileSync(indexPath, 'utf8'));
            return res.json(allPosts);
        } catch (err) {
            console.error('Error reading posts index:', err);
            // Fallthrough to directory scan if index is corrupt
        }
    }

    // Fallback: Scan Directory (Slow, Legacy)
    console.warn('Warning: all-posts.json not found, falling back to directory scan');
    fs.readdir(postsDir, (err, files) => {
        if (err) {
            console.error('Error reading posts directory:', err);
            return res.status(500).json({ error: 'Failed to fetch posts' });
        }

        const posts = [];
        files.filter(f => f.endsWith('.txt')).forEach(file => {
            const slug = file.replace('.txt', '');
            const parsed = parseTxtPost(path.join(postsDir, file), slug);
            if (parsed) posts.push(parsed.meta);
        });

        // Sort by date (newest first)
        posts.sort((a, b) => new Date(b.date) - new Date(a.date));
        res.json(posts);
    });
});

// API: Get Single Post (Content + Meta)
app.get('/api/post/:slug', (req, res) => {
    const slug = req.params.slug;
    const postsDir = path.join(__dirname, 'public', 'content', 'posts');

    // 1. Try JSON + HTML pair
    const jsonPath = path.join(postsDir, `${slug}.json`);
    const htmlPath = path.join(postsDir, `${slug}.html`);

    if (fs.existsSync(jsonPath)) {
        try {
            const meta = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
            let content = '';
            if (fs.existsSync(htmlPath)) {
                content = fs.readFileSync(htmlPath, 'utf8');
            }
            return res.json({ meta, content });
        } catch (err) {
            return res.status(500).json({ error: 'Error reading post files' });
        }
    }

    // 2. Try TXT file (using shared parser)
    const txtPath = path.join(postsDir, `${slug}.txt`);
    if (fs.existsSync(txtPath)) {
        const parsed = parseTxtPost(txtPath, slug);
        if (parsed) {
            return res.json({ meta: parsed.meta, content: parsed.html });
        }
    }

    res.status(404).json({ error: 'Post not found' });
});


app.get('/post/:slug', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'blog-post.html'));
});

app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'about.html'));
});

app.get('/privacy', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'privacy.html'));
});

app.get('/terms', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'terms.html'));
});

app.get('/contact', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'contact.html'));
});

// Risk Audit (CSV Upload) Page
app.get('/risk-audit', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'risk-audit.html'));
});

// Account / Login Page (Dedicated)
app.get('/account', (req, res) => {
    // If already logged in, redirect to dashboard
    if (req.isAuthenticated()) {
        return res.redirect('/dashboard');
    }
    res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

// Signup Page
app.get('/signup', (req, res) => {
    // If already logged in, redirect to dashboard
    if (req.isAuthenticated()) {
        return res.redirect('/dashboard');
    }
    // TODO: Create dedicated signup view or reuse login with mode
    // For now, let's reuse login.html but we might need a separate one later.
    // However, the task implies a separate page or flow.
    // Let's assume we will create a signup.html or use login.html with query param?
    // User requested "Sign in page...".
    // Let's serve the same login page for now if we haven't created signup.html, 
    // OR creating a simple signup placeholder.
    // Actually, I should create a signup.html to properly fulfill the "professional" requirement.
    // For this step I will point to signup.html and create it in next step.
    res.sendFile(path.join(__dirname, 'views', 'signup.html'));
});

// Reset Password Page
app.get('/reset-password/:token', async (req, res) => {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');

    try {
        const token = req.params.token;
        const filePath = path.join(__dirname, 'views', 'reset-password.html');
        let html = fs.readFileSync(filePath, 'utf8');

        // Verify token server-side to inject email
        const user = await User.findByResetToken(token);

        if (user) {
            // Inject email into the hidden input for Chrome Password Manager
            // Finds 'value=""' in the username input specifically and replaces it
            html = html.replace(
                'name="username" autocomplete="username" value=""',
                `name="username" autocomplete="username" value="${user.email}"`
            );
        }

        res.send(html);
    } catch (err) {
        console.error('Error serving reset page:', err);
        res.status(500).send('Server Error');
    }
});

// Contact form submission
app.post('/send-email', async (req, res) => {
    const { firstName, lastName, email, message, recaptchaToken } = req.body;

    if (!firstName || !lastName || !email || !message || !recaptchaToken) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    // Verify reCAPTCHA
    try {
        const fetch = (await import('node-fetch')).default;
        const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${recaptchaToken}`;
        const recaptchaResponse = await fetch(verifyUrl, { method: 'POST' });
        const recaptchaData = await recaptchaResponse.json();

        if (!recaptchaData.success) {
            return res.status(400).json({ message: 'reCAPTCHA verification failed.' });
        }
    } catch (error) {
        console.error('reCAPTCHA verification error:', error);
        return res.status(500).json({ message: 'Failed to verify reCAPTCHA.' });
    }

    // Send email
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: false,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    });

    const mailOptions = {
        from: process.env.SMTP_USER,
        to: 'sales@aegisight.ai',
        subject: `New Contact Form Submission from ${firstName} ${lastName}`,
        text: `Name: ${firstName} ${lastName}\nEmail: ${email}\n\nMessage:\n${message}`
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Email sent successfully to sales@aegisight.ai from ${firstName} ${lastName}`);
        res.status(200).json({ message: 'Message sent successfully!' });
    } catch (error) {
        console.error("Error sending email:", error);
        res.status(500).json({ message: 'Failed to send message.' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
