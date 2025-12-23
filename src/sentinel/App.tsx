
import React, { useState } from 'react';
import { AppState } from './types';
import { DEFAULT_COST } from './constants';
import { Step1Onboarding } from './components/Step1Onboarding';
import { Step2CostOverview } from './components/Step2CostOverview';
import { Step2Extraction } from './components/Step2Extraction';
import { Step3Report } from './components/Step3Report';
import { Step4PredictiveHorizon } from './components/Step4PredictiveHorizon';
import { Shield, Eye } from 'lucide-react';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    step: 1,
    costPerOutage: DEFAULT_COST,
    dataYears: 2,
    assetClass: 'ServiceNow'
  });

  const updateState = (updates: Partial<AppState>) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  const handleReset = () => {
    setState({
      step: 1,
      costPerOutage: DEFAULT_COST,
      dataYears: 2,
      assetClass: 'ServiceNow'
    });
  };

  const steps = [
    { id: 1, label: 'Onboarding' },
    { id: 2, label: 'Cost Overview' },
    { id: 3, label: 'Fingerprints' },
    { id: 4, label: 'Report' },
    { id: 5, label: 'Horizon' }
  ] as const;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex flex-col selection:bg-blue-500/30 font-inter">
      {/* Global Navbar */}
      <nav className="h-20 border-b border-slate-900 flex items-center justify-between px-10 bg-slate-950/50 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <img src="/pics/as-2-icon.png" alt="Aegisight AI" className="w-12 h-12 rounded-full shadow-lg shadow-blue-900/20" />
          <button
            onClick={handleReset}
            className="text-left focus:outline-none"
          >
            <span className="font-montserrat font-bold text-2xl text-white block leading-none tracking-tight">Aegisight <span className="text-brand-blue">AI</span></span>
            <span className="text-slate-500 font-mono text-[10px] uppercase tracking-widest pl-0.5">Audit Core</span>
          </button>
        </div>

        {/* Interactive Navigation Hub */}
        <div className="hidden lg:flex items-center gap-8 text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">
          {steps.map((s) => (
            <button
              key={s.id}
              onClick={() => updateState({ step: s.id as AppState['step'] })}
              className={`flex items-center gap-2 transition-all hover:text-blue-300 focus:outline-none ${state.step === s.id ? 'text-blue-400 scale-105' : ''}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${state.step >= s.id ? 'bg-blue-500 shadow-[0_0_8px_#3b82f6]' : 'bg-slate-800'}`} />
              {s.label}
            </button>
          ))}
        </div>

        <div className="text-right hidden sm:block">
          <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest mb-1">Audit Status</p>
          <div className="flex items-center gap-2 justify-end">
            <div className="flex items-center gap-2 justify-end">
              <Shield size={10} className="text-emerald-500" />
              <span className="text-[10px] font-mono text-emerald-500 bg-emerald-500/10 px-2 rounded-full border border-emerald-500/20 tracking-wider">SECURE SESSION ENCRYPTED</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col items-center justify-center p-8 md:p-16">
        {state.step === 1 && (
          <Step1Onboarding
            years={state.dataYears}
            asset={state.assetClass}
            onChange={(updates) => updateState({
              ...(updates.years !== undefined && { dataYears: updates.years }),
              ...(updates.asset !== undefined && { assetClass: updates.asset })
            })}
            onNext={() => updateState({ step: 2 })}
          />
        )}

        {state.step === 2 && (
          <Step2CostOverview
            cost={state.costPerOutage}
            onChange={(cost) => updateState({ costPerOutage: cost })}
            onNext={() => updateState({ step: 3 })}
            onBack={() => updateState({ step: 1 })}
          />
        )}

        {state.step === 3 && (
          <Step2Extraction
            years={state.dataYears}
            asset={state.assetClass}
            onComplete={() => updateState({ step: 4 })}
            onBack={() => updateState({ step: 2 })}
          />
        )}

        {state.step === 4 && (
          <Step3Report
            state={state}
            onReset={handleReset}
            onNext={() => updateState({ step: 5 })}
            onBack={() => updateState({ step: 3 })}
          />
        )}

        {state.step === 5 && (
          <Step4PredictiveHorizon
            state={state}
            onReset={handleReset}
            onBack={() => updateState({ step: 4 })}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="py-8 px-12 border-t border-slate-900 text-slate-600 text-[10px] font-black uppercase tracking-[0.3em] flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-950/80 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <Shield className="text-slate-800" size={14} />
          AEGISIGHT ENTERPRISE SECURITY PLATFORM // VER 4.0
        </div>
        <div className="flex gap-8">
          <span className="hover:text-blue-500 cursor-pointer transition-colors">Forensic Integrity Policy</span>
          <span className="hover:text-blue-500 cursor-pointer transition-colors">ISO 27001/30001</span>
          <span className="hover:text-blue-500 cursor-pointer transition-colors">Global Node Status: Green</span>
        </div>
      </footer>
    </div>
  );
};

export default App;
