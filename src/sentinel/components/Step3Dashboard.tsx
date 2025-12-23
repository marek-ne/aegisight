
import React from 'react';
import { DataSource, AppState } from '../types';
import { SCENARIOS, EVENTS_PER_YEAR } from '../constants';
import { TrendingDown, TrendingUp, Info, ArrowRight, Server, Lock, FileWarning, Terminal, RefreshCcw } from 'lucide-react';

interface Props {
  state: AppState;
  onReset: () => void;
}

export const Step3Dashboard: React.FC<Props> = ({ state, onReset }) => {
  // Use state.assetClass instead of state.dataSource to match AppState interface
  const scenario = SCENARIOS[state.assetClass];
  
  // Logic: (Cost * 60 mins) * (Events_Per_Year) - using state.costPerOutage
  const annualLoss = (state.costPerOutage * 60) * EVENTS_PER_YEAR;
  const savings = annualLoss * 0.92;

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 animate-in fade-in zoom-in duration-1000">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-50">Operational Risk Report</h2>
          <p className="text-slate-400 text-sm">Target: {state.assetClass} Infrastructure Analysis</p>
        </div>
        <button 
          onClick={onReset}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm transition-colors"
        >
          <RefreshCcw size={16} />
          New Simulation
        </button>
      </div>

      {/* Financial Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-900 border border-rose-900/30 rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 text-rose-500 opacity-10">
            <TrendingDown size={80} />
          </div>
          <p className="text-slate-400 text-sm font-semibold uppercase tracking-wider mb-2">Projected Annual Loss</p>
          <p className="text-4xl font-bold text-rose-500 font-mono">{formatCurrency(annualLoss)}</p>
          <p className="text-xs text-rose-400/60 mt-4 flex items-center gap-1">
            <Info size={12} />
            Based on {EVENTS_PER_YEAR} typical incidents/year
          </p>
        </div>

        <div className="bg-slate-900 border border-emerald-900/30 rounded-2xl p-6 relative overflow-hidden shadow-[0_0_40px_rgba(16,185,129,0.05)]">
          <div className="absolute top-0 right-0 p-4 text-emerald-500 opacity-10">
            <TrendingUp size={80} />
          </div>
          <p className="text-slate-400 text-sm font-semibold uppercase tracking-wider mb-2">Savings with Prediction</p>
          <p className="text-4xl font-bold text-emerald-500 font-mono">{formatCurrency(savings)}</p>
          <p className="text-xs text-emerald-400/60 mt-4 flex items-center gap-1">
            <Info size={12} />
            92% MTTR Reduction via AI Early-Warning
          </p>
        </div>
      </div>

      {/* Risk Chain / CUJ */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
        <h3 className="text-lg font-bold text-slate-50 mb-8 flex items-center gap-2">
          <div className="w-1.5 h-6 bg-cyan-500 rounded-full" />
          Critical User Journey (CUJ) Impact: {scenario.title}
        </h3>
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative">
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-slate-800 -translate-y-1/2 z-0" />
          
          {scenario.chain.map((step, idx) => (
            <div key={idx} className="relative z-10 flex flex-col items-center gap-4 w-full md:w-1/3">
              <div className="w-16 h-16 rounded-full bg-slate-950 border-2 border-slate-700 flex items-center justify-center shadow-xl group transition-all hover:border-cyan-500">
                {idx === 0 && <Server className="text-slate-400 group-hover:text-cyan-400" />}
                {idx === 1 && <Lock className="text-slate-400 group-hover:text-cyan-400" />}
                {idx === 2 && <FileWarning className="text-slate-400 group-hover:text-cyan-400" />}
              </div>
              <div className="text-center">
                <p className="text-slate-200 font-bold">{step}</p>
                <p className="text-slate-500 text-xs mt-1 uppercase tracking-widest">Step 0{idx + 1}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* XAI Evidence Panel */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="px-6 py-4 bg-slate-800/50 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-300 flex items-center gap-2 uppercase tracking-widest">
            <Terminal size={16} className="text-cyan-500" />
            Root Cause Evidence (Raw Telemetry)
          </h3>
          <span className="text-[10px] font-mono text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded">CONFIDENCE: 94%</span>
        </div>
        <div className="p-6 bg-slate-950 font-mono text-sm leading-relaxed">
          <div className="flex gap-4">
            <div className="text-slate-700 select-none">
              <p>01</p>
              <p>02</p>
              <p>03</p>
            </div>
            <div className="text-slate-400">
              <p><span className="text-slate-600">[{new Date().toISOString().split('T')[0]}]</span> {scenario.log}</p>
              <p><span className="text-slate-600">[{new Date().toISOString().split('T')[0]}]</span> Analyzing cross-cluster dependencies...</p>
              <p className="text-emerald-400"><span className="text-slate-600">[{new Date().toISOString().split('T')[0]}]</span> ACTION_REQUIRED: Predictive throttling initiated.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
