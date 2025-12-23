/**
 * Aegisight TCO Validator
 * Validates if the training cost remains under the <$6,000 annualized goal.
 * 
 * Logic:
 * 1. Calculate Data Size for 1 Training Cycle (7 days history).
 * 2. Estimate BQ Analysis Cost ($6.25 per TB).
 * 3. Estimate BQ ML Training Cost ($250.00 per TB).
 * 4. Annualize (Daily Training * 365).
 */

const DATA_POINTS_PER_DAY = (60 / 5) * 24; // 288 points
const BYTES_PER_ROW = 0.5 * 1024; // 0.5 KB conservative estimate (JSON + Metadata)
const DAYS_HISTORY = 7;

// Costs (approximate GCP list prices)
const PRICE_ANALYSIS_PER_TB = 6.25;
const PRICE_ML_TRAINING_PER_TB = 250.00;

function calculateTCO() {
    const totalRows = DATA_POINTS_PER_DAY * DAYS_HISTORY;
    const totalBytes = totalRows * BYTES_PER_ROW;
    const totalTB = totalBytes / (1024 * 1024 * 1024 * 1024);

    const costPerTrain = totalTB * PRICE_ML_TRAINING_PER_TB;
    const costAnnual = costPerTrain * 365;

    console.log("=== Aegisight TCO Benchmark ===");
    console.log(`Training Data Window: ${DAYS_HISTORY} days`);
    console.log(`Total Data Volume: ${(totalBytes / 1024 / 1024).toFixed(4)} MB`);
    console.log(`Estimated Cost per Training Run: $${costPerTrain.toFixed(6)}`);
    console.log(`Annualized Training Cost: $${costAnnual.toFixed(2)}`);

    // Threshold Check
    const THRESHOLD = 500;
    if (costAnnual < THRESHOLD) {
        console.log(`\n✅ PASS: Annualized Cost $${costAnnual.toFixed(2)} is well below the $${THRESHOLD} limit.`);
        return true;
    } else {
        console.error(`\n❌ FAIL: Annualized Cost $${costAnnual.toFixed(2)} exceeds limit.`);
        return false;
    }
}

calculateTCO();
