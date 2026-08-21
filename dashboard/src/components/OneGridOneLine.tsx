/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { Compass, Target, Map } from 'lucide-react';

export default function OneGridOneLine() {
  // Animation timing
  const mapInDuration = 0.8;
  const callout1Delay = 1.2;
  const callout2Delay = 2.4;

  // Real coordinates from WGS84 for the verified transect corridor (200m x 4000m)
  const realTransectCoords = [
    [18.172539765631697, 40.35261251508738],
    [18.167019323279078, 40.3701159803413],
    [18.161495771716414, 40.38761903773497],
    [18.159206804834024, 40.38719653398498],
    [18.16473090222193, 40.36969360438068],
    [18.170251889981017, 40.35219026678667],
    [18.172539765631697, 40.35261251508738]
  ];

  // Map projection bounding constants derived from grid extent
  const minLon = 18.136667;
  const maxLon = 18.247222;
  const minLat = 40.302778;
  const maxLat = 40.379167;

  // Project longitude/latitude into SVG pixel space
  const project = (lon: number, lat: number) => {
    const x = ((lon - minLon) / (maxLon - minLon)) * 800;
    const y = (320 - ((lat - minLat) / (maxLat - minLat)) * 320) + 10;
    return [x, y];
  };

  const projectedPoints = realTransectCoords.map(([lon, lat]) => project(lon, lat));
  const pointsString = projectedPoints.map(([x, y]) => `${x.toFixed(2)},${y.toFixed(2)}`).join(' ');
  const pathString = `M ${projectedPoints.map(([x, y]) => `${x.toFixed(2)},${y.toFixed(2)}`).join(' L ')} Z`;

  // Compute a clean coordinate inside the polygon for the callout pointer target
  // We choose a stable point in the lower-middle of the corridor
  const calloutTargetX = 229;
  const calloutTargetY = 82;

  return (
    <div className="w-full flex flex-col justify-start" id="one-grid-one-line-container">
      {/* MAP VISUAL - DOMINANT ELEMENT OF THE SLIDE */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: mapInDuration, ease: "easeOut", delay: 0.1 }}
        className="w-full bg-white/60 backdrop-blur-sm rounded border border-[#2C3E50]/10 overflow-hidden flex flex-col p-4 relative shadow-sm h-[420px] md:h-[460px]"
      >
        {/* HUD Top bar */}
        <div className="flex justify-between items-center pb-2 border-b border-[#2C3E50]/5 mb-3 select-none">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-[#D35400] animate-pulse" />
            <span className="text-[0.6rem] font-mono tracking-widest text-[#2C3E50]/60 uppercase">
              TERRITORIAL STUDY LIMITS: DUAL GEOMETRIES
            </span>
          </div>
          <div className="text-[0.58rem] font-mono text-[#2C3E50]/50 uppercase flex space-x-3">
            <span>GRID: 100M × 100M (8,625 CELLS)</span>
            <span>·</span>
            <span className="text-[#D35400] font-semibold">TRANSECT: 200M × 4,000M CORRIDOR (VERIFIED)</span>
          </div>
        </div>

        {/* Map graphics canvas */}
        <div className="flex-1 w-full relative overflow-hidden bg-[#F5F5F0]/30 rounded border border-[#2C3E50]/5">
          <svg 
            viewBox="0 0 800 340" 
            className="w-full h-full select-none"
          >
            <defs>
              {/* Muted achromatic fishnet grid pattern */}
              <pattern id="achromatic-fishnet" width="12.0" height="12.0" patternUnits="userSpaceOnUse">
                <rect width="12.0" height="12.0" fill="none" stroke="#2C3E50" strokeWidth="0.15" strokeOpacity="0.08" />
              </pattern>
            </defs>

            {/* 1. TERRAIN BASEMAP OUTLINES (Muted greyscale) */}
            {/* Coastline (Adriatic Sea is upper right) */}
            <path 
              d="M 580,-20 Q 640,110 710,180 T 840,290 L 840,-20 Z" 
              fill="#2C3E50" 
              fillOpacity="0.02" 
              stroke="#2C3E50" 
              strokeWidth="0.4" 
              strokeOpacity="0.1"
              strokeDasharray="2,3"
            />
            <text x="735" y="45" className="font-mono text-[5.5px] fill-[#2C3E50]/20 tracking-widest uppercase rotate-45">Adriatic Coast</text>

            {/* Regional topography contours */}
            <path d="M -10,190 Q 200,170 400,250 T 810,130" fill="none" stroke="#2C3E50" strokeWidth="0.2" strokeOpacity="0.06" />
            <path d="M -10,250 Q 250,220 450,300 T 810,220" fill="none" stroke="#2C3E50" strokeWidth="0.2" strokeOpacity="0.06" />
            <path d="M -10,120 Q 180,100 350,160 T 810,60" fill="none" stroke="#2C3E50" strokeWidth="0.2" strokeOpacity="0.06" />

            {/* Lecce Historical Core (Center-Left) */}
            <circle cx="210" cy="170" r="42" fill="none" stroke="#2C3E50" strokeWidth="0.5" strokeOpacity="0.18" strokeDasharray="3 2" />
            <circle cx="210" cy="170" r="30" fill="#2C3E50" fillOpacity="0.03" stroke="#2C3E50" strokeWidth="0.4" strokeOpacity="0.15" />
            <circle cx="210" cy="170" r="12" fill="#2C3E50" fillOpacity="0.04" stroke="#2C3E50" strokeWidth="0.3" strokeOpacity="0.1" />
            <text x="210" y="172.5" className="font-sans font-bold text-[5.5px] fill-[#2C3E50]/30 tracking-wider text-center" textAnchor="middle">HISTORIC CORE</text>

            {/* Radial Expansion Roads */}
            <line x1="210" y1="170" x2="35" y2="70" stroke="#2C3E50" strokeWidth="0.3" strokeOpacity="0.1" />
            <line x1="210" y1="170" x2="420" y2="70" stroke="#2C3E50" strokeWidth="0.3" strokeOpacity="0.1" />
            <line x1="210" y1="170" x2="390" y2="290" stroke="#2C3E50" strokeWidth="0.3" strokeOpacity="0.1" />
            <line x1="210" y1="170" x2="60" y2="260" stroke="#2C3E50" strokeWidth="0.3" strokeOpacity="0.1" />

            {/* Urban Expansion Rings */}
            <circle cx="210" cy="170" r="85" fill="none" stroke="#2C3E50" strokeWidth="0.25" strokeOpacity="0.08" strokeDasharray="5,5" />
            <circle cx="210" cy="170" r="145" fill="none" stroke="#2C3E50" strokeWidth="0.25" strokeOpacity="0.05" strokeDasharray="5,5" />

            {/* 2. THE DENSE FISHNET GRID OVERLAY (Achromatic, muted) */}
            <g id="fishnet-boundary-layer">
              {/* Main Analytical Grid Polygon */}
              <motion.polygon 
                points="120,70 480,50 560,190 440,290 180,300 90,190" 
                fill="url(#achromatic-fishnet)" 
                stroke="#2C3E50" 
                strokeWidth="1.0" 
                strokeOpacity="0.3"
                initial={{ strokeDasharray: "1000", strokeDashoffset: "1000", fillOpacity: 0 }}
                animate={{ strokeDashoffset: 0, fillOpacity: 1 }}
                transition={{ duration: 1.2, ease: "easeInOut", delay: 0.2 }}
              />

              {/* Study Area Outline Dash */}
              <polygon 
                points="120,70 480,50 560,190 440,290 180,300 90,190" 
                fill="none" 
                stroke="#2C3E50" 
                strokeWidth="0.4" 
                strokeOpacity="0.15"
                strokeDasharray="4 4"
              />
            </g>

            {/* 3. DESIGN TRANSECT - VERIFIED GEOMETRY (Dashed boundary, prominent --heat highlight) */}
            <g id="design-transect-layer">
              {/* Corridor Highlight Band (Low opacity orange fill) */}
              <motion.path
                d={pathString}
                fill="#D35400"
                fillOpacity="0.08"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.0, ease: "easeOut", delay: 0.6 }}
              />

              {/* Corridor Outer Outline (Dashed prominent heat highlight) */}
              <motion.path
                d={pathString}
                fill="none"
                stroke="#D35400"
                strokeWidth="1.5"
                strokeDasharray="4,4"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.2, ease: "easeOut", delay: 0.6 }}
              />

              {/* Midpoint start and end indicator dots */}
              <motion.circle 
                cx="251.30" cy="122.10" r="3.5" 
                fill="#D35400"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.6 }}
              />
              <motion.circle 
                cx="171.30" cy="-24.50" r="3.5" 
                fill="#D35400"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, delay: 1.6 }}
              />
            </g>

            {/* Faint regional labels */}
            <text x="350" y="90" className="font-mono text-[4.5px] fill-[#2C3E50]/20 tracking-widest uppercase">Fringe Territory</text>
            <text x="490" y="260" className="font-mono text-[4.5px] fill-[#2C3E50]/20 tracking-widest uppercase">Agricultural Matrix</text>

            {/* 4. ANNOTATIONS & CONNECTORS (drawn in SVG space for perfect scalability) */}

            {/* CALLOUT 1: The Analytical Grid */}
            <motion.g
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: callout1Delay }}
            >
              {/* Pointer line */}
              <motion.path
                d="M 570,100 L 480,100 L 390,140"
                fill="none"
                stroke="#2C3E50"
                strokeWidth="0.75"
                strokeOpacity="0.4"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.6, delay: callout1Delay }}
              />
              {/* Pointer terminal circle */}
              <circle cx="390" cy="140" r="2" fill="#2C3E50" fillOpacity="0.7" />

              {/* Callout Card 1 using foreignObject */}
              <foreignObject x="530" y="45" width="230" height="95">
                <div className="bg-white/95 border border-[#2C3E50]/15 rounded shadow-sm p-2.5 text-left font-sans select-text pointer-events-auto">
                  <div className="flex items-center space-x-1.5 mb-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#2C3E50]/60" />
                    <span className="text-[0.55rem] font-mono tracking-wider text-[#2C3E50]/70 font-bold uppercase">
                      DUAL GEOMETRY I
                    </span>
                  </div>
                  <h3 className="text-[0.68rem] font-sans font-bold text-[#2C3E50] leading-tight mb-0.5 uppercase tracking-tight">
                    THE ANALYTICAL GRID
                  </h3>
                  <p className="text-[0.62rem] text-[#2C3E50]/85 leading-snug">
                    The analytical grid — <strong className="text-[#D35400] font-semibold">8,625 cells</strong>, where we measure the fringe.
                  </p>
                  <div className="mt-1 pt-1 border-t border-[#2C3E50]/5 text-[0.48rem] font-mono text-[#2C3E50]/50 uppercase tracking-wider flex justify-between">
                    <span>100m Fishnet</span>
                    <span>WGS 84 UTM 34N</span>
                  </div>
                </div>
              </foreignObject>
            </motion.g>

            {/* CALLOUT 2: The Design Transect */}
            <motion.g
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: callout2Delay }}
            >
              {/* Pointer line */}
              <motion.path
                d={`M 120,255 L 195,255 L ${calloutTargetX},${calloutTargetY}`}
                fill="none"
                stroke="#D35400"
                strokeWidth="0.75"
                strokeOpacity="0.5"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.6, delay: callout2Delay }}
              />
              {/* Pointer terminal circle */}
              <circle cx={calloutTargetX} cy={calloutTargetY} r="2" fill="#D35400" />

              {/* Callout Card 2 using foreignObject */}
              <foreignObject x="40" y="210" width="230" height="95">
                <div className="bg-white/95 border border-[#D35400]/20 rounded shadow-sm p-2.5 text-left font-sans select-text pointer-events-auto">
                  <div className="flex items-center space-x-1.5 mb-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D35400]" />
                    <span className="text-[0.55rem] font-mono tracking-wider text-[#D35400] font-bold uppercase">
                      DUAL GEOMETRY II
                    </span>
                  </div>
                  <h3 className="text-[0.68rem] font-sans font-bold text-[#D35400] leading-tight mb-0.5 uppercase tracking-tight">
                    THE DESIGN TRANSECT
                  </h3>
                  <p className="text-[0.62rem] text-[#2C3E50]/85 leading-snug">
                    The design transect — <strong className="text-[#2C3E50] font-semibold">4 km corridor</strong>, historic core to rural matrix, where we propose the response.
                  </p>
                  <div className="mt-1 pt-1 border-t border-[#D35400]/10 text-[0.48rem] font-mono text-[#D35400]/60 uppercase tracking-wider flex justify-between">
                    <span>Transect Corridor</span>
                    <span>200m × 4,000m (Verified)</span>
                  </div>
                </div>
              </foreignObject>
            </motion.g>

          </svg>

          {/* Compass layout absolute corner */}
          <div className="absolute bottom-3 right-4 flex items-center space-x-2 select-none bg-white/40 px-2 py-1 rounded backdrop-blur-sm border border-[#2C3E50]/5">
            <Compass size={14} className="text-[#2C3E50]/40 animate-pulse" style={{ animationDuration: '6s' }} />
            <span className="text-[0.55rem] font-mono tracking-widest text-[#2C3E50]/40 uppercase">
              SECTOR 04 // NORTH ORIENTED
            </span>
          </div>

          {/* Coordinate frames */}
          <div className="absolute top-2 left-3 font-mono text-[0.45rem] text-[#2C3E50]/35 select-none">
            40°21'N / 18°10'E
          </div>
          <div className="absolute bottom-2 left-3 font-mono text-[0.45rem] text-[#2C3E50]/35 select-none">
            WGS 84 ESPG:32634
          </div>
        </div>

        {/* Legend / Info bar */}
        <div className="flex justify-between items-center mt-3 pt-2 border-t border-[#2C3E50]/5 text-[0.55rem] font-mono text-[#2C3E50]/40 uppercase select-none">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <span className="w-2.5 h-1.5 border border-[#2C3E50]/30 bg-[#2C3E50]/5 opacity-60" />
              <span>Analytical Grid Limit</span>
            </div>
            <div className="flex items-center space-x-1">
              <span className="w-3 h-0.5 bg-[#D35400] border-t border-dashed border-[#D35400]" />
              <span className="text-[#D35400] font-semibold">Design Transect</span>
            </div>
          </div>
          <span>REFERENCE SYSTEM: UTM ZONE 34N</span>
        </div>
      </motion.div>
    </div>
  );
}
