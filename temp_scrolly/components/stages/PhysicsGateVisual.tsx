import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Fingerprint, BrainCircuit } from 'lucide-react';
import { TEXT_CONTENT } from '../../config';

export const PhysicsGateVisual: React.FC = () => {
  const [progress, setProgress] = useState(0);
  const { header, thresholdLabel, searching, passed, rule1, rule2 } = TEXT_CONTENT.physicsGate;

  // Simulation of validation progress
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + 0.4;
        return next > 87.4 ? 87.4 : next;
      });
    }, 20); 
    return () => clearInterval(timer);
  }, []);

  const coreOpacity = Math.max(0, 1 - (progress / 60)); 
  const coreScale = 1 - (progress / 100) * 0.2;

  const fingerprintOpacity = Math.min(1, Math.max(0, (progress - 30) / 40));
  const fingerprintScale = 0.5 + (Math.min(1, fingerprintOpacity) * 0.5);

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0, transition: { duration: 0.5 } }}
      className="absolute inset-0 flex flex-col items-center justify-center bg-black overflow-hidden"
    >
      {/* Vignette Overlay for depth */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(5,5,5,0.8)_90%)]" />

      <div className="relative z-10 flex flex-col items-center gap-6 w-full max-w-sm">
          {/* Central Reticle & Icon Transformation */}
          <div className="relative flex items-center justify-center py-6">
            
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className={`absolute w-48 h-48 rounded-full border border-dashed transition-colors duration-1000 ${progress > 60 ? 'border-green-500/50' : 'border-cyan-500/50'}`}
            />
            
             <div className="absolute w-36 h-36 rounded-full border border-slate-800/80 bg-black/40 backdrop-blur-sm" />

            <div className="relative z-10 w-24 h-24 flex items-center justify-center">
                 
                 <motion.div
                    style={{ opacity: coreOpacity, scale: coreScale }}
                    className="absolute inset-0 flex items-center justify-center"
                 >
                    <BrainCircuit className="text-cyan-400 w-16 h-16 drop-shadow-[0_0_20px_rgba(34,211,238,0.8)]" />
                 </motion.div>

                 <motion.div
                    style={{ opacity: fingerprintOpacity, scale: fingerprintScale }}
                    className="absolute inset-0 flex items-center justify-center"
                 >
                    <Fingerprint className="text-green-500 w-16 h-16 drop-shadow-[0_0_20px_rgba(34,197,94,0.8)]" />
                 </motion.div>

                 {progress < 85 && (
                    <motion.div 
                        initial={{ top: "0%" }}
                        animate={{ top: "100%" }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", repeatType: "reverse" }}
                        className="absolute w-full h-[2px] bg-white shadow-[0_0_15px_white] opacity-80"
                    />
                 )}
            </div>
          </div>

          {/* Dashboard UI: Progress & Rules */}
          <div className="w-full space-y-4 px-6 bg-black/60 backdrop-blur-sm p-4 rounded-xl border border-slate-800/50">
            
            <div className="flex justify-between text-xs font-mono tracking-wider">
                <span className="text-slate-300">{header}</span>
                <span className={`font-bold transition-colors ${progress >= 85 ? 'text-green-500' : 'text-cyan-400'}`}>
                    {progress.toFixed(1)}%
                </span>
            </div>

            <div className="h-2 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
                <motion.div 
                    className={`h-full shadow-[0_0_10px] transition-colors duration-500 ${progress >= 85 ? 'bg-green-500 shadow-green-500/50' : 'bg-cyan-500 shadow-cyan-500/50'}`}
                    style={{ width: `${progress}%` }}
                />
            </div>
             <div className="flex justify-between text-[10px] text-slate-500 font-mono uppercase">
                <span>{thresholdLabel}</span>
                <span className={progress >= 85 ? "text-green-500 font-bold" : "text-cyan-500/70 animate-pulse"}>
                    {progress >= 85 ? passed : searching}
                </span>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-2">
                <div className="bg-[#0f172a]/90 border border-slate-700 p-3 rounded flex flex-col gap-1 shadow-lg">
                    <span className="text-[9px] text-slate-400 font-bold font-mono uppercase tracking-wide">{rule1.label}:</span>
                    <span className="text-[10px] text-slate-200 font-mono">{rule1.value}</span>
                </div>
                <div className="bg-[#0f172a]/90 border border-slate-700 p-3 rounded flex flex-col gap-1 shadow-lg">
                    <span className="text-[9px] text-slate-400 font-bold font-mono uppercase tracking-wide">{rule2.label}:</span>
                    <span className="text-[10px] text-slate-200 font-mono">{rule2.value}</span>
                </div>
            </div>
          </div>
      </div>
    </motion.div>
  );
};