
import React, { useMemo, useState, useEffect } from 'react';
import { AppState, RiskEntry } from '../types';
import { ASSET_DATA } from '../constants';
import {
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  Terminal,
  RefreshCw,
  ChevronLeft,
  BarChart3,
  ShieldCheck,
  Sparkles,
  Fingerprint,
  Search,
  Cpu
} from 'lucide-react';

interface Props {
  state: AppState;
  onReset: () => void;
  onNext: () => void;
  onBack: () => void;
}

export const Step3Report: React.FC<Props> = ({ state, onReset, onNext, onBack }) => {
  const [selectedRisk, setSelectedRisk] = useState<RiskEntry | null>(null);
  const [isDecoding, setIsDecoding] = useState(false);
  const assetInfo = ASSET_DATA[state.assetClass];
  const totalRisks = state.dataYears * 5;
  const preventableLoss = state.dataYears * state.costPerOutage * 4;
  const netROI = preventableLoss * 0.92;

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);

  // Generate unique signatures for each risk
  const generateSignature = (asset: string, index: number) => {
    const chars = 'ABCDEF0123456789';
    let salt = '';
    for (let i = 0; i < 8; i++) salt += chars.charAt(Math.floor(Math.random() * chars.length));
    return `SIG-${asset.substring(0, 3).toUpperCase()}-${salt}`;
  };

  // Generate risk register rows
  const risks: RiskEntry[] = useMemo(() => {
    return Array.from({ length: totalRisks }).map((_, i) => {
      const assetName = `${state.assetClass} Instance #${Math.floor(Math.random() * 900) + 100}`;
      return {
        date: `2024-M${(i % 12) + 1}`,
        asset: assetName,
        type: assetInfo.fingerprints[i % assetInfo.fingerprints.length],
        probability: `${(95 - (i * 1.5)).toFixed(1)}%`,
        action: i % 2 === 0 ? 'AUTO-REMEDY' : 'ISOLATE',
        signature: generateSignature(state.assetClass, i)
      };
    });
  }, [state.assetClass, state.dataYears, assetInfo]);

  // Simulate AI decoding effect when a risk is selected
  useEffect(() => {
    if (selectedRisk) {
      setIsDecoding(true);
      const timer = setTimeout(() => setIsDecoding(false), 600);
      return () => clearTimeout(timer);
    }
  }, [selectedRisk]);

  // Unique Telemetry Generator for Step 3 XAI Window
  const getEvidenceData = (risk: RiskEntry) => {
    const explanations: Record<string, string> = {
      "Change Collision": "Sentinel detected a temporal link between recent deployment and service decay.",
      "SLA Cascade": "Heuristic match found between upstream latency and downstream timeout triggers.",
      "Admin Override": "Unauthorized configuration drift detected outside standard change window.",
      "Orphaned CI": "Infrastructure map inconsistency linked to failed reconciliation job.",
      "Table T001 Lock": "Database contention pattern identified during high-volume batch processing.",
      "Batch Job Deadlock": "Deadlock signature matched with concurrent analytical query load.",
      "IDOC Failure": "Buffer saturation detected in cross-system transactional interface.",
      "Memory Leak": "Anomalous heap growth identified in production cluster node.",
      "Auto-Scale Saturation": "Request volume exceeded provisioned auto-scaling ceiling.",
      "Zombie Asset Cost": "Infrastructure leakage detected via unattached storage volume audit.",
      "IAM Privilege Esc": "Security fingerprint matched anomalous identity role elevation.",
      "API Throttling": "Rate limiting triggered by high-frequency unauthorized endpoint polling.",
      "RAID Controller Degraded": "Hardware parity integrity failure detected on secondary disk array.",
      "Thermal Spike": "Chassis thermal profile exceeded safe operational parameters.",
      "Disk I/O Latency": "I/O wait state threshold breached during peak transactional window.",
      "SSL Expiry": "Certificate validation failure predicted within next maintenance cycle."
    };

    // Realistic log generation based on asset class
    const getLogSignal = () => {
      const sig = risk.signature.split('-')[2];
      switch (state.assetClass) {
        case 'ServiceNow': return `INC-${sig.substring(0, 4)}: Correlation found with CHG-${sig.substring(4)}. Pattern: 'Unverified_Push' -> 'Dependency_Failure'.`;
        case 'SAP': return `HANA_DB: Deadlock on [${risk.type}] detected. Thread ID: ${sig}. Wait state > 2500ms.`;
        case 'Cloud': return `C_WATCH: Resource saturation for [${risk.asset}]. Vector: ${risk.type}. Request: ${sig}.`;
        case 'Legacy': return `SYS_LOG: Critical latency in ${sig.substring(0, 3)} controller. Sector mismatch on ${risk.type}.`;
        default: return assetInfo.logSnippet;
      }
    };

    return {
      line01: `INFRA_MAP:: Mapping logical dependencies for ${risk.asset}...`,
      line02: `AI_SIGNAL:: ${getLogSignal()}`,
      line03: `PATTERN_ID: ${state.assetClass.toUpperCase()}_${risk.type.replace(/\s+/g, '_').toUpperCase()}_${risk.signature.split('-')[2]}`,
      line04: `// Explanation: ${explanations[risk.type] || "Forensic anomaly detected in operational telemetry stream."}`
    };
  };

  const evidence = selectedRisk ? getEvidenceData(selectedRisk) : null;

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 animate-in fade-in zoom-in duration-1000">
      {/* Executive Summary Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-900 border border-rose-900/40 rounded-3xl p-8 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-6 text-rose-500/10 group-hover:scale-110 transition-transform">
            <TrendingDown size={120} />
          </div>
          <div className="relative z-10">
            <p className="text-rose-400 text-xs font-black uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
              <AlertTriangle size={14} /> Preventable Exposure
            </p>
            <h3 className="text-5xl font-black text-rose-500 font-mono mb-4">{formatCurrency(preventableLoss)}</h3>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              Total financial risk identified across <span className="text-slate-100">{state.dataYears} years</span> of forensic log telemetry.
            </p>
          </div>
        </div>

        <div className="bg-slate-900 border border-emerald-900/40 rounded-3xl p-8 relative overflow-hidden group shadow-[0_0_50px_rgba(16,185,129,0.05)]">
          <div className="absolute top-0 right-0 p-6 text-emerald-500/10 group-hover:scale-110 transition-transform">
            <TrendingUp size={120} />
          </div>
          <div className="relative z-10">
            <p className="text-emerald-400 text-xs font-black uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
              <ShieldCheck size={14} /> Net ROI (Predicted)
            </p>
            <h3 className="text-5xl font-black text-emerald-500 font-mono mb-4">{formatCurrency(netROI)}</h3>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              Calculated savings based on <span className="text-slate-100">92% predictive accuracy</span> and MTTR compression.
            </p>
          </div>
        </div>
      </div>

      {/* Risk Register Table */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-slate-800 bg-slate-900/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600/20 rounded-lg">
              <BarChart3 className="text-blue-500" size={20} />
            </div>
            <div>
              <h3 className="font-bold text-slate-100">Identified Critical Risks ({totalRisks} Total)</h3>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mt-0.5">Select a row to clarify AI evidence</p>
            </div>
          </div>
          <div className="flex gap-4">
            <button
              onClick={onBack}
              className="flex items-center gap-2 px-4 py-2 text-slate-400 hover:text-blue-400 text-xs font-bold transition-all uppercase tracking-widest group"
            >
              <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Review Scan
            </button>
            <button
              onClick={onReset}
              className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl transition-all uppercase tracking-widest"
            >
              <RefreshCw size={14} /> New Audit
            </button>
            <button
              onClick={onNext}
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-black rounded-xl transition-all uppercase tracking-[0.2em] shadow-lg shadow-blue-900/20"
            >
              <Sparkles size={14} /> Predictive Horizon
            </button>
          </div>
        </div>

        <div className="max-h-[350px] overflow-y-auto custom-scrollbar">
          <table className="w-full text-left border-collapse font-mono text-xs">
            <thead className="bg-slate-950/50 text-slate-500 uppercase font-bold sticky top-0 z-20">
              <tr>
                <th className="p-5 border-b border-slate-800">Date</th>
                <th className="p-5 border-b border-slate-800">Target Asset</th>
                <th className="p-5 border-b border-slate-800">Fingerprint Type</th>
                <th className="p-5 border-b border-slate-800">Probability</th>
                <th className="p-5 border-b border-slate-800">Verified Signature</th>
                <th className="p-5 border-b border-slate-800 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="text-slate-300">
              {risks.map((risk, idx) => {
                const isSelected = selectedRisk?.signature === risk.signature;
                return (
                  <tr
                    key={idx}
                    onClick={() => setSelectedRisk(risk)}
                    className={`border-b border-slate-900 transition-all cursor-pointer group ${isSelected ? 'bg-blue-600/20 border-blue-500/50' : 'hover:bg-blue-500/5'}`}
                  >
                    <td className="p-5 text-slate-500">{risk.date}</td>
                    <td className="p-5 font-bold text-slate-400">{risk.asset}</td>
                    <td className="p-5 text-blue-400 font-bold group-hover:text-blue-300">{risk.type}</td>
                    <td className="p-5">
                      <div className="flex items-center gap-2">
                        <div className="w-12 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                          <div className={`h-full transition-all duration-1000 ${isSelected ? 'bg-cyan-400' : 'bg-blue-500'}`} style={{ width: risk.probability }} />
                        </div>
                        {risk.probability}
                      </div>
                    </td>
                    <td className="p-5">
                      <div className={`flex items-center gap-2 text-[10px] transition-colors ${isSelected ? 'text-cyan-400' : 'text-slate-500 group-hover:text-cyan-400/80'}`}>
                        <Fingerprint size={10} />
                        <span className="font-mono tracking-tighter uppercase">{risk.signature}</span>
                      </div>
                    </td>
                    <td className="p-5 text-right">
                      <span className={`text-[10px] font-black px-3 py-1 rounded-lg transition-all uppercase ${isSelected ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'}`}>
                        {risk.action}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* XAI Evidence Section - DYNAMIC & UNIQUE */}
      <div className="bg-slate-950 border border-slate-800/80 rounded-[2rem] overflow-hidden shadow-2xl transition-all border-l-4 border-l-blue-500/30">
        <div className="px-8 py-5 bg-slate-900/40 border-b border-slate-800/60 flex items-center justify-between">
          <h4 className="text-[11px] font-black text-blue-400 uppercase tracking-[0.25em] flex items-center gap-2">
            <span className="text-slate-500">&gt;_</span> XAI FORENSIC EVIDENCE (HIGHEST PROBABILITY PATTERN)
          </h4>
          {selectedRisk && (
            <div className="px-3 py-1 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-400 text-[9px] font-black tracking-widest uppercase flex items-center gap-2 shadow-[0_0_10px_rgba(245,158,11,0.2)]">
              <div className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-ping" />
              Verified Signature Authenticated
            </div>
          )}
        </div>

        <div className="min-h-[220px] p-10 font-mono text-[13px] leading-relaxed text-slate-400 bg-slate-950/40 relative">
          {!selectedRisk ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4 opacity-20 select-none">
              <Search size={40} className="text-slate-500" />
              <p className="text-[10px] font-black uppercase tracking-[0.5em]">Awaiting Forensic Selection</p>
            </div>
          ) : isDecoding ? (
            <div className="flex gap-8">
              <div className="flex flex-col text-slate-800 select-none pr-6">
                <span>01</span>
                <span>02</span>
                <span>03</span>
                <span>04</span>
              </div>
              <div className="flex items-center gap-3 text-blue-500 font-bold animate-pulse">
                <RefreshCw className="animate-spin" size={16} />
                <span>AI_ENGINE:: Processing Signal Integrity for {selectedRisk.signature}...</span>
              </div>
            </div>
          ) : evidence && (
            <div className="flex gap-8 animate-in fade-in slide-in-from-left-4 duration-500">
              <div className="flex flex-col text-slate-800 select-none pr-6">
                <span>01</span>
                <span>02</span>
                <span>03</span>
                <span>04</span>
              </div>
              <div className="space-y-1">
                <p>
                  <span className="text-blue-500 font-bold">INFRA_MAP::</span> {evidence.line01}
                </p>
                <p>
                  <span className="text-emerald-500 font-bold">AI_SIGNAL::</span>
                  <span className="ml-2 text-slate-100">{evidence.line02}</span>
                </p>
                <p>
                  <span className="text-slate-600 font-bold">PATTERN_ID:</span>
                  <span className="ml-2 text-slate-400">{evidence.line03}</span>
                </p>
                <p className="mt-2 italic text-slate-500 font-medium">
                  {evidence.line04}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
