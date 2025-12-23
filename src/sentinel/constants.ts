
import { AssetClass, AssetInfo } from './types';

export const ASSET_DATA: Record<AssetClass, AssetInfo> = {
  ServiceNow: {
    fingerprints: ["Change Collision", "SLA Cascade", "Admin Override", "Orphaned CI"],
    logSnippet: "INC-9901: Correlation found with CHG-00492. Pattern: 'Friday_Patch' -> 'VPN_Timeout'."
  },
  SAP: {
    fingerprints: ["Table T001 Lock", "Batch Job Deadlock", "IDOC Failure", "Memory Leak"],
    logSnippet: "HANA_DB: Deadlock detected on Table T001. User: BATCH_JOB. Process blocked > 5000ms."
  },
  Cloud: {
    fingerprints: ["Auto-Scale Saturation", "Zombie Asset Cost", "IAM Privilege Esc", "API Throttling"],
    logSnippet: "AWS_CloudWatch: Instance i-0123 reached MaxCapacity. Throttling active. Region: us-east-1."
  },
  Legacy: {
    fingerprints: ["RAID Controller Degraded", "Thermal Spike", "Disk I/O Latency", "SSL Expiry"],
    logSnippet: "SNMP TRAP: Virtual Disk 0:1 degraded. Write latency > 2000ms. Host: ESXi-04."
  }
};

export const DEFAULT_COST = 50000;

// Added constant for annual frequency of typical risk events
export const EVENTS_PER_YEAR = 24;

// Added scenario data mapping for different infrastructure targets
export const SCENARIOS: Record<AssetClass, { title: string; chain: string[]; log: string }> = {
  ServiceNow: {
    title: "Change Conflict Escalation",
    chain: ["Change Validation", "Conflict Detection", "Service Outage"],
    log: "SYSTEM: Detected 400% spike in related INC records following CHG-001."
  },
  SAP: {
    title: "Database Deadlock Cluster",
    chain: ["Batch Job Initiation", "Table T001 Locked", "Production Halt"],
    log: "HANA: Deadlock cluster detected on core tables. Batch processing suspended."
  },
  Cloud: {
    title: "Auto-Scale Saturation",
    chain: ["Traffic Surge", "Quota Limit Hit", "Service Unavailable"],
    log: "AWS: Request limit reached for US-EAST-1. Auto-scaling halted."
  },
  Legacy: {
    title: "Hardware Controller Failure",
    chain: ["Disk Latency High", "RAID Degraded", "System Panic"],
    log: "KERN_ERR: RAID controller reports critical failure on slot 0. Throughput -80%."
  }
};
