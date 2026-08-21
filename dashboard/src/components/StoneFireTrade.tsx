import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Info, HelpCircle } from 'lucide-react';

type Season = 'spring' | 'summer' | 'winter';

interface EcologyData {
  lst: number;
  ndmi: number;
  bsi: number;
  ndvi: number;
}

const SEASON_METRICS: Record<Season, Record<string, EcologyData>> = {
  spring: {
    Stone: { lst: 31.65, ndmi: 0.194, bsi: -0.110, ndvi: 0.607 },
    Fire: { lst: 33.63, ndmi: -0.002, bsi: 0.074, ndvi: 0.314 },
    Shadow: { lst: 32.13, ndmi: 0.129, bsi: -0.045, ndvi: 0.511 },
    Transitional: { lst: 32.78, ndmi: 0.063, bsi: 0.013, ndvi: 0.412 }
  },
  summer: {
    Stone: { lst: 46.79, ndmi: -0.081, bsi: 0.136, ndvi: 0.345 },
    Fire: { lst: 45.24, ndmi: -0.048, bsi: 0.113, ndvi: 0.272 },
    Shadow: { lst: 45.38, ndmi: -0.017, bsi: 0.085, ndvi: 0.373 },
    Transitional: { lst: 45.31, ndmi: -0.040, bsi: 0.104, ndvi: 0.316 }
  },
  winter: {
    Stone: { lst: 15.57, ndmi: 0.157, bsi: -0.084, ndvi: 0.594 },
    Fire: { lst: 14.71, ndmi: 0.035, bsi: 0.046, ndvi: 0.359 },
    Shadow: { lst: 15.04, ndmi: 0.171, bsi: -0.088, ndvi: 0.562 },
    Transitional: { lst: 14.83, ndmi: 0.094, bsi: -0.014, ndvi: 0.453 }
  }
};

// 4-year trends values for plotting lines smoothly (representing fluctuation over the years)
const YEAR_TRENDS: Record<Season, Record<string, number[]>> = {
  spring: {
    Stone: [31.12, 31.54, 31.85, 32.09],
    Fire: [33.10, 33.45, 33.80, 34.17],
    Shadow: [31.60, 32.02, 32.35, 32.55],
    Transitional: [32.25, 32.65, 33.00, 33.22]
  },
  summer: {
    Stone: [45.95, 46.52, 47.11, 47.58],
    Fire: [44.40, 45.02, 45.50, 46.04],
    Shadow: [44.55, 45.15, 45.65, 46.17],
    Transitional: [44.50, 45.08, 45.58, 46.08]
  },
  winter: {
    Stone: [15.12, 15.42, 15.65, 16.09],
    Fire: [14.20, 14.55, 14.85, 15.24],
    Shadow: [14.60, 14.92, 15.15, 15.49],
    Transitional: [14.35, 14.70, 14.98, 15.29]
  }
};

const RANGES: Record<Season, { min: number; max: number }> = {
  spring: { min: 29, max: 35 },
  summer: { min: 43, max: 49 },
  winter: { min: 13, max: 17 }
};

export default function StoneFireTrade() {
  const [activeSeason, setActiveSeason] = useState<Season>('spring');
  const [hoveredYearIndex, setHoveredYearIndex] = useState<number | null>(null);

  const data = SEASON_METRICS[activeSeason];
  const trends = YEAR_TRENDS[activeSeason];
  const range = RANGES[activeSeason];

  // Stone minus Fire gap computation:
  // Spring: -2.0, Summer: +1.6, Winter: +0.9
  const gapValue = activeSeason === 'spring' ? -2.0 : activeSeason === 'summer' ? 1.6 : 0.9;
  const gapString = gapValue > 0 ? `+${gapValue.toFixed(1)}` : `${gapValue.toFixed(1)}`;

  // SVG drawing specs
  const width = 600;
  const height = 280;
  const paddingLeft = 55;
  const paddingRight = 45;
  const paddingTop = 30;
  const paddingBottom = 40;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  const xCoords = [0, 1, 2, 3].map(i => paddingLeft + (i / 3) * chartWidth);

  const getY = (val: number) => {
    return paddingTop + chartHeight - ((val - range.min) / (range.max - range.min)) * chartHeight;
  };

  // Build path d-strings
  const getPathD = (values: number[]) => {
    return values.map((val, idx) => {
      const command = idx === 0 ? 'M' : 'L';
      return `${command} ${xCoords[idx].toFixed(1)} ${getY(val).toFixed(1)}`;
    }).join(' ');
  };

  // Stone details for the "Why" panel
  const stoneWhy = {
    spring: { 
      ndmi: '+0.19', 
      bsi: '-0.11', 
      ndvi: '0.61',
      interpretation: 'High moisture and spring herbage cover buffer the karst, keeping it 2.0 °C cooler than the built fringe before the summer heat hits.'
    },
    summer: { 
      ndmi: '-0.08', 
      bsi: '+0.14', 
      ndvi: '0.35',
      interpretation: 'Summer desiccation and high rock exposure convert the karst into a severe heat battery, reversing the textbook rule by +1.6 °C.'
    },
    winter: { 
      ndmi: '+0.16', 
      bsi: '-0.08', 
      ndvi: '0.59',
      interpretation: 'The limestone thermal mass acts as a minor buffer in winter, retaining slight residual warmth (+0.9 °C) relative to the damp built fringe.'
    }
  }[activeSeason];

  return (
    <div className="w-full flex flex-col space-y-6" id="stone-fire-trade-container">
      {/* Interactive Controls & Live Readout Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-stretch">
        
        {/* Large season toggle buttons */}
        <div className="md:col-span-6 flex flex-col justify-between">
          <div>
            <div className="grid grid-cols-3 gap-2">
              {(['spring', 'summer', 'winter'] as Season[]).map((season) => (
                <button
                  key={season}
                  onClick={() => setActiveSeason(season)}
                  className={`py-3.5 px-4 rounded font-sans font-bold text-xs uppercase tracking-wider transition-all duration-300 ${
                    activeSeason === season
                      ? 'bg-[#D35400] text-white shadow-md scale-[1.01] border border-[#D35400]'
                      : 'bg-white text-[#2C3E50]/80 border border-[#2C3E50]/15 hover:bg-[#2C3E50]/5 hover:text-[#2C3E50]'
                  }`}
                  id={`btn-season-${season}`}
                >
                  {season}
                </button>
              ))}
            </div>
          </div>
          
          <div className="mt-3 text-[0.68rem] text-[#2C3E50]/60 font-sans italic">
            *Loads on SPRING to show canonical state before Summer's drastic inversion.
          </div>
        </div>

        {/* Live Gap Readout Box */}
        <div className="md:col-span-6 bg-white border border-[#2C3E50]/10 rounded p-4 flex flex-col justify-between shadow-sm relative overflow-hidden">
          <div className="absolute right-0 top-0 w-24 h-24 pointer-events-none opacity-[0.03]">
            <svg viewBox="0 0 100 100" className="w-full h-full fill-[#2C3E50]">
              <path d="M10,90 L90,10" stroke="#2C3E50" strokeWidth="12" />
            </svg>
          </div>
          
          <div>
            <span className="text-[0.62rem] font-mono tracking-widest text-[#2C3E50]/60 uppercase block">
              Live Index Differential
            </span>
            <h3 className="text-xs font-sans font-bold text-[#2C3E50] mt-0.5 uppercase tracking-wide">
              Stone minus Fire LST Gap
            </h3>
          </div>

          <div className="my-2.5 flex items-baseline space-x-3">
            <motion.span 
              key={activeSeason}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              className={`text-4xl md:text-5xl font-sans font-black tracking-tight ${
                gapValue > 0 ? 'text-[#D35400]' : 'text-[#4A7C9E]'
              }`}
              id="gap-value-display"
            >
              {gapString} °C
            </motion.span>
            
            <div className="flex flex-col">
              <span className="text-[0.65rem] font-sans font-bold text-[#2C3E50]/70 uppercase">
                {gapValue > 0 ? 'Inversion Confirmed' : 'Canonical State'}
              </span>
              <span className="text-[0.58rem] font-mono text-[#2C3E50]/50">
                {activeSeason === 'spring' ? 'Textbook open cooler trend' : activeSeason === 'summer' ? 'Karst exceeds urban fringe' : 'Residual winter buffer'}
              </span>
            </div>
          </div>

          <div className="text-[0.65rem] font-mono text-[#2C3E50]/60 border-t border-[#2C3E50]/5 pt-2 text-left">
            <span>Robust 4-Year Mean (2015-2025)</span>
          </div>
        </div>

      </div>

      {/* Dynamic Smooth-Animating SVG Line Chart */}
      <div className="bg-white border border-[#2C3E50]/10 rounded p-4 shadow-sm flex flex-col" id="chart-card">
        {/* HUD Header */}
        <div className="flex justify-between items-center pb-2 border-b border-[#2C3E50]/5 mb-3 text-[0.6rem] font-mono tracking-widest text-[#2C3E50]/50 uppercase">
          <div className="flex items-center space-x-2">
            <span className={`w-1.5 h-1.5 rounded-full ${activeSeason === 'summer' ? 'bg-[#D35400] animate-pulse' : 'bg-[#4A7C9E]'}`} />
            <span>Seasonal Surface Temperature Trends (Landsat GIS 4-Year Record)</span>
          </div>
          <div>LST (°C) x YEAR</div>
        </div>

        {/* The SVG element */}
        <div className="relative w-full overflow-hidden" style={{ aspectRatio: '600 / 280' }}>
          <svg viewBox="0 0 600 280" className="w-full h-full select-none" id="trade-places-svg">
            {/* Horizontal Gridlines */}
            {Array.from({ length: 4 }).map((_, i) => {
              const fraction = i / 3;
              const tempValue = range.max - fraction * (range.max - range.min);
              const y = paddingTop + fraction * chartHeight;
              return (
                <g key={i} className="opacity-40">
                  <line 
                    x1={paddingLeft} 
                    y1={y} 
                    x2={width - paddingRight} 
                    y2={y} 
                    stroke="#2C3E50" 
                    strokeWidth="0.5" 
                    strokeDasharray="3,3" 
                  />
                  <text 
                    x={paddingLeft - 8} 
                    y={y + 3.5} 
                    textAnchor="end" 
                    className="font-mono text-[0.62rem] fill-[#2C3E50]/60"
                  >
                    {tempValue.toFixed(1)}°
                  </text>
                </g>
              );
            })}

            {/* Vertical Year Guidelines */}
            {[2015, 2018, 2021, 2025].map((year, idx) => {
              const x = xCoords[idx];
              return (
                <g key={year}>
                  <line 
                    x1={x} 
                    y1={paddingTop} 
                    x2={x} 
                    y2={paddingTop + chartHeight} 
                    stroke="#2C3E50" 
                    strokeWidth="0.5" 
                    strokeDasharray="4,4" 
                    className="opacity-25"
                  />
                  <text 
                    x={x} 
                    y={height - paddingBottom + 16} 
                    textAnchor="middle" 
                    className="font-sans font-bold text-[0.68rem] fill-[#2C3E50]/80 tracking-wider"
                  >
                    {year}
                  </text>
                  
                  {/* Invisible wide mouse-hover hit area for the year */}
                  <rect
                    x={x - 40}
                    y={paddingTop}
                    width={80}
                    height={chartHeight}
                    fill="transparent"
                    className="cursor-pointer"
                    onMouseEnter={() => setHoveredYearIndex(idx)}
                    onMouseLeave={() => setHoveredYearIndex(null)}
                  />
                </g>
              );
            })}

            {/* Secondary lines first (Shadow and Transitional) - thin & muted */}
            {/* Transitional Line */}
            <motion.path
              d={getPathD(trends.Transitional)}
              fill="none"
              stroke="#4A7C9E"
              strokeWidth="1.5"
              strokeOpacity="0.4"
              transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
            />

            {/* Shadow Canopy Line */}
            <motion.path
              d={getPathD(trends.Shadow)}
              fill="none"
              stroke="#4A5D23"
              strokeWidth="1.5"
              strokeOpacity="0.4"
              transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
            />

            {/* PRIMARY LINES (Stone & Fire) - Thick, high-contrast, designed to cross */}
            {/* Stone Line */}
            <motion.path
              d={getPathD(trends.Stone)}
              fill="none"
              stroke="#B0A99F"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
              transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
              id="chart-line-stone"
            />

            {/* Fire Line */}
            <motion.path
              d={getPathD(trends.Fire)}
              fill="none"
              stroke="#D35400"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
              transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
              id="chart-line-fire"
            />

            {/* Dynamic Interactive Dot Highlight Markers on hover */}
            {[2015, 2018, 2021, 2025].map((year, idx) => {
              const x = xCoords[idx];
              const isHovered = hoveredYearIndex === idx;

              return (
                <g key={year} className="pointer-events-none">
                  {/* Stone Dot */}
                  <motion.circle
                    cx={x}
                    cy={getY(trends.Stone[idx])}
                    r={isHovered ? 6 : 3.5}
                    fill="#B0A99F"
                    stroke="#white"
                    strokeWidth={isHovered ? 1.5 : 1}
                    animate={{ r: isHovered ? 6.5 : 3.5 }}
                    transition={{ duration: 0.15 }}
                  />
                  {/* Fire Dot */}
                  <motion.circle
                    cx={x}
                    cy={getY(trends.Fire[idx])}
                    r={isHovered ? 6 : 3.5}
                    fill="#D35400"
                    stroke="#white"
                    strokeWidth={isHovered ? 1.5 : 1}
                    animate={{ r: isHovered ? 6.5 : 3.5 }}
                    transition={{ duration: 0.15 }}
                  />
                </g>
              );
            })}
          </svg>

          {/* Floating HUD Tooltip when hovering over a year index */}
          {hoveredYearIndex !== null && (
            <div 
              className="absolute bg-white/95 border border-[#2C3E50]/25 backdrop-blur-sm p-3 rounded shadow-lg text-left pointer-events-none transition-all duration-150"
              style={{
                left: `${(hoveredYearIndex / 3) * 70 + 8}%`,
                top: '10px',
                width: '185px'
              }}
            >
              <div className="font-sans font-bold text-xs text-[#2C3E50] border-b border-[#2C3E50]/10 pb-1 mb-1.5 flex justify-between">
                <span>YEAR {[2015, 2018, 2021, 2025][hoveredYearIndex]}</span>
                <span className="font-mono text-[0.62rem] uppercase tracking-wider text-[#D35400]">
                  {activeSeason}
                </span>
              </div>
              <div className="space-y-1 text-[0.68rem]">
                <div className="flex justify-between items-center">
                  <span className="flex items-center space-x-1.5 font-bold">
                    <span className="w-2 h-2 rounded bg-[#B0A99F]" />
                    <span>Stone LST:</span>
                  </span>
                  <span className="font-mono font-bold text-[#2C3E50]">
                    {trends.Stone[hoveredYearIndex].toFixed(2)} °C
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center space-x-1.5 font-bold">
                    <span className="w-2 h-2 rounded bg-[#D35400]" />
                    <span>Fire LST:</span>
                  </span>
                  <span className="font-mono font-bold text-[#D35400]">
                    {trends.Fire[hoveredYearIndex].toFixed(2)} °C
                  </span>
                </div>
                <div className="flex justify-between items-center text-slate-500 text-[0.6rem]">
                  <span className="flex items-center space-x-1.5">
                    <span className="w-2 h-2 rounded bg-[#4A5D23]/70" />
                    <span>Shadow:</span>
                  </span>
                  <span className="font-mono">
                    {trends.Shadow[hoveredYearIndex].toFixed(2)} °C
                  </span>
                </div>
                <div className="flex justify-between items-center text-slate-500 text-[0.6rem]">
                  <span className="flex items-center space-x-1.5">
                    <span className="w-2 h-2 rounded bg-[#4A7C9E]/70" />
                    <span>Transitional:</span>
                  </span>
                  <span className="font-mono">
                    {trends.Transitional[hoveredYearIndex].toFixed(2)} °C
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Legend horizontally underneath the chart */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-2 pt-3 border-t border-[#2C3E50]/10 text-left mt-1 text-[0.62rem] font-sans">
          <div className="flex items-center space-x-2">
            <div className="w-3.5 h-1.5 rounded bg-[#B0A99F]" />
            <div className="flex flex-col">
              <span className="font-bold text-[#2C3E50]">Stone (Open Karst)</span>
              <span className="font-mono text-[0.58rem] opacity-65">Mean: {data.Stone.lst.toFixed(2)}°C</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3.5 h-1.5 rounded bg-[#D35400]" />
            <div className="flex flex-col">
              <span className="font-bold text-[#D35400]">Fire (Built Fringe)</span>
              <span className="font-mono text-[0.58rem] text-[#D35400]/80">Mean: {data.Fire.lst.toFixed(2)}°C</span>
            </div>
          </div>
          <div className="flex items-center space-x-2 opacity-60">
            <div className="w-3.5 h-0.5 rounded bg-[#4A5D23]" />
            <div className="flex flex-col">
              <span className="text-[#2C3E50]/80">Shadow Canopy</span>
              <span className="font-mono text-[0.55rem]">Mean: {data.Shadow.lst.toFixed(2)}°C</span>
            </div>
          </div>
          <div className="flex items-center space-x-2 opacity-60">
            <div className="w-3.5 h-0.5 rounded bg-[#4A7C9E]" />
            <div className="flex flex-col">
              <span className="text-[#2C3E50]/80">Transitional Ground</span>
              <span className="font-mono text-[0.55rem]">Mean: {data.Transitional.lst.toFixed(2)}°C</span>
            </div>
          </div>
        </div>
      </div>

      {/* WHY Panel detailing Stone's water-energy feedback mechanisms */}
      <div className="bg-[#B0A99F]/10 border border-[#B0A99F]/20 rounded p-4 flex flex-col space-y-3" id="why-panel">
        <div className="flex justify-between items-center pb-2 border-b border-[#2C3E50]/10">
          <span className="text-[0.62rem] font-mono tracking-widest text-[#2C3E50]/70 uppercase font-bold flex items-center space-x-1">
            <Info className="w-3.5 h-3.5 text-[#D35400]" />
            <span>Pathology Analysis: Stone's Climatological Mechanism</span>
          </span>
          <span className="text-[0.55rem] font-mono text-[#D35400] uppercase font-bold">
            Landsat Collection-2 L2 Data
          </span>
        </div>

        {/* Mechanism grid */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white/50 border border-[#2C3E50]/5 p-2.5 rounded text-left">
            <span className="text-[0.55rem] font-mono text-[#2C3E50]/50 uppercase block">Moisture Index (NDMI)</span>
            <span className={`text-lg font-sans font-black tracking-tight ${activeSeason === 'summer' ? 'text-[#D35400]' : 'text-[#2C3E50]'}`}>
              {stoneWhy.ndmi}
            </span>
            <p className="text-[0.58rem] leading-snug text-[#2C3E50]/75 mt-1 font-sans">
              {activeSeason === 'summer' 
                ? 'Drops below zero, signifying a complete loss of extractable water content.' 
                : 'Healthy winter/spring reservoir level stored in porous karst fissures.'}
            </p>
          </div>

          <div className="bg-white/50 border border-[#2C3E50]/5 p-2.5 rounded text-left">
            <span className="text-[0.55rem] font-mono text-[#2C3E50]/50 uppercase block">Bare Soil/Rock Index (BSI)</span>
            <span className="text-lg font-sans font-black tracking-tight text-[#2C3E50]">
              {stoneWhy.bsi}
            </span>
            <p className="text-[0.58rem] leading-snug text-[#2C3E50]/75 mt-1 font-sans">
              {activeSeason === 'summer'
                ? 'High soil exposure indicates exposed, dry limestone absorbing shortwave energy.'
                : 'Negative scores reflect heavy spring moss, herbaceous cover, and surface moisture.'}
            </p>
          </div>

          <div className="bg-white/50 border border-[#2C3E50]/5 p-2.5 rounded text-left">
            <span className="text-[0.55rem] font-mono text-[#2C3E50]/50 uppercase block">Vegetation Index (NDVI)</span>
            <span className="text-lg font-sans font-black tracking-tight text-[#2C3E50]">
              {stoneWhy.ndvi}
            </span>
            <p className="text-[0.58rem] leading-snug text-[#2C3E50]/75 mt-1 font-sans">
              {activeSeason === 'summer'
                ? '0.35 remains high (highest in grid) due to drought-resistant evergreen macchia.'
                : '0.61 reflects vigorous evergreen canopy coupled with spring annual ground weeds.'}
            </p>
          </div>
        </div>

        {/* Interpretation sentence bar */}
        <div className="bg-white border border-[#2C3E50]/10 p-3 rounded text-left flex items-start space-x-2.5">
          <span className="text-[0.58rem] font-mono text-[#D35400] font-black uppercase tracking-wider border border-[#D35400]/30 px-1.5 py-0.5 rounded shrink-0 mt-0.5">
            CLIMATIC PARADOX
          </span>
          <p className="text-[0.72rem] text-[#2C3E50] leading-relaxed font-sans">
            "{stoneWhy.interpretation}"
          </p>
        </div>
      </div>
    </div>
  );
}
