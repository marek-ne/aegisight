const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

// Generate JWT token
const generateToken = (user) => {
    return jwt.sign(
        {
            id: user.id,
            email: user.email,
            authProvider: user.auth_provider
        },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
    );
};

// Verify JWT token
const verifyToken = (token) => {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        return null;
    }
};

// Middleware to require authentication
const requireAuth = (req, res, next) => {
    // Check session first (for Google OAuth)
    if (req.isAuthenticated && req.isAuthenticated()) {
        return next();
    }

    // Check JWT token in cookie
    const token = req.cookies.auth_token;

    if (!token) {
        return res.status(401).json({ error: 'Authentication required' });
    }

    const decoded = verifyToken(token);

    if (!decoded) {
        return res.status(401).json({ error: 'Invalid or expired token' });
    }

    req.userId = decoded.id;
    next();
};

// Optional auth middleware (doesn't fail if not authenticated)
const optionalAuth = (req, res, next) => {
    if (req.isAuthenticated && req.isAuthenticated()) {
        return next();
    }

    const token = req.cookies.auth_token;

    if (token) {
        const decoded = verifyToken(token);
        if (decoded) {
            req.userId = decoded.id;
        }
    }

    next();
};

module.exports = {
    generateToken,
    verifyToken,
    requireAuth,
    optionalAuth
};
