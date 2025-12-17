
const { BigQuery } = require('@google-cloud/bigquery');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const bigquery = new BigQuery();

async function setupBigQuery() {
    console.log('--- BigQuery Risk Engine Setup ---');

    // Check for credentials
    if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
        console.warn('⚠️  GOOGLE_APPLICATION_CREDENTIALS not found in env.');
        console.warn('   Ensure you have your key.json and the env var pointed to it.');
    }

    const DATASET_ID = 'aegisight_mvp';

    // 1. Create Dataset if not exists
    try {
        const [dataset] = await bigquery.dataset(DATASET_ID).get({ autoCreate: true });
        console.log(`✅ Dataset '${dataset.id}' ready.`);
    } catch (err) {
        console.error(`❌ Failed to access/create dataset '${DATASET_ID}':`, err.message);
        return; // Stop if we can't get the dataset
    }

    const sqlPath = path.join(__dirname, '../src/models/risk_engine.sql');
    let sqlQuery;

    try {
        sqlQuery = fs.readFileSync(sqlPath, 'utf8');
        console.log(`✅ Loaded SQL from ${sqlPath}`);
    } catch (err) {
        console.error(`❌ Failed to read SQL file: ${err.message}`);
        process.exit(1);
    }

    // BigQuery client doesn't support multiple statements in one go easily unless configured, 
    // or we split them. The SQL file contains multiple steps.
    // Let's split by semicolon and run sequentially.
    // NOTE: This basic splitting is naive but works for our specific SQL file structure.
    const queries = sqlQuery
        .split(';')
        .map(q => q.trim())
        .filter(q => q.length > 0);

    console.log(`Found ${queries.length} SQL statements to execute.`);

    for (let i = 0; i < queries.length; i++) {
        const query = queries[i];
        console.log(`\n▶️  Executing Statement ${i + 1}/${queries.length}...`);
        // console.log(query.substring(0, 50) + '...'); 

        try {
            await bigquery.query(query);
            console.log(`✅ Statement ${i + 1} Success.`);
        } catch (error) {
            // Check if error is "Already Exists" which is fine for idempotent scripts
            if (error.message.includes('Already Exists')) {
                console.log(`⚠️  Resource already exists (Skipping).`);
            } else {
                console.error(`❌ Statement ${i + 1} Failed:`, error.message);
                // We might want to stop here
                // process.exit(1);
            }
        }
    }

    console.log('\n--- Setup Complete ---');
}

setupBigQuery().catch(console.error);
