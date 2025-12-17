/**
 * Aegisight AI - ServiceNow Connector
 * Connects to ServiceNow Table API to fetch incident data.
 */

const axios = require('axios');

// Configuration
const INSTANCE = process.env.SERVICENOW_INSTANCE; // e.g., 'dev12345'
const USERNAME = process.env.SERVICENOW_USER;
const PASSWORD = process.env.SERVICENOW_PASSWORD;

const BASE_URL = `https://${INSTANCE}.service-now.com/api/now/table/incident`;

/**
 * Fetch recent incidents from ServiceNow
 * @param {number} limit - Number of records to fetch
 * @returns {Promise<Array>} - List of incidents
 */
async function fetchIncidents(limit = 10) {
    if (!INSTANCE || !USERNAME || !PASSWORD) {
        console.warn('ServiceNow credentials missing. Returning empty list.');
        return [];
    }

    try {
        const response = await axios.get(BASE_URL, {
            params: {
                sysparm_limit: limit,
                sysparm_query: 'active=true^ORDERBYDESCsys_created_on',
                sysparm_fields: 'number,short_description,sys_created_on,priority,state'
            },
            auth: {
                username: USERNAME,
                password: PASSWORD
            },
            headers: {
                'Accept': 'application/json'
            }
        });

        if (!response.data || !response.data.result) {
            console.warn('Unexpected ServiceNow response format:', response.data);
            return [];
        }

        return response.data.result;
    } catch (error) {
        console.error('Error fetching incidents from ServiceNow:', error.message);
        throw error;
    }
}

const ingestionService = require('./ingestionService');

/**
 * Syncs recent ServiceNow incidents to the Risk Engine.
 * Fetches last 30 days (mock limit) or recent batch, aggregates velocity, and saves.
 */
async function syncServiceNow() {
    console.log('Syncing ServiceNow data...');
    try {
        let incidents = await fetchIncidents(100);

        if (!Array.isArray(incidents)) {
            console.warn('Fetched incidents data is not an array. Using mock data.');
            incidents = [];
        }

        if (incidents.length === 0) {
            console.log('No incidents found (or instance hibernating). Generating MOCK incidents for demo...');
            incidents = generateMockIncidents(50); // Fallback to 50 mock incidents
        }

        console.log(`[DEBUG] Sync fetched ${incidents.length} incidents.`);

        // Aggregate incidents by hour to create time-series
        const buckets = {};

        incidents.forEach(inc => {
            const date = new Date(inc.sys_created_on);
            date.setMinutes(0, 0, 0); // Round to hour
            const key = date.toISOString();

            if (!buckets[key]) buckets[key] = 0;
            buckets[key]++;
        });

        // Transform to Metrics rows
        const rows = Object.keys(buckets).map(timestamp => ({
            timestamp,
            cpu_load: 30 + Math.random() * 20, // Simulated baseline CPU (30-50%)
            ticket_velocity: buckets[timestamp],
            is_anomaly: 0 // Default, let Engine decide
        }));

        if (rows.length > 0) {
            await ingestionService.insertMetrics(rows);
            console.log(`Synced ${rows.length} time-series points from ServiceNow.`);
        }

        return { success: true, count: rows.length };
    } catch (error) {
        console.error('ServiceNow Sync Failed:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Generates mock incidents for fallback/demo purposes.
 */
function generateMockIncidents(count) {
    const mocks = [];
    const now = new Date();
    for (let i = 0; i < count; i++) {
        // Random time in last 24 hours
        const time = new Date(now.getTime() - Math.random() * 24 * 60 * 60 * 1000);
        mocks.push({
            number: `INC${10000 + i}`,
            short_description: 'Simulated Incident',
            sys_created_on: time.toISOString(),
            priority: Math.floor(Math.random() * 5) + 1,
            state: 'New'
        });
    }
    return mocks;
}

module.exports = {
    fetchIncidents,
    syncServiceNow
};
