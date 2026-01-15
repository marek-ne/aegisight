import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, FileCheck, Settings, Bell, ShieldCheck, Scale } from 'lucide-react';
import { TEXT_CONTENT } from '../../config';

// --- Assets & Sub-components ---

const IsometricGrid = () => (
  <div className="absolute inset-0 z-0 opacity-20 pointer-events-none"
    style={{
      backgroundImage: `linear-gradient(30deg, #1e293b 1px, transparent 1px), 
                        linear-gradient(150deg, #1e293b 1px, transparent 1px)`,
      backgroundSize: '40px 40px',
      transform: 'scale(1.5)'
    }}
  />
);

const IntegrationNode = ({ x, y, icon: Icon, label, status, delay }: any) => (
  <motion.div
    className="absolute z-20 flex flex-col items-center"
    style={{ left: x, top: y }}
    initial={{ opacity: 0, scale: 0.5 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay: delay, duration: 0.5, type: "spring" }}
  >
    <div className="relative group">
      <div className="absolute inset-0 bg-amber-500/20 blur-lg rounded-full animate-pulse" />
      <div className="relative w-12 h-12 bg-slate-900 border border-amber-500/50 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(245,158,11,0.2)]">
        <Icon size={20} className="text-amber-400" />
      </div>
      <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border border-black" />
    </div>
    <div className="mt-2 bg-black/80 backdrop-blur px-2 py-1 rounded border border-slate-800 text-center">
      <div className="text-[9px] font-bold text-slate-300 tracking-wider">{label}</div>
      <div className="text-[7px] font-mono text-green-400">{status}</div>
    </div>
  </motion.div>
);

// --- Main Component ---

export const OutputVisual: React.FC = () => {
  const { labels, integrations } = TEXT_CONTENT.output;

  return (
    <div className="w-full h-full flex items-center justify-center bg-[#050505] overflow-hidden relative perspective-1000">
      <IsometricGrid />

      {/* Integration Nodes (External Tools) */}
      {/* Top Left: Compliance (Shield) */}
      <IntegrationNode
        x="15%" y="20%"
        icon={ShieldCheck}
        label={integrations[0].label}
        status={integrations[0].status}
        delay={2.5}
      />
      {/* Top Right: Workflow (Gear) */}
      <IntegrationNode
        x="75%" y="25%"
        icon={Settings}
        label={integrations[1].label}
        status={integrations[1].status}
        delay={3.0}
      />
      {/* Bottom Right: Governance (Scale) */}
      <IntegrationNode
        x="80%" y="70%"
        icon={Scale}
        label={integrations[2].label}
        status={integrations[2].status}
        delay={3.5}
      />

      {/* SVG Stage - Reusing 800x600 coordinate space for consistency */}
      <svg viewBox="0 0 800 600" className="relative z-10 w-full h-full max-w-[800px] overflow-visible">
        <defs>
          <linearGradient id="tabletGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1e293b" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>
          <linearGradient id="holoGradient" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#f59e0b" stopOpacity="0" />
            <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.4" />
          </linearGradient>
          <filter id="glow-gold">
            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
            <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* --- CENTER: THE TABLET --- */}
        <g transform="translate(400, 320)">

          {/* Tablet Base Shadow */}
          <path d="M -160 80 L 0 160 L 160 80 L 0 0 Z" fill="#000" opacity="0.5" filter="blur(10px)" />

          {/* Tablet Body (Isometric Rectangle) */}
          <motion.path
            d="M -150 75 L 0 150 L 150 75 L 0 0 Z"
            fill="url(#tabletGradient)"
            stroke="#334155"
            strokeWidth="2"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, ease: "backOut" }}
          />
          {/* Tablet Thickness */}
          <motion.path
            d="M -150 75 L 0 150 L 0 160 L -150 85 Z"
            fill="#0f172a"
            stroke="#1e293b"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, ease: "backOut" }}
          />
          <motion.path
            d="M 150 75 L 0 150 L 0 160 L 150 85 Z"
            fill="#0f172a"
            stroke="#1e293b"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, ease: "backOut" }}
          />

          {/* Screen Content (Glowing Surface) */}
          <motion.path
            d="M -140 75 L 0 145 L 140 75 L 0 5 Z"
            fill="#0f172a"
            stroke="#f59e0b"
            strokeWidth="1"
            strokeOpacity="0.3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          />

          {/* --- HOLOGRAPHIC PROJECTIONS --- */}

          {/* Hologram Base Grid */}
          <motion.g
            initial={{ opacity: 0, translateY: 10 }}
            animate={{ opacity: 1, translateY: -40 }}
            transition={{ delay: 1.2, duration: 1 }}
          >
            {/* Bar Chart Bars */}
            <motion.path d="M -80 60 L -60 70 V 20 L -80 10 Z" fill="url(#holoGradient)" stroke="#f59e0b" strokeWidth="1"
              initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ delay: 1.5, duration: 0.5 }} />
            <motion.path d="M -50 75 L -30 85 V 35 L -50 25 Z" fill="url(#holoGradient)" stroke="#f59e0b" strokeWidth="1"
              initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ delay: 1.7, duration: 0.5 }} />
            <motion.path d="M -20 90 L 0 100 V 10 L -20 0 Z" fill="url(#holoGradient)" stroke="#f59e0b" strokeWidth="1"
              initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ delay: 1.9, duration: 0.5 }} />

            {/* Floating Pie Chart Ring */}
            <motion.ellipse
              cx="80" cy="50" rx="30" ry="15"
              fill="none" stroke="#22d3ee" strokeWidth="2"
              strokeDasharray="4 4"
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            />
            <motion.ellipse
              cx="80" cy="50" rx="15" ry="7"
              fill="#22d3ee" opacity="0.3"
            />

            {/* Connection Lines to External Nodes */}

            {/* To Left Node (Audit Log) */}
            <motion.path
              d="M -100 50 C -150 0 -200 -50 -250 -100"
              fill="none" stroke="#f59e0b" strokeWidth="2" strokeDasharray="5 5"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1, strokeDashoffset: -20 }}
              transition={{ duration: 1.5, delay: 2.2 }}
            />
            {/* To Right Node (Operations) */}
            <motion.path
              d="M 100 50 C 150 0 200 -50 250 -100"
              fill="none" stroke="#22d3ee" strokeWidth="2" strokeDasharray="5 5"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1, strokeDashoffset: -20 }}
              transition={{ duration: 1.5, delay: 2.7 }}
            />
            {/* To Bottom Node (Command Center) */}
            <motion.path
              d="M 50 100 C 150 150 200 200 280 250"
              fill="none" stroke="#10b981" strokeWidth="2" strokeDasharray="5 5"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1, strokeDashoffset: -20 }}
              transition={{ duration: 1.5, delay: 3.2 }}
            />

          </motion.g>
        </g>

        {/* Floating Success Indicator near tablet */}
        <foreignObject x="350" y="200" width="100" height="50">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2 }}
            className="flex items-center gap-2"
          >
            <CheckCircle2 size={16} className="text-green-500" />
            <span className="text-[10px] text-green-400 font-mono tracking-widest bg-green-900/30 px-2 py-1 rounded border border-green-500/30">
              ACTIONABLE
            </span>
          </motion.div>
        </foreignObject>

        {/* Labels */}
        <g transform="translate(400, 300)">
          <text x="-120" y="-30" fill="#f59e0b" fontSize="10" fontFamily="monospace" opacity="0.8">{labels.chart1}</text>
          <text x="50" y="-20" fill="#22d3ee" fontSize="10" fontFamily="monospace" opacity="0.8">{labels.chart2}</text>
        </g>

      </svg>

      {/* Bottom Label */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <div className="text-[10px] text-slate-500 font-mono uppercase tracking-[0.2em] mb-1">
          {labels.tablet}
        </div>
        <div className="h-[1px] w-24 bg-gradient-to-r from-transparent via-amber-500/50 to-transparent mx-auto" />
      </motion.div>

    </div>
  );
};