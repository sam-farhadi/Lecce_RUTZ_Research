import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { transectData, TransectPoint } from '../transect_data';
import { 
  Compass, 
  TrendingUp, 
  Calendar, 
  HelpCircle, 
  Sparkles, 
  Info,
  Layers,
  Thermometer
} from 'lucide-react';

type SeasonType = 'summer' | 'spring' | 'winter';
type MetricType = 'LST' | 'NDVI' | 'NDMI' | 'BSI';

const metricInfo = {
  LST: {
    name: "Land Surface Temperature",
    unit: "°C",
    desc: "Derived from thermal infrared bands (Landsat TIRS), reflecting skin-surface heat emission.",
    index: 0
  },
  NDVI: {
    name: "Normalized Difference Vegetation Index",
    unit: "",
    desc: "Measures photosynthetic activity and chlorophyll concentration, tracking canopy vigor.",
    index: 1
  },
  NDMI: {
    name: "Normalized Difference Moisture Index",
    unit: "",
    desc: "Sensitive to water content in plant canopies and soils, tracking moisture gradients.",
    index: 2
  },
  BSI: {
    name: "Bare Soil Index",
    unit: "",
    desc: "Highlights soil exposure and mineral density, mapping karst and construction exposure.",
    index: 3
  }
};

const interpretiveTexts: Record<SeasonType, Record<MetricType, string>> = {
  summer: {
    LST: "Under intense summer solar radiation, the open rural karst behaves as a massive thermal battery, running hotter than the city. Over ten years, this rural-to-core thermal gap narrowed from +6.9 °C in 2015 to +4.7 °C in 2025, demonstrating a microclimatic narrowing.",
    NDVI: "Summer canopy vigor is highly fragmented. The historical core (0m) remains heavily mineralized, with vegetative recovery stalling, while the rural matrix (4,050m) reflects agricultural productivity and pine buffers.",
    NDMI: "Severe summer desiccation. Moisture indexes are negative across both the historic center and rural karst, reflecting acute soil dryness, with surviving canopies offering rare oases.",
    BSI: "Bare soil index peaks in summer, with high-reflectance mineral surfaces clearly demarcating exposed karst terraces and urban roads from shaded gardens."
  },
  spring: {
    LST: "In spring, the textbook UHI holds: the dense, paved historic Roman core remains a massive thermal mass, running hotter than the rural envelope. The temperature difference expanded from -1.6 °C in 2015 to -3.2 °C in 2025.",
    NDVI: "Spring vegetative greenness peaks deck-wide. Photosynthetic activity shows robust, healthy gradients as we transition away from the mineral city out into the productive countryside.",
    NDMI: "Spring moisture levels are stable and positive across agricultural margins, buffered by winter recharge before summer desiccation begins.",
    BSI: "Bare soil values are low in spring, as young annual crops and wild grasses blanket the Salento landscape, softening the mineral footprint."
  },
  winter: {
    LST: "Winter exhibits a standard, quiet rural-to-core gradient. The thermal gap remains highly stable, drifting only slightly from +3.9 °C in 2015 to +3.6 °C in 2025, representing a gentle, cold-season equilibrium.",
    NDVI: "Winter vegetation is dominated by broadleaved evergreen canopies, with annual crop fields laying fallow and grasses showing dormant profiles.",
    NDMI: "High winter saturation. Soil and tree moisture remain high across the entire transect length, showing consistent baseline moisture values.",
    BSI: "Fallow fields and harvested agricultural zones show elevated bare soil signatures in winter, creating localized mineral spikes."
  }
};

const meansLST = {
  summer: {
    2015: 47.467,
    2025: 45.539,
  },
  spring: {
    2015: 31.033,
    2025: 30.099,
  }
};

const getPointUTFVIClass = (pt: TransectPoint, season: 'summer' | 'spring' | 'winter', year: 2015 | 2025) => {
  if (season === 'winter') return 1; // Winter is unclassified anyway
  const lst = season === 'summer'
    ? (year === 2015 ? pt.summer2015[0] : pt.summer2025[0])
    : (year === 2015 ? pt.spring2015[0] : pt.spring2025[0]);
  
  const mean = meansLST[season][year];
  const utfvi = (lst - mean) / mean;
  
  if (utfvi < 0) return 1;
  if (utfvi < 0.002) return 2;
  if (utfvi < 0.006) return 3;
  if (utfvi < 0.015) return 4;
  return 5;
};

const getUTFVIColor = (cls: number) => {
  switch (cls) {
    case 1: return 'var(--color-canopy)'; // #4A5D23
    case 2: return 'var(--color-sage)';   // #8F9E8B
    case 3: return 'var(--color-sand)';   // #E5D5C5
    case 4: return 'var(--color-heat)';   // #D35400
    case 5: return 'var(--color-shadow)'; // #2C3E50
    default: return 'var(--color-stone)';
  }
};

const getUTFVILabel = (cls: number) => {
  switch (cls) {
    case 1: return 'Strong cooling';
    case 2: return 'Mild';
    case 3: return 'Moderate stress';
    case 4: return 'Significant stress';
    case 5: return 'Extreme stress';
    default: return '';
  }
};

export default function FourKilometresTenYears() {
  const [season, setSeason] = useState<SeasonType>('summer');
  const [metric, setMetric] = useState<MetricType>('LST');
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [showAreaDifference, setShowAreaDifference] = useState(true);
  const chartRef = useRef<SVGSVGElement>(null);
  const [chartWidth, setChartWidth] = useState(800);
  const [chartHeight, setChartHeight] = useState(320);

  // Measure container size dynamically for responsiveness
  useEffect(() => {
    if (!chartRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const width = entry.contentRect.width || 800;
        // Maintain the 0.4 aspect ratio dynamically, ensuring a minimum height of 280px
        const height = Math.max(280, width * 0.4);
        setChartWidth(width);
        setChartHeight(height);
      }
    });
    observer.observe(chartRef.current.parentElement || chartRef.current);
    return () => observer.disconnect();
  }, []);

  // Access value helper
  const getPointValue = (pt: TransectPoint, yr: 2015 | 2025) => {
    const key = `${season}${yr}` as const;
    const dataArray = pt[key];
    const metricIdx = metricInfo[metric].index;
    return dataArray[metricIdx];
  };

  // Extract values arrays
  const vals2015 = transectData.map(pt => getPointValue(pt, 2015));
  const vals2025 = transectData.map(pt => getPointValue(pt, 2025));
  const allVals = [...vals2015, ...vals2025];
  
  // Calculate axis bounds dynamically
  const rawMin = Math.min(...allVals);
  const rawMax = Math.max(...allVals);
  const valRange = rawMax - rawMin;
  const padding = valRange * 0.1 || 0.1;
  const yMin = rawMin - padding;
  const yMax = rawMax + padding;

  // Chart coordinate mapping
  const margin = { top: 30, right: 30, bottom: 45, left: 50 };
  const getX = (dist: number) => {
    const rangeX = chartWidth - margin.left - margin.right;
    return margin.left + (dist / 4050) * rangeX;
  };
  const getY = (val: number) => {
    const rangeY = chartHeight - margin.top - margin.bottom;
    return chartHeight - margin.bottom - ((val - yMin) / (yMax - yMin)) * rangeY;
  };

  // Dynamic Delta Calculations (First vs Last index)
  const core2015 = getPointValue(transectData[0], 2015);
  const rural2015 = getPointValue(transectData[transectData.length - 1], 2015);
  const delta2015 = rural2015 - core2015;

  const core2025 = getPointValue(transectData[0], 2025);
  const rural2025 = getPointValue(transectData[transectData.length - 1], 2025);
  const delta2025 = rural2025 - core2025;

  const gapShift = delta2025 - delta2015;

  // Render SVG Paths
  const createPathD = (vals: number[]) => {
    if (vals.length === 0) return '';
    const points = vals.map((val, idx) => {
      const pt = transectData[idx];
      return { x: getX(pt.distance), y: getY(val) };
    });

    let d = `M ${points[0].x} ${points[0].y}`;
    const tension = 0.15; // Smooth curve tension parameter

    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[Math.max(0, i - 1)];
      const p1 = points[i];
      const p2 = points[i + 1];
      const p3 = points[Math.min(points.length - 1, i + 2)];
      
      const cp1x = p1.x + (p2.x - p0.x) * tension;
      const cp1y = p1.y + (p2.y - p0.y) * tension;
      
      const cp2x = p2.x - (p3.x - p1.x) * tension;
      const cp2y = p2.y - (p3.y - p1.y) * tension;
      
      d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
    }
    return d;
  };

  const createAreaPathD = (vals15: number[], vals25: number[]) => {
    if (vals15.length === 0) return '';
    const points15 = vals15.map((val, idx) => {
      const pt = transectData[idx];
      return { x: getX(pt.distance), y: getY(val) };
    });
    const points25 = vals25.map((val, idx) => {
      const pt = transectData[idx];
      return { x: getX(pt.distance), y: getY(val) };
    });

    let d = `M ${points15[0].x} ${points15[0].y}`;
    const tension = 0.15;

    for (let i = 0; i < points15.length - 1; i++) {
      const p0 = points15[Math.max(0, i - 1)];
      const p1 = points15[i];
      const p2 = points15[i + 1];
      const p3 = points15[Math.min(points15.length - 1, i + 2)];
      
      const cp1x = p1.x + (p2.x - p0.x) * tension;
      const cp1y = p1.y + (p2.y - p0.y) * tension;
      
      const cp2x = p2.x - (p3.x - p1.x) * tension;
      const cp2y = p2.y - (p3.y - p1.y) * tension;
      
      d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
    }

    d += ` L ${points25[points25.length - 1].x} ${points25[points25.length - 1].y}`;

    const revPoints25 = [...points25].reverse();
    for (let i = 0; i < revPoints25.length - 1; i++) {
      const p0 = revPoints25[Math.max(0, i - 1)];
      const p1 = revPoints25[i];
      const p2 = revPoints25[i + 1];
      const p3 = revPoints25[Math.min(revPoints25.length - 1, i + 2)];
      
      const cp1x = p1.x + (p2.x - p0.x) * tension;
      const cp1y = p1.y + (p2.y - p0.y) * tension;
      
      const cp2x = p2.x - (p3.x - p1.x) * tension;
      const cp2y = p2.y - (p3.y - p1.y) * tension;
      
      d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
    }

    d += ' Z';
    return d;
  };

  // Handle chart hovering logic
  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    if (!chartRef.current) return;
    const rect = chartRef.current.getBoundingClientRect();
    const clientX = e.clientX - rect.left;
    
    // Reverse map from x coordinate to closest distance point index (0 to 81)
    const rangeX = chartWidth - margin.left - margin.right;
    const pct = (clientX - margin.left) / rangeX;
    
    if (pct < -0.02 || pct > 1.02) {
      setHoverIndex(null);
      return;
    }
    
    const targetDist = Math.max(0, Math.min(1, pct)) * 4050;
    const closestIdx = Math.round(targetDist / 50);
    const validIdx = Math.max(0, Math.min(transectData.length - 1, closestIdx));
    setHoverIndex(validIdx);
  };

  const handleMouseLeave = () => {
    setHoverIndex(null);
  };

  // Format deltas
  const formatDelta = (val: number) => {
    const sign = val > 0 ? '+' : '';
    return `${sign}${val.toFixed(2)}${metricInfo[metric].unit}`;
  };

  // Selected hover point attributes
  const hoverPoint = hoverIndex !== null ? transectData[hoverIndex] : null;
  const hoverVal2015 = hoverPoint ? getPointValue(hoverPoint, 2015) : 0;
  const hoverVal2025 = hoverPoint ? getPointValue(hoverPoint, 2025) : 0;
  const hoverDelta = hoverVal2025 - hoverVal2015;

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch font-sans text-[#2C3E50]" id="transect-measured-container">
      
      {/* LEFT COLUMN: CONTROLS & INTELLIGENT READING (lg:col-span-4, width ~35%) */}
      <div className="lg:col-span-4 flex flex-col justify-between space-y-5 bg-white/60 backdrop-blur-sm p-5 rounded-lg border border-[#2C3E50]/10 shadow-sm" id="transect-sidebar">
        
        {/* Controls Section */}
        <div className="space-y-5">
          <div className="flex items-center justify-between border-b border-[#2C3E50]/10 pb-2">
            <span className="text-[0.62rem] font-mono tracking-widest text-[#2C3E50]/50 uppercase">
              TRANSECT PARAMETERS
            </span>
          </div>

          {/* Season Toggle Pill Container */}
          <div className="space-y-2">
            <label className="text-[0.62rem] font-mono tracking-wider text-[#2C3E50]/60 uppercase block">
              1. Select Season
            </label>
            <div className="grid grid-cols-3 bg-[#2C3E50]/5 p-1 rounded-md border border-[#2C3E50]/10">
              {(['spring', 'summer', 'winter'] as SeasonType[]).map((s) => (
                <button
                  key={s}
                  onClick={() => setSeason(s)}
                  className={`py-1.5 text-[0.68rem] font-sans font-bold uppercase tracking-wider rounded transition-all ${
                    season === s 
                      ? 'bg-[#D35400] text-white shadow-sm' 
                      : 'text-[#2C3E50]/60 hover:text-[#2C3E50] hover:bg-white/30'
                  }`}
                  id={`btn-season-${s}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Metric Selector Grid */}
          <div className="space-y-2">
            <label className="text-[0.62rem] font-mono tracking-wider text-[#2C3E50]/60 uppercase block">
              2. Select Ecological Indicator
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(['LST', 'NDVI', 'NDMI', 'BSI'] as MetricType[]).map((m) => (
                <button
                  key={m}
                  onClick={() => setMetric(m)}
                  className={`py-2 px-3 text-[0.7rem] font-sans font-bold text-left rounded-md border transition-all flex flex-col justify-between h-14 ${
                    metric === m
                      ? 'border-[#D35400] bg-[#D35400]/5 text-[#D35400]'
                      : 'border-[#2C3E50]/10 bg-white hover:border-[#2C3E50]/30 text-[#2C3E50]/70'
                  }`}
                  id={`btn-metric-${m}`}
                >
                  <div className="flex justify-between items-center w-full">
                    <span className="tracking-wide">{m}</span>
                    <span className="text-[0.55rem] font-mono font-normal opacity-60">
                      {metricInfo[m].unit || 'index'}
                    </span>
                  </div>
                  <span className="text-[0.52rem] font-sans font-light tracking-tight truncate max-w-full opacity-80 leading-none block">
                    {metricInfo[m].name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Intelligent Delta Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${season}-${metric}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35 }}
            className="border-2 border-[#D35400] bg-[#D35400]/5 p-4 rounded-md text-left space-y-3.5 relative overflow-hidden"
            id="intelligent-delta-card"
          >
            {/* Background absolute subtle gradient accent */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#D35400]/5 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-center justify-between border-b border-[#D35400]/15 pb-1.5">
              <div className="flex items-center space-x-1.5">
                <TrendingUp size={13} className="text-[#D35400]" />
                <span className="text-[0.58rem] font-mono uppercase tracking-widest text-[#D35400] font-bold">
                  Core-to-Rural Gradient
                </span>
              </div>
              <span className="text-[0.52rem] font-mono bg-white border border-[#D35400]/20 text-[#D35400] px-1.5 py-0.5 rounded font-semibold uppercase">
                10-year Shift
              </span>
            </div>

            {/* Gap comparison layout */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col">
                <span className="text-[0.52rem] font-mono text-[#2C3E50]/55 uppercase leading-none mb-1">
                  2015 Gap
                </span>
                <span className="text-xl font-sans font-bold text-[#2C3E50]">
                  {formatDelta(delta2015)}
                </span>
                <span className="text-[0.48rem] font-sans text-[#2C3E50]/45 mt-0.5">
                  Core vs. Rural Envelope
                </span>
              </div>
              <div className="flex flex-col border-l border-[#D35400]/15 pl-4">
                <span className="text-[0.52rem] font-mono text-[#D35400]/80 uppercase leading-none mb-1 font-bold">
                  2025 Gap
                </span>
                <span className="text-xl font-sans font-bold text-[#D35400]">
                  {formatDelta(delta2025)}
                </span>
                <span className="text-[0.48rem] font-sans text-[#D35400]/60 mt-0.5 font-medium">
                  Core vs. Rural Envelope
                </span>
              </div>
            </div>

            {/* Dynamic interpretive caption */}
            <div className="bg-white/70 backdrop-blur-sm p-2.5 rounded border border-[#D35400]/10 text-[0.72rem] leading-relaxed text-[#2C3E50] font-light">
              {interpretiveTexts[season][metric]}
            </div>

            {/* Compact Technical Legend */}
            <div className="flex items-center justify-between text-[0.52rem] font-mono text-[#2C3E50]/45 pt-1">
              <div className="flex items-center space-x-1.5">
                <div className="w-2.5 h-0.5 bg-[#B0A99F]" />
                <span>2015 baseline</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <div className="w-2.5 h-0.5 bg-[#D35400]" />
                <span>2025 satellite state</span>
              </div>
            </div>

          </motion.div>
        </AnimatePresence>

      </div>

      {/* RIGHT COLUMN: HIGH QUALITY SVG LINE CHART (lg:col-span-8, width ~65%) */}
      <div className="lg:col-span-8 bg-white/60 backdrop-blur-sm p-4 rounded-lg border border-[#2C3E50]/10 shadow-sm flex flex-col justify-between relative min-h-[420px]" id="transect-chart-container">
        
        {/* HUD Top Bar */}
        <div className="flex justify-between items-center pb-2 border-b border-[#2C3E50]/5 mb-4">
          <div className="flex items-center space-x-2">
            <Compass size={12} className="text-[#D35400]" />
            <span className="text-[0.62rem] font-mono tracking-widest text-[#2C3E50] uppercase font-bold">
              TRANSECT CORRIDOR SPECTRUM
            </span>
          </div>
          <div className="text-[0.55rem] font-mono text-[#2C3E50]/55 uppercase flex items-center space-x-3">
            <button 
              onClick={() => setShowAreaDifference(!showAreaDifference)}
              className={`flex items-center space-x-1 px-1.5 py-0.5 rounded border transition-all ${
                showAreaDifference 
                  ? 'bg-[#D35400]/10 border-[#D35400]/30 text-[#D35400] font-bold' 
                  : 'bg-transparent border-[#2C3E50]/20 text-[#2C3E50]/60 hover:border-[#2C3E50]/40'
              }`}
              id="toggle-area-difference"
            >
              <Layers size={10} className="shrink-0" />
              <span>Area Diff: {showAreaDifference ? 'ON' : 'OFF'}</span>
            </button>
            <span>·</span>
            <span>Points: 82</span>
            <span>·</span>
            <span>Interval: 50m</span>
            <span>·</span>
            <span className="text-[#D35400] font-bold">Lecce Southeast Transect</span>
          </div>
        </div>

        {/* Core Chart Area */}
        <div className="flex-1 w-full relative">
          <svg 
            ref={chartRef}
            className="w-full select-none cursor-crosshair overflow-visible"
            style={{ height: chartHeight }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            id="transect-chart-svg"
          >
            {/* 1. CHART GRIDLINES */}
            <g opacity="0.06">
              {/* Vertical grids every 500m */}
              {[0, 500, 1000, 1500, 2000, 2500, 3000, 3500, 4000].map((dist) => (
                <line 
                  key={`grid-x-${dist}`}
                  x1={getX(dist)}
                  y1={margin.top}
                  x2={getX(dist)}
                  y2={chartHeight - margin.bottom}
                  stroke="#2C3E50"
                  strokeWidth="1"
                />
              ))}

              {/* Horizontal grids (4 intervals) */}
              {[0, 0.25, 0.5, 0.75, 1].map((p) => {
                const val = yMin + p * (yMax - yMin);
                return (
                  <line 
                    key={`grid-y-${p}`}
                    x1={margin.left}
                    y1={getY(val)}
                    x2={chartWidth - margin.right}
                    y2={getY(val)}
                    stroke="#2C3E50"
                    strokeWidth="1"
                  />
                );
              })}
            </g>

            {/* 2. AXIS LINES */}
            <line 
              x1={margin.left}
              y1={chartHeight - margin.bottom}
              x2={chartWidth - margin.right}
              y2={chartHeight - margin.bottom}
              stroke="#2C3E50"
              strokeWidth="0.75"
              strokeOpacity="0.25"
            />
            <line 
              x1={margin.left}
              y1={margin.top}
              x2={margin.left}
              y2={chartHeight - margin.bottom}
              stroke="#2C3E50"
              strokeWidth="0.75"
              strokeOpacity="0.25"
            />

            {/* 3. X-AXIS LABELS AND TICK MARKS */}
            {/* Label marks every 500m */}
            {[0, 500, 1000, 1500, 2000, 2500, 3000, 3500, 4000].map((dist) => {
              const xCoord = getX(dist);
              return (
                <g key={`tick-x-${dist}`} className="font-mono text-[9px] fill-[#2C3E50]/55">
                  <line 
                    x1={xCoord}
                    y1={chartHeight - margin.bottom}
                    x2={xCoord}
                    y2={chartHeight - margin.bottom + 4}
                    stroke="#2C3E50"
                    strokeWidth="0.75"
                    strokeOpacity="0.3"
                  />
                  <text 
                    x={xCoord}
                    y={chartHeight - margin.bottom + 15}
                    textAnchor="middle"
                    className="font-bold tracking-tight"
                  >
                    {dist === 0 ? 'Core (0m)' : dist === 4000 ? '4,000m' : `${dist}m`}
                  </text>
                </g>
              );
            })}

            {/* 4. Y-AXIS LABELS AND TICK MARKS */}
            {[0, 0.25, 0.5, 0.75, 1].map((p) => {
              const val = yMin + p * (yMax - yMin);
              const yCoord = getY(val);
              return (
                <g key={`tick-y-${p}`} className="font-mono text-[9px] fill-[#2C3E50]/55">
                  <line 
                    x1={margin.left - 4}
                    y1={yCoord}
                    x2={margin.left}
                    y2={yCoord}
                    stroke="#2C3E50"
                    strokeWidth="0.75"
                    strokeOpacity="0.3"
                  />
                  <text 
                    x={margin.left - 8}
                    y={yCoord + 3}
                    textAnchor="end"
                    className="font-bold"
                  >
                    {val.toFixed(metric === 'LST' ? 1 : 2)}{metricInfo[metric].unit}
                  </text>
                </g>
              );
            })}

            {/* 5. DATA LINES (ANIMATED) */}
            {/* Area Difference Shading */}
            {showAreaDifference && (
              <motion.path
                d={createAreaPathD(vals2015, vals2025)}
                fill="#D35400"
                fillOpacity="0.12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                key={`area-diff-${season}-${metric}-${chartWidth}`}
                transition={{ duration: 0.6 }}
              />
            )}

            {/* 2015 Line: Muted grey (#B0A99F) */}
            <motion.path
              d={createPathD(vals2015)}
              fill="none"
              stroke="#B0A99F"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.8 }}
              key={`line-15-${season}-${metric}-${chartWidth}`}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />

            {/* 2025 Line: Active Heat Accent (#D35400) */}
            <motion.path
              d={createPathD(vals2025)}
              fill="none"
              stroke="#D35400"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              key={`line-25-${season}-${metric}-${chartWidth}`}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
            />

            {/* 6. DYNAMIC ACTIVE SCRUBBER & TOOLTIP */}
            {hoverIndex !== null && hoverPoint && (
              <g>
                {/* Scrubber vertical line */}
                <line 
                  x1={getX(hoverPoint.distance)}
                  y1={margin.top}
                  x2={getX(hoverPoint.distance)}
                  y2={chartHeight - margin.bottom}
                  stroke="#D35400"
                  strokeWidth="1.5"
                  strokeDasharray="2 2"
                  className="animate-pulse"
                />

                {/* Scrubber points on the path */}
                <circle 
                  cx={getX(hoverPoint.distance)}
                  cy={getY(hoverVal2015)}
                  r="4"
                  fill="#B0A99F"
                  stroke="white"
                  strokeWidth="1.5"
                  className="shadow-sm"
                />
                <circle 
                  cx={getX(hoverPoint.distance)}
                  cy={getY(hoverVal2025)}
                  r="5"
                  fill="#D35400"
                  stroke="white"
                  strokeWidth="2"
                  className="shadow-sm"
                />

                {/* Technical Coordinates overlay at the point */}
                <text 
                  x={getX(hoverPoint.distance)}
                  y={margin.top - 10}
                  textAnchor="middle"
                  className="font-mono text-[9px] fill-[#D35400] font-bold bg-[#F5F5F0] px-1 rounded"
                >
                  {hoverPoint.distance}m
                </text>
              </g>
            )}
          </svg>

          {/* FLOAT-RIGHT HUD OVERLAY CARD (DYNAMIC TOOLTIP) */}
          <AnimatePresence>
            {hoverIndex !== null && hoverPoint && (
              <motion.div
                initial={{ opacity: 0, scale: 0.98, y: 5 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98, y: 5 }}
                transition={{ duration: 0.15 }}
                className={`absolute top-2 ${hoverIndex > transectData.length / 2 ? 'left-2' : 'right-2'} bg-[#F5F5F0]/95 backdrop-blur-md p-3.5 rounded-md border border-[#2C3E50]/15 shadow-lg flex flex-col space-y-2 z-10 w-[240px] md:w-[280px] pointer-events-none`}
                id="chart-hover-hud"
              >
                {/* Point Title */}
                <div className="flex justify-between items-center border-b border-[#2C3E50]/10 pb-1.5">
                  <div className="flex items-center space-x-1.5">
                    <span className="h-2 w-2 rounded-full bg-[#D35400] animate-ping" />
                    <span className="text-[0.6rem] font-mono tracking-wider text-[#D35400] uppercase font-bold">
                      TRANSECT UNIT {hoverPoint.objectId}
                    </span>
                  </div>
                  <span className="text-[0.62rem] font-mono font-bold bg-[#2C3E50]/5 text-[#2C3E50] px-1.5 py-0.5 rounded">
                    {hoverPoint.distance}m
                  </span>
                </div>

                {/* Material Typology */}
                <div className="space-y-1">
                  <div className="flex justify-between items-start space-x-2">
                    <span className="text-[0.52rem] font-mono text-[#2C3E50]/45 uppercase mt-0.5">CORINE LC:</span>
                    <span className="text-[0.62rem] font-sans font-bold text-[#2C3E50] truncate max-w-[170px] text-right">
                      {hoverPoint.clc}
                    </span>
                  </div>
                  <div className="flex justify-between items-start space-x-2">
                    <span className="text-[0.52rem] font-mono text-[#2C3E50]/45 uppercase mt-0.5">URBAN ATLAS:</span>
                    <span className="text-[0.55rem] font-sans font-medium text-[#2C3E50]/75 text-right max-w-[170px] leading-tight block">
                      {hoverPoint.urbanAtlas}
                    </span>
                  </div>
                </div>

                {/* Values Comparison */}
                <div className="pt-2 border-t border-[#2C3E50]/5 grid grid-cols-3 gap-2 text-center bg-white/40 p-1.5 rounded border border-[#2C3E50]/5">
                  <div className="flex flex-col">
                    <span className="text-[0.5rem] font-mono text-[#2C3E50]/50 uppercase leading-none">2015</span>
                    <span className="text-[0.78rem] font-sans font-bold text-[#2C3E50]/70 mt-1">
                      {hoverVal2015.toFixed(2)}{metricInfo[metric].unit}
                    </span>
                  </div>
                  <div className="flex flex-col border-l border-[#2C3E50]/5">
                    <span className="text-[0.5rem] font-mono text-[#D35400] uppercase leading-none font-bold">2025</span>
                    <span className="text-[0.78rem] font-sans font-bold text-[#D35400] mt-1">
                      {hoverVal2025.toFixed(2)}{metricInfo[metric].unit}
                    </span>
                  </div>
                  <div className="flex flex-col border-l border-[#2C3E50]/5">
                    <span className="text-[0.5rem] font-mono text-[#2C3E50]/50 uppercase leading-none">Shift</span>
                    <span className={`text-[0.78rem] font-sans font-black mt-1 ${hoverDelta > 0 ? 'text-[#D35400]' : 'text-emerald-700'}`}>
                      {hoverDelta > 0 ? '+' : ''}{hoverDelta.toFixed(2)}
                    </span>
                  </div>
                </div>

                {season !== 'winter' && (
                  <div className="pt-2 border-t border-[#2C3E50]/5 space-y-1 bg-white/40 p-1.5 rounded border border-[#2C3E50]/5 text-left">
                    <span className="text-[0.5rem] font-mono text-[#2C3E50]/50 uppercase block mb-1">UTFVI Thermal Stress:</span>
                    <div className="flex items-center justify-between text-[0.62rem]">
                      <span className="text-[#2C3E50]/60">2015 Class:</span>
                      <div className="flex items-center space-x-1.5">
                        <div 
                          className="w-1.5 h-1.5 rounded-full" 
                          style={{ backgroundColor: getUTFVIColor(getPointUTFVIClass(hoverPoint, season, 2015)) }} 
                        />
                        <span className="font-bold text-[#2C3E50]/80">
                          {getUTFVILabel(getPointUTFVIClass(hoverPoint, season, 2015))}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-[0.62rem]">
                      <span className="text-[#D35400]/80 font-medium">2025 Class:</span>
                      <div className="flex items-center space-x-1.5">
                        <div 
                          className="w-1.5 h-1.5 rounded-full" 
                          style={{ backgroundColor: getUTFVIColor(getPointUTFVIClass(hoverPoint, season, 2025)) }} 
                        />
                        <span className="font-bold text-[#D35400]">
                          {getUTFVILabel(getPointUTFVIClass(hoverPoint, season, 2025))}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Axis Labels and Indicator Info */}
        <div className="flex flex-col md:flex-row md:items-center justify-between border-t border-[#2C3E50]/10 pt-3 mt-2 text-left gap-4">
          <div className="flex items-start space-x-3 max-w-md">
            <Info size={14} className="text-[#D35400] mt-0.5 shrink-0" />
            <div className="space-y-0.5">
              <span className="text-[0.62rem] font-mono tracking-wider text-[#2C3E50] uppercase font-bold leading-none block">
                {metricInfo[metric].name} ({metric})
              </span>
              <p className="text-[0.68rem] text-[#2C3E50]/75 leading-relaxed font-light">
                {metricInfo[metric].desc}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4 bg-[#2C3E50]/5 px-3 py-1.5 rounded text-[0.65rem] font-mono self-end">
            <div className="flex items-center space-x-1.5">
              <span className="text-[#B0A99F] font-bold">●</span>
              <span className="text-[#2C3E50]/70">2015 baseline</span>
            </div>
            <span className="text-[#2C3E50]/20">|</span>
            <div className="flex items-center space-x-1.5">
              <span className="text-[#D35400] font-bold">●</span>
              <span className="text-[#D35400] font-bold">2025 satellite state</span>
            </div>
          </div>
        </div>

        {/* UTFVI Thermal Stress Classification Addendum */}
        <div className="border-t border-[#2C3E50]/10 pt-4 mt-4" id="utfvi-stress-strip-addendum">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <Thermometer size={13} className="text-[#D35400]" />
              <span className="text-[0.62rem] font-mono tracking-widest text-[#2C3E50] uppercase font-bold">
                Urban Thermal Field Variance Index (UTFVI)
              </span>
            </div>
            {season === 'winter' && (
              <span className="text-[0.55rem] font-mono text-[#2C3E50]/55 uppercase bg-[#2C3E50]/5 px-2 py-0.5 rounded">
                Omitted
              </span>
            )}
          </div>

          {season === 'winter' ? (
            <div className="bg-[#2C3E50]/5 p-3 rounded-md text-[0.68rem] text-[#2C3E50]/65 font-sans italic text-center leading-relaxed">
              Winter UTFVI not classified — thermal-stress classification is not meaningful in winter for this climate.
            </div>
          ) : (
            <div className="space-y-4">
              
              {/* Stacked Strips for 2015 and 2025 */}
              <div className="space-y-3.5">
                
                {/* 2015 Strip */}
                <div className="space-y-1.5">
                  <div 
                    className="flex justify-between items-center text-[0.52rem] font-mono uppercase tracking-wider text-[#2C3E50]/60"
                    style={{ 
                      paddingLeft: `${margin.left}px`, 
                      paddingRight: `${margin.right}px` 
                    }}
                  >
                    <span>2015 THERMAL FIELD VARIANCE baseline</span>
                    <span>SPRING/SUMMER SPECTRUM</span>
                  </div>
                  <div 
                    className="h-3.5 rounded-sm flex overflow-hidden border border-[#2C3E50]/10 bg-white/10"
                    style={{ 
                      marginLeft: `${margin.left}px`, 
                      marginRight: `${margin.right}px` 
                    }}
                  >
                    {transectData.map((pt, idx) => {
                      const cls = getPointUTFVIClass(pt, season, 2015);
                      const color = getUTFVIColor(cls);
                      const isHovered = hoverIndex === idx;
                      return (
                        <div 
                          key={`utfvi-15-${idx}`}
                          className={`h-full flex-1 transition-all duration-150 cursor-help ${
                            isHovered ? 'scale-y-130 border-x border-white z-10 shadow-sm' : 'opacity-85 hover:opacity-100'
                          }`}
                          style={{ backgroundColor: color }}
                          onMouseEnter={() => setHoverIndex(idx)}
                          onMouseLeave={() => setHoverIndex(null)}
                        />
                      );
                    })}
                  </div>
                </div>

                {/* 2025 Strip */}
                <div className="space-y-1.5">
                  <div 
                    className="flex justify-between items-center text-[0.52rem] font-mono uppercase tracking-wider text-[#D35400] font-bold"
                    style={{ 
                      paddingLeft: `${margin.left}px`, 
                      paddingRight: `${margin.right}px` 
                    }}
                  >
                    <span>2025 THERMAL FIELD VARIANCE state</span>
                    <span>TEN-YEAR TRANSITION STATE</span>
                  </div>
                  <div 
                    className="h-3.5 rounded-sm flex overflow-hidden border border-[#D35400]/15 bg-white/10"
                    style={{ 
                      marginLeft: `${margin.left}px`, 
                      marginRight: `${margin.right}px` 
                    }}
                  >
                    {transectData.map((pt, idx) => {
                      const cls = getPointUTFVIClass(pt, season, 2025);
                      const color = getUTFVIColor(cls);
                      const isHovered = hoverIndex === idx;
                      return (
                        <div 
                          key={`utfvi-25-${idx}`}
                          className={`h-full flex-1 transition-all duration-150 cursor-help ${
                            isHovered ? 'scale-y-130 border-x border-white z-10 shadow-sm' : 'opacity-85 hover:opacity-100'
                          }`}
                          style={{ backgroundColor: color }}
                          onMouseEnter={() => setHoverIndex(idx)}
                          onMouseLeave={() => setHoverIndex(null)}
                        />
                      );
                    })}
                  </div>
                </div>

              </div>

              {/* Axis markers for the strips */}
              <div 
                className="flex justify-between items-center text-[0.52rem] font-mono text-[#2C3E50]/45 pt-0.5"
                style={{ 
                  paddingLeft: `${margin.left}px`, 
                  paddingRight: `${margin.right}px` 
                }}
              >
                <div className="flex flex-col items-start">
                  <span className="font-bold text-[#2C3E50]/75">Historic Roman Core (0m)</span>
                  <span>Extremely mineralized fabric</span>
                </div>
                <div className="w-16 h-px bg-[#2C3E50]/10" />
                <span className="italic">4.05 Kilometre Spatial Microclimate Transect</span>
                <div className="w-16 h-px bg-[#2C3E50]/10" />
                <div className="flex flex-col items-end text-right">
                  <span className="font-bold text-[#2C3E50]/75">Rural Envelope (4,050m)</span>
                  <span>Evergreen scrub and olive groves</span>
                </div>
              </div>

              {/* Legend with Five Swatches */}
              <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 pt-3 border-t border-[#2C3E50]/5">
                {[
                  { cls: 1, label: 'Strong cooling', color: 'var(--color-canopy)' },
                  { cls: 2, label: 'Mild', color: 'var(--color-sage)' },
                  { cls: 3, label: 'Moderate stress', color: 'var(--color-sand)' },
                  { cls: 4, label: 'Significant stress', color: 'var(--color-heat)' },
                  { cls: 5, label: 'Extreme stress', color: 'var(--color-shadow)' },
                ].map((item) => (
                  <div key={`legend-swatch-${item.cls}`} className="flex items-center space-x-2">
                    <div 
                      className="w-2.5 h-2.5 rounded-sm border border-[#2C3E50]/10 shrink-0" 
                      style={{ backgroundColor: item.color }} 
                    />
                    <span className="text-[0.58rem] font-mono text-[#2C3E50]/75">{item.label}</span>
                  </div>
                ))}
              </div>

            </div>
          )}
        </div>

      </div>

    </div>
  );
}
