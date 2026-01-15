import React from 'react';
import { AnimatePresence, MotionValue } from 'framer-motion';
import { StageId } from '../types';
import { IngestionVisual } from './stages/IngestionVisual';
import { FingerprintVisual } from './stages/FingerprintVisual';
import { PhysicsGateVisual } from './stages/PhysicsGateVisual';
import { SignatureVisual } from './stages/SignatureVisual';
import { OutputVisual } from './stages/OutputVisual';

interface VisualizerProps {
  currentStage: StageId;
  scrollYProgress: MotionValue<number>;
}

export const Visualizer: React.FC<VisualizerProps> = ({ currentStage, scrollYProgress }) => {
  return (
    <div className="relative w-full h-full flex items-center justify-center bg-[#050505] overflow-hidden rounded-xl border border-slate-800 shadow-2xl">
      {/* Background Grid Mesh */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #334155 1px, transparent 0)', backgroundSize: '40px 40px' }}>
      </div>

      <div className="relative z-10 w-full max-w-lg aspect-square flex items-center justify-center p-8">
        <AnimatePresence>
          {currentStage === StageId.Ingestion && (
            <IngestionVisual key="ingestion" />
          )}
          {currentStage === StageId.Fingerprint && (
            <FingerprintVisual key="fingerprint" />
          )}
          {currentStage === StageId.PhysicsGate && (
            <PhysicsGateVisual key="gate" />
          )}
          {currentStage === StageId.Signature && (
            <SignatureVisual key="signature" />
          )}
          {currentStage === StageId.Output && (
            <OutputVisual key="output" />
          )}
        </AnimatePresence>
      </div>

      {/* Stage Indicator Overlay */}
      <div className="absolute bottom-6 right-6 flex space-x-2 z-20">
        {[0, 1, 2, 3, 4].map((idx) => (
          <div 
            key={idx}
            className={`h-1.5 rounded-full transition-all duration-500 ${
              idx === currentStage 
                ? 'w-8 bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.5)]' 
                : 'w-2 bg-slate-800'
            }`}
          />
        ))}
      </div>
    </div>
  );
};