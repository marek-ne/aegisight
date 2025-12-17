Aegisight AI: MVP Master Execution Plan
Version: 1.1 (ServiceNow Beachhead Edition)
Focus: Predictive Incident Prevention System (The "Risk Grader")
Persona: Sarah, IT Ops Director
Primary Integration: ServiceNow ITSM
1. Executive Summary: The Strategic Shift
The Problem: Enterprises do not buy "Risk Graders" (status reports); they buy guaranteed outcomes (cost prevention).
The Solution: The MVP is a "Predictive Intelligence Layer" that sits on top of ServiceNow.
The "Aha!" Moment: We do not just grade the risk; we tell Sarah, "ServiceNow shows all green, but our engine predicts a Critical Incident in 3 hours."
The MVP Definition
Input:
Dev Phase: Simulated Data (to build fast).
Pilot Phase: Real-time Ticket Data pulled from ServiceNow API.
Processing: Uses BigQuery ML (ARIMA_PLUS) to forecast "failure patterns" (High CPU + High Ticket Volume).
Output:
Aegisight Dashboard: The "Risk Grader" Gauge.
ServiceNow Alert: Pushes a "High Risk" incident back into ServiceNow (optional for V2).
2. Strategic Alignment: Learning vs. Business
This MVP bridges your personal learning goals with the enterprise sales strategy.
Component
Strategic Role (Business)
Learning Path Role (Technical)
The Brain
Core Value. Forecasting failures before they happen.
BigQuery ML: Mastering ARIMA_PLUS & SQL-based ML.
The Body
Scale. Handling data ingestion without crashing.
Cloud Run: Mastering Serverless Containers & Docker.
The Connector
Market Access. Connecting to the industry standard (ServiceNow).
API Integration: Learning OAuth & REST Data Fetching.

3. Go-To-Market: The "ServiceNow Shadow" Strategy
How to sell this MVP to an Enterprise without a long sales cycle.
The Pitch: "We predict the incidents ServiceNow misses."
The Scope (Low Risk):
Target a client with a ServiceNow Sandbox/Staging environment.
Sales Hook: "We connect to your sandbox, so we never touch production data."
The Baseline:
Measure their current Mean Time To Resolution (MTTR) inside ServiceNow.
The Validation (Shadow Mode):
Your Agent pulls last month's closed tickets from ServiceNow.
Sales Hook: "Let us run our model on last month's data. If we can predict the outages you actually had, we move to a live pilot."
The Close:
Show the report: "We predicted 5 outages. You prevented 4. Here is the money you saved."
4. Technical Architecture & Data Flow
graph LR
    subgraph "Client Environment"
    A[ServiceNow API]
    end
    subgraph "Aegisight Cloud (Your MVP)"
    B[Node.js Connector] -->|Fetch Incidents| A
    B -->|Ingest Data| C(BigQuery)
    C -->|ARIMA_PLUS Model| D[Prediction Engine]
    E[Dashboard API] -->|Query Risk| D
    F[Risk Dashboard] -->|Display| E
    end


Connector: Fetches incident table data from ServiceNow (JSON format).
The Brain: BigQuery ML calculates the probability of anomaly.
The Dashboard: Displays the Red/Green status to the user.
5. Execution: The Antigravity Agent Instructions
Use these exact prompts in your GitHub Issues or Antigravity Manager View to build the MVP.
Phase 1: The Simulator (Data Generation)
Keep this! You need data TODAY to start coding. Getting ServiceNow access takes time.
Instruction:
Create a standalone script scripts/simulate_data.js.
Connect to the database using process.env credentials.
Generate a continuous stream of time-series data for cpu_load (0-100) and ticket_velocity (int).
Normal Pattern: 90% of the time, keep CPU 20-40% and Tickets 0-2.
Failure Pattern: 10% of the time, simulate an "incident": CPU > 90% AND Tickets > 10 simultaneously.
Insert timestamps for the past 30 days so we have immediate history for BigQuery ML.
Phase 2: The ServiceNow Connector (The "Beachhead" Feature)
Context: We need to fetch real data from a ServiceNow instance to replace our simulator later.
Instruction:
Create a service src/services/servicenow.js.
Use axios to connect to a ServiceNow instance URL (from process.env.SN_INSTANCE).
Implement Basic Auth using SN_USER and SN_PASSWORD.
Create a function fetchRecentIncidents() that hits the Table API: /api/now/table/incident.
Query params: sysparm_limit=100, sysparm_query=opened_atONLast 30 days@javascript:gs.beginningOfLast30Days()@javascript:gs.endOfLast30Days().
Map the response to our internal DB format (extract opened_at as timestamp, count items as velocity).
Phase 3: The Brain (BigQuery ML)
Instruction:
Create a file src/models/risk_engine.sql.
Write a CREATE OR REPLACE MODEL statement.
Use model_type='ARIMA_PLUS' (best for time-series).
Select timestamp, cpu_load, and ticket_velocity from the dataset.
Add a second query below it to run ML.DETECT_ANOMALIES against the model.
Filter the results: return rows only where anomaly_probability > 0.75 (Our precision threshold).
Phase 4: The Bridge (Integration Layer)
Instruction:
Create a service file src/services/predictionService.js and an API route GET /api/risk-status.
Import @google-cloud/bigquery.
Write a function that executes the SQL query from Phase 3, fetching only the latest available prediction.
Logic:
If anomaly_probability > 0.75, return JSON: { status: "CRITICAL", score: [probability * 100] }.
Else, return { status: "STABLE", score: [probability * 100] }.
Handle errors gracefully (return "System Offline" if Cloud unreachable).
Phase 5: The Risk Grader (Dashboard UI)
Instruction:
Create a new route GET /dashboard and a frontend view.
Visual Requirements:
Header: "System Prediction Status".
The Gauge: A large circular visual showing the "Current Risk Score" (0-100%).
Green: < 75%
Red (Pulsing): > 75%
The Evidence: Below the gauge, show a simple line chart of cpu_load vs ticket_velocity for the last hour.
Data: Fetch data from the GET /api/risk-status endpoint we created.
6. Pre-Flight Checklist (Do This Before Starting Agents)
[ ] Google Cloud Key: Ensure key.json is in your project root (ignored by git) and linked in .env.
[ ] BigQuery Dataset: Manually create an empty dataset named aegisight_mvp in your Google Cloud Console.
[ ] ServiceNow Developer Account: Sign up at developer.servicenow.com to get a free "Personal Developer Instance" (PDI) for testing Phase 2.
[ ] Dependencies: Allow the agent to run npm install @google-cloud/bigquery axios.
