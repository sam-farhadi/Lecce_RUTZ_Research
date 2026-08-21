/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { Sliders, BarChart2, Info, Compass, Target } from 'lucide-react';
import { cellsData } from '../cells_data';

// Color map for the ecologies
const ECOLOGY_COLORS = {
  0: '#B0A99F', // Stone (gray)
  1: '#D35400', // Fire (orange)
  2: '#4A5D23', // Shadow (green)
  3: '#4A7C9E', // Transitional (blue)
};

const ECOLOGY_NAMES = {
  0: 'Stone',
  1: 'Fire',
  2: 'Shadow',
  3: 'Transitional',
};

// Colors for the 5 classes in the Buffer-Capacity Ladder
const LADDER_COLORS = {
  1: '#4A5D23', // Class 1: Canopy green
  2: '#7D8461', // Class 2: Blended green-gray
  3: '#B0A99F', // Class 3: Stone gray
  4: '#C17F4F', // Class 4: Blended gray-orange
  5: '#D35400', // Class 5: Heat orange
};

interface Preset {
  name: string;
  bsf: number;
  isf: number;
  enn: number;
  wall: number;
  ecol: number;
}

const PRESETS: Preset[] = [
  { name: 'Stone', bsf: 0.008, isf: 0.107, enn: 0.124, wall: 0.178, ecol: 0.233 },
  { name: 'Fire', bsf: 0.83, isf: 0.323, enn: 0.077, wall: 0.081, ecol: 0.126 },
  { name: 'Shadow', bsf: 0.273, isf: 0.617, enn: 0.196, wall: 0.156, ecol: 0.12 },
  { name: 'Transitional', bsf: 0.482, isf: 0.388, enn: 0.15, wall: 0.103, ecol: 0.109 },
];

export default function OneGridTwoReadings() {
  // 5 Sliders state for hypothetical cell
  const [sBsf, setSBsf] = useState(0.25);
  const [sIsf, setSIsf] = useState(0.3);
  const [sEnn, setSEnn] = useState(0.2);
  const [sWall, setSWall] = useState(0.15);
  const [sEcol, setSEcol] = useState(0.12);

  const [activePreset, setActivePreset] = useState<string | null>(null);

  // Load a preset
  const handleLoadPreset = (preset: Preset) => {
    setSBsf(preset.bsf);
    setSIsf(preset.isf);
    setSEnn(preset.enn);
    setSWall(preset.wall);
    setSEcol(preset.ecol);
    setActivePreset(preset.name);
  };

  // Check if current sliders match a preset exactly (with tolerance)
  const matchedPreset = useMemo(() => {
    const tol = 0.001;
    const match = PRESETS.find(p => 
      Math.abs(p.bsf - sBsf) < tol &&
      Math.abs(p.isf - sIsf) < tol &&
      Math.abs(p.enn - sEnn) < tol &&
      Math.abs(p.wall - sWall) < tol &&
      Math.abs(p.ecol - sEcol) < tol
    );
    return match ? match.name : null;
  }, [sBsf, sIsf, sEnn, sWall, sEcol]);

  // Compute live Score
  const score = useMemo(() => {
    return 0.22 * sBsf + 0.15 * sIsf + 0.18 * sEnn + 0.27 * sWall + 0.18 * sEcol;
  }, [sBsf, sIsf, sEnn, sWall, sEcol]);

  // Determine active Class index (1-5)
  const activeClassIdx = useMemo(() => {
    if (score <= 0.075) return 1;
    if (score <= 0.161) return 2;
    if (score <= 0.246) return 3;
    if (score <= 0.351) return 4;
    return 5;
  }, [score]);

  // Pre-calculate real-world counts and ecology compositions for the 5 classes
  // calculated from our representative cellsData and scaled to exactly 8,625 cells
  const classStats = useMemo(() => {
    const stats: Record<number, { count: number; ecologies: Record<number, number> }> = {};
    
    // Initialize
    for (let c = 1; c <= 5; c++) {
      stats[c] = {
        count: 0,
        ecologies: { 0: 0, 1: 0, 2: 0, 3: 0 },
      };
    }

    // Accumulate representative data
    cellsData.forEach(cell => {
      const cls = cell[6];
      const eco = cell[7];
      if (stats[cls]) {
        stats[cls].count += 1;
        stats[cls].ecologies[eco] += 1;
      }
    });

    // Scale to exactly 8,625
    const totalRep = cellsData.length;
    let accumulatedScaledTotal = 0;
    const scaledStats: Record<number, { count: number; percentages: Record<number, number> }> = {};

    for (let c = 1; c <= 5; c++) {
      const repCount = stats[c].count;
      let scaledCount = Math.round(repCount * (8625 / totalRep));
      
      accumulatedScaledTotal += scaledCount;

      const ecoPercentages: Record<number, number> = { 0: 0, 1: 0, 2: 0, 3: 0 };
      if (repCount > 0) {
        for (let e = 0; e <= 3; e++) {
          ecoPercentages[e] = (stats[c].ecologies[e] / repCount) * 100;
        }
      }

      scaledStats[c] = {
        count: scaledCount,
        percentages: ecoPercentages,
      };
    }

    // Adjust rounding discrepancy to guarantee exactly 8,625 cells
    const discrepancy = 8625 - accumulatedScaledTotal;
    if (discrepancy !== 0) {
      let maxClass = 1;
      let maxCount = scaledStats[1].count;
      for (let c = 2; c <= 5; c++) {
        if (scaledStats[c].count > maxCount) {
          maxCount = scaledStats[c].count;
          maxClass = c;
        }
      }
      scaledStats[maxClass].count += discrepancy;
    }

    return scaledStats;
  }, []);

  const activeClassStats = classStats[activeClassIdx];

  // Data for Table 1: The ecological signature – where the real distinction lives
  const table1Data = [
    { class: 'Rural Matrix', stone: '91%', fire: '0.00%', shadow: '0.30%', trans: '8%', copresence: '0.30%' },
    { class: 'Margin Approach', stone: '66%', fire: '0.30%', shadow: '2.90%', trans: '30%', copresence: '3.20%' },
    { class: 'Transition Mosaic', stone: '39%', fire: '2.80%', shadow: '6.60%', trans: '52%', copresence: '9.50%' },
    { class: 'Active Margin', stone: '23%', fire: '5.20%', shadow: '9.90%', trans: '61%', copresence: '15.00%' },
    { class: 'Critical Fringe', stone: '16%', fire: '7.10%', shadow: '8.20%', trans: '68%', copresence: '15.30%' },
  ];

  // Data for Table 2: The evidence – physical morphology by class
  const table2Data = [
    { class: 'Rural Matrix', n: '1,535', bldg: '0.40%', sealed: '3.90%', open: '98%', patches: '0.28', spacing: '0.4', wall: '0.49' },
    { class: 'Margin Approach', n: '2,107', bldg: '5.90%', sealed: '20.10%', open: '94%', patches: '2.39', spacing: '2.4', wall: '1.1' },
    { class: 'Transition Mosaic', n: '2,514', bldg: '9.90%', sealed: '36.90%', open: '85%', patches: '4.96', spacing: '9.8', wall: '0.69' },
    { class: 'Active Margin', n: '1,763', bldg: '9.50%', sealed: '38.70%', open: '81%', patches: '5.58', spacing: '17.7', wall: '0.85' },
    { class: 'Critical Fringe', n: '706', bldg: '11.20%', sealed: '38.90%', open: '82%', patches: '6.89', spacing: '26.4', wall: '1.34' },
  ];

  return (
    <div className="w-full flex flex-col space-y-6 lg:space-y-8 select-none" id="one-grid-two-readings-root">
      
      {/* UPPER SECTION: TWO MINIMALIST DATA TABLES */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
        
        {/* TABLE 2: PHYSICAL MORPHOLOGY (THE EVIDENCE) - LEFT */}
        <div className="bg-white/75 backdrop-blur-sm p-4 rounded border border-[#2C3E50]/15 shadow-sm flex flex-col space-y-3">
          <div className="flex justify-between items-center border-b border-[#2C3E50]/10 pb-2">
            <span className="text-[0.62rem] font-mono tracking-widest text-[#2C3E50] uppercase font-bold">
              The evidence – physical morphology by class
            </span>
            <span className="text-[0.55rem] font-mono text-[#2C3E50]/50 uppercase">By Class</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#2C3E50]/15 text-[0.52rem] font-mono text-[#2C3E50]/60 uppercase tracking-wider">
                  <th className="py-2 px-1.5 font-semibold">Class</th>
                  <th className="py-2 px-1 font-semibold text-right">n</th>
                  <th className="py-2 px-1 font-semibold text-right">Bldg %</th>
                  <th className="py-2 px-1 font-semibold text-right">Sealed %</th>
                  <th className="py-2 px-1 font-semibold text-right">Open Frac</th>
                  <th className="py-2 px-1 font-semibold text-right">Patches/cell</th>
                  <th className="py-2 px-1 font-semibold text-right">Spacing (m)</th>
                  <th className="py-2 px-1.5 font-semibold text-right">Wall Den (m/ha)</th>
                </tr>
              </thead>
              <tbody>
                {table2Data.map((row, idx) => (
                  <tr 
                    key={`tbl2-${idx}`} 
                    className="border-b border-[#2C3E50]/5 hover:bg-[#2C3E50]/5 transition-colors text-[0.65rem]"
                  >
                    <td className="py-2 px-1.5 font-sans font-medium text-[#2C3E50]">{row.class}</td>
                    <td className="py-2 px-1 font-mono text-[#2C3E50]/80 text-right">{row.n}</td>
                    <td className="py-2 px-1 font-mono text-[#2C3E50]/80 text-right">{row.bldg}</td>
                    <td className="py-2 px-1 font-mono text-[#2C3E50]/80 text-right">{row.sealed}</td>
                    <td className="py-2 px-1 font-mono text-[#2C3E50]/80 text-right">{row.open}</td>
                    <td className="py-2 px-1 font-mono text-[#2C3E50]/80 text-right">{row.patches}</td>
                    <td className="py-2 px-1 font-mono text-[#2C3E50]/80 text-right">{row.spacing}</td>
                    <td className="py-2 px-1.5 font-mono text-[#D35400] text-right font-semibold">{row.wall}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* TABLE 1: ECOLOGICAL SIGNATURE - RIGHT */}
        <div className="bg-white/75 backdrop-blur-sm p-4 rounded border border-[#2C3E50]/15 shadow-sm flex flex-col space-y-3">
          <div className="flex justify-between items-center border-b border-[#2C3E50]/10 pb-2">
            <span className="text-[0.62rem] font-mono tracking-widest text-[#2C3E50] uppercase font-bold">
              The ecological signature – where the real distinction lives
            </span>
            <span className="text-[0.55rem] font-mono text-[#2C3E50]/50 uppercase">By Class</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#2C3E50]/15 text-[0.55rem] font-mono text-[#2C3E50]/60 uppercase tracking-wider">
                  <th className="py-2 px-2 font-semibold">Class</th>
                  <th className="py-2 px-1 font-semibold text-right">%Stone</th>
                  <th className="py-2 px-1 font-semibold text-right">%Fire</th>
                  <th className="py-2 px-1 font-semibold text-right">%Shadow</th>
                  <th className="py-2 px-1 font-semibold text-right">%Transitional</th>
                  <th className="py-2 px-2 font-semibold text-right">Fire+Shadow Co-presence</th>
                </tr>
              </thead>
              <tbody>
                {table1Data.map((row, idx) => (
                  <tr 
                    key={`tbl1-${idx}`} 
                    className="border-b border-[#2C3E50]/5 hover:bg-[#2C3E50]/5 transition-colors text-[0.68rem]"
                  >
                    <td className="py-2 px-2 font-sans font-medium text-[#2C3E50]">{row.class}</td>
                    <td className="py-2 px-1 font-mono text-[#2C3E50]/80 text-right">{row.stone}</td>
                    <td className="py-2 px-1 font-mono text-[#D35400] text-right font-medium">{row.fire}</td>
                    <td className="py-2 px-1 font-mono text-[#4A5D23] text-right font-medium">{row.shadow}</td>
                    <td className="py-2 px-1 font-mono text-[#4A7C9E] text-right">{row.trans}</td>
                    <td className="py-2 px-2 font-mono text-[#2C3E50] text-right font-semibold">{row.copresence}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* MIDDLE SECTION: SCATTER PLOT VISUALIZATION */}
      <div className="bg-white/75 backdrop-blur-sm p-4 rounded border border-[#2C3E50]/15 shadow-sm flex flex-col space-y-3" id="scatter-plot-container">
        <div className="flex justify-between items-center border-b border-[#2C3E50]/10 pb-2">
          <div className="flex items-center space-x-2">
            <Compass size={14} className="text-[#B0A99F] animate-spin" style={{ animationDuration: '60s' }} />
            <span className="text-[0.68rem] font-mono tracking-widest text-[#2C3E50] uppercase font-bold">2D TERRITORIAL CLOUD OF CELLS</span>
          </div>
          <span className="text-[0.58rem] font-mono text-[#2C3E50]/50 uppercase">8,625 OBSERVATIONS</span>
        </div>

        {/* Scatter plot + Axis Labels container with Grid layout */}
        <div className="grid grid-cols-[32px_1fr] grid-rows-[1fr_auto] gap-x-4 gap-y-3 items-center w-full">
          
          {/* Y-Axis Label */}
          <div className="row-start-1 col-start-1 h-full flex items-center justify-center relative w-8">
            <div className="-rotate-90 whitespace-nowrap text-[0.58rem] md:text-[0.62rem] font-mono tracking-wider text-[#2C3E50]/65 uppercase absolute">
              Y-Axis: Dry-Stone Wall Density (s_wall)
            </div>
          </div>

          {/* 2D Scatter plot Canvas */}
          <div className="row-start-1 col-start-2 relative w-full aspect-[4/1] min-h-[160px] bg-[#F5F5F0]/40 rounded border border-[#2C3E50]/5 overflow-hidden flex items-center justify-center p-2">
            
            {/* SVG Canvas for scatter plot */}
            <svg className="w-full h-full overflow-visible select-none" viewBox="0 0 800 200">
              {/* Grid lines */}
              {[0, 0.25, 0.5, 0.75, 1].map((gridX, gIdx) => {
                const x = gridX * 800;
                return (
                  <motion.line 
                    key={`gx-${gridX}`} 
                    x1={x} 
                    y1="0" 
                    x2={x} 
                    y2="200" 
                    stroke="#2C3E50" 
                    strokeOpacity="0.05" 
                    strokeWidth="1" 
                    initial={{ opacity: 0, pathLength: 0 }}
                    animate={{ opacity: 1, pathLength: 1 }}
                    transition={{ duration: 0.6, delay: gIdx * 0.04, ease: "easeOut" }}
                  />
                );
              })}
              {[0, 0.25, 0.5, 0.75, 1].map((gridY, gIdx) => {
                const y = (1 - gridY) * 200;
                return (
                  <motion.line 
                    key={`gy-${gridY}`} 
                    x1="0" 
                    y1={y} 
                    x2="800" 
                    y2={y} 
                    stroke="#2C3E50" 
                    strokeOpacity="0.05" 
                    strokeWidth="1" 
                    initial={{ opacity: 0, pathLength: 0 }}
                    animate={{ opacity: 1, pathLength: 1 }}
                    transition={{ duration: 0.6, delay: 0.15 + gIdx * 0.04, ease: "easeOut" }}
                  />
                );
              })}

              {/* Scatter plot points (representative subset) */}
              {cellsData.map((cell, idx) => {
                const cx = cell[0] * 800;
                const cy = (1 - cell[1]) * 200;
                const ecoColor = ECOLOGY_COLORS[cell[7] as 0 | 1 | 2 | 3];
                
                return (
                  <motion.circle
                    key={`pt-${idx}`}
                    cx={cx}
                    cy={cy}
                    r="1.75"
                    fill={ecoColor}
                    fillOpacity="0.45"
                    className="transition-all hover:r-4 hover:fill-opacity-100 cursor-help"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ 
                      type: "spring",
                      stiffness: 140,
                      damping: 12,
                      delay: 0.3 + idx * 0.002,
                    }}
                    style={{ transformOrigin: `${cx}px ${cy}px` }}
                  >
                    <title>{`s_isf: ${cell[0].toFixed(3)}, s_wall: ${cell[1].toFixed(3)} | Ecology: ${ECOLOGY_NAMES[cell[7] as 0 | 1 | 2 | 3]}`}</title>
                  </motion.circle>
                );
              })}

              {/* Pulsing Target marker for the hypothetical cell */}
              <motion.g
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.1, duration: 0.4 }}
              >
                {/* Target lines */}
                <motion.line 
                  x1={sIsf * 800} 
                  y1="0" 
                  x2={sIsf * 800} 
                  y2="200" 
                  stroke="#D35400" 
                  strokeWidth="0.8" 
                  strokeOpacity="0.45" 
                  strokeDasharray="2,3" 
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ delay: 1.2, duration: 0.5 }}
                />
                <motion.line 
                  x1="0" 
                  y1={(1 - sWall) * 200} 
                  x2="800" 
                  y2={(1 - sWall) * 200} 
                  stroke="#D35400" 
                  strokeWidth="0.8" 
                  strokeOpacity="0.45" 
                  strokeDasharray="2,3" 
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ delay: 1.2, duration: 0.5 }}
                />

                {/* Pulsing Outer target sight */}
                <motion.circle
                  cx={sIsf * 800}
                  cy={(1 - sWall) * 200}
                  r="10"
                  fill="none"
                  stroke="#D35400"
                  strokeWidth="1.5"
                  className="animate-ping"
                  style={{ transformOrigin: `${sIsf * 800}px ${(1 - sWall) * 200}px` }}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 1.5, duration: 0.3 }}
                />

                {/* Precise target dot */}
                <motion.circle
                  cx={sIsf * 800}
                  cy={(1 - sWall) * 200}
                  r="4.5"
                  fill="#D35400"
                  stroke="#F5F5F0"
                  strokeWidth="1.5"
                  className="shadow-sm filter drop-shadow"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 12, delay: 1.4 }}
                  style={{ transformOrigin: `${sIsf * 800}px ${(1 - sWall) * 200}px` }}
                />
              </motion.g>
            </svg>

            {/* Top-Right HUD Coordinate Display */}
            <div className="absolute top-2.5 right-2.5 bg-white/95 px-2.5 py-1 rounded border border-[#2C3E50]/15 shadow-sm text-[0.58rem] font-mono text-[#2C3E50] flex items-center space-x-1.5 z-10">
              <Target size={11} className="text-[#D35400] animate-pulse" />
              <span>HYPOTHETICAL COORD: s_isf={sIsf.toFixed(3)}, s_wall={sWall.toFixed(3)}</span>
            </div>

          </div>

          {/* X-Axis Label */}
          <div className="row-start-2 col-start-2 text-center text-[0.58rem] md:text-[0.62rem] font-mono tracking-wider text-[#2C3E50]/65 uppercase">
            X-Axis: Impervious Surface Fraction (s_isf)
          </div>

        </div>

        {/* Legend for scatter plot points */}
        <div className="flex justify-center space-x-6 text-[0.58rem] font-mono text-[#2C3E50]/70 pt-0.5 border-t border-[#2C3E50]/5">
          <div className="flex items-center space-x-2">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: ECOLOGY_COLORS[0] }} />
            <span>Stone Ecology (Pietra)</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: ECOLOGY_COLORS[1] }} />
            <span>Fire Ecology (Frangia)</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: ECOLOGY_COLORS[2] }} />
            <span>Shadow Ecology (Giardino)</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: ECOLOGY_COLORS[3] }} />
            <span>Transitional Ecology</span>
          </div>
        </div>
      </div>

      {/* LOWER SECTION: SIDE-BY-SIDE MAIN ENGINE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        
        {/* LEFT PANEL: PERI-URBAN SCORE EXPLORER */}
        <div className="lg:col-span-6 bg-white/75 backdrop-blur-sm p-5 rounded border border-[#2C3E50]/15 shadow-sm flex flex-col space-y-4 h-full">
          <div className="flex justify-between items-center border-b border-[#2C3E50]/10 pb-2.5">
            <div className="flex items-center space-x-2">
              <Sliders size={14} className="text-[#D35400]" />
              <span className="text-[0.68rem] font-mono tracking-widest text-[#2C3E50] uppercase font-bold">PERI-URBAN SCORE EXPLORER</span>
            </div>
            <span className="text-[0.58rem] font-mono text-[#2C3E50]/50 uppercase">HYPOTHETICAL HECTARE</span>
          </div>

          {/* Preset buttons */}
          <div className="space-y-1.5">
            <span className="text-[0.55rem] font-mono text-[#2C3E50]/60 uppercase tracking-wider block">Ecological Reference Presets:</span>
            <div className="grid grid-cols-4 gap-1.5">
              {PRESETS.map((p) => {
                const isSelected = matchedPreset === p.name;
                return (
                  <button
                    key={p.name}
                    onClick={() => handleLoadPreset(p)}
                    className={`py-1.5 px-1 text-[0.62rem] font-sans font-bold uppercase tracking-wider rounded border transition-all ${
                      isSelected
                        ? 'bg-[#2C3E50] text-[#F5F5F0] border-[#2C3E50] shadow-sm scale-[1.02]'
                        : 'bg-white text-[#2C3E50]/80 border-[#2C3E50]/15 hover:border-[#2C3E50]/40 hover:bg-[#2C3E50]/5'
                    }`}
                  >
                    {p.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Five Sliders */}
          <div className="space-y-3.5 flex-1 justify-center flex flex-col pt-1">
            
            {/* s_bsf */}
            <div className="space-y-1">
              <div className="flex justify-between items-baseline text-xs">
                <span className="font-sans font-bold text-[#2C3E50]/95">
                  Building Surface Fraction <span className="font-mono text-[0.68rem] text-[#2C3E50]/50 ml-1 font-normal">(s_bsf)</span>
                </span>
                <span className="font-mono text-[0.65rem] text-[#2C3E50]/60">
                  wt. <strong className="text-[#2C3E50] font-bold">0.22</strong> · <strong className="text-[#D35400] font-bold text-xs">{sBsf.toFixed(3)}</strong>
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.001"
                value={sBsf}
                onChange={(e) => {
                  setSBsf(parseFloat(e.target.value));
                  setActivePreset(null);
                }}
                className="w-full h-1 bg-slate-200/80 rounded-lg appearance-none cursor-pointer accent-[#D35400]"
              />
            </div>

            {/* s_isf */}
            <div className="space-y-1">
              <div className="flex justify-between items-baseline text-xs">
                <span className="font-sans font-bold text-[#2C3E50]/95">
                  Impervious Surface Fraction <span className="font-mono text-[0.68rem] text-[#2C3E50]/50 ml-1 font-normal">(s_isf)</span>
                </span>
                <span className="font-mono text-[0.65rem] text-[#2C3E50]/60">
                  wt. <strong className="text-[#2C3E50] font-bold">0.15</strong> · <strong className="text-[#D35400] font-bold text-xs">{sIsf.toFixed(3)}</strong>
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.001"
                value={sIsf}
                onChange={(e) => {
                  setSIsf(parseFloat(e.target.value));
                  setActivePreset(null);
                }}
                className="w-full h-1 bg-slate-200/80 rounded-lg appearance-none cursor-pointer accent-[#D35400]"
              />
            </div>

            {/* s_enn */}
            <div className="space-y-1">
              <div className="flex justify-between items-baseline text-xs">
                <span className="font-sans font-bold text-[#2C3E50]/95">
                  Patch Isolation (ENN) <span className="font-mono text-[0.68rem] text-[#2C3E50]/50 ml-1 font-normal">(s_enn)</span>
                </span>
                <span className="font-mono text-[0.65rem] text-[#2C3E50]/60">
                  wt. <strong className="text-[#2C3E50] font-bold">0.18</strong> · <strong className="text-[#D35400] font-bold text-xs">{sEnn.toFixed(3)}</strong>
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.001"
                value={sEnn}
                onChange={(e) => {
                  setSEnn(parseFloat(e.target.value));
                  setActivePreset(null);
                }}
                className="w-full h-1 bg-slate-200/80 rounded-lg appearance-none cursor-pointer accent-[#D35400]"
              />
            </div>

            {/* s_wall */}
            <div className="space-y-1">
              <div className="flex justify-between items-baseline text-xs">
                <span className="font-sans font-bold text-[#2C3E50]/95">
                  Dry-Stone Wall Density <span className="font-mono text-[0.68rem] text-[#2C3E50]/50 ml-1 font-normal">(s_wall)</span>
                </span>
                <span className="font-mono text-[0.65rem] text-[#2C3E50]/60">
                  wt. <strong className="text-[#2C3E50] font-bold">0.27</strong> · <strong className="text-[#D35400] font-bold text-xs">{sWall.toFixed(3)}</strong>
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.001"
                value={sWall}
                onChange={(e) => {
                  setSWall(parseFloat(e.target.value));
                  setActivePreset(null);
                }}
                className="w-full h-1 bg-slate-200/80 rounded-lg appearance-none cursor-pointer accent-[#D35400]"
              />
            </div>

            {/* s_ecol */}
            <div className="space-y-1" title="The ratio of degraded 'Fire' land cover to healthy 'Shadow' land cover within the cell. Higher = more Fire share = weaker climate buffer. Lower = more Shadow share = stronger climate buffer.">
              <div className="flex justify-between items-baseline text-xs">
                <span className="font-sans font-bold text-[#2C3E50]/95 cursor-help">
                  Ecological Composition (Fire vs. Shadow) <span className="font-mono text-[0.68rem] text-[#2C3E50]/50 ml-1 font-normal">(s_ecol)</span>
                </span>
                <span className="font-mono text-[0.65rem] text-[#2C3E50]/60">
                  wt. <strong className="text-[#2C3E50] font-bold">0.18</strong> · <strong className="text-[#D35400] font-bold text-xs">{sEcol.toFixed(3)}</strong>
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.001"
                value={sEcol}
                onChange={(e) => {
                  setSEcol(parseFloat(e.target.value));
                  setActivePreset(null);
                }}
                className="w-full h-1 bg-slate-200/80 rounded-lg appearance-none cursor-pointer accent-[#D35400]"
              />
            </div>

          </div>

        </div>

        {/* RIGHT PANEL: COMPOSITE SCORE & CLASSIFICATION */}
        <div className="lg:col-span-6 bg-[#FAFAF7] p-5 rounded border border-[#2C3E50]/15 shadow-sm flex flex-col space-y-4 h-full">
          <div className="flex justify-between items-center border-b border-[#2C3E50]/10 pb-2.5">
            <div className="flex items-center space-x-2">
              <BarChart2 size={14} className="text-[#4A7C9E]" />
              <span className="text-[0.68rem] font-mono tracking-widest text-[#2C3E50] uppercase font-bold">COMPOSITE SCORE & CLASSIFICATION</span>
            </div>
            <span className="text-[0.58rem] font-mono text-[#2C3E50]/50 uppercase">CALCULATED VALUE</span>
          </div>

          {/* Large Live Score Readout */}
          <div className="text-center bg-[#F5F5F0]/60 py-3.5 px-4 rounded border border-[#2C3E50]/5 flex flex-col items-center justify-center relative overflow-hidden">
            <span className="text-[0.52rem] font-mono uppercase tracking-widest text-[#2C3E50]/55">Peri-Urban Composite Score</span>
            <span className="text-4xl md:text-5xl font-sans font-bold text-[#2C3E50] tracking-tighter mt-1 block">
              {score.toFixed(3)}
            </span>
            <div className="text-[0.52rem] font-mono text-[#2C3E50]/50 mt-2 tracking-wide uppercase">
              Score = 0.22*s_bsf + 0.15*s_isf + 0.18*s_enn + 0.27*s_wall + 0.18*s_ecol
            </div>
          </div>

          {/* Buffer-Capacity Ladder */}
          <div className="space-y-1.5 flex-1">
            <span className="text-[0.55rem] font-mono text-[#2C3E50]/60 uppercase tracking-wider block">Buffer-Capacity Ladder:</span>
            
            <div className="space-y-1">
              {/* Class 5: Critical Fringe */}
              <div 
                className={`p-1.5 px-3 rounded border text-xs font-sans flex justify-between items-center transition-all ${
                  activeClassIdx === 5 
                    ? 'bg-[#D35400] text-white border-[#D35400] font-bold shadow-sm scale-[1.01]' 
                    : 'bg-white text-[#2C3E50]/70 border-[#2C3E50]/10'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <span className={`w-2 h-2 rounded-full ${activeClassIdx === 5 ? 'bg-white' : 'bg-[#D35400]'}`} />
                  <span>Class 5: Critical Fringe</span>
                </div>
                <span className="font-mono text-[0.68rem]">Score &gt; 0.351</span>
              </div>

              {/* Class 4: Active Margin */}
              <div 
                className={`p-1.5 px-3 rounded border text-xs font-sans flex justify-between items-center transition-all ${
                  activeClassIdx === 4 
                    ? 'bg-[#C17F4F] text-white border-[#C17F4F] font-bold shadow-sm scale-[1.01]' 
                    : 'bg-white text-[#2C3E50]/70 border-[#2C3E50]/10'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <span className={`w-2 h-2 rounded-full ${activeClassIdx === 4 ? 'bg-white' : 'bg-[#C17F4F]'}`} />
                  <span>Class 4: Active Margin</span>
                </div>
                <span className="font-mono text-[0.68rem]">0.246 &lt; Score ≤ 0.351</span>
              </div>

              {/* Class 3: Transition Mosaic */}
              <div 
                className={`p-1.5 px-3 rounded border text-xs font-sans flex justify-between items-center transition-all ${
                  activeClassIdx === 3 
                    ? 'bg-[#B0A99F] text-white border-[#B0A99F] font-bold shadow-sm scale-[1.01]' 
                    : 'bg-white text-[#2C3E50]/70 border-[#2C3E50]/10'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <span className={`w-2 h-2 rounded-full ${activeClassIdx === 3 ? 'bg-white' : 'bg-[#B0A99F]'}`} />
                  <span>Class 3: Transition Mosaic</span>
                </div>
                <span className="font-mono text-[0.68rem]">0.161 &lt; Score ≤ 0.246</span>
              </div>

              {/* Class 2: Margin Approach */}
              <div 
                className={`p-1.5 px-3 rounded border text-xs font-sans flex justify-between items-center transition-all ${
                  activeClassIdx === 2 
                    ? 'bg-[#7D8461] text-white border-[#7D8461] font-bold shadow-sm scale-[1.01]' 
                    : 'bg-white text-[#2C3E50]/70 border-[#2C3E50]/10'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <span className={`w-2 h-2 rounded-full ${activeClassIdx === 2 ? 'bg-white' : 'bg-[#7D8461]'}`} />
                  <span>Class 2: Margin Approach</span>
                </div>
                <span className="font-mono text-[0.68rem]">0.075 &lt; Score ≤ 0.161</span>
              </div>

              {/* Class 1: Rural Matrix */}
              <div 
                className={`p-1.5 px-3 rounded border text-xs font-sans flex justify-between items-center transition-all ${
                  activeClassIdx === 1 
                    ? 'bg-[#4A5D23] text-white border-[#4A5D23] font-bold shadow-sm scale-[1.01]' 
                    : 'bg-white text-[#2C3E50]/70 border-[#2C3E50]/10'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <span className={`w-2 h-2 rounded-full ${activeClassIdx === 1 ? 'bg-white' : 'bg-[#4A5D23]'}`} />
                  <span>Class 1: Rural Matrix</span>
                </div>
                <span className="font-mono text-[0.68rem]">Score ≤ 0.075</span>
              </div>
            </div>
          </div>

          {/* Real-world composition bar */}
          <div className="pt-2.5 border-t border-[#2C3E50]/10 space-y-2">
            <div className="flex justify-between items-baseline">
              <span className="text-[0.65rem] font-sans text-[#2C3E50]/80">
                Lecce Distribution: <strong className="text-[#2C3E50] font-bold">{activeClassStats.count.toLocaleString()} cells</strong> (out of 8,625)
              </span>
              <span className="text-[0.58rem] font-mono text-[#2C3E50]/50 uppercase">Ecology Composition</span>
            </div>

            {/* Horizontal Stacked Bar */}
            <div className="h-4 w-full bg-slate-100 rounded-sm overflow-hidden flex border border-[#2C3E50]/5">
              {activeClassStats.percentages[0] > 0 && (
                <div 
                  className="h-full transition-all duration-300" 
                  style={{ width: `${activeClassStats.percentages[0]}%`, backgroundColor: ECOLOGY_COLORS[0] }}
                  title={`Stone: ${activeClassStats.percentages[0].toFixed(1)}%`}
                />
              )}
              {activeClassStats.percentages[1] > 0 && (
                <div 
                  className="h-full transition-all duration-300" 
                  style={{ width: `${activeClassStats.percentages[1]}%`, backgroundColor: ECOLOGY_COLORS[1] }}
                  title={`Fire: ${activeClassStats.percentages[1].toFixed(1)}%`}
                />
              )}
              {activeClassStats.percentages[2] > 0 && (
                <div 
                  className="h-full transition-all duration-300" 
                  style={{ width: `${activeClassStats.percentages[2]}%`, backgroundColor: ECOLOGY_COLORS[2] }}
                  title={`Shadow: ${activeClassStats.percentages[2].toFixed(1)}%`}
                />
              )}
              {activeClassStats.percentages[3] > 0 && (
                <div 
                  className="h-full transition-all duration-300" 
                  style={{ width: `${activeClassStats.percentages[3]}%`, backgroundColor: ECOLOGY_COLORS[3] }}
                  title={`Transitional: ${activeClassStats.percentages[3].toFixed(1)}%`}
                />
              )}
            </div>

            {/* Legend */}
            <div className="flex justify-between items-center text-[0.58rem] font-mono text-[#2C3E50]/75 px-0.5">
              <div className="flex items-center space-x-1.5">
                <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: ECOLOGY_COLORS[0] }} />
                <span>Stone ({activeClassStats.percentages[0].toFixed(0)}%)</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: ECOLOGY_COLORS[1] }} />
                <span>Fire ({activeClassStats.percentages[1].toFixed(0)}%)</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: ECOLOGY_COLORS[2] }} />
                <span>Shadow ({activeClassStats.percentages[2].toFixed(0)}%)</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: ECOLOGY_COLORS[3] }} />
                <span>Transitional ({activeClassStats.percentages[3].toFixed(0)}%)</span>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
