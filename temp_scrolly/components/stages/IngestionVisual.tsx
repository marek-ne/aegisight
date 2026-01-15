import React from 'react';
import { motion } from 'framer-motion';
import { Cloud, Database, Server, Layers } from 'lucide-react';

// --- Assets & Sub-components ---

// Isometric Background Grid
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

const FloatingLabel = ({ text, x, y, color = "text-slate-400", delay = 0 }: { text: string, x: string, y: string, color?: string, delay?: number }) => (
  <motion.div
    className={`absolute z-20 px-2 py-1 bg-black/80 border border-slate-800 backdrop-blur-md rounded text-[9px] font-mono tracking-widest uppercase ${color} shadow-lg`}
    style={{ left: x, top: y, padding: '4px 8px' }} // HARDENED
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: delay, duration: 0.8 }}
  >
    {text}
  </motion.div>
);

// --- Main Visual Component ---

export const IngestionVisual: React.FC = () => {
  return (
    <div className="w-full h-full flex items-center justify-center bg-[#050505] overflow-hidden relative perspective-1000">
      <IsometricGrid />

      {/* Main SVG Stage - ViewBox calibrated for Isometric Flow (Left/Top to Right/Bottom) */}
      <svg viewBox="0 0 800 600" className="relative z-10 w-full h-full max-w-[800px] overflow-visible">

        <defs>
          {/* Gradients for streams */}
          <linearGradient id="chaosGradient1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f97316" stopOpacity="0" />
            <stop offset="50%" stopColor="#f97316" stopOpacity="1" />
            <stop offset="100%" stopColor="#f97316" stopOpacity="0.5" />
          </linearGradient>
          <linearGradient id="chaosGradient2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ef4444" stopOpacity="0" />
            <stop offset="50%" stopColor="#ef4444" stopOpacity="1" />
            <stop offset="100%" stopColor="#ef4444" stopOpacity="0.5" />
          </linearGradient>
          <linearGradient id="chaosGradient3" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#a855f7" stopOpacity="0" />
            <stop offset="50%" stopColor="#a855f7" stopOpacity="1" />
            <stop offset="100%" stopColor="#a855f7" stopOpacity="0.5" />
          </linearGradient>

          {/* Clean Stream Gradient */}
          <linearGradient id="cleanGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.2" />
          </linearGradient>

          {/* Glow Filters */}
          <filter id="glow-warm">
            <feGaussianBlur stdDeviation="3.5" result="coloredBlur" />
            <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="glow-core">
            <feGaussianBlur stdDeviation="6" result="coloredBlur" />
            <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* --- CENTER SECTION: AEGISIGHT CORE (SOFTWARE ENGINE) --- */}
        {/* Appears First - Positioned explicitly at center (400, 300) */}

        <g transform="translate(400, 300)">
          <motion.g
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1.4 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          >
            {/* Engine Aura - Scaled Up (r=90) */}
            <motion.circle r="90" fill="rgba(6,182,212,0.05)" filter="url(#glow-core)"
              animate={{ r: [80, 90, 80], opacity: [0.5, 0.8, 0.5] }}
              transition={{ duration: 3, repeat: Infinity }}
            />

            {/* Central Logo - Constructed SVG */}
            <motion.g
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 1 }}
            >
              <g transform="scale(0.8)">
                {/* Outer Shield */}
                <path
                  d="M -45 -40 H 45 L 45 -10 C 45 35 0 65 0 65 C 0 65 -45 35 -45 -10 Z"
                  fill="#0f172a"
                  stroke="#22d3ee"
                  strokeWidth="2"
                  filter="url(#glow-core)"
                />

                {/* Inner Shield/Circuit Details */}
                <path d="M -35 -30 L -25 -30 L -20 -15" stroke="#22d3ee" strokeWidth="1" fill="none" opacity="0.5" />
                <path d="M 35 -30 L 25 -30 L 20 -15" stroke="#22d3ee" strokeWidth="1" fill="none" opacity="0.5" />
                <circle cx="-35" cy="-30" r="2" fill="#22d3ee" />
                <circle cx="35" cy="-30" r="2" fill="#22d3ee" />

                {/* The 'A' Shape (Stylized Apex) */}
                <path
                  d="M 0 -25 L 22 20 H 14 L 0 -10 L -14 20 H -22 Z"
                  fill="#cbd5e1"
                />

                {/* The Eye */}
                <g transform="translate(0, 5)">
                  {/* Sclera */}
                  <path d="M -28 0 Q 0 -20 28 0 Q 0 20 -28 0 Z" fill="#020617" stroke="#22d3ee" strokeWidth="2" />
                  {/* Iris */}
                  <circle r="10" fill="#06b6d4" />
                  {/* Pupil */}
                  <circle r="5" fill="#e0f2fe" />
                  {/* Glint */}
                  <circle cx="3" cy="-3" r="2" fill="white" opacity="0.8" />
                </g>

                {/* Tech Accents - Radiating lines */}
                <line x1="0" y1="-40" x2="0" y2="-30" stroke="#22d3ee" strokeWidth="1" opacity="0.5" />
                <line x1="0" y1="65" x2="0" y2="50" stroke="#22d3ee" strokeWidth="1" opacity="0.5" />
              </g>
            </motion.g>

            {/* Geometric Construct (Wireframe Hex Cluster - Isometric Cube feel) - Scaled Up 1.75x */}
            <motion.g animate={{ rotateY: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }}>
              {/* Outer Hex: Radius ~70 */}
              <path d="M 0 -70 L 60 -35 L 60 35 L 0 70 L -60 35 L -60 -35 Z" fill="none" stroke="#22d3ee" strokeWidth="1" strokeOpacity="0.4" />

              {/* Inner Hex: Radius ~50 */}
              <path d="M 0 -50 L 43 -25 L 43 25 L 0 50 L -43 25 L -43 -25 Z" fill="none" stroke="#22d3ee" strokeWidth="2" />

              {/* Inner connecting filaments */}
              <motion.line x1="0" y1="-50" x2="0" y2="50" stroke="#22d3ee" strokeWidth="1" opacity="0.5" />
              <motion.line x1="-43" y1="-25" x2="43" y2="25" stroke="#22d3ee" strokeWidth="1" opacity="0.5" />
              <motion.line x1="-43" y1="25" x2="43" y2="-25" stroke="#22d3ee" strokeWidth="1" opacity="0.5" />
            </motion.g>

            {/* Abstract Code Snippets Floating - Moved out slightly */}
            <foreignObject x="-75" y="-75" width="150" height="150" className="overflow-visible pointer-events-none">
              <motion.div
                className="w-full h-full flex items-center justify-center"
                animate={{ rotate: -360 }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              >
                <div className="absolute top-0 text-[8px] text-cyan-400 font-mono opacity-70">010110</div>
                <div className="absolute bottom-0 text-[8px] text-cyan-400 font-mono opacity-70">110010</div>
                <div className="absolute left-0 text-[8px] text-cyan-400 font-mono opacity-70 rotate-90">REFLECT</div>
                <div className="absolute right-0 text-[8px] text-cyan-400 font-mono opacity-70 -rotate-90">SYNC</div>
              </motion.div>
            </foreignObject>

            {/* Processing Particles (Chaos colors turning Blue) - Adjusted orbits */}
            <circle r="4" fill="#f97316" cx="-30" cy="-15">
              <animate attributeName="fill" values="#f97316;#22d3ee;#22d3ee" dur="2s" repeatCount="indefinite" />
              <animate attributeName="cx" values="-60;0;60" dur="2s" repeatCount="indefinite" />
            </circle>
            <circle r="4" fill="#ef4444" cx="-30" cy="15">
              <animate attributeName="fill" values="#ef4444;#22d3ee;#22d3ee" dur="2.5s" repeatCount="indefinite" />
              <animate attributeName="cx" values="-60;0;60" dur="2.5s" repeatCount="indefinite" />
            </circle>
          </motion.g>
        </g>

        {/* --- LEFT SECTION: DISPARATE DATA SILOS --- */}
        {/* Appears Second: Icons fade in around 1.5s */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
        >
          {/* Silo 1: Cloud (Orange) */}
          <g transform="translate(100, 150)">
            <text x="-30" y="5" textAnchor="end" fill="#f97316" fontSize="10" fontFamily="monospace" className="font-bold tracking-widest opacity-80">CLOUD</text>
            <foreignObject x="-20" y="-20" width="40" height="40">
              <div className="flex items-center justify-center w-full h-full bg-[#1c1917] border border-orange-500/50 rounded-lg shadow-[0_0_15px_rgba(249,115,22,0.3)]">
                <Cloud size={20} className="text-orange-500" />
              </div>
            </foreignObject>
          </g>

          {/* Silo 2: Database (Red) */}
          <g transform="translate(60, 250)">
            <text x="-30" y="5" textAnchor="end" fill="#ef4444" fontSize="10" fontFamily="monospace" className="font-bold tracking-widest opacity-80">DB</text>
            <foreignObject x="-20" y="-20" width="40" height="40">
              <div className="flex items-center justify-center w-full h-full bg-[#1c1917] border border-red-500/50 rounded-lg shadow-[0_0_15px_rgba(239,68,68,0.3)]">
                <Database size={20} className="text-red-500" />
              </div>
            </foreignObject>
          </g>

          {/* Silo 3: Server Rack (Purple) */}
          <g transform="translate(120, 380)">
            <text x="-30" y="5" textAnchor="end" fill="#a855f7" fontSize="10" fontFamily="monospace" className="font-bold tracking-widest opacity-80">LEGACY</text>
            <foreignObject x="-20" y="-20" width="40" height="40">
              <div className="flex items-center justify-center w-full h-full bg-[#1c1917] border border-purple-500/50 rounded-lg shadow-[0_0_15px_rgba(168,85,247,0.3)]">
                <Server size={20} className="text-purple-500" />
              </div>
            </foreignObject>
          </g>
        </motion.g>

        {/* --- CHAOTIC STREAMS --- */}
        {/* Appears Third: Streams draw in slowly (2s duration) starting at 2.0s */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.0, duration: 0.5 }}
        >
          {/* Stream 1 Path (Jagged) - Adjusted End Point for Larger Core */}
          <motion.path
            d="M 120 170 L 180 160 L 220 200 L 280 250 L 330 280"
            fill="none"
            stroke="url(#chaosGradient1)"
            strokeWidth="2"
            strokeDasharray="5 5"
            filter="url(#glow-warm)"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1, strokeDashoffset: [0, -100] }}
            transition={{
              pathLength: { duration: 2.0, ease: "easeInOut" },
              strokeDashoffset: { duration: 1, repeat: Infinity, ease: "linear" }
            }}
          />
          {/* Stream 2 Path (Looping/Messy) */}
          <motion.path
            d="M 80 270 Q 150 350 200 300 T 330 300"
            fill="none"
            stroke="url(#chaosGradient2)"
            strokeWidth="2"
            filter="url(#glow-warm)"
            initial={{ pathLength: 0 }}
            animate={{
              pathLength: 1,
              d: ["M 80 270 Q 150 350 200 300 T 330 300", "M 80 270 Q 150 250 200 320 T 330 300"]
            }}
            transition={{
              pathLength: { duration: 2.0, ease: "easeInOut" },
              d: { duration: 2, repeat: Infinity, repeatType: "mirror" }
            }}
          />
          {/* Stream 3 Path (Sharp Angles) */}
          <motion.path
            d="M 140 380 L 200 380 L 220 330 L 300 330 L 340 320"
            fill="none"
            stroke="url(#chaosGradient3)"
            strokeWidth="2"
            filter="url(#glow-warm)"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2.0, ease: "easeInOut" }}
          />

          {/* Particles (Wait for streams to be mostly drawn) */}
          <motion.g
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3.5 }}
          >
            {/* Chaotic Particles 1 */}
            {[...Array(3)].map((_, i) => (
              <motion.circle
                key={`p1-${i}`} r="3" fill="#fdba74"
                initial={{ offsetDistance: "0%" }}
                animate={{ offsetDistance: "100%" }}
                style={{ offsetPath: "path('M 120 170 L 180 160 L 220 200 L 280 250 L 330 280')" }}
                transition={{ duration: 1.5 + Math.random(), delay: i * 0.5, repeat: Infinity, ease: "easeInOut" }}
              />
            ))}
            {/* Chaotic Particles 2 */}
            {[...Array(3)].map((_, i) => (
              <motion.rect
                key={`p2-${i}`} width="6" height="6" fill="#fca5a5"
                initial={{ offsetDistance: "0%", rotate: 0 }}
                animate={{ offsetDistance: "100%", rotate: 360 }}
                style={{ offsetPath: "path('M 80 270 Q 150 350 200 300 T 330 300')" }}
                transition={{ duration: 2, delay: i * 0.8, repeat: Infinity, ease: "linear" }}
              />
            ))}
            {/* Chaotic Particles 3 */}
            {[...Array(4)].map((_, i) => (
              <motion.path
                d="M 0 0 L 8 4 L 0 8 Z" fill="#d8b4fe"
                key={`p3-${i}`}
                initial={{ offsetDistance: "0%" }}
                animate={{ offsetDistance: "100%" }}
                style={{ offsetPath: "path('M 140 380 L 200 380 L 220 330 L 300 330 L 340 320')" }}
                transition={{ duration: 1.8, delay: i * 0.4, repeat: Infinity, ease: "circIn" }}
              />
            ))}
          </motion.g>
        </motion.g>

        {/* --- RIGHT SECTION: SYNCHRONIZED DATA PIPELINE --- */}
        {/* Appears Last: Fades in after core processes */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3.5, duration: 1.0 }}
        >
          {/* The Highway (Isometric Perspective) - Adjusted Start Point for Larger Core */}
          <path d="M 460 300 L 750 420 L 780 480 L 460 340 Z" fill="url(#cleanGradient)" opacity="0.3" />

          {/* Pipeline Rails */}
          <line x1="460" y1="300" x2="750" y2="420" stroke="#22d3ee" strokeWidth="1" />
          <line x1="460" y1="340" x2="780" y2="480" stroke="#22d3ee" strokeWidth="1" />

          {/* Lockstep Data Packets */}
          {[...Array(6)].map((_, i) => (
            <g key={`out-${i}`}>
              <motion.rect
                width="20" height="12" rx="2"
                fill="#06b6d4" stroke="#cffafe" strokeWidth="1"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: [0, 1, 1, 0],
                  x: [460, 750],
                  y: [310, 440]
                }}
                transition={{
                  duration: 2.5,
                  delay: i * 0.4,
                  repeat: Infinity,
                  ease: "linear"
                }}
                style={{
                  transformBox: "fill-box",
                  transformOrigin: "center",
                  filter: "drop-shadow(0 0 5px #22d3ee)"
                }}
              />
              <motion.rect
                width="20" height="12" rx="2"
                fill="#000" opacity="0.5"
                animate={{
                  opacity: [0, 0.3, 0.3, 0],
                  x: [460, 750],
                  y: [320, 450]
                }}
                transition={{ duration: 2.5, delay: i * 0.4, repeat: Infinity, ease: "linear" }}
              />
            </g>
          ))}
        </motion.g>

      </svg>

      {/* --- LABELS --- */}

      {/* Input Label (Appears with streams) */}
      <FloatingLabel text="Disparate Data Streams" x="5%" y="15%" color="text-red-300" delay={2.5} />

      {/* Core Label (Appears with core) */}
      <motion.div
        className="absolute left-1/2 top-[20%] flex flex-col items-start z-30 pointer-events-none"
        // HARDENED: left-1/2, items-start, NO translate-x-50
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.5 }}
      >
        <motion.div
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }} // Ensure inner wrapper also aligns left
        >
          <div
            className="px-3 py-1.5 bg-[#06b6d4]/10 border border-cyan-500/50 backdrop-blur-md rounded-lg shadow-[0_0_15px_rgba(6,182,212,0.2)]"
            style={{ padding: '6px 14px', display: 'flex', flexDirection: 'column', alignItems: 'center' }} // HARDENED (+Flex Col for Content)
          >
            {/* HARDENED: PURE FLEX CENTERING */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Layers size={14} />
              <span
                className="text-[10px] font-bold text-cyan-300 font-mono tracking-widest uppercase leading-none"
              >
                AEGISIGHT AI CORE
              </span>
            </div>

            <div className="h-[1px] w-full bg-cyan-500/30 my-0.5" />
            <span className="text-[8px] text-cyan-400/80 font-mono uppercase block text-center">(Software Engine)</span>
          </div>
          {/* Connecting line to core - Adjusted length for larger core */}
          {/* Added ml-2 to offset it slightly closer to text start */}
          <div className="w-[1px] h-4 bg-gradient-to-b from-cyan-500/50 to-transparent ml-2" />
        </motion.div>
      </motion.div>

      {/* Output Label (Appears last) */}
      <FloatingLabel text="Synchronized Data Pipeline" x="65%" y="80%" color="text-cyan-300" delay={4.0} />

    </div>
  );
};