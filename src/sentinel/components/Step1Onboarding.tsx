
import React from 'react';
import { AssetClass } from '../types';
import { Zap, Database, Cloud, HardDrive, LayoutGrid } from 'lucide-react';

interface Props {
  years: number;
  asset: AssetClass;
  onChange: (updates: Partial<{ years: number; asset: AssetClass }>) => void;
  onNext: () => void;
}

export const Step1Onboarding: React.FC<Props> = ({ years, asset, onChange, onNext }) => {
  const assets: { id: AssetClass; label: string; icon: any }[] = [
    { id: 'ServiceNow', label: 'ServiceNow', icon: LayoutGrid },
    { id: 'SAP', label: 'SAP', icon: Database },
    { id: 'Cloud', label: 'Cloud', icon: Cloud },
    { id: 'Legacy', label: 'Legacy', icon: HardDrive },
  ];

  return (
    <div className="max-w-3xl w-full mx-auto animate-in fade-in zoom-in duration-500">
      <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-10 shadow-2xl backdrop-blur-xl">
        <header className="mb-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest mb-6">
            Aegisight AI • Onboarding
          </div>
          <h1 className="text-4xl font-extrabold text-slate-50 tracking-tight">System Initialization</h1>
          <p className="text-slate-400 mt-3 text-lg">Calibrate the environment and historical data scope.</p>
        </header>

        <div className="space-y-10">
          {/* Asset Class Selection */}
          <div className="space-y-4">
            <label className="text-sm font-semibold text-slate-300 uppercase tracking-widest text-center block">Select Target Infrastructure</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {assets.map((item) => {
                const Icon = item.icon;
                const isSelected = asset === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onChange({ asset: item.id })}
                    className={`flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all group ${
                      isSelected 
                        ? 'bg-blue-600/20 border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.2)]' 
                        : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <Icon className={`mb-3 transition-colors ${isSelected ? 'text-blue-400' : 'text-slate-500 group-hover:text-slate-300'}`} size={28} />
                    <span className={`text-sm font-bold ${isSelected ? 'text-blue-50' : 'text-slate-400'}`}>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Historical Depth */}
          <div className="space-y-6 max-w-md mx-auto">
            <div className="flex justify-between items-center">
              <label className="text-sm font-semibold text-slate-300 uppercase tracking-widest">Historical Data Depth</label>
              <span className="text-blue-400 font-mono font-bold text-lg">{years} Years</span>
            </div>
            <input
              type="range"
              min="1"
              max="5"
              step="1"
              value={years}
              onChange={(e) => onChange({ years: Number(e.target.value) })}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-bold uppercase tracking-tighter">
              <span>Standard Scan</span>
              <span>Full Forensics</span>
            </div>
          </div>

          <button
            onClick={onNext}
            className="w-full mt-6 bg-blue-600 hover:bg-blue-500 text-white font-black py-5 px-8 rounded-2xl transition-all flex items-center justify-center gap-3 group shadow-xl shadow-blue-900/40 uppercase tracking-widest text-sm"
          >
            Configure Financial Model
            <Zap size={20} className="fill-current" />
          </button>
        </div>
      </div>
    </div>
  );
};
