import React, { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Compass, 
  TrendingUp, 
  Sparkles, 
  Info,
  Layers,
  Thermometer,
  Grid,
  BarChart3
} from 'lucide-react';

export type SeasonType = 'summer' | 'spring' | 'winter';
export type MetricType = 'LST' | 'NDVI' | 'NDMI' | 'BSI';

const metricInfo = {
  LST: {
    name: "Land Surface Temperature",
    unit: "°C",
    desc: "Derived from thermal infrared bands (Landsat TIRS), reflecting skin-surface heat emission across all 8,625 cells.",
    index: 0
  },
  NDVI: {
    name: "Normalized Difference Vegetation Index",
    unit: "",
    desc: "Measures photosynthetic activity and chlorophyll concentration, tracking canopy vigor territory-wide.",
    index: 1
  },
  NDMI: {
    name: "Normalized Difference Moisture Index",
    unit: "",
    desc: "Sensitive to water content in plant canopies and soils, tracking moisture gradients deck-wide.",
    index: 2
  },
  BSI: {
    name: "Bare Soil Index",
    unit: "",
    desc: "Highlights soil exposure and mineral density, mapping karst exposure across the entire 8,625-cell grid.",
    index: 3
  }
};

const YEARS = [2015, 2018, 2021, 2025] as const;
type YearType = typeof YEARS[number];

// Column helper matching RUTZ_thermal_slim_v2.csv exact column naming scheme
function getColumnName(metric: MetricType | 'UTFVI', year: YearType, season: SeasonType): string {
  const seasonCode = season === 'spring' ? 'Sp' : season === 'summer' ? 'Su' : 'Wi';
  const sensor = (year === 2025 && (season === 'spring' || season === 'winter')) ? 'L9' : 'L8';
  
  if (metric === 'UTFVI') {
    return `MAJORITY_UTFVI_C_MAJ_${year}${seasonCode}_${sensor}`;
  }
  return `MEAN_${metric}_${year}${seasonCode}_${sensor}`;
}

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

interface YearStats {
  year: YearType;
  mean: number;
  p25: number;
  p75: number;
  iqr: number;
  min: number;
  max: number;
  count: number;
}

interface UTFVIStats {
  counts: Record<number, number>;
  percentages: Record<number, number>;
  total: number;
}

export default function GridWideDashboard() {
  const [season, setSeason] = useState<SeasonType>('summer');
  const [metric, setMetric] = useState<MetricType>('LST');
  const [hoverYearIndex, setHoverYearIndex] = useState<number | null>(null);
  const [showShadedBand, setShowShadedBand] = useState(true);
  const [hoveredUTFVIClass, setHoveredUTFVIClass] = useState<{ year: YearType; cls: number } | null>(null);

  const [rawRows, setRawRows] = useState<Record<string, number>[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const chartRef = useRef<SVGSVGElement>(null);
  const [chartWidth, setChartWidth] = useState(800);
  const [chartHeight, setChartHeight] = useState(320);

  // Measure container size dynamically for responsiveness
  useEffect(() => {
    if (!chartRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const width = entry.contentRect.width || 800;
        const height = Math.max(280, width * 0.4);
        setChartWidth(width);
        setChartHeight(height);
      }
    });
    observer.observe(chartRef.current.parentElement || chartRef.current);
    return () => observer.disconnect();
  }, []);

  // Fetch and parse RUTZ_thermal_slim_v2.csv live from public folder
  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    fetch(`${import.meta.env.BASE_URL}RUTZ_thermal_slim_v2.csv`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.text();
      })
      .then((text) => {
        if (!isMounted) return;
        const lines = text.trim().split('\n');
        if (lines.length < 2) throw new Error("CSV file is empty or missing data");

        const headers = lines[0].split(',').map(s => s.trim());
        const rows: Record<string, number>[] = [];

        for (let i = 1; i < lines.length; i++) {
          const line = lines[i].trim();
          if (!line) continue;
          const parts = line.split(',');
          const rowObj: Record<string, number> = {};
          for (let j = 0; j < headers.length; j++) {
            rowObj[headers[j]] = parseFloat(parts[j]);
          }
          rows.push(rowObj);
        }

        setRawRows(rows);
        setLoading(false);
      })
      .catch((err) => {
        if (!isMounted) return;
        console.error("Failed to load CSV:", err);
        setError(err.message || "Failed to load territory CSV data");
        setLoading(false);
      });

    return () => { isMounted = false; };
  }, []);

  // Calculate stats live across all 8,625 rows for each year
  const yearlyStats = useMemo<Record<YearType, YearStats>>(() => {
    const result: Partial<Record<YearType, YearStats>> = {};

    YEARS.forEach((yr) => {
      const col = getColumnName(metric, yr, season);
      const vals: number[] = [];

      for (let i = 0; i < rawRows.length; i++) {
        const val = rawRows[i][col];
        if (val !== undefined && !isNaN(val)) {
          vals.push(val);
        }
      }

      if (vals.length === 0) {
        result[yr] = { year: yr, mean: 0, p25: 0, p75: 0, iqr: 0, min: 0, max: 0, count: 0 };
        return;
      }

      vals.sort((a, b) => a - b);
      const count = vals.length;
      const sum = vals.reduce((a, b) => a + b, 0);
      const mean = sum / count;

      const getP = (pct: number) => {
        const idx = (pct / 100) * (count - 1);
        const lower = Math.floor(idx);
        const upper = Math.ceil(idx);
        const w = idx - lower;
        if (upper >= count) return vals[count - 1];
        return vals[lower] * (1 - w) + vals[upper] * w;
      };

      const p25 = getP(25);
      const p75 = getP(75);

      result[yr] = {
        year: yr,
        mean,
        p25,
        p75,
        iqr: p75 - p25,
        min: vals[0],
        max: vals[count - 1],
        count
      };
    });

    return result as Record<YearType, YearStats>;
  }, [rawRows, season, metric]);

  // Calculate UTFVI stats for 2015 and 2025 live
  const utfviDistribution = useMemo<Record<2015 | 2025, UTFVIStats>>(() => {
    const compute = (yr: 2015 | 2025) => {
      const col = getColumnName('UTFVI', yr, season);
      const counts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
      let total = 0;

      for (let i = 0; i < rawRows.length; i++) {
        const val = rawRows[i][col];
        if (val !== undefined && !isNaN(val)) {
          const cls = Math.round(val);
          if (cls >= 1 && cls <= 5) {
            counts[cls] = (counts[cls] || 0) + 1;
            total++;
          }
        }
      }

      const percentages: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
      if (total > 0) {
        for (let c = 1; c <= 5; c++) {
          percentages[c] = (counts[c] / total) * 100;
        }
      }

      return { counts, percentages, total };
    };

    return {
      2015: compute(2015),
      2025: compute(2025)
    };
  }, [rawRows, season]);

  // 2015 vs 2025 Territory Mean
  const mean2015 = yearlyStats[2015]?.mean || 0;
  const mean2025 = yearlyStats[2025]?.mean || 0;
  const shiftVal = mean2025 - mean2015;

  // Axis bounds for chart
  const p25List = YEARS.map(y => yearlyStats[y]?.p25 || 0);
  const p75List = YEARS.map(y => yearlyStats[y]?.p75 || 0);
  const meanList = YEARS.map(y => yearlyStats[y]?.mean || 0);

  const rawMin = Math.min(...p25List, ...meanList);
  const rawMax = Math.max(...p75List, ...meanList);
  const range = rawMax - rawMin;
  const pad = range * 0.15 || 0.1;
  const yMin = rawMin - pad;
  const yMax = rawMax + pad;

  // Chart Coordinate Mappers
  const margin = { top: 35, right: 40, bottom: 45, left: 55 };
  const getX = (yearIndex: number) => {
    const rangeX = chartWidth - margin.left - margin.right;
    return margin.left + (yearIndex / (YEARS.length - 1)) * rangeX;
  };
  const getY = (val: number) => {
    const rangeY = chartHeight - margin.top - margin.bottom;
    return chartHeight - margin.bottom - ((val - yMin) / (yMax - yMin)) * rangeY;
  };

  // Generate SVG Path for mean line
  const meanPathD = useMemo(() => {
    const points = YEARS.map((yr, idx) => ({
      x: getX(idx),
      y: getY(yearlyStats[yr]?.mean || 0)
    }));
    return `M ${points[0].x} ${points[0].y} ` + points.slice(1).map(p => `L ${p.x} ${p.y}`).join(' ');
  }, [yearlyStats, chartWidth, chartHeight, yMin, yMax]);

  // Generate SVG Path for shaded 25th-75th percentile band
  const bandPathD = useMemo(() => {
    const topPoints = YEARS.map((yr, idx) => ({
      x: getX(idx),
      y: getY(yearlyStats[yr]?.p75 || 0)
    }));
    const bottomPoints = YEARS.map((yr, idx) => ({
      x: getX(idx),
      y: getY(yearlyStats[yr]?.p25 || 0)
    })).reverse();

    let d = `M ${topPoints[0].x} ${topPoints[0].y}`;
    topPoints.slice(1).forEach(p => { d += ` L ${p.x} ${p.y}`; });
    bottomPoints.forEach(p => { d += ` L ${p.x} ${p.y}`; });
    d += ' Z';
    return d;
  }, [yearlyStats, chartWidth, chartHeight, yMin, yMax]);

  // Chart hover scrubber handler
  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    if (!chartRef.current) return;
    const rect = chartRef.current.getBoundingClientRect();
    const clientX = e.clientX - rect.left;
    const rangeX = chartWidth - margin.left - margin.right;
    const pct = (clientX - margin.left) / rangeX;

    if (pct < -0.05 || pct > 1.05) {
      setHoverYearIndex(null);
      return;
    }

    const closestIdx = Math.max(0, Math.min(3, Math.round(pct * 3)));
    setHoverYearIndex(closestIdx);
  };

  const formatValue = (val: number) => {
    return `${val > 0 && metric === 'LST' ? '+' : ''}${val.toFixed(metric === 'LST' ? 2 : 3)}${metricInfo[metric].unit}`;
  };

  if (loading) {
    return (
      <div className="w-full h-[500px] flex flex-col items-center justify-center bg-white/60 backdrop-blur-sm rounded-lg border border-[#2C3E50]/10 p-8 space-y-4 font-sans text-[#2C3E50]">
        <div className="w-10 h-10 border-2 border-[#D35400] border-t-transparent rounded-full animate-spin" />
        <span className="text-xs font-mono tracking-widest text-[#D35400] uppercase font-bold">
          PARSING 8,625 GRID CELL OBSERVATIONS...
        </span>
        <span className="text-[0.65rem] font-mono text-[#2C3E50]/60">
          Loading RUTZ Territory Dataset (2015–2025)
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full p-8 bg-red-50 border border-red-200 rounded-lg text-red-700 font-sans text-sm">
        <strong>Error loading CSV dataset:</strong> {error}
      </div>
    );
  }

  const activeHoverYear = hoverYearIndex !== null ? YEARS[hoverYearIndex] : null;
  const hoverStats = activeHoverYear ? yearlyStats[activeHoverYear] : null;

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch font-sans text-[#2C3E50]" id="grid-wide-measured-container">
      
      {/* LEFT COLUMN: CONTROLS & TERRITORY SHIFT SUMMARY (lg:col-span-4) */}
      <div className="lg:col-span-4 flex flex-col justify-between space-y-5 bg-white/60 backdrop-blur-sm p-5 rounded-lg border border-[#2C3E50]/10 shadow-sm" id="grid-wide-sidebar">
        
        {/* Controls Section */}
        <div className="space-y-5">
          <div className="flex items-center justify-between border-b border-[#2C3E50]/10 pb-2">
            <span className="text-[0.62rem] font-mono tracking-widest text-[#2C3E50]/50 uppercase">
              GRID-WIDE PARAMETERS
            </span>
            <div className="flex items-center space-x-1.5 text-[0.55rem] font-mono bg-[#D35400]/10 text-[#D35400] px-2 py-0.5 rounded font-bold uppercase">
              <Sparkles size={9} />
              <span>8,625 Cells</span>
            </div>
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
                  id={`btn-season-grid-${s}`}
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
                  id={`btn-metric-grid-${m}`}
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

        {/* Territory Shift Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`territory-card-${season}-${metric}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35 }}
            className="border-2 border-[#D35400] bg-[#D35400]/5 p-4 rounded-md text-left space-y-3.5 relative overflow-hidden"
            id="territory-shift-card"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#D35400]/5 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-center justify-between border-b border-[#D35400]/15 pb-1.5">
              <div className="flex items-center space-x-1.5">
                <TrendingUp size={13} className="text-[#D35400]" />
                <span className="text-[0.58rem] font-mono uppercase tracking-widest text-[#D35400] font-bold">
                  TERRITORY SHIFT, 2015→2025
                </span>
              </div>
              <span className="text-[0.52rem] font-mono bg-white border border-[#D35400]/20 text-[#D35400] px-1.5 py-0.5 rounded font-semibold uppercase">
                Territory Mean
              </span>
            </div>

            {/* Mean comparison layout */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col">
                <span className="text-[0.52rem] font-mono text-[#2C3E50]/55 uppercase leading-none mb-1">
                  2015 Territory Mean
                </span>
                <span className="text-xl font-sans font-bold text-[#2C3E50]">
                  {mean2015.toFixed(metric === 'LST' ? 2 : 3)}{metricInfo[metric].unit}
                </span>
                <span className="text-[0.48rem] font-sans text-[#2C3E50]/45 mt-0.5">
                  8,625 cells baseline
                </span>
              </div>
              <div className="flex flex-col border-l border-[#D35400]/15 pl-4">
                <span className="text-[0.52rem] font-mono text-[#D35400]/80 uppercase leading-none mb-1 font-bold">
                  2025 Territory Mean
                </span>
                <span className="text-xl font-sans font-bold text-[#D35400]">
                  {mean2025.toFixed(metric === 'LST' ? 2 : 3)}{metricInfo[metric].unit}
                </span>
                <span className="text-[0.48rem] font-sans text-[#D35400]/60 mt-0.5 font-medium">
                  10-year Shift: {shiftVal > 0 ? '+' : ''}{shiftVal.toFixed(metric === 'LST' ? 2 : 3)}{metricInfo[metric].unit}
                </span>
              </div>
            </div>

            {/* Dynamic interpretive caption */}
            <div className="bg-white/70 backdrop-blur-sm p-2.5 rounded border border-[#D35400]/10 text-[0.72rem] leading-relaxed text-[#2C3E50] font-light">
              Across all 8,625 grid cells in Lecce, the {season} {metricInfo[metric].name} shifted by{' '}
              <strong className="font-semibold text-[#D35400]">
                {shiftVal > 0 ? '+' : ''}{shiftVal.toFixed(2)}{metricInfo[metric].unit}
              </strong>{' '}
              between 2015 ({mean2015.toFixed(2)}{metricInfo[metric].unit}) and 2025 ({mean2025.toFixed(2)}{metricInfo[metric].unit}).
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

      {/* RIGHT COLUMN: YEAR-OVER-YEAR TRAJECTORY CHART & UTFVI STACKED BARS (lg:col-span-8) */}
      <div className="lg:col-span-8 bg-white/60 backdrop-blur-sm p-4 rounded-lg border border-[#2C3E50]/10 shadow-sm flex flex-col justify-between relative min-h-[420px]" id="grid-wide-chart-container">
        
        {/* HUD Top Bar */}
        <div className="flex justify-between items-center pb-2 border-b border-[#2C3E50]/5 mb-4">
          <div className="flex items-center space-x-2">
            <Compass size={12} className="text-[#D35400]" />
            <span className="text-[0.62rem] font-mono tracking-widest text-[#2C3E50] uppercase font-bold">
              TERRITORY-WIDE YEAR-OVER-YEAR TRAJECTORY (2015–2025)
            </span>
          </div>
          <div className="text-[0.55rem] font-mono text-[#2C3E50]/55 uppercase flex items-center space-x-3">
            <button 
              onClick={() => setShowShadedBand(!showShadedBand)}
              className={`flex items-center space-x-1 px-1.5 py-0.5 rounded border transition-all ${
                showShadedBand 
                  ? 'bg-[#D35400]/10 border-[#D35400]/30 text-[#D35400] font-bold' 
                  : 'bg-transparent border-[#2C3E50]/20 text-[#2C3E50]/60 hover:border-[#2C3E50]/40'
              }`}
              id="toggle-shaded-band"
            >
              <Layers size={10} className="shrink-0" />
              <span>25th-75th % Band: {showShadedBand ? 'ON' : 'OFF'}</span>
            </button>
            <span>·</span>
            <span>Grid Cells: 8,625</span>
            <span>·</span>
            <span className="text-[#D35400] font-bold">Lecce Territory</span>
          </div>
        </div>

        {/* Core Line Chart Area */}
        <div className="flex-1 w-full relative">
          <svg 
            ref={chartRef}
            className="w-full select-none cursor-crosshair overflow-visible"
            style={{ height: chartHeight }}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setHoverYearIndex(null)}
            id="grid-wide-chart-svg"
          >
            {/* 1. GRIDLINES */}
            <g opacity="0.06">
              {/* Vertical grids at each year */}
              {YEARS.map((yr, idx) => (
                <line 
                  key={`grid-x-${yr}`}
                  x1={getX(idx)}
                  y1={margin.top}
                  x2={getX(idx)}
                  y2={chartHeight - margin.bottom}
                  stroke="#2C3E50"
                  strokeWidth="1"
                />
              ))}

              {/* Horizontal grids (5 intervals) */}
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

            {/* 3. X-AXIS LABELS */}
            {YEARS.map((yr, idx) => {
              const xCoord = getX(idx);
              const isSelected = activeHoverYear === yr;
              return (
                <g key={`tick-x-${yr}`} className="font-mono text-[9px]">
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
                    y={chartHeight - margin.bottom + 16}
                    textAnchor="middle"
                    className={`font-bold tracking-tight ${isSelected ? 'fill-[#D35400] text-[10px]' : 'fill-[#2C3E50]/70'}`}
                  >
                    {yr}
                  </text>
                </g>
              );
            })}

            {/* 4. Y-AXIS LABELS */}
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

            {/* 5. DATA SHADED BAND (25th-75th Percentile) */}
            {showShadedBand && (
              <motion.path
                d={bandPathD}
                fill="#D35400"
                fillOpacity="0.15"
                stroke="#D35400"
                strokeOpacity="0.25"
                strokeWidth="0.75"
                strokeDasharray="3 3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                key={`band-${season}-${metric}-${chartWidth}`}
                transition={{ duration: 0.6 }}
              />
            )}

            {/* 6. TERRITORY MEAN LINE */}
            <motion.path
              d={meanPathD}
              fill="none"
              stroke="#D35400"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              key={`line-mean-${season}-${metric}-${chartWidth}`}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />

            {/* Data Points on Mean Line */}
            {YEARS.map((yr, idx) => {
              const x = getX(idx);
              const y = getY(yearlyStats[yr]?.mean || 0);
              const isHovered = hoverYearIndex === idx;

              return (
                <g key={`point-${yr}`}>
                  <circle
                    cx={x}
                    cy={y}
                    r={isHovered ? "6" : "4.5"}
                    fill="#D35400"
                    stroke="white"
                    strokeWidth="2"
                    className="transition-all duration-150 cursor-pointer shadow-sm"
                  />
                  <text
                    x={x}
                    y={y - 10}
                    textAnchor="middle"
                    className="font-mono text-[9px] fill-[#2C3E50] font-bold"
                  >
                    {(yearlyStats[yr]?.mean || 0).toFixed(metric === 'LST' ? 1 : 2)}
                  </text>
                </g>
              );
            })}

            {/* 7. DYNAMIC HOVER SCRUBBER & TOOLTIP */}
            {hoverYearIndex !== null && hoverStats && (
              <g>
                {/* Vertical Scrubber Line */}
                <line 
                  x1={getX(hoverYearIndex)}
                  y1={margin.top}
                  x2={getX(hoverYearIndex)}
                  y2={chartHeight - margin.bottom}
                  stroke="#D35400"
                  strokeWidth="1.5"
                  strokeDasharray="2 2"
                  className="animate-pulse"
                />

                {/* 25th & 75th percentile dots on scrubber */}
                <circle 
                  cx={getX(hoverYearIndex)}
                  cy={getY(hoverStats.p25)}
                  r="3.5"
                  fill="#8F9E8B"
                  stroke="white"
                  strokeWidth="1.5"
                />
                <circle 
                  cx={getX(hoverYearIndex)}
                  cy={getY(hoverStats.p75)}
                  r="3.5"
                  fill="#D35400"
                  stroke="white"
                  strokeWidth="1.5"
                />
              </g>
            )}
          </svg>

          {/* FLOAT-RIGHT HUD OVERLAY CARD (DYNAMIC YEAR TOOLTIP) */}
          <AnimatePresence>
            {hoverYearIndex !== null && hoverStats && (
              <motion.div
                initial={{ opacity: 0, scale: 0.98, y: 5 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98, y: 5 }}
                transition={{ duration: 0.15 }}
                className={`absolute top-2 ${hoverYearIndex >= 2 ? 'left-2' : 'right-2'} bg-[#F5F5F0]/95 backdrop-blur-md p-3.5 rounded-md border border-[#2C3E50]/15 shadow-lg flex flex-col space-y-2 z-10 w-[240px] md:w-[270px] pointer-events-none`}
                id="grid-chart-hover-hud"
              >
                <div className="flex justify-between items-center border-b border-[#2C3E50]/10 pb-1.5">
                  <div className="flex items-center space-x-1.5">
                    <span className="h-2 w-2 rounded-full bg-[#D35400] animate-ping" />
                    <span className="text-[0.6rem] font-mono tracking-wider text-[#D35400] uppercase font-bold">
                      SATELLITE RECORD: {hoverStats.year}
                    </span>
                  </div>
                  <span className="text-[0.62rem] font-mono font-bold bg-[#2C3E50]/5 text-[#2C3E50] px-1.5 py-0.5 rounded">
                    {hoverStats.count.toLocaleString()} Cells
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-[0.55rem] font-mono text-[#2C3E50]/60 uppercase">Territory Mean:</span>
                    <span className="text-sm font-sans font-bold text-[#D35400]">
                      {hoverStats.mean.toFixed(metric === 'LST' ? 2 : 3)}{metricInfo[metric].unit}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[0.55rem] font-mono text-[#2C3E50]/60 uppercase">25th–75th Percentile:</span>
                    <span className="text-[0.65rem] font-mono font-medium text-[#2C3E50]">
                      {hoverStats.p25.toFixed(2)} to {hoverStats.p75.toFixed(2)}{metricInfo[metric].unit}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[0.55rem] font-mono text-[#2C3E50]/60 uppercase">Interquartile Range (IQR):</span>
                    <span className="text-[0.65rem] font-mono font-medium text-[#2C3E50]">
                      {hoverStats.iqr.toFixed(2)}{metricInfo[metric].unit}
                    </span>
                  </div>
                  {hoverStats.year !== 2015 && (
                    <div className="flex justify-between items-center pt-1 border-t border-[#2C3E50]/5">
                      <span className="text-[0.55rem] font-mono text-[#2C3E50]/60 uppercase">Shift vs 2015:</span>
                      <span className={`text-[0.68rem] font-mono font-bold ${(hoverStats.mean - mean2015) > 0 ? 'text-[#D35400]' : 'text-emerald-700'}`}>
                        {formatValue(hoverStats.mean - mean2015)}
                      </span>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Indicator Description & Legend Footer */}
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
              <span className="text-[#D35400] font-bold">―●―</span>
              <span className="text-[#2C3E50]/70">Territory Mean</span>
            </div>
            <span className="text-[#2C3E50]/20">|</span>
            <div className="flex items-center space-x-1.5">
              <span className="w-3 h-2 bg-[#D35400]/20 border border-[#D35400]/40 rounded-sm" />
              <span className="text-[#D35400] font-bold">25th–75th % Band</span>
            </div>
          </div>
        </div>

        {/* UTFVI THERMAL STRESS CLASSIFICATION 100%-STACKED BARS */}
        <div className="border-t border-[#2C3E50]/10 pt-4 mt-4" id="grid-utfvi-stacked-bars">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <Thermometer size={13} className="text-[#D35400]" />
              <span className="text-[0.62rem] font-mono tracking-widest text-[#2C3E50] uppercase font-bold">
                UTFVI Class Distribution (% of 8,625 Grid Cells)
              </span>
            </div>
            <span className="text-[0.55rem] font-mono text-[#2C3E50]/55 uppercase bg-[#2C3E50]/5 px-2 py-0.5 rounded">
              100%-Stacked Bars
            </span>
          </div>

          <div className="space-y-4">
            
            {/* 2015 Stacked Bar */}
            <div className="space-y-1">
              <div className="flex justify-between items-center text-[0.52rem] font-mono uppercase tracking-wider text-[#2C3E50]/60">
                <span>2015 UTFVI CLASS DISTRIBUTION (BASELINE)</span>
                <span>8,625 CELLS</span>
              </div>
              <div className="h-5 rounded-md flex overflow-hidden border border-[#2C3E50]/10 shadow-inner bg-stone-100">
                {[1, 2, 3, 4, 5].map((cls) => {
                  const pct = utfviDistribution[2015].percentages[cls] || 0;
                  const count = utfviDistribution[2015].counts[cls] || 0;
                  const color = getUTFVIColor(cls);
                  const isHovered = hoveredUTFVIClass?.year === 2015 && hoveredUTFVIClass?.cls === cls;

                  return (
                    <div
                      key={`utfvi-bar-15-${cls}`}
                      style={{ width: `${pct}%`, backgroundColor: color }}
                      className={`h-full flex items-center justify-center transition-all duration-150 cursor-pointer relative ${
                        isHovered ? 'brightness-110 z-10 scale-y-110 shadow-md' : 'opacity-90 hover:opacity-100'
                      }`}
                      onMouseEnter={() => setHoveredUTFVIClass({ year: 2015, cls })}
                      onMouseLeave={() => setHoveredUTFVIClass(null)}
                      title={`2015 Class ${cls} (${getUTFVILabel(cls)}): ${pct.toFixed(1)}% (${count} cells)`}
                    >
                      {pct > 6 && (
                        <span className="text-[0.55rem] font-mono font-bold text-white drop-shadow-sm select-none">
                          {pct.toFixed(1)}%
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 2025 Stacked Bar */}
            <div className="space-y-1">
              <div className="flex justify-between items-center text-[0.52rem] font-mono uppercase tracking-wider text-[#D35400] font-bold">
                <span>2025 UTFVI CLASS DISTRIBUTION (10-YEAR SHIFT)</span>
                <span>8,625 CELLS</span>
              </div>
              <div className="h-5 rounded-md flex overflow-hidden border border-[#D35400]/20 shadow-inner bg-stone-100">
                {[1, 2, 3, 4, 5].map((cls) => {
                  const pct = utfviDistribution[2025].percentages[cls] || 0;
                  const count = utfviDistribution[2025].counts[cls] || 0;
                  const color = getUTFVIColor(cls);
                  const isHovered = hoveredUTFVIClass?.year === 2025 && hoveredUTFVIClass?.cls === cls;

                  return (
                    <div
                      key={`utfvi-bar-25-${cls}`}
                      style={{ width: `${pct}%`, backgroundColor: color }}
                      className={`h-full flex items-center justify-center transition-all duration-150 cursor-pointer relative ${
                        isHovered ? 'brightness-110 z-10 scale-y-110 shadow-md' : 'opacity-90 hover:opacity-100'
                      }`}
                      onMouseEnter={() => setHoveredUTFVIClass({ year: 2025, cls })}
                      onMouseLeave={() => setHoveredUTFVIClass(null)}
                      title={`2025 Class ${cls} (${getUTFVILabel(cls)}): ${pct.toFixed(1)}% (${count} cells)`}
                    >
                      {pct > 6 && (
                        <span className="text-[0.55rem] font-mono font-bold text-white drop-shadow-sm select-none">
                          {pct.toFixed(1)}%
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Hovered class detail popup if hovering over a segment */}
            <AnimatePresence>
              {hoveredUTFVIClass && (
                <motion.div
                  initial={{ opacity: 0, y: 3 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 3 }}
                  className="bg-[#2C3E50] text-[#F5F5F0] p-2.5 rounded text-[0.62rem] font-mono flex items-center justify-between shadow-sm"
                >
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-2.5 h-2.5 rounded-sm" 
                      style={{ backgroundColor: getUTFVIColor(hoveredUTFVIClass.cls) }} 
                    />
                    <span className="font-bold">
                      {hoveredUTFVIClass.year} UTFVI Class {hoveredUTFVIClass.cls} ({getUTFVILabel(hoveredUTFVIClass.cls)}):
                    </span>
                    <span>
                      {(utfviDistribution[hoveredUTFVIClass.year].percentages[hoveredUTFVIClass.cls] || 0).toFixed(2)}%
                    </span>
                    <span className="opacity-60">
                      ({(utfviDistribution[hoveredUTFVIClass.year].counts[hoveredUTFVIClass.cls] || 0).toLocaleString()} cells)
                    </span>
                  </div>

                  <span className="text-[#D35400] font-bold">
                    Shift vs 2015:{' '}
                    {((utfviDistribution[2025].percentages[hoveredUTFVIClass.cls] || 0) - (utfviDistribution[2015].percentages[hoveredUTFVIClass.cls] || 0)) > 0 ? '+' : ''}
                    {((utfviDistribution[2025].percentages[hoveredUTFVIClass.cls] || 0) - (utfviDistribution[2015].percentages[hoveredUTFVIClass.cls] || 0)).toFixed(2)}%
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* UTFVI Swatch Legend */}
            <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 pt-3 border-t border-[#2C3E50]/5">
              {[
                { cls: 1, label: 'Strong cooling', color: 'var(--color-canopy)' },
                { cls: 2, label: 'Mild', color: 'var(--color-sage)' },
                { cls: 3, label: 'Moderate stress', color: 'var(--color-sand)' },
                { cls: 4, label: 'Significant stress', color: 'var(--color-heat)' },
                { cls: 5, label: 'Extreme stress', color: 'var(--color-shadow)' },
              ].map((item) => (
                <div key={`legend-grid-swatch-${item.cls}`} className="flex items-center space-x-2">
                  <div 
                    className="w-2.5 h-2.5 rounded-sm border border-[#2C3E50]/10 shrink-0" 
                    style={{ backgroundColor: item.color }} 
                  />
                  <span className="text-[0.58rem] font-mono text-[#2C3E50]/75">
                    Class {item.cls}: {item.label}
                  </span>
                </div>
              ))}
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
