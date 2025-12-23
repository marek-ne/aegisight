
import React, { useEffect, useState, useMemo } from 'react';
import { AssetClass, ExtractionRow } from '../types';
import { ASSET_DATA } from '../constants';
import { Search, Loader2, Fingerprint, CheckCircle2, ChevronLeft } from 'lucide-react';

interface Props {
  years: number;
  asset: AssetClass;
  onComplete: () => void;
  onBack: () => void;
}

export const Step2Extraction: React.FC<Props> = ({ years, asset, onComplete, onBack }) => {
  const [displayedRows, setDisplayedRows] = useState<ExtractionRow[]>([]);
  const [progress, setProgress] = useState(0);
  const fingerprintCount = years * 124;
  const assetInfo = ASSET_DATA[asset];

  // Logic: Generate rows based on years
  const allRows = useMemo(() => {
    if (!assetInfo) return [];
    
    const rows: ExtractionRow[] = [];
    const quarters = ['Q1', 'Q2', 'Q3', 'Q4'];
    const currentYear = new Date().getFullYear();
    
    for (let i = 0; i < years; i++) {
      const year = currentYear - i;
      quarters.forEach((q, idx) => {
        rows.push({
          timestamp: `${year}-${q}`,
          source: `${asset} Log Partition 0${idx + 1}`,
          fingerprint: (assetInfo.fingerprints[idx % assetInfo.fingerprints.length] || 'Unknown') + ' Pattern',
          status: 'FOUND'
        });
      });
    }
    return rows;
  }, [years, asset, assetInfo]);

  useEffect(() => {
    setDisplayedRows([]);
    setProgress(0);
    
    if (allRows.length === 0) return;

    let currentIndex = 0;
    let completionTimeout: ReturnType<typeof setTimeout>;

    const interval = setInterval(() => {
      if (currentIndex < allRows.length) {
        const nextRow = allRows[currentIndex];
        if (nextRow) {
          setDisplayedRows(prev => [...prev, nextRow]);
        }
        currentIndex++;
        setProgress((currentIndex / allRows.length) * 100);
      } else {
        clearInterval(interval);
        completionTimeout = setTimeout(onComplete, 1500);
      }
    }, 600);

    return () => {
      clearInterval(interval);
      if (completionTimeout) clearTimeout(completionTimeout);
    };
  }, [allRows, onComplete]);

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <header className="flex items-end justify-between border-b border-slate-800 pb-6">
        <div>
          <button 
            onClick={onBack}
            className="inline-flex items-center gap-1 text-slate-500 hover:text-blue-400 text-[10px] font-black uppercase tracking-widest mb-2 transition-colors group"
          >
            <ChevronLeft size={12} className="group-hover:-translate-x-1 transition-transform" /> Back to Calibration
          </button>
          <div className="flex items-center gap-2 text-blue-500 font-bold text-xs uppercase tracking-tighter mb-2">
            <Search size={14} /> Extraction in Progress
          </div>
          <h2 className="text-3xl font-black text-slate-50">Scanning {years} Years of Logs...</h2>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">Fingerprints Isolated</p>
          <p className="text-3xl font-mono font-bold text-blue-500">{Math.round((progress / 100) * fingerprintCount)}</p>
        </div>
      </header>

      {/* Main Table Content */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-slate-800">
          <div 
            className="h-full bg-blue-500 transition-all duration-300 shadow-[0_0_10px_#3b82f6]" 
            style={{ width: `${progress}%` }} 
          />
        </div>
        
        <div className="max-h-[500px] overflow-y-auto">
          <table className="w-full text-left border-collapse font-mono text-xs">
            <thead className="sticky top-0 bg-slate-900 text-slate-500 uppercase font-bold tracking-widest z-10">
              <tr>
                <th className="p-4 border-b border-slate-800">Timestamp</th>
                <th className="p-4 border-b border-slate-800">Raw Log Source</th>
                <th className="p-4 border-b border-slate-800">AI Fingerprint Detected</th>
                <th className="p-4 border-b border-slate-800">Status</th>
              </tr>
            </thead>
            <tbody className="text-slate-300">
              {displayedRows.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-12 text-center text-slate-600 italic">
                    <Loader2 className="animate-spin inline mr-2" size={16} /> Initializing heuristic engine...
                  </td>
                </tr>
              ) : (
                displayedRows.map((row, i) => (
                  row ? (
                    <tr key={i} className="border-b border-slate-900 hover:bg-blue-500/5 transition-colors animate-in fade-in slide-in-from-left-4">
                      <td className="p-4 text-slate-500 font-bold">{row.timestamp}</td>
                      <td className="p-4">{row.source}</td>
                      <td className="p-4 flex items-center gap-2">
                        <Fingerprint size={14} className="text-blue-400" />
                        <span className="text-blue-50 font-medium">{row.fingerprint}</span>
                      </td>
                      <td className="p-4">
                        <span className="flex items-center gap-1.5 text-emerald-400 font-bold bg-emerald-400/10 px-2 py-0.5 rounded-full w-fit border border-emerald-400/20">
                          <CheckCircle2 size={12} /> {row.status}
                        </span>
                      </td>
                    </tr>
                  ) : null
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <footer className="flex items-center justify-between p-6 bg-slate-900/50 border border-slate-800 rounded-2xl">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-600/20 rounded-xl">
            <Fingerprint className="text-blue-500" size={32} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Heuristic Target</p>
            <p className="text-slate-100 font-bold">{fingerprintCount} latent signals remaining</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-slate-600 font-mono">AEGISIGHT_ENGINE_v4.2.0::ACTIVE</p>
          <div className="flex gap-1 justify-end mt-1">
            {[...Array(5)].map((_, i) => (
              <div key={i} className={`w-1 h-3 rounded-full ${i < (progress / 20) ? 'bg-blue-500' : 'bg-slate-800'}`} />
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
};
