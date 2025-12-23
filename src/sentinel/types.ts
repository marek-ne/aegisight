
export type AssetClass = 'ServiceNow' | 'SAP' | 'Cloud' | 'Legacy';

// Added DataSource alias for semantic clarity and to fix import errors in analysis components
export type DataSource = AssetClass;

// Added ScatterPoint for telemetry data visualization used in Step2Analysis
export interface ScatterPoint {
  id: number;
  x: number;
  y: number;
  status: 'pattern' | 'unstructured';
}

export interface AppState {
  step: 1 | 2 | 3 | 4 | 5;
  costPerOutage: number;
  dataYears: number;
  assetClass: AssetClass;
}

export interface AssetInfo {
  fingerprints: string[];
  logSnippet: string;
}

export interface ExtractionRow {
  timestamp: string;
  source: string;
  fingerprint: string;
  status: 'FOUND' | 'SCANNING';
}

export interface RiskEntry {
  date: string;
  asset: string;
  type: string;
  probability: string;
  action: string;
  signature: string;
}

export interface ForecastData {
  threatTitle: string;
  description: string;
  probabilityCurve: { month: string; value: number }[];
  strategicSteps: string[];
}
