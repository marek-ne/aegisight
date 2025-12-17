const express = require('express');
const router = express.Router();
const predictionService = require('../src/services/predictionService');
const { requireAuth } = require('../middleware/auth');

/**
 * GET /api/risk/status
 * Returns current risk assessment from the AI engine.
 */
router.get('/status', async (req, res) => {
    try {
        const riskData = await predictionService.getRiskStatus();
        res.json(riskData);
    } catch (error) {
        console.error('API Error:', error);
        res.status(500).json({ error: 'Failed to fetch risk status' });
    }
});

module.exports = router;
