# Aegisight: Implementation & Engineering Roadmap

This document translates the **Unicorn Strategy** into a concrete list of **Pull Requests (PRs)**.
Use this as your checklist for "What code do I write and push next?"

## GOAL A: Foundation & Market Entry (Aggressive Execution)
**Focus:** Build the Core Engine AND Launch Products 1 & 2 immediately.

*   **[x] PR #1: Unified Ingestion Tests (IT Data)**
    *   **File:** `tests/api_ingest.test.js`
    *   **Logic:** Automated tests ensuring `POST /api/ingest` correctly handles IT Ticket/CPU payloads.
    *   **Goal:** Ensure the foundation is solid before adding other verticals.
*   **[ ] PR #2: Hybrid Engine Optimization (IP & TCO)**
    *   **File:** `src/models/risk_engine_hybrid.sql`
    *   **Logic:**
        1. Tune XGBoost for **Accuracy > 85%**.
        2. Verify **False Positive Rate < 15%** (Goal B Requirement).
        3. Benchmark Query Costs (Ensure <$500 annualized run-rate).
    *   **Goal:** Hit the specific metrics defined in `docs/VALIDATION_STRATEGY.md`.
*   **[ ] PR #3: Supply Chain Plugin (The "Physical" Pillar)**
    *   **File:** `scripts/simulate_supply_chain.js`
    *   **Logic:** Generate `shipment_delay` and `supplier_health` metrics.
    *   **Goal:**  Validate the "Data Agnostic" claim by feeding non-IT data into the existing engine.
*   **[ ] PR #4: The "Downloadable Brain" (Docker)**
    *   **File:** `Dockerfile.onprem` and `docker-compose.onprem.yml`
    *   **Logic:** Create a self-contained build that does *not* require Google Cloud credentials.
    *   **Goal:** The artifact we send to air-gapped clients.
*   **[ ] PR #5: DuckDB Adapter (No-Cloud Storage)**
    *   **File:** `src/services/storage/duckdbAdapter.js`
    *   **Logic:** Abstract the database calls. `if (ENV === 'ON_PREM') use DuckDB else use BigQuery`.
    *   **Goal:** Remove the BigQuery dependency for the "Shadow Mode" trial.
*   **[ ] PR #6: Self-Service Report UI**
    *   **File:** `views/risk-audit.html` (Update)
    *   **Logic:** Add a "Download PDF Report" button after the CSV scoring is done.
    *   **Goal:** The "Lead Magnet" feature.

## GOAL B: Strategic Expansion (The "Run" Phase)
**Focus:** Privacy & Automation.

*   **[ ] PR #7: PII Anonymizer Service**
    *   **File:** `src/services/privacy/anonymizer.js`
    *   **Logic:** Hash function (SHA-256) for fields marked `sensitive: true` in the schema.
    *   **Goal:** Pre-requisite for Federated Learning.
*   **[ ] PR #8: Agentic Action Framework**
    *   **File:** `src/services/remediation/executor.js`
    *   **Logic:** A whitelist of allowed commands (e.g., `restart_service`, `clear_cache`) that the engine can request.
    *   **Goal:** The "Self-Driving" capability.

---

## Team Workflow (Ref: `GITHUB_WORKFLOW.md`)
For each item above:
1.  `git checkout -b feature/pr-1-supply-chain`
2.  Write code.
3.  `git push -u origin feature/pr-1-supply-chain`
4.  Open PR -> Merge.
