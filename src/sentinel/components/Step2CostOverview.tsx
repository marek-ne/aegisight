
import React from 'react';
import { Coins, ChevronLeft, ArrowRight, TrendingUp, DollarSign } from 'lucide-react';

interface Props {
  cost: number;
  onChange: (cost: number) => void;
  onNext: () => void;
  onBack: () => void;
}

export const Step2CostOverview: React.FC<Props> = ({ cost, onChange, onNext, onBack }) => {
  const formatValue = (val: number) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);

  return (
    <div className="max-w-4xl w-full mx-auto animate-in fade-in slide-in-from-right-10 duration-500">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
        {/* Left Explanation Column */}
        <div className="md:col-span-2 space-y-6 flex flex-col justify-center">
          <header>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest mb-4">
              Economic Parameterization
            </div>
            <h1 className="text-3xl font-black text-slate-50 tracking-tight leading-tight">Define Cost of Inertia</h1>
            <p className="text-slate-400 mt-4 text-base leading-relaxed">
              To calculate accurate ROI, we must establish the financial gravity of a single failure event. This includes direct losses, SLA penalties, and engineering burnout costs.
            </p>
          </header>

          <div className="p-4 bg-slate-900/50 border border-slate-800 rounded-2xl space-y-3">
             <div className="flex items-center gap-3 text-xs font-bold text-slate-300">
                <TrendingUp size={16} className="text-emerald-500" />
                <span>Impact Scale: High</span>
             </div>
             <p className="text-[10px] text-slate-500 leading-normal">
               Predictive models suggest that for your selected infrastructure, every minute of downtime accumulates exponentially after the initial 15-minute window.
             </p>
          </div>
          
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-slate-500 hover:text-slate-300 text-[10px] font-black uppercase tracking-widest transition-all group w-fit"
          >
            <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back to Onboarding
          </button>
        </div>

        {/* Right Input Column */}
        <div className="md:col-span-3">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 -m-8 w-48 h-48 bg-blue-600/10 rounded-full blur-3xl" />
            
            <div className="relative z-10 space-y-10">
              <div className="space-y-6">
                <div className="flex items-center gap-4 mb-2">
                  <div className="w-12 h-12 bg-blue-600/20 rounded-2xl flex items-center justify-center border border-blue-500/30">
                    <Coins className="text-blue-400" size={24} />
                  </div>
                  <div>
                    <label className="text-xs font-black text-slate-300 uppercase tracking-widest">Est. Cost / Outage Event</label>
                    <p className="text-[10px] text-slate-500 uppercase tracking-tighter">Enter average financial impact per 60min failure</p>
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute left-6 top-1/2 -translate-y-1/2 text-blue-500 font-black text-2xl">$</div>
                  <input
                    type="number"
                    value={cost}
                    onChange={(e) => onChange(Number(e.target.value))}
                    className="w-full bg-slate-950 border-2 border-slate-800 rounded-2xl py-8 pl-14 pr-6 text-slate-50 focus:outline-none focus:border-blue-500 transition-all font-mono text-4xl font-black shadow-inner"
                  />
                  <div className="absolute right-6 top-1/2 -translate-y-1/2 flex flex-col gap-1">
                    <button 
                      onClick={() => onChange(cost + 1000)}
                      className="p-1 hover:bg-slate-800 rounded text-slate-500 hover:text-blue-400 transition-colors"
                    >
                      <ArrowRight className="-rotate-90" size={16} />
                    </button>
                    <button 
                      onClick={() => onChange(Math.max(0, cost - 1000))}
                      className="p-1 hover:bg-slate-800 rounded text-slate-500 hover:text-blue-400 transition-colors"
                    >
                      <ArrowRight className="rotate-90" size={16} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Economic Visualization */}
              <div className="space-y-4">
                 <div className="flex justify-between text-[10px] font-black text-slate-500 uppercase tracking-widest">
                    <span>Projected Risk Gradient</span>
                    <span>Scaling @ 1.2x</span>
                 </div>
                 <div className="flex items-end gap-1 h-20">
                    {[...Array(24)].map((_, i) => (
                      <div 
                        key={i} 
                        className="flex-1 bg-slate-800 rounded-t-sm transition-all duration-500"
                        style={{ 
                          height: `${Math.min(100, (cost / 100000) * (i + 1) * 4)}%`,
                          backgroundColor: i > 18 ? '#f43f5e' : i > 10 ? '#3b82f6' : '#1e293b'
                        }}
                      />
                    ))}
                 </div>
              </div>

              <div className="pt-6">
                <button
                  onClick={onNext}
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-5 px-8 rounded-2xl transition-all flex items-center justify-center gap-3 group shadow-xl shadow-blue-900/40 uppercase tracking-[0.2em] text-xs"
                >
                  <DollarSign size={16} />
                  Validate & Run Simulation
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
