
import React, { useEffect, useState, useMemo } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, ResponsiveContainer, Cell } from 'recharts';
import { Cpu, Activity, Database, AlertCircle } from 'lucide-react';
import { DataSource, ScatterPoint } from '../types';

interface Props {
  cost: number;
  depth: number;
  source: DataSource;
  onComplete: () => void;
}

export const Step2Analysis: React.FC<Props> = ({ cost, depth, source, onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [isDone, setIsDone] = useState(false);

  // Generate random data points that will "cluster" over time
  const points = useMemo<ScatterPoint[]>(() => {
    return Array.from({ length: 60 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      status: i % 5 === 0 ? 'pattern' : 'unstructured'
    }));
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setIsDone(true);
          return 100;
        }
        return prev + 1.2;
      });
    }, 30);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (isDone) {
      const timeout = setTimeout(onComplete, 1200);
      return () => clearTimeout(timeout);
    }
  }, [isDone, onComplete]);

  // Dynamic coordinates that move toward a center based on progress
  const animatedPoints = points.map(p => {
    if (p.status === 'pattern' && progress > 50) {
      const weight = (progress - 50) / 50;
      return {
        ...p,
        x: p.x * (1 - weight) + (40 + Math.random() * 20) * weight,
        y: p.y * (1 - weight) + (40 + Math.random() * 20) * weight,
      };
    }
    return p;
  });

  return (
    <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center animate-in fade-in slide-in-from-bottom-10 duration-700">
      {/* Left Column: Logic */}
      <div className="space-y-8">
        <header>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-4">
            Phase 02: Correlative Analysis
          </div>
          <h2 className="text-4xl font-bold text-slate-50 mb-4">Processing Engine</h2>
          <p className="text-slate-400 text-lg leading-relaxed">
            The Sentinel AI is currently ingestings and cross-referencing telemetry from your <span className="text-cyan-400 font-semibold">{source}</span> environment.
          </p>
        </header>

        <div className="space-y-4">
          <div className={`flex items-start gap-4 p-4 rounded-lg border transition-colors ${progress > 10 ? 'bg-slate-900 border-slate-700' : 'bg-transparent border-slate-800 opacity-40'}`}>
            <div className="p-2 bg-slate-800 rounded text-cyan-400">
              <Database size={20} />
            </div>
            <div>
              <p className="text-slate-200 font-medium">Data Ingestion</p>
              <p className="text-sm text-slate-500">Scanning {depth} years of historical log data...</p>
            </div>
          </div>

          <div className={`flex items-start gap-4 p-4 rounded-lg border transition-colors ${progress > 40 ? 'bg-slate-900 border-slate-700' : 'bg-transparent border-slate-800 opacity-40'}`}>
            <div className="p-2 bg-slate-800 rounded text-emerald-400">
              <Activity size={20} />
            </div>
            <div>
              <p className="text-slate-200 font-medium">Financial Correlation</p>
              <p className="text-sm text-slate-500">Mapping timestamps to ${cost}/min impact...</p>
            </div>
          </div>

          <div className={`flex items-start gap-4 p-4 rounded-lg border transition-colors ${progress > 75 ? 'bg-slate-900 border-slate-700' : 'bg-transparent border-slate-800 opacity-40'}`}>
            <div className="p-2 bg-slate-800 rounded text-rose-400">
              <AlertCircle size={20} />
            </div>
            <div>
              <p className="text-slate-200 font-medium">AI Fingerprint Detection</p>
              <p className="text-sm text-slate-500">Isolating unique failure signatures.</p>
            </div>
          </div>
        </div>

        <div className="relative pt-4">
          <div className="flex justify-between mb-2 text-xs font-mono text-slate-500 uppercase tracking-widest">
            <span>Verifying Signatures</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-cyan-500 transition-all duration-300 ease-out shadow-[0_0_15px_rgba(6,182,212,0.5)]"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Right Column: Visual Animation */}
      <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 h-[450px] relative overflow-hidden flex flex-col items-center justify-center shadow-inner">
        <div className="absolute inset-0 scan-line pointer-events-none" />
        <div className="absolute top-4 left-4 text-[10px] font-mono text-slate-600 uppercase tracking-widest">
          Live Log Stream Viz
        </div>

        <div className="w-full h-full flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <XAxis type="number" dataKey="x" hide domain={[0, 100]} />
              <YAxis type="number" dataKey="y" hide domain={[0, 100]} />
              <ZAxis type="number" range={[40, 120]} />
              <Scatter name="Logs" data={animatedPoints}>
                {animatedPoints.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.status === 'pattern' && progress > 50 ? '#f43f5e' : '#475569'}
                    className="transition-colors duration-500"
                    fillOpacity={entry.status === 'pattern' && progress > 50 ? 0.9 : 0.4}
                  />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </div>

        <div className="absolute bottom-6 flex gap-8 items-center justify-center text-[10px] uppercase font-bold tracking-tighter">
          <div className="flex items-center gap-2 text-slate-500">
            <span className="w-2 h-2 rounded-full bg-slate-600" />
            Unstructured Logs
          </div>
          <div className={`flex items-center gap-2 transition-opacity duration-500 ${progress > 50 ? 'opacity-100' : 'opacity-0'}`}>
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            <span className="text-rose-500">Critical Risks</span>
          </div>
        </div>
      </div>
    </div>
  );
};
