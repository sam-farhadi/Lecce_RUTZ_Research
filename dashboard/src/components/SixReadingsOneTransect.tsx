/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as React from 'react';
import { motion } from 'motion/react';
import { Layers, MapPin, Grid, GitCommit, Flame, Compass } from 'lucide-react';

export function SixReadingsOneTransect() {
  const bands = [
    { id: 1, title: 'Existing Situation', icon: Layers, ref: '01_STRUCTURAL_BASE' },
    { id: 2, title: 'POI Identification', icon: MapPin, ref: '02_POINTS_OF_INTEREST' },
    { id: 3, title: 'Point, Line & Surfaces Processing', icon: Grid, ref: '03_SPATIAL_INTERPOLATION' },
    { id: 4, title: 'Structure', icon: GitCommit, ref: '04_THERMAL_SKELETON' },
    { id: 5, title: 'Heat Risk Gradient', icon: Flame, ref: '05_THERMODYNAMIC_SCORE' },
    { id: 6, title: 'Globe Eye View', icon: Compass, ref: '06_PLANETARY_PROJECTION' },
  ];

  const legendItems = [
    { label: 'Bare Karst Surface', color: '#B0A99F' },
    { label: 'Inactive Agricultural', color: '#E0DBCE' },
    { label: 'Active Agricultural', color: '#4A7C9E' },
    { label: 'Active Canopy', color: '#4A5D23' },
  ];

  return (
    <div className="w-full flex flex-col justify-start" id="six-readings-container">
      {/* WRAPPER CARD - DOMINANT DESIGN ELEMENT */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full bg-white/60 backdrop-blur-sm rounded border border-[#2C3E50]/10 overflow-hidden flex flex-col p-4 md:p-5 relative shadow-sm min-h-[440px]"
      >
        {/* HUD Top Bar */}
        <div className="flex justify-between items-center pb-2 border-b border-[#2C3E50]/5 mb-4 select-none">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-[#D35400] animate-pulse" />
            <span className="text-[0.6rem] font-mono tracking-widest text-[#2C3E50]/60 uppercase">
              TRANSECT DECONSTRUCTION // SIX READINGS
            </span>
          </div>

          {/* Compact Corner Legend */}
          <div className="hidden sm:flex items-center space-x-3 text-[0.55rem] font-mono">
            {legendItems.map((item, idx) => (
              <div key={idx} className="flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-sm border border-[#2C3E50]/10" style={{ backgroundColor: item.color }} />
                <span className="text-[#2C3E50]/60">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Dense Stack of Bands */}
        <div className="flex-1 flex flex-col justify-between space-y-1.5">
          {bands.map((band, idx) => {
            const BandIcon = band.icon;
            return (
              <motion.div
                key={band.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1, ease: "easeOut" }}
                className="grid grid-cols-12 gap-3 items-center group"
              >
                {/* Title and reference ID (Left column, aligned) */}
                <div className="col-span-12 sm:col-span-4 flex items-center justify-between sm:justify-start space-x-2 select-none">
                  <div className="flex items-center space-x-2 text-left">
                    <BandIcon size={12} className="text-[#2C3E50]/40 group-hover:text-[#D35400] transition-colors" />
                    <span className="text-[0.65rem] md:text-[0.72rem] font-sans font-bold text-[#2C3E50] tracking-wide uppercase">
                      {band.title}
                    </span>
                  </div>
                  <span className="font-mono text-[0.48rem] text-[#2C3E50]/30 tracking-widest hidden md:inline ml-auto">
                    {band.ref}
                  </span>
                </div>

                {/* Wide Strip Placeholder (Right column) */}
                <div className="col-span-12 sm:col-span-8">
                  <div 
                    className="w-full h-8 sm:h-9 rounded border border-dashed border-[#2C3E50]/15 hover:border-[#D35400]/40 bg-[#F5F5F0]/40 group-hover:bg-[#F5F5F0]/70 transition-all duration-300 relative overflow-hidden flex items-center justify-between px-4"
                    style={{
                      backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 4px, rgba(44, 62, 80, 0.02) 4px, rgba(44, 62, 80, 0.02) 8px)'
                    }}
                  >
                    {/* Tick marks on left and right to emulate a measuring grid */}
                    <div className="absolute left-0 top-0 bottom-0 w-1 border-r border-[#2C3E50]/10 flex flex-col justify-between py-1">
                      <span className="w-full h-[1px] bg-[#2C3E50]/20" />
                      <span className="w-2/3 h-[1px] bg-[#2C3E50]/20" />
                      <span className="w-full h-[1px] bg-[#2C3E50]/20" />
                    </div>

                    <div className="absolute right-0 top-0 bottom-0 w-1 border-l border-[#2C3E50]/10 flex flex-col justify-between py-1">
                      <span className="w-full h-[1px] bg-[#2C3E50]/20" />
                      <span className="w-2/3 h-[1px] bg-[#2C3E50]/20" />
                      <span className="w-full h-[1px] bg-[#2C3E50]/20" />
                    </div>

                    {/* Left-aligned aesthetic tick label */}
                    <span className="text-[0.5rem] font-mono text-[#2C3E50]/25 tracking-widest select-none">
                      TR-C0{band.id} // SEC_A
                    </span>

                    {/* Centered clean artwork label */}
                    <div className="flex items-center space-x-2 opacity-35 group-hover:opacity-70 transition-opacity">
                      <span className="text-[0.52rem] font-mono uppercase tracking-wider text-[#2C3E50]">
                        artwork slot // pending file upload
                      </span>
                    </div>

                    {/* Right-aligned aesthetic coordinate */}
                    <span className="text-[0.48rem] font-mono text-[#2C3E50]/20 tracking-wider hidden sm:inline select-none">
                      L.200m × W.4000m [WGS84]
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}

          {/* AXIS LABELS - Bottom corners framing the gradient */}
          <div className="grid grid-cols-12 gap-3 pt-3 select-none">
            <div className="hidden sm:block col-span-4" />
            <div className="col-span-12 sm:col-span-8 flex justify-between text-[0.6rem] font-mono text-[#2C3E50]/50 tracking-wider uppercase font-semibold">
              <span className="flex items-center space-x-1.5">
                <span>◀</span>
                <span>Agricultural Matrix</span>
              </span>
              <span className="flex items-center space-x-1.5">
                <span>Historic Core</span>
                <span>▶</span>
              </span>
            </div>
          </div>

          {/* ANIMATED GRADIENT BAR PLACEHOLDER */}
          <motion.div
            initial={{ opacity: 0, scaleY: 0.5 }}
            animate={{ opacity: 1, scaleY: 1 }}
            transition={{ duration: 1.0, delay: 0.8, ease: "easeOut" }}
            className="grid grid-cols-12 gap-3 items-center pt-1"
          >
            <div className="col-span-12 sm:col-span-4 flex items-center select-none">
              <span className="text-[0.58rem] font-mono text-[#D35400] font-bold tracking-widest uppercase">
                Thermodynamic Gradient
              </span>
            </div>
            
            <div className="col-span-12 sm:col-span-8 flex flex-col space-y-1">
              <div 
                className="w-full h-3 rounded-sm relative overflow-hidden flex items-center justify-center border border-[#2C3E50]/10 shadow-inner"
                style={{
                  background: 'linear-gradient(90deg, #4A5D23 0%, #4A7C9E 35%, #B0A99F 70%, #D35400 100%)',
                  backgroundSize: '200% auto',
                  animation: 'colorSweep 15s ease infinite'
                }}
              >
                <span className="text-[0.48rem] font-mono text-[#F5F5F0] tracking-widest opacity-80 z-10 select-none uppercase">
                  pending gradient SVG asset // active sweep
                </span>
                {/* Visual glass overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-black/5 pointer-events-none" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Footer info line */}
        <div className="mt-4 pt-2 border-t border-[#2C3E50]/5 flex justify-between items-center text-[0.55rem] font-mono text-[#2C3E50]/40 select-none">
          <span>SOURCE: EMPIRICAL ANALYSIS TRANSECT VECTOR FILE [FIG 7.1]</span>
          <span>POLITECNICO DI TORINO // MSc THESIS</span>
        </div>
      </motion.div>

      {/* Internal Animation CSS Injection for the sweep effect */}
      <style>{`
        @keyframes colorSweep {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </div>
  );
}
