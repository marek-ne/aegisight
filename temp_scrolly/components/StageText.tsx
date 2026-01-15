import React from 'react';
import { StageId, ContentBlock } from '../types';

interface StageTextProps {
  content: ContentBlock;
  isActive: boolean;
}

export const StageText = React.forwardRef<HTMLDivElement, StageTextProps>(
  ({ content, isActive }, ref) => {
    
    const isIP = content.id === StageId.Fingerprint || content.id === StageId.Signature;

    return (
      <div 
        ref={ref} 
        id={`stage-${content.id}`}
        className="min-h-screen flex items-center justify-center p-6 md:p-12 snap-center"
      >
        <div 
          className={`max-w-lg transition-all duration-700 ease-out transform ${
            isActive 
              ? 'opacity-100 translate-y-0 blur-none' 
              : 'opacity-20 translate-y-8 blur-sm'
          }`}
        >
          <div className="flex items-center gap-3 mb-4">
              <span className="font-mono text-slate-500 text-sm">0{content.id + 1}</span>
              <div className={`h-[1px] w-12 ${isIP ? 'bg-cyan-500' : 'bg-slate-700'}`} />
              <span className={`text-sm font-bold uppercase tracking-widest ${
                  content.id === StageId.Fingerprint ? 'text-cyan-400' : 
                  content.id === StageId.Signature ? 'text-red-400' : 'text-slate-400'
              }`}>
                  {content.title}
              </span>
          </div>

          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white leading-tight">
              {content.subtitle}
          </h2>

          <p className="text-lg text-slate-400 leading-relaxed mb-8">
              {content.description}
          </p>

          <div className="bg-slate-900/50 border-l-2 border-slate-700 p-4 backdrop-blur-sm">
              <h4 className="text-xs text-slate-500 uppercase mb-1 font-bold">Technical Specs</h4>
              <p className="font-mono text-xs text-cyan-500/80">
                  {content.technicalDetail}
              </p>
          </div>
        </div>
      </div>
    );
  }
);

StageText.displayName = 'StageText';