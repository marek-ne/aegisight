/**
 * Aegisight AI - MVP Phase 1: Data Simulator
 * Generates synthetic time-series data for checking the Risk Engine.
 * 
 * Usage: node scripts/simulate_data.js [hours] [filename]
 * Default: 24 hours, output to data/simulated_metrics.json
 */

const fs = require('fs');
const path = require('path');

// Configuration
const HOURS_TO_SIMULATE = process.argv[2] ? parseInt(process.argv[2]) : 24;
const OUTPUT_FILE_JSON = process.argv[3] || 'simulated_metrics.json';
const OUTPUT_FILE_CSV = 'sample_data.csv';
const OUTPUT_DIR = path.join(__dirname, '../data');

// Simulation Parameters
const INTERVAL_MINUTES = 5; // Data point every 5 minutes
const BASE_CPU = 30; // 30% baseline CPU
const BASE_TICKETS = 5; // 5 tickets per hour baseline
const ANOMALY_PROBABILITY = 0.1; // 10% chance of an anomaly event per day cycle

function generateNoise(min, max) {
    return Math.random() * (max - min) + min;
}

function generateData() {
    console.log(`Generating ${HOURS_TO_SIMULATE} hours of data...`);

    const data = [];
    const now = new Date();
    const startTime = new Date(now.getTime() - (HOURS_TO_SIMULATE * 60 * 60 * 1000));

    // Calculate total intervals
    const totalPoints = (HOURS_TO_SIMULATE * 60) / INTERVAL_MINUTES;

    // Define an anomaly window (e.g., occurs at 75% through the dataset)
    const anomalyStartIdx = Math.floor(totalPoints * 0.75);
    const anomalyDurationIdx = Math.floor(60 / INTERVAL_MINUTES) * 2; // 2 hours duration
    const anomalyEndIdx = anomalyStartIdx + anomalyDurationIdx;

    for (let i = 0; i < totalPoints; i++) {
        const timestamp = new Date(startTime.getTime() + (i * INTERVAL_MINUTES * 60 * 1000));

        let cpuLoad = BASE_CPU + generateNoise(-5, 10);
        let ticketVelocity = BASE_TICKETS + generateNoise(-2, 3);
        let isAnomaly = false;

        // Simulate daily cycle (higher load during day, lower at night)
        const hour = timestamp.getHours();
        if (hour >= 9 && hour <= 17) {
            cpuLoad += 15;
            ticketVelocity += 5;
        }

        // Inject Anomaly
        if (i >= anomalyStartIdx && i < anomalyEndIdx) {
            isAnomaly = true;
            // Ramp up
            const progress = (i - anomalyStartIdx) / anomalyDurationIdx;
            // Peak in the middle
            const intensity = 1 - Math.abs(progress - 0.5) * 2;

            cpuLoad += (50 * intensity) + generateNoise(0, 5); // Spike up to +50%
            ticketVelocity += (20 * intensity) + generateNoise(0, 5); // Spike up to +20 tickets
        }

        // Clamp values
        cpuLoad = Math.max(0, Math.min(100, cpuLoad));
        ticketVelocity = Math.max(0, Math.round(ticketVelocity));

        data.push({
            timestamp: timestamp.toISOString(),
            cpu_load: parseFloat(cpuLoad.toFixed(2)),
            ticket_velocity: ticketVelocity,
            is_anomaly: isAnomaly ? 1 : 0
        });
    }

    return data;
}

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR);
}

const simulatedData = generateData();
const jsonPath = path.join(OUTPUT_DIR, OUTPUT_FILE_JSON);
const csvPath = path.join(OUTPUT_DIR, OUTPUT_FILE_CSV);

// Write JSON
fs.writeFileSync(jsonPath, JSON.stringify(simulatedData, null, 2));

// Write CSV
const csvHeader = 'timestamp,cpu_load,ticket_velocity,is_anomaly\n';
const csvRows = simulatedData.map(row =>
    `${row.timestamp},${row.cpu_load},${row.ticket_velocity},${row.is_anomaly}`
).join('\n');

fs.writeFileSync(csvPath, csvHeader + csvRows);

console.log(`Success! Generated ${simulatedData.length} data points.`);
console.log(`JSON output saved to: ${jsonPath}`);
console.log(`CSV output saved to: ${csvPath}`);
console.log('Sample data point:', simulatedData[0]);
console.log('Anomaly sample:', simulatedData.find(d => d.is_anomaly === 1) || 'No anomaly generated');
