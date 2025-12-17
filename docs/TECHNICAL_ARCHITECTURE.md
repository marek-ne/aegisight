# Aegisight: Technical Architecture & Implementation Roadmap

This document outlines the engineering architecture required to deliver the "One Platform" strategy.

## GOAL A: The Foundation (Crawl Phase)
**Technical Objective:** Build the "Core AI Engine" (Data-Agnostic & Scalable).

### 1. The Core AI Engine
*   **Component:** `src/models/risk_engine_hybrid.sql`
*   **Architecture:** Hybrid Ensemble (ARIMA for trends + XGBoost for pattern classification).
*   **Data-Agnostic Design:** The engine accepts a generic schema (`timestamp`, `metric_value`, `features_json`), allowing it to score **IT Risks** (CPU/Tickets) or **Supply Chain Risks** (Shipment Delay/Supplier Health) without code changes.

### 2. Universal Ingestion Layer
*   **Component:** `POST /api/ingest`
*   **Logic:** A unified entry point that validates and normalizes JSON payloads from any source (ServiceNow, SAP, IoT Wearables) into the BigQuery `metrics` table.

---

## GOAL B: Market Entry (Walk Phase)
**Technical Objective:** Enable "Dual-Deployment" and "Self-Service" to secure the beachhead market.

### 3. Dual-Deployment Architecture (SaaS vs On-Prem)
To support regulated markets (Goal B requirement), the platform supports two modes from Day 1:

| Feature | **SaaS Model** (Public Cloud) | **Hybrid/On-Prem Model** (Private Cloud) |
| :--- | :--- | :--- |
| **Compute** | Cloud Run (Auto-scaling) | Docker Container (Fixed Resource) |
| **Storage** | **BigQuery** (PB-scale Analysis) | **DuckDB / PostgreSQL** (Local embedded storage) |
| **Why?** | Speed & Scale for generic users. | Data Sovereignty for Regulated Clients. |

### 4. "Self-Service" Risk Grader (The Front-End)
*   **Component:** `POST /api/upload-csv` + `dashboard_mvp.html`
*   **Workflow:**
    1.  User uploads `incidents.csv` (IT) or `shipments.csv` (Supply Chain).
    2.  System parses via stream processing.
    3.  **Local Wasm Engine** (or stateless Cloud Run) scores data instantly.
    4.  **Value:** Generates immediate "Forecasting Report" for Lead Gen, without complex integration.

---

## GOAL C: Strategic Expansion (Run Phase)
**Technical Objective:** "Federated Learning" for future verticals (Human/Financial).

### 5. The Federated Brain
*   **Requirement:** Train models on sensitive Bio-Health/Pension data without exposing PII.
*   **Architecture:**
    1.  **Anonymization Proxy**: Hashes PII locally before upload.
    2.  **Global Training**: BigQuery trains the "Base Model" on aggregate anonymized metadata.
    3.  **Transfer Learning**: Clients download the improved "Base Model" to their local instance.

### 6. Agentic Action Layer
*   **Component:** "Self-Driving" Remediation Modules.
*   **Logic:** WebAssembly sandboxes allow the engine to trigger safe, pre-approved actions (e.g., "Restart Pod", "Re-route Shipment") based on predictions.
