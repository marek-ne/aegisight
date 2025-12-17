const express = require('express');
const router = express.Router();
const passport = require('../config/passport');
const User = require('../models/User');
const { generateToken } = require('../middleware/auth');

// POST /api/auth/register - Email/password registration
router.post('/register', async (req, res) => {
    try {
        const { email, password, firstName, lastName, companyName, businessPhone, jobLevel, department, jobFunction, country } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        if (password.length < 6) {
            return res.status(400).json({ error: 'Password must be at least 6 characters' });
        }

        // Check if user already exists
        const existingUser = await User.findByEmail(email);
        if (existingUser) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        // Create user
        const user = await User.createWithEmail({
            email,
            password,
            firstName: firstName || '',
            lastName: lastName || '',
            companyName: companyName || '',
            businessPhone: businessPhone || '',
            jobLevel: jobLevel || '',
            department: department || '',
            jobFunction: jobFunction || '',
            country: country || ''
        });

        // Generate JWT token
        const token = generateToken(user);

        // Set cookie
        res.cookie('auth_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        res.json({
            success: true,
            user: {
                id: user.id,
                email: user.email,
                firstName: user.first_name,
                lastName: user.last_name
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Registration failed' });
    }
});

// POST /api/auth/login - Email/password login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        // Find user
        const user = await User.findByEmail(email);
        if (!user || !user.password_hash) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Verify password
        const isValid = await User.comparePassword(password, user.password_hash);
        if (!isValid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Update last login
        await User.updateLastLogin(user.id);

        // Generate JWT token
        const token = generateToken(user);

        // Set cookie
        res.cookie('auth_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        res.json({
            success: true,
            user: {
                id: user.id,
                email: user.email,
                firstName: user.first_name,
                lastName: user.last_name,
                avatarUrl: user.avatar_url
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Login failed' });
    }
});

// GET /api/auth/google - Initiate Google OAuth
router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}));

// GET /api/auth/google/callback - Google OAuth callback
router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: '/?login=failed' }),
    (req, res) => {
        // Generate JWT token
        const token = generateToken(req.user);

        // Set cookie
        res.cookie('auth_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        // Redirect to dashboard
        res.redirect('/');
    }
);

// GET /api/auth/me - Get current user
router.get('/me', async (req, res) => {
    try {
        // Check session or JWT
        let userId = null;

        if (req.isAuthenticated && req.isAuthenticated()) {
            userId = req.user.id;
        } else {
            const token = req.cookies.auth_token;
            if (token) {
                const jwt = require('jsonwebtoken');
                const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key-change-in-production');
                userId = decoded.id;
            }
        }

        if (!userId) {
            return res.status(401).json({ error: 'Not authenticated' });
        }

        const user = await User.getPublicProfile(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ user });
    } catch (error) {
        console.error('Get user error:', error);
        res.status(401).json({ error: 'Authentication failed' });
    }
});

// POST /api/auth/logout - Logout
router.post('/logout', (req, res) => {
    req.logout(() => {
        res.clearCookie('auth_token');
        res.json({ success: true });
    });
});

// POST /api/auth/forgot-password
router.post('/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;
        const crypto = require('crypto');
        const nodemailer = require('nodemailer');

        const user = await User.findByEmail(email);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Generate token
        const token = crypto.randomBytes(32).toString('hex');
        const expires = new Date(Date.now() + 3600000); // 1 hour

        await User.saveResetToken(email, token, expires);

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

        const resetUrl = `https://${req.get('host')}/reset-password/${token}`;
        const userName = user.first_name ? user.first_name : 'User';

        await transporter.sendMail({
            from: process.env.SMTP_USER,
            to: email,
            subject: 'Password Reset Request',
            text: `Hi ${userName},\n\n
            You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
            Please click on the following link, or paste this into your browser to complete the process:\n\n
            ${resetUrl}\n\n
            If you did not request this, please ignore this email and your password will remain unchanged.\n`
        });

        res.json({ success: true, message: 'Reset email sent' });

    } catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({ error: 'Failed to send reset email' });
    }
});

// GET /api/auth/verify-token/:token
router.get('/verify-token/:token', async (req, res) => {
    try {
        const { token } = req.params;
        const user = await User.findByResetToken(token);

        if (!user) {
            return res.status(400).json({ valid: false, error: 'Token invalid or expired' });
        }

        res.json({
            valid: true,
            email: user.email,
            firstName: user.first_name
        });
    } catch (error) {
        console.error('Verify token error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// POST /api/auth/reset-password
router.post('/reset-password', async (req, res) => {
    try {
        const { token, password } = req.body;
        console.log('Reset password request for token:', token);

        const user = await User.findByResetToken(token);

        if (!user) {
            console.log('User not found by token or token expired.');
            // Debugging: Check if the token exists at all, ignoring expiry
            const db = require('../config/database');
            const debugResult = await db.query('SELECT * FROM users WHERE reset_password_token = $1', [token]);
            if (debugResult.rows.length > 0) {
                console.log('Token exists but might be expired. Expiry:', debugResult.rows[0].reset_password_expires, 'Current DB Time:', (await db.query('SELECT NOW()')).rows[0].now);
            } else {
                console.log('Token explicitly not found in DB.');
            }
            return res.status(400).json({ error: 'Password reset token is invalid or has expired' });
        }

        if (password.length < 6) {
            return res.status(400).json({ error: 'Password must be at least 6 characters' });
        }

        await User.updatePassword(user.id, password);

        res.json({ success: true, message: 'Password has been updated' });

    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({ error: 'Failed to reset password' });
    }
});

module.exports = router;
