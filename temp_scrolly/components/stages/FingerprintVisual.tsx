import React from 'react';
import { motion } from 'framer-motion';
import { Fingerprint } from 'lucide-react';
import { TEXT_CONTENT } from '../../config';

export const FingerprintVisual: React.FC = () => {
  const { floatLabel1, floatLabel2, bottomLabel } = TEXT_CONTENT.fingerprint;

  // Geometry: 200x200 SVG.
  // Node 1 (Top): cx=100 (50%), cy=50 (25%)
  // Node 2 (BL):  cx=40 (20%),  cy=150 (75%)
  // Node 3 (BR):  cx=160 (80%), cy=150 (75%)

  const nodes = [
    {
      id: 1,
      start: { cx: 40, cy: 180, fill: "#64748b" },
      end: { cx: 100, cy: 50, fill: "#22d3ee" },
      label: floatLabel1,
      // Node 1 (Top): Closer to vertex (y=25%), slightly up/left
      labelPos: { top: "18%", left: "45%", x: "-50%" }
    },
    {
      id: 2,
      start: { cx: 20, cy: 40, fill: "#475569" },
      end: { cx: 40, cy: 150, fill: "#22d3ee" },
      label: floatLabel2,
      // Node 2 (Left): Below vertex (y=75%)
      labelPos: { top: "80%", left: "12%", x: "0%" }
    },
    {
      id: 3,
      start: { cx: 180, cy: 100, fill: "#94a3b8" },
      end: { cx: 160, cy: 150, fill: "#22d3ee" },
      label: bottomLabel,
      // Node 3 (Right): Above vertex (y=75%), right aligned
      labelPos: { top: "58%", left: "70%", x: "0%" }
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, filter: "blur(10px)", transition: { duration: 0.5 } }}
      className="absolute inset-0 flex items-center justify-center bg-black"
    >
      {/* 1. The Format Tensor (Background Grid Mesh) */}
      <div className="absolute inset-0 flex items-center justify-center opacity-30">
        <motion.div
          animate={{ rotateX: 60, rotateZ: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="w-64 h-64 rounded-full border border-dashed border-slate-700"
        />
        <motion.div
          animate={{ rotateX: 60, rotateZ: -360 }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          className="absolute w-48 h-48 rounded-full border border-dotted border-slate-600"
        />
        <motion.div
          animate={{ rotateX: 60, rotateZ: 180 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute w-80 h-80 rounded-full border border-slate-800 opacity-50"
        />
      </div>

      {/* 2. The Synthesis Layer (SVG) */}
      <svg viewBox="0 0 200 200" className="relative z-10 w-full h-full max-w-[400px] max-h-[400px]">
        <defs>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <radialGradient id="grad1" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
            <stop offset="0%" style={{ stopColor: "#22d3ee", stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: "#000000", stopOpacity: 0 }} />
          </radialGradient>
        </defs>

        {/* Connecting Lines (The Vector Mesh) */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.5, 1] }}
          transition={{ duration: 2, delay: 1 }}
        >
          <motion.line x1="100" y1="50" x2="40" y2="150" stroke="#22d3ee" strokeWidth="1" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1, delay: 1.2 }} />
          <motion.line x1="100" y1="50" x2="160" y2="150" stroke="#22d3ee" strokeWidth="1" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1, delay: 1.2 }} />
          <motion.line x1="40" y1="150" x2="160" y2="150" stroke="#22d3ee" strokeWidth="1" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1, delay: 1.2 }} />
          <motion.line x1="100" y1="50" x2="100" y2="130" stroke="#22d3ee" strokeWidth="0.5" strokeDasharray="2 2" initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} transition={{ duration: 1, delay: 1.8 }} />
          <motion.line x1="40" y1="150" x2="100" y2="130" stroke="#22d3ee" strokeWidth="0.5" strokeDasharray="2 2" initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} transition={{ duration: 1, delay: 1.8 }} />
          <motion.line x1="160" y1="150" x2="100" y2="130" stroke="#22d3ee" strokeWidth="0.5" strokeDasharray="2 2" initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} transition={{ duration: 1, delay: 1.8 }} />
        </motion.g>

        {/* Central Core */}
        <motion.circle cx="100" cy="117" r="25" fill="url(#grad1)" opacity="0" animate={{ opacity: [0, 0.3, 0.1] }} transition={{ delay: 2, duration: 3, repeat: Infinity, repeatType: "reverse" }} />

        {/* Fingerprint Icon - Centered at (100, 117) */}
        <foreignObject x="80" y="97" width="40" height="40">
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, delay: 1.2, ease: "easeOut" }}
            className="w-full h-full flex items-center justify-center"
          >
            <motion.div
              animate={{ opacity: [0.6, 1, 0.6], scale: [0.95, 1.05, 0.95] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 2.7 }}
              className="flex items-center justify-center"
            >
              <Fingerprint size={28} className="text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]" />
            </motion.div>
          </motion.div>
        </foreignObject>

        {/* Nodes */}
        {nodes.map((node) => (
          <motion.circle
            key={node.id}
            initial={{ cx: node.start.cx, cy: node.start.cy, fill: node.start.fill, r: 6 }}
            animate={{ cx: node.end.cx, cy: node.end.cy, fill: node.end.fill, r: 4 }}
            transition={{ duration: 2, ease: "easeInOut", delay: node.id * 0.1 }}
            filter="url(#glow)"
          />
        ))}

      </svg>

      {/* 3. Floating Labels (Lines Removed) */}
      {nodes.map((node) => (
        <motion.div
          key={`label-${node.id}`}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 2 + (node.id * 0.2), duration: 0.5 }}
          className="absolute z-20"
          style={{
            top: node.labelPos.top,
            left: node.labelPos.left,
            transform: `translateX(${node.labelPos.x})`
          }}
        >
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse shadow-[0_0_10px_#22d3ee]" />
            <span className="text-[10px] text-cyan-400 font-mono tracking-wider bg-black/80 px-1 border border-cyan-900/50 rounded whitespace-nowrap">
              {node.label}
            </span>
          </div>
          {/* NO CONNECTING LINES */}
        </motion.div>
      ))}

    </motion.div>
  );
};