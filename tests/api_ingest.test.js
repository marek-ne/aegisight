const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');

// Mock dependencies to avoid needing real BigQuery validation in unit tests
jest.mock('../src/services/unifiedIngestionService', () => ({
    ingest: jest.fn(async (payload) => {
        if (!payload || payload.length === 0) throw new Error('Empty payload');
        return { success: true, count: payload.length };
    })
}));

// Load the routes (we need to construct a test app since server.js might have side effects)
const apiRoutes = require('../routes/api');
const app = express();
app.use(bodyParser.json());
app.use('/api', apiRoutes);

describe('PR #1: Unified Ingestion Tests (IT Data)', () => {

    it('should successfully ingest valid IT Risk data', async () => {
        const payload = [
            {
                source: "servicenow",
                timestamp: new Date().toISOString(),
                metrics: {
                    cpu_load: 85,
                    ticket_velocity: 12
                }
            }
        ];

        const res = await request(app)
            .post('/api/ingest')
            .send(payload);

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.count).toBe(1);
    });

    it('should reject invalid or empty payloads (Simulated)', async () => {
        // In our mock, we throw on empty. In real integration tests, validation middleware handles this.
        // This test primarily checks the Route -> Controller wiring.
        const res = await request(app)
            .post('/api/ingest')
            .send([]); // Empty array

        // Based on our mock implementation for this unit test
        expect(res.statusCode).toBe(400);
    });

    it('should handle large batches of IT events', async () => {
        const largePayload = Array(50).fill({
            source: "splunk_forwarder",
            timestamp: new Date().toISOString(),
            metrics: { cpu_load: 50, ticket_velocity: 5 }
        });

        const res = await request(app)
            .post('/api/ingest')
            .send(largePayload);

        expect(res.statusCode).toBe(200);
        expect(res.body.count).toBe(50);
    });
});
