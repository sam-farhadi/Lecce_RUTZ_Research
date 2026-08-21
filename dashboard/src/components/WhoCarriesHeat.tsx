import React from 'react';
import { motion } from 'motion/react';
import { Thermometer, Trees, Users, Compass } from 'lucide-react';

export default function WhoCarriesHeat() {
  // Sequential animation timing
  const itemDelay = 0.15;
  const badgeDelay = 1.2;

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch font-sans text-[#2C3E50]">
      
      {/* LEFT COLUMN: THE PROCESS (35% on desktop -> lg:col-span-4) */}
      <div className="lg:col-span-4 flex flex-col justify-between space-y-4 bg-white/60 backdrop-blur-sm p-5 rounded-lg border border-[#2C3E50]/10 shadow-sm">
        
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-[#2C3E50]/10 pb-2">
            <span className="text-[0.62rem] font-mono tracking-wider text-[#2C3E50]/50 uppercase">
              INDEX GENERATION PIPELINE
            </span>
            <span className="text-[0.55rem] font-mono bg-[#D35400]/10 text-[#D35400] px-1.5 py-0.5 rounded font-bold">
              RUN ONCE
            </span>
          </div>

          {/* Animated Process Container - Vertically flowing, spacious, with zero overlap */}
          <div className="py-5 px-3 bg-white/40 rounded border border-[#2C3E50]/5 flex flex-col items-center justify-start space-y-3 min-h-[380px]">
            
            {/* 3 Input Layers stacked vertically */}
            <div className="w-full flex flex-col items-center space-y-2.5 z-10">
              
              {/* Layer 1: LST */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="flex items-center space-x-3 bg-white p-2 rounded.5 border border-[#2C3E50]/8 shadow-sm w-full max-w-[260px] rounded"
              >
                <div className="p-1.5 rounded bg-[#D35400]/10 text-[#D35400]">
                  <Thermometer size={14} />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-[0.52rem] font-mono tracking-widest text-[#2C3E50]/40 uppercase">INDICATOR 1</span>
                  <span className="text-[0.72rem] font-bold">Land Surface Temp</span>
                </div>
              </motion.div>

              {/* Layer 2: Trees */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 + itemDelay }}
                className="flex items-center space-x-3 bg-white p-2 rounded.5 border border-[#2C3E50]/8 shadow-sm w-full max-w-[260px] rounded"
              >
                <div className="p-1.5 rounded bg-[#4A5D23]/10 text-[#4A5D23]">
                  <Trees size={14} />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-[0.52rem] font-mono tracking-widest text-[#2C3E50]/40 uppercase">INDICATOR 2</span>
                  <span className="text-[0.72rem] font-bold">Tree Cover Density</span>
                </div>
              </motion.div>

              {/* Layer 3: Pop */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 + (itemDelay * 2) }}
                className="flex items-center space-x-3 bg-white p-2 rounded.5 border border-[#2C3E50]/8 shadow-sm w-full max-w-[260px] rounded"
              >
                <div className="p-1.5 rounded bg-[#4A7C9E]/10 text-[#4A7C9E]">
                  <Users size={14} />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-[0.52rem] font-mono tracking-widest text-[#2C3E50]/40 uppercase">INDICATOR 3</span>
                  <span className="text-[0.72rem] font-bold">Population Density</span>
                </div>
              </motion.div>

            </div>

            {/* Downward elegant, thin convergence SVG line */}
            <div className="py-1 flex justify-center items-center h-12 w-full overflow-visible">
              <svg className="w-[120px] h-[40px] overflow-visible" viewBox="0 0 120 40">
                {/* Left diagonal connector */}
                <motion.path
                  d="M 20 0 L 60 20"
                  fill="none"
                  stroke="#2C3E50"
                  strokeWidth="0.75"
                  strokeOpacity="0.25"
                  strokeDasharray="3 3"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.5, delay: 0.1 + (itemDelay * 2) + 0.1 }}
                />
                {/* Right diagonal connector */}
                <motion.path
                  d="M 100 0 L 60 20"
                  fill="none"
                  stroke="#2C3E50"
                  strokeWidth="0.75"
                  strokeOpacity="0.25"
                  strokeDasharray="3 3"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.5, delay: 0.1 + (itemDelay * 2) + 0.1 }}
                />
                {/* Center vertical connector */}
                <motion.path
                  d="M 60 0 L 60 20"
                  fill="none"
                  stroke="#2C3E50"
                  strokeWidth="0.75"
                  strokeOpacity="0.25"
                  strokeDasharray="3 3"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.5, delay: 0.1 + (itemDelay * 2) + 0.1 }}
                />
                {/* Combined downward arrow path */}
                <motion.path
                  d="M 60 20 L 60 36"
                  fill="none"
                  stroke="#D35400"
                  strokeWidth="1.2"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.4, delay: badgeDelay - 0.2 }}
                />
                {/* Arrowhead polygon */}
                <motion.polygon
                  points="57,33 63,33 60,37"
                  fill="#D35400"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2, delay: badgeDelay - 0.05 }}
                />
              </svg>
            </div>

            {/* Convergence Badge & Counts cleanly placed at bottom */}
            <div className="flex flex-col items-center text-center space-y-2.5 w-full">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: badgeDelay }}
                className="bg-[#D35400] text-[#F5F5F0] border border-[#D35400] text-center px-4 py-2 rounded-md shadow flex items-center justify-center space-x-3 w-full max-w-[260px]"
              >
                <div className="flex flex-col items-start leading-none">
                  <span className="text-[0.45rem] font-mono tracking-widest uppercase opacity-80">COMPOSITE</span>
                  <span className="text-base font-sans font-black tracking-wider mt-0.5">HRI</span>
                </div>
                <div className="h-5 w-[1px] bg-white/20" />
                <span className="text-[0.62rem] font-mono tracking-wider font-bold">HEAT RISK INDEX</span>
              </motion.div>

              {/* Counts stacked beneath the badge */}
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: badgeDelay + 0.2 }}
                className="flex items-center justify-center space-x-3 bg-white/50 border border-[#2C3E50]/5 px-3 py-1 rounded-md text-[0.62rem] font-mono w-full max-w-[260px]"
              >
                <span className="font-bold text-[#D35400]">1,784 SECTIONS</span>
                <span className="text-[#2C3E50]/30">•</span>
                <span className="font-bold text-[#2C3E50]/70">9 MUNICIPALITIES</span>
              </motion.div>
            </div>

          </div>
        </div>

        {/* Callout section - Prominent, bordered with high-contrast --heat accent border */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: badgeDelay + 0.4 }}
          className="border-2 border-[#D35400] bg-[#D35400]/5 p-3 rounded-md text-left"
        >
          <div className="flex items-center space-x-1.5 mb-1.5">
            <span className="h-2 w-2 rounded-full bg-[#D35400]" />
            <span className="text-[0.58rem] font-mono uppercase tracking-widest text-[#D35400] font-bold">
              SCALE WARNING
            </span>
          </div>
          <p className="text-[0.72rem] leading-relaxed text-[#2C3E50] font-medium">
            "A different instrument, at a different scale — census sections, not the 8,625-cell fishnet. The two must never be conflated."
          </p>
        </motion.div>

      </div>

      {/* RIGHT COLUMN: HRI COMPOSITE MAP PLACEHOLDER (65% on desktop -> lg:col-span-8) */}
      <div className="lg:col-span-8 bg-white/60 backdrop-blur-sm p-4 rounded-lg border border-[#2C3E50]/10 shadow-sm flex flex-col justify-between min-h-[350px]">
        
        {/* HUD Top bar */}
        <div className="flex justify-between items-center pb-2 border-b border-[#2C3E50]/5 mb-3">
          <div className="flex items-center space-x-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D35400] animate-pulse" />
            <span className="text-[0.6rem] font-mono tracking-widest text-[#2C3E50]/60 uppercase">
              HEAT RISK COMPOSITE (HRI)
            </span>
          </div>
          <div className="text-[0.55rem] font-mono text-[#2C3E50]/50 uppercase flex space-x-3">
            <span>DRAFT FIG 8.1</span>
            <span>·</span>
            <span>10M TREE COVER + DEMOGRAPHICS</span>
          </div>
        </div>

        {/* Large, beautiful dashed map placeholder with coordinate framing */}
        <div className="relative flex-1 w-full rounded border-2 border-dashed border-[#2C3E50]/15 bg-[#2C3E50]/5 overflow-hidden flex flex-col items-center justify-center p-4 min-h-[220px]">
          {/* Faint diagonal hatch pattern */}
          <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(45deg,#2C3E50_25%,transparent_25%,transparent_75%,#2C3E50_75%,#2C3E50),linear-gradient(45deg,#2C3E50_25%,transparent_25%,transparent_75%,#2C3E50_75%,#2C3E50)] bg-[size:20px_20px] bg-[position:0_0,10px_10px]" />
          
          <div className="z-10 flex flex-col items-center text-center space-y-2 max-w-sm">
            <Compass size={24} className="text-[#2C3E50]/30 animate-pulse" style={{ animationDuration: '6s' }} />
            <span className="text-[0.62rem] font-mono font-bold tracking-[0.25em] text-[#2C3E50]/60 uppercase">
              YOUR ARTWORK
            </span>
            <span className="text-xs font-mono text-[#2C3E50]/40 uppercase tracking-wider">
              Heat Risk Index (HRI) Map
            </span>
            <p className="text-[0.65rem] text-[#2C3E50]/50 font-sans italic mt-1 leading-normal">
              Awaiting draft Fig 8.1 export showing composite census sections (Lecce Area)
            </p>
          </div>

          {/* Coordinate frame borders */}
          <div className="absolute top-2 left-3 font-mono text-[0.48rem] text-[#2C3E50]/30">
            40°21'N / 18°10'E
          </div>
          <div className="absolute bottom-2 right-3 font-mono text-[0.48rem] text-[#2C3E50]/30">
            WGS 84 / UTM ZONE 34N
          </div>
        </div>

        {/* Subtitle / Source info */}
        <div className="text-[0.52rem] font-sans text-[#2C3E50]/50 italic text-center mt-2.5">
          Reference Geography: Lecce, Cavallino, Lizzanello, Lequile, Monteroni di Lecce, San Cesario di Lecce, Surbo, Trepuzzi, Novoli
        </div>

      </div>

    </div>
  );
}

