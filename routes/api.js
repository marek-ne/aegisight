const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const ingestionService = require('../src/services/ingestionService');

// Configure Multer for temporary file storage
const upload = multer({
    dest: path.join(__dirname, '../data/uploads/'),
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

/**
 * POST /api/upload-csv
 * Handles CSV file upload for Risk Audit.
 */
router.post('/upload-csv', upload.single('csvFile'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded.' });
    }

    try {
        const filePath = req.file.path;
        console.log(`Received file: ${req.file.originalname} at ${filePath}`);

        const result = await ingestionService.processCSV(filePath);

        res.json({
            success: true,
            message: `Successfully analyzed ${result.count} data points.`,
            meta: result
        });
    } catch (error) {
        console.error('Upload Error:', error);
        res.status(500).json({ error: error.message || 'Failed to process CSV.' });
    }
});

/**
 * POST /api/servicenow-sync
 * Triggers fetch and ingest from ServiceNow.
 */
router.post('/servicenow-sync', async (req, res) => {
    try {
        const servicenow = require('../src/services/servicenow');
        const result = await servicenow.syncServiceNow();
        res.json(result);
    } catch (error) {
        console.error('Sync Error:', error);
        res.status(500).json({ error: 'Failed to sync ServiceNow.' });
    }
});

const unifiedIngestionService = require('../src/services/unifiedIngestionService');

// ... (previous imports)

/**
 * POST /api/ingest
 * Unified endpoint for pushing metrics from any source.
 */
router.post('/ingest', async (req, res) => {
    try {
        const payload = req.body;
        // Basic auth check (can be enhanced later)
        // if (!req.headers['x-api-key']) return res.status(401).send('Unauthorized');

        const result = await unifiedIngestionService.ingest(payload);
        res.json(result);
    } catch (error) {
        console.error('Ingest Error:', error);
        res.status(400).json({ error: error.message || 'Ingestion failed.' });
    }
});

module.exports = router;
