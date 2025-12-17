
const { BigQuery } = require('@google-cloud/bigquery');
const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const bigquery = new BigQuery();
const DATASET_ID = 'aegisight_mvp';
const TABLE_ID = 'metrics';

// Import generation logic from simulate_data.js
// Since simulate_data.js runs on load, we'll read the JSON it produces or just require it.
// Actually, simulate_data.js writes files as a side effect. Let's just read the JSON file it creates.
const DATA_FILE = path.join(__dirname, '../data/simulated_metrics.json');

async function seedBigQuery() {
    console.log('--- Seeding BigQuery with Simulated Data ---');

    if (!fs.existsSync(DATA_FILE)) {
        console.log('Simulated data file not found. Generating new data...');
        // Run the simulation script
        require('./simulate_data.js');
    }

    try {
        const rawData = fs.readFileSync(DATA_FILE, 'utf8');
        const data = JSON.parse(rawData);

        console.log(`Loaded ${data.length} records from ${DATA_FILE}`);

        // BigQuery expects NDJSON or row objects.
        // We need to ensure timestamp formats match BQ expectations (ISO string is usually fine)

        const rows = data.map(row => ({
            timestamp: row.timestamp, // Ensure this is standard ISO8601
            cpu_load: row.cpu_load,
            ticket_velocity: row.ticket_velocity,
            is_anomaly: row.is_anomaly
        }));

        // Batch insert
        // BQ streaming limits: 10MB per request. 
        // 24 hours * 12 points/hr = 288 points. Small enough for one batch.

        await bigquery
            .dataset(DATASET_ID)
            .table(TABLE_ID)
            .insert(rows);

        console.log(`✅ Successfully inserted ${rows.length} rows into ${DATASET_ID}.${TABLE_ID}`);

    } catch (error) {
        console.error('❌ Insert Failed:', error);
        if (error.errors) {
            console.error('Partial Failures:', JSON.stringify(error.errors, null, 2));
        }
    }
}

seedBigQuery().catch(console.error);
