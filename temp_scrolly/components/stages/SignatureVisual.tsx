import React from 'react';
import { motion } from 'framer-motion';
import { Fingerprint } from 'lucide-react';
import { TEXT_CONTENT } from '../../config';

export const SignatureVisual: React.FC = () => {
  const { id, status, header, subHeader, rows } = TEXT_CONTENT.signature;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.5 } }}
      className="absolute inset-0 flex flex-col items-center justify-center gap-8"
      style={{ gap: '32px' }} // Enforce gap-8
    >

      {/* 1. The Glowing Signature ID Pill */}
      {/* Layout: rounded-full, px-6 py-3 (24px x 12px) */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, type: "spring" }}
        className="group relative"
      >
        <div className="absolute inset-0 bg-yellow-400/20 blur-xl rounded-full" />
        <div
          className="relative flex items-center gap-3 bg-[#1e293b] px-6 py-3 rounded-full border border-yellow-400/30 shadow-[0_0_15px_rgba(250,204,21,0.15)] backdrop-blur-sm"
          style={{ padding: '12px 24px', gap: '12px' }} // Enforce px-6 py-3
        >
          <Fingerprint className="text-yellow-400" size={24} />
          <span className="font-mono text-xl font-bold text-yellow-400 tracking-widest drop-shadow-sm">
            {id}
          </span>
        </div>
      </motion.div>

      {/* 2. The Forensic Card */}
      {/* Layout: max-w-[480px], rounded-xl */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, type: "spring" }}
        className="w-full max-w-[480px] bg-[#0f172a] rounded-xl overflow-hidden border border-slate-800 shadow-2xl"
      >

        {/* Card Header */}
        {/* Layout: p-6 (24px padding), Flex Space-Between */}
        <div
          className="flex justify-between items-start p-6 border-b border-slate-800 bg-[#0f172a]"
          style={{ padding: '24px' }} // Enforce p-6
        >
          <div>
            <h3 className="text-sky-400 font-bold tracking-wider flex items-center gap-2 text-sm md:text-base uppercase">
              <span>&gt;_</span> {header}
            </h3>
            <p className="text-slate-500 text-xs italic mt-1 font-mono">{subHeader}</p>
          </div>

          {/* Badge Layout: px-3 py-1.5 (12px x 6px) */}
          <div className="border border-yellow-500/30 rounded px-3 py-1.5 bg-yellow-500/5">
            <span className="text-[10px] font-bold text-yellow-500 tracking-widest leading-tight block text-right whitespace-pre-wrap">
              {status}
            </span>
          </div>
        </div>

        {/* Card Body (Terminal Style) */}
        {/* Layout: p-6 (24px padding), space-y-4 (16px vertical gaps) */}
        <div
          className="p-6 font-mono text-xs md:text-sm space-y-4 bg-[#020617]/50"
          style={{ padding: '24px', gap: '16px' }} // Enforce p-6
        >
          {rows.map((row) => (
            <div key={row.id} className="flex gap-4 items-baseline">
              {/* Fixed width for line number ensures vertical alignment of data */}
              <span className="text-slate-700 select-none w-6 shrink-0">{row.id}</span>

              {/* Render based on row type structure */}
              {row.comment ? (
                <div className="text-slate-500 italic">
                  {row.comment}
                </div>
              ) : (
                <div className="flex flex-wrap gap-x-2">
                  <span className="text-sky-400 font-bold">{row.key}::</span>
                  <span className={`${row.highlight ? 'text-slate-100 font-semibold' : 'text-slate-300'}`}>
                    {row.value}
                  </span>
                  {row.meta && (
                    <span className="text-slate-500">{row.meta}</span>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};