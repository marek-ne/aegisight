/**
 * Aegisight AI - Unified Ingestion Service
 * Handles data ingestion from various sources (ServiceNow, Jira, Datadog, etc.)
 * Normalizes data into a standard format for the Risk Engine.
 */

const ingestionService = require('./ingestionService');

/**
 * Ingests a batch of metric data.
 * @param {Array} payload - Array of metric objects.
 * @returns {Promise<Object>} - Success status and count.
 */
async function ingest(payload) {
    if (!Array.isArray(payload)) {
        throw new Error('Payload must be an array of metric objects.');
    }

    if (payload.length === 0) {
        return { success: true, count: 0, message: 'Empty payload.' };
    }

    const normalizedRows = [];
    const errors = [];

    // 1. Validate and Normalize
    payload.forEach((item, index) => {
        try {
            const row = normalizeItem(item);
            normalizedRows.push(row);
        } catch (err) {
            errors.push({ index, error: err.message });
        }
    });

    if (normalizedRows.length === 0 && errors.length > 0) {
        throw new Error(`All items failed validation. First error: ${errors[0].error}`);
    }

    // 2. Insert into BigQuery
    // We delegate the actual BQ insertion to the existing service
    // which we will update to handle the new fields if necessary.
    await ingestionService.insertMetrics(normalizedRows);

    return {
        success: true,
        count: normalizedRows.length,
        failed: errors.length,
        errors: errors.length > 0 ? errors : undefined
    };
}

/**
 * Normalizes a single metric item.
 * @param {Object} item 
 */
function normalizeItem(item) {
    if (!item.timestamp) {
        throw new Error('Missing required field: timestamp');
    }

    // Ensure timestamp is ISO string
    const timestamp = new Date(item.timestamp).toISOString();

    // Default values for core schema
    let cpu_load = null;
    let ticket_velocity = null;
    let is_anomaly = 0;

    // Map known fields if present
    if (item.metrics) {
        if (item.metrics.cpu_load !== undefined) cpu_load = parseFloat(item.metrics.cpu_load);
        if (item.metrics.ticket_velocity !== undefined) ticket_velocity = parseInt(item.metrics.ticket_velocity, 10);
    }

    // Also accept top-level fields for backward compatibility/simplicity
    if (item.cpu_load !== undefined) cpu_load = parseFloat(item.cpu_load);
    if (item.ticket_velocity !== undefined) ticket_velocity = parseInt(item.ticket_velocity, 10);

    // Basic validation logic (can be expanded)
    if (cpu_load === null && ticket_velocity === null) {
        throw new Error('Item must contain at least one known metric (cpu_load or ticket_velocity).');
    }

    return {
        timestamp,
        cpu_load,
        ticket_velocity,
        is_anomaly,
        source: item.source || 'unknown', // New field
        metadata: item.metadata ? JSON.stringify(item.metadata) : null // New field
    };
}

module.exports = {
    ingest
};
