# Aegisight: Product Phase Validation & Verification

This document defines the **Product Assumptions** and the specific **Success Signals** required to graduate each phase.

## [Goal A] CRAWL: The Foundation
**Focus:** Viability, Awareness, and Efficiency.

| Category | Assumption (Hypothesis) | Validation Strategy (The Test) | Success Signal (The Proof) |
| :--- | :--- | :--- | :--- |
| **Product** | **Core Algorithm Viability**: We can accurately detect failure "fingerprints" in historical logs without live data. | **Retrospective Back-Testing**: Ingest 5 years of historical logs and run model against known failures. | Model identifies **>85%** of past failures 48 hours before they occurred. |
| **Customer** | **Problem Awareness**: IT Directors are aware of the "Insight Gap" and willing to upload data. | **"Risk Grader" Launch**: Deploy website offering free CSV analysis. | **>5%** of site visitors upload a file to the "Risk Grader" tool. |
| **Systems** | **TCO Efficiency**: We can train enterprise AI without massive Cloud bills. | **GCP Cost Benchmark**: Run full training cycle. | Total training cost remains **<$500** (validating the $4.40/hr model). |
| **Partners** | **Data Accessibility**: Universities/Partners are willing to share anonymized datasets. | **Data Outreach Campaign**: Approach 10 universities / 5 partners. | Secure **3 signed Data Sharing Agreements**. |

## [Goal B] WALK: Market Entry
**Focus:** Fidelity, Economic Value, and Agility.

| Category | Assumption (Hypothesis) | Validation Strategy (The Test) | Success Signal (The Proof) |
| :--- | :--- | :--- | :--- |
| **Product** | **Alert Fidelity**: We can filter "noise" so users trust the system. | **"Shadow Mode" Pilots**: Run engine live but silenced. | **False Positive Rate drops below 15%** before "Live Mode". |
| **Customer** | **Economic Value**: CFOs will shift budget for proven savings. | **ROI Case Study**: Present the "$13M Savings" model. | Pilot converts to Paid Contract based on savings business case. |
| **Systems** | **Integration Agility**: Can deploy new verticals (Supply Chain) without breaking existing ones. | **Matrix Velocity Test**: Deploy Supply Chain update simultaneously with IT. | **Zero regression errors** or downtime explicitly during update. |
| **Partners** | **Channel Alignment**: System Integrators see us as a tool, not a replacement. | **Partner Pitch**: Propose Aegisight as the "engine" for bids. | **1 Signed Teaming Agreement** to include Aegisight in an RFP. |

## [Goal C] RUN: Strategic Expansion
**Focus:** Compliance, Stickiness, and Scale.

| Category | Assumption (Hypothesis) | Validation Strategy (The Test) | Success Signal (The Proof) |
| :--- | :--- | :--- | :--- |
| **Product** | **Regulatory Compliance**: Architecture handles PII/PHI legally. | **External Audit**: HIPAA / SOC2 Type 2 assessment. | Certification Achieved. |
| **Customer** | **Platform Stickiness**: Customers buy multiple modules. | **Upsell Campaign**: Offer "Bio-Wearable" module to Supply Chain clients. | **>20%** of clients adopt a 2nd module within 12 months. |
| **Systems** | **Global Reliability**: Infra supports 24/7 critical safety. | **Load Testing**: Simulate global traffic/failover. | **99.99% Uptime** during stress tests. |
| **Partners** | **Hardware Ecosystem**: Vendors allow API access to raw data. | **OEM Negotiation**: Request raw SDK access. | Confirmed technical access to HRW/Fatigue streams. |
