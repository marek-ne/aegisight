# Aegisight: Technical Architecture & Implementation Roadmap

This document outlines the engineering architecture required to deliver the "One Platform" strategy.

## GOAL A: Foundation & Market Entry (Crawl + Walk)
**Technical Objective:** Build the Core Engine, Universal Ingestion, and Dual-Deployment capability simultaneously.

### 1. The Core AI Engine
*   **Component:** `src/models/risk_engine_hybrid.sql`
*   **Architecture:** Hybrid Ensemble (ARIMA for trends + XGBoost for pattern classification).
*   **Alignment:** Tuned for **>85% Accuracy** and **<15% False Positives**.

### 2. Universal Ingestion Layer
*   **Component:** `POST /api/ingest`
*   **Logic:** A unified entry point that validates and normalizes JSON payloads from any source (ServiceNow, SAP, IoT Wearables) into the BigQuery `metrics` table.

### 3. Dual-Deployment Architecture (SaaS vs On-Prem)
To support regulated markets immediately:
| Feature | **SaaS Model** (Public Cloud) | **Hybrid/On-Prem Model** (Private Cloud) |
| :--- | :--- | :--- |
| **Compute** | Cloud Run (Auto-scaling) | Docker Container (Fixed Resource) |
| **Storage** | **BigQuery** (PB-scale Analysis) | **DuckDB / PostgreSQL** (Local embedded storage) |

### 4. "Self-Service" Risk Grader (The Front-End)
*   **Component:** `POST /api/upload-csv` + `dashboard_mvp.html`
*   **Logic:** **Local Wasm Engine** scores generic CSVs (IT or Supply Chain) instantly for Lead Gen.

---

## GOAL B: Strategic Expansion (Run Phase)
**Technical Objective:** "Federated Learning" for future verticals (Human/Financial).

### 5. The Federated Brain
*   **Requirement:** Train models on sensitive Bio-Health/Pension data without exposing PII.
*   **Architecture:**
    1.  **Anonymization Proxy**: Hashes PII locally before upload.
    2.  **Global Training**: BigQuery trains the "Base Model" on aggregate anonymized metadata.

### 6. Agentic Action Layer
*   **Component:** "Self-Driving" Remediation Modules.
*   **Logic:** WebAssembly sandboxes allow the engine to trigger safe, pre-approved actions.
