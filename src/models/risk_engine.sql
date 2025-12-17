-- Aegisight AI - BigQuery ML Risk Engine
-- Phase 3: The Brain

-- 1. Create Data Table (Schema matches simulation)
CREATE TABLE IF NOT EXISTS `aegisight_mvp.metrics` (
    timestamp TIMESTAMP,
    cpu_load FLOAT64,
    ticket_velocity INT64,
    is_anomaly INT64,
    source STRING,
    metadata JSON
);

-- 2. Train Model (ARIMA_PLUS for Time Series Forecasting)
-- We train on cpu_load as a leading indicator, or ticket_velocity.
-- For the MVP, let's detect anomalies in 'ticket_velocity' as the primary output, 
-- but realistically we might want to multivariate. ARIMA_PLUS is univariate.
-- Let's train on 'ticket_velocity' to predict surges.

CREATE OR REPLACE MODEL `aegisight_mvp.ticket_velocity_model`
OPTIONS(
  model_type = 'ARIMA_PLUS',
  time_series_timestamp_col = 'timestamp',
  time_series_data_col = 'ticket_velocity'
) AS
SELECT
  timestamp,
  ticket_velocity
FROM
  `aegisight_mvp.metrics`
WHERE
  timestamp < TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL 1 HOUR); -- Train on historical

-- 3. Detect Anomalies (The "Risk Grader")
-- We run this against the most recent data to see if it deviates from forecast.

SELECT
  *
FROM
  ML.DETECT_ANOMALIES(
    MODEL `aegisight_mvp.ticket_velocity_model`,
    STRUCT(0.95 AS anomaly_prob_threshold),
    (
      SELECT
        timestamp,
        ticket_velocity
      FROM
        `aegisight_mvp.metrics`
      WHERE
        timestamp >= TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL 24 HOUR)
    )
  )
ORDER BY
  timestamp DESC;
