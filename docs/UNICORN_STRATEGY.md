# Aegisight: Product Strategy & Roadmap
**The "One Platform" Architecture**

We do not sell seven different tools; we sell one **Core Prediction Engine** that powers three distinct pillars of protection.

## The Three Pillars of Protection
1.  **Digital Asset Protection**: IT Risk (ServiceNow), Financial Fraud (ERP).
2.  **Physical Asset Protection**: Supply Chain Logistics (SAP), Project Timelines.
3.  **Human Asset Protection**: Industrial Bio-Safety (Wearables), Pension Solvency.

---

## Execution Roadmap: The "Crawl, Walk, Run" Approach

### GOAL A: The Foundation (Crawl Phase)
**Objective**: Develop, Test, and Validate the Core AI Engine & Platform Architecture.
**Focus**: Build the single, data-agnostic "Core AI Engine." Ingest historical data to train "failure pattern" recognition without live integration.

*   **Key Metric**: Model Prediction Accuracy > 85% on historical data.
*   **Technical Implementation**:
    *   **Engine**: `risk_engine_hybrid.sql` (ARIMA + XGBoost).
    *   **Ingestion**: `POST /api/ingest` (Universal JSON Receiver).
    *   **Validation**: Simulator Scripts (`simulate_data.js`).

### GOAL B: The Market Entry (Walk Phase)
**Objective**: Successfully Launch and Secure our Beachhead Market.
**Focus**: Prove ROI by launching the first two commercial modules.
1.  **Product 1: IT Risk Plug-in (Digital)**: Connects to ServiceNow.
2.  **Product 2: Supply Chain Plug-in (Physical)**: Connects to ERP/Logistics.
*   **Reasoning**: Structured, high-volume data allows fast validation.
*   **Key Metric**: Reduction in downtime/disruption for pilot customers.
*   **Technical Implementation**:
    *   **ServiceNow Connector**: `src/services/servicenow.js`.
    *   **Self-Service Grader**: The "Risk Audit" CSV Upload feature for lead-gen.
    *   **Dual-Deployment**: "Downloadable Brain" (Containerized Model) for on-prem compliance.

### GOAL C: The Strategic Expansion (Run Phase)
**Objective**: Expansion into Future Verticals (Human & Financial).
**Focus**: Leverage the proven platform to enter high-regulation markets requiring high trust (GDPR/HIPAA).
*   **Target Sectors**: Industrial Bio-Safety, Pension Solvency.
*   **Key Metric**: Multi-pillar adoption (customers using >2 modules).
*   **Technical Implementation**:
    *   **Federated Learning**: Cross-customer model training.
    *   **Agentic Action**: "Self-Driving" remediation integration.
