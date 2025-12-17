
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const { fetchIncidents } = require('../src/services/servicenow');

async function testConnection() {
    console.log('--- ServiceNow Connection Test ---');
    console.log(`Instance: ${process.env.SERVICENOW_INSTANCE}`);
    console.log(`User: ${process.env.SERVICENOW_USER}`);

    if (!process.env.SERVICENOW_INSTANCE || !process.env.SERVICENOW_USER || !process.env.SERVICENOW_PASSWORD) {
        console.error('❌ Missing Credentials in .env');
        console.log('Please set SERVICENOW_INSTANCE, SERVICENOW_USER, and SERVICENOW_PASSWORD');
        return;
    }

    try {
        console.log('Attempting to fetch incidents...');
        const incidents = await fetchIncidents(5);
        if (incidents && incidents.length > 0) {
            console.log('✅ Connection Successful!');
            console.log(`Fetched ${incidents.length} incidents.`);
            console.log('Sample Incident:', incidents[0].number, '-', incidents[0].short_description);
        } else {
            console.log('⚠️ Connection successful, but no incidents found (or empty response).');
        }
    } catch (error) {
        console.error('❌ Connection Failed:', error.message);
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', error.response.data);
        }
    }
}

testConnection();
