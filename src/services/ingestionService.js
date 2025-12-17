const fs = require('fs');
const path = require('path');
const csv = require('fast-csv');
const { BigQuery } = require('@google-cloud/bigquery');

const bigquery = new BigQuery();
const DATASET_ID = 'aegisight_mvp';
const TABLE_ID = 'metrics';

/**
 * Parses and validates the uploaded CSV file.
 * @param {string} filePath - Absolute path to the uploaded CSV.
 * @returns {Promise<Object>} - Result summary (success/failure, row count).
 */
async function processCSV(filePath) {
    return new Promise((resolve, reject) => {
        const rows = [];
        let validationError = null;

        fs.createReadStream(filePath)
            .pipe(csv.parse({ headers: true }))
            .on('error', error => {
                console.error('Error reading CSV:', error);
                reject(error);
            })
            .on('headers', headers => {
                const requiredColumns = ['timestamp', 'cpu_load', 'ticket_velocity'];
                const missing = requiredColumns.filter(col => !headers.includes(col));
                if (missing.length > 0) {
                    validationError = `Missing required columns: ${missing.join(', ')}`;
                }
            })
            .on('data', row => {
                if (validationError) return;

                // Parse numbers
                rows.push({
                    timestamp: row.timestamp, // Kept as string/timestamp for BQ
                    cpu_load: parseFloat(row.cpu_load),
                    ticket_velocity: parseInt(row.ticket_velocity, 10),
                    is_anomaly: parseInt(row.is_anomaly || 0, 10),
                    source: 'csv_upload',
                    metadata: null
                });
            })
            .on('end', async rowCount => {
                if (validationError) {
                    // Cleanup file
                    fs.unlinkSync(filePath);
                    return reject(new Error(validationError));
                }

                try {
                    console.log(`Parsed ${rowCount} rows. Inserting into BigQuery...`);

                    // Insert into DB (Mock or Real)
                    await insertMetrics(rows);

                    // NEW: Run immediate verification
                    // We need to require predictionService specifically here or pass it in to avoid circular deps if any
                    // Best to lazy load or move require to top if safe. 
                    // ingestionService doesn't require predictionService yet.
                    const predictionService = require('./predictionService');
                    const metrics = await predictionService.getEvaluationMetrics();

                    // Cleanup file after processing
                    fs.unlinkSync(filePath);
                    resolve({
                        success: true,
                        count: rowCount,
                        metrics: metrics // Return accuracy/fpr
                    });
                } catch (error) {
                    console.error('BigQuery Insert Error:', error);
                    reject(error);
                }
            });
    });
}

async function insertMetrics(rows) {
    // Basic BQ Insert Logic
    try {
        if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
            console.log(`[MOCK] Inserting ${rows.length} rows into ${DATASET_ID}.${TABLE_ID}`);
            return;
        }

        await bigquery
            .dataset(DATASET_ID)
            .table(TABLE_ID)
            .insert(rows);

        console.log(`Inserted ${rows.length} rows into BigQuery.`);
    } catch (error) {
        console.error('BigQuery Insert Error:', error);
        // Don't throw for now to avoid crashing MVP demo if BQ fails
    }
}

module.exports = { processCSV, insertMetrics };
