/**
 * simulate_multi_source.js
 * Generates synthetic data for the Hybrid Risk Engine.
 * Simulates multiple sources (CPU Monitor, Service Desk) and complex failure patterns.
 * Pushes data to the local Unified Ingestion API.
 */

const axios = require('axios');

const API_URL = 'http://localhost:3003/api/ingest';
const BATCH_SIZE = 50;
const TOTAL_HOURS = 24 * 7; // 1 week of data

async function runSimulation() {
    console.log('Starting Multi-Source Simulation...');
    console.log(`Target: ${API_URL}`);
    console.log(`Generating ${TOTAL_HOURS} hours of data...`);

    const batch = [];
    const now = new Date();

    // Start 1 week ago
    let currentTime = new Date(now.getTime() - (TOTAL_HOURS * 60 * 60 * 1000));

    for (let i = 0; i < TOTAL_HOURS * 60; i++) { // Minute-by-minute resolution
        currentTime = new Date(currentTime.getTime() + 60000); // +1 minute

        // 1. Simulate "Normal" Behavior (Random Noise)
        let cpu = 20 + Math.random() * 30; // 20-50%
        let velocity = 5 + Math.floor(Math.random() * 10); // 5-15 tickets/hr rate
        let is_incident = 0;

        // 2. Simulate "Incident" Patterns (Every ~24 hours)
        // Pattern: CPU spikes first, then Velocity follows 30 mins later.
        const hour = currentTime.getHours();
        const isPeakTime = hour >= 14 && hour <= 16; // 2PM-4PM Peak

        // Inject Incident randomly during peak times (approx once a day)
        if (isPeakTime && Math.random() > 0.95) {
            // Ramping up to failure
            cpu = 80 + Math.random() * 20; // 80-100%
            velocity = 50 + Math.floor(Math.random() * 50); // Surge in tickets
            is_incident = 1; // Label this as a failure state
        } else if (isPeakTime) {
            // Just busy, not broken
            cpu = 60 + Math.random() * 20;
            velocity = 20 + Math.floor(Math.random() * 20);
        }

        // 3. Create Payloads (Simulating decoupled sources)

        // Source A: Datadog (CPU)
        batch.push({
            timestamp: currentTime.toISOString(),
            source: 'datadog_agent',
            metrics: { cpu_load: cpu.toFixed(2) },
            // We attach label to one of them or both for training simplifying
            // In reality, you'd join them. For MVP, we attach to the 'main' row or both.
            is_anomaly: is_incident
        });

        // Source B: ServiceNow (Tickets)
        batch.push({
            timestamp: currentTime.toISOString(),
            source: 'servicenow_connector',
            metrics: { ticket_velocity: velocity },
            is_anomaly: is_incident
        });

        // Flush batch
        if (batch.length >= BATCH_SIZE) {
            await sendBatch(batch.splice(0, batch.length));
        }
    }

    // specific "Now" scenario for demo
    // Create a "Pre-Crash" state right now
    batch.push({
        timestamp: new Date().toISOString(),
        source: 'datadog_agent',
        metrics: { cpu_load: 95.5 },
        is_anomaly: 1
    });
    batch.push({
        timestamp: new Date().toISOString(),
        source: 'servicenow_connector',
        metrics: { ticket_velocity: 80 },
        is_anomaly: 1
    });

    if (batch.length > 0) {
        await sendBatch(batch);
    }

    console.log('Simulation Complete.');
}

async function sendBatch(payload) {
    try {
        const res = await axios.post(API_URL, payload);
        process.stdout.write('.'); // Progress dot
    } catch (error) {
        process.stdout.write('X'); // Error
        if (error.response) {
            // console.error(error.response.data);
        } else {
            console.error(error.message);
        }
    }
}

runSimulation();
