/*
    Aegisight AI - Model Evaluation Script
    Calculates Accuracy and False Positive Rate (FPR) for the Risk Engine.

    METRIC DEFINITIONS:
    - True Positive (TP): Model detected anomaly, and it WAS an anomaly.
    - True Negative (TN): Model said normal, and it WAS normal.
    - False Positive (FP): Model detected anomaly, but it was actually normal.
    - False Negative (FN): Model said normal, but it was actually an anomaly.

    - Accuracy = (TP + TN) / Total
    - False Positive Rate = FP / (FP + TN)
*/

WITH Predictions AS (
  SELECT
    timestamp,
    -- Get the ground truth from the original table (or a labeled test set)
    t1.is_anomaly AS ground_truth,
    -- Get the model prediction (is_anomaly from ML.DETECT_ANOMALIES is the prediction)
    t2.is_anomaly AS predicted_anomaly
  FROM
    `aegisight_mvp.metrics` AS t1
  JOIN
    (
      SELECT
        timestamp,
        is_anomaly
      FROM
        ML.DETECT_ANOMALIES(
          MODEL `aegisight_mvp.ticket_velocity_model`,
          STRUCT(0.95 AS anomaly_prob_threshold),
          (SELECT timestamp, ticket_velocity FROM `aegisight_mvp.metrics`)
        )
    ) AS t2
  ON t1.timestamp = t2.timestamp
),

ConfusionMatrix AS (
  SELECT
    SUM(CASE WHEN predicted_anomaly = 1 AND ground_truth = 1 THEN 1 ELSE 0 END) AS TP,
    SUM(CASE WHEN predicted_anomaly = 0 AND ground_truth = 0 THEN 1 ELSE 0 END) AS TN,
    SUM(CASE WHEN predicted_anomaly = 1 AND ground_truth = 0 THEN 1 ELSE 0 END) AS FP,
    SUM(CASE WHEN predicted_anomaly = 0 AND ground_truth = 1 THEN 1 ELSE 0 END) AS FN,
    COUNT(*) AS Total
  FROM Predictions
)

SELECT
  TP, TN, FP, FN, Total,
  ROUND((TP + TN) / Total, 4) AS Accuracy,
  ROUND(FP / NULLIF(FP + TN, 0), 4) AS False_Positive_Rate
FROM
  ConfusionMatrix;
