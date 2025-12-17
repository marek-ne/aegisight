const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');
const User = require('../models/User');

// GET /api/dashboard - Get dashboard data (protected)
router.get('/', requireAuth, async (req, res) => {
    try {
        const userId = req.userId || req.user?.id;

        const user = await User.getPublicProfile(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Return dashboard data
        res.json({
            user: {
                id: user.id,
                email: user.email,
                firstName: user.first_name,
                lastName: user.last_name,
                avatarUrl: user.avatar_url,
                authProvider: user.auth_provider,
                memberSince: user.created_at,
                lastLogin: user.last_login
            },
            stats: {
                // Add your dashboard stats here
                totalLogins: 1,
                accountType: 'Free',
                // etc.
            }
        });
    } catch (error) {
        console.error('Dashboard error:', error);
        res.status(500).json({ error: 'Failed to load dashboard' });
    }
});

module.exports = router;
