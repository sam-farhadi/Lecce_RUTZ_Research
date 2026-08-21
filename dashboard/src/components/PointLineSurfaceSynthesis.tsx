import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MapPin, 
  Layers, 
  Trees, 
  Flame, 
  Compass, 
  Info,
  Maximize2,
  Image as ImageIcon,
  CheckCircle,
  TrendingDown,
  Navigation,
  Sparkles,
  ChevronRight
} from 'lucide-react';

interface Hotspot {
  id: number;
  x: number; // percentage
  y: number; // percentage
  title: string;
  description: string;
  associatedPhoto?: string;
  metric?: string;
  metricLabel?: string;
}

interface ScaleData {
  id: 'point' | 'line' | 'surface' | 'master';
  actNumber: string;
  title: string;
  subtitle: string;
  kicker: string;
  themeColor: string;
  textColor: string;
  borderColor: string;
  badgeBg: string;
  mainImage: string;
  description: string;
  thermodynamicGoal: string;
  metrics: { label: string; value: string; icon: React.ReactNode }[];
  hotspots: Hotspot[];
  references: {
    src: string;
    alt: string;
    caption: string;
  }[];
}

export default function PointLineSurfaceSynthesis() {
  const [activeTab, setActiveTab] = useState<'point' | 'line' | 'surface' | 'master'>('point');
  const [activeHotspot, setActiveHotspot] = useState<Hotspot | null>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  const sectionRefs = {
    point: useRef<HTMLDivElement>(null),
    line: useRef<HTMLDivElement>(null),
    surface: useRef<HTMLDivElement>(null),
    master: useRef<HTMLDivElement>(null),
  };

  const scales: Record<'point' | 'line' | 'surface' | 'master', ScaleData> = {
    point: {
      id: 'point',
      actNumber: 'ACT I',
      title: 'Micro Interventions: Localized Cooling Hubs',
      subtitle: 'La Pietra — architectural taxonomics & cistern cooling cellars',
      kicker: 'POINT INTENSITY',
      themeColor: '#8F9E8B', // slate stone
      textColor: 'text-[#8F9E8B]',
      borderColor: 'border-[#8F9E8B]/30',
      badgeBg: 'bg-[#8F9E8B]/10',
      mainImage: '/Point_FINAL.png',
      description: 'Micro-scale architectural interventions located at critical Points of Interest (POIs). By leveraging high thermal inertia masonry, deep courtyard shade, and active water evaporation, these spots act as localized thermodynamic oases.',
      thermodynamicGoal: 'Address severe heat distress at key historic junctions by providing immediate relief shelters leveraging night radiative thermal storage and geothermal masonry conduction.',
      metrics: [
        { label: 'Intervention Nodes', value: '6 POIs', icon: <MapPin size={14} /> },
        { label: 'Core Material', value: 'High-Albedo Limestone', icon: <Info size={14} /> },
        { label: 'Cooling Strategy', value: 'Limestone Courtyard Shade', icon: <TrendingDown size={14} /> }
      ],
      references: [
        { src: 'https://images.unsplash.com/photo-1543872084-c7bd3822856f?auto=format&fit=crop&w=600&h=450&q=80', alt: 'Piazza limestone pocket', caption: 'Piazza pocket: localized limestone sink coupled with native evergreen holm-oak canopy pockets.' },
        { src: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=600&h=450&q=80', alt: 'Subterranean cistern', caption: 'The cistern: subterranean cooling cellar utilizing water and stone conduction.' }
      ],
      hotspots: [
        {
          id: 1,
          x: 24,
          y: 45,
          title: 'Piazza Limestone Pocket',
          description: "Sub-surface stone chambers and limestone benches designed with high thermal mass, staying chilled by shading evergreen canopies.",
          associatedPhoto: 'https://images.unsplash.com/photo-1543872084-c7bd3822856f?auto=format&fit=crop&w=600&h=450&q=80',
          metric: 'Thermal Behavior',
          metricLabel: 'High-Inertia Conduction'
        },
        {
          id: 2,
          x: 62,
          y: 35,
          title: 'Underground Cistern Hub',
          description: "A dual-chamber structural cistern cooling cell utilizing night radiative thermal storage and geothermal masonry conduction.",
          associatedPhoto: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=600&h=450&q=80',
          metric: 'Conduction Method',
          metricLabel: 'Evaporative Sink'
        }
      ]
    },
    line: {
      id: 'line',
      actNumber: 'ACT II',
      title: 'Corridor Interventions: Linear Mobility Winds',
      subtitle: 'La Frangia — dry-stone cooling paths & cycle windbreakers',
      kicker: 'LINE CORRIDOR',
      themeColor: '#D35400', // warm terracotta
      textColor: 'text-[#D35400]',
      borderColor: 'border-[#D35400]/30',
      badgeBg: 'bg-[#D35400]/10',
      mainImage: '/Line_FINAL.png',
      description: 'Medium-scale linear interventions designed to reinforce mobility networks and microclimatic corridors. Linear buffers of double-tiered dry-stone walls and high-canopy trees channel prevailing sea breezes while blocking desert heat waves.',
      thermodynamicGoal: 'Establish continuous shaded mobility paths that link fragmented peri-urban areas, facilitating ecological migration and creating cool, walkable wind corridors.',
      metrics: [
        { label: 'Linear Path', value: '4,050 meters', icon: <Navigation size={14} /> },
        { label: 'Cooling Walls', value: 'Reclaimed Dry-Stone', icon: <Layers size={14} /> },
        { label: 'Wind Corridor', value: 'Guiding Coastal Breezes', icon: <Compass size={14} /> }
      ],
      references: [
        { src: 'https://images.unsplash.com/photo-1508849789987-4e5333c12b78?auto=format&fit=crop&w=600&h=450&q=80', alt: 'Dry-stone wall alignment', caption: 'Dry-stone alignment: traditional limestone walls reconstructed to channel cooling Adriatic winds.' },
        { src: 'https://images.unsplash.com/photo-1541614101331-1a5a3a194e92?auto=format&fit=crop&w=600&h=450&q=80', alt: 'Shaded bicycle spine', caption: 'Bicycle spine: multi-tiered tree buffer providing dense, continuous summer shade.' }
      ],
      hotspots: [
        {
          id: 1,
          x: 35,
          y: 55,
          title: 'Limestone Dry-Stone Alignment',
          description: "Reconstructed dry-stone walls oriented along the NNW-SSE vector to capture and guide evening coastal breezes down the corridor.",
          associatedPhoto: 'https://images.unsplash.com/photo-1508849789987-4e5333c12b78?auto=format&fit=crop&w=600&h=450&q=80',
          metric: 'Wind Direction',
          metricLabel: 'NNW-SSE Orientation'
        },
        {
          id: 2,
          x: 75,
          y: 68,
          title: 'Shaded Bicycle Spine',
          description: "Dual-row deciduous and evergreen oak canopy lanes keeping paved movement tracks sheltered from peak solar midday radiation.",
          associatedPhoto: 'https://images.unsplash.com/photo-1541614101331-1a5a3a194e92?auto=format&fit=crop&w=600&h=450&q=80',
          metric: 'Canopy Density',
          metricLabel: 'Continuous Shade Spine'
        }
      ]
    },
    surface: {
      id: 'surface',
      actNumber: 'ACT III',
      title: 'Territorial Interventions: Macro Canopy Ceilings',
      subtitle: 'Il Giardino — karst forest matrices & agroforestry screens',
      kicker: 'SURFACE MATRIX',
      themeColor: '#4A5D23', // deep green
      textColor: 'text-[#4A5D23]',
      borderColor: 'border-[#4A5D23]/30',
      badgeBg: 'bg-[#4A5D23]/10',
      mainImage: '/Surface_FINAL.png',
      description: 'Macro-scale territorial interventions. By reclaiming abandoned limestone quarries, expanding local karst oak woodlands, and replacing dead olive monocultures with multi-canopy agroforestry systems, these surfaces act as regional temperature buffers.',
      thermodynamicGoal: 'Form an extensive vegetative insulation blanket over the dry, rocky Salento soil, significantly increasing regional evapotranspiration and minimizing high-albedo heat-island effects.',
      metrics: [
        { label: 'Reclaimed Land', value: '14.2 hectares', icon: <Trees size={14} /> },
        { label: 'Plant Diversity', value: '18 Native Species', icon: <CheckCircle size={14} /> },
        { label: 'Woodland Unit', value: 'Karst Oak Canopy', icon: <TrendingDown size={14} /> }
      ],
      references: [
        { src: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=600&h=450&q=80', alt: 'Limestone quarry reclamation', caption: 'Quarry reclamation: sunken quarry zones transformed into dense pocket woodlands.' },
        { src: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&h=450&q=80', alt: 'Olive canopy recovery', caption: 'Agroforestry screen: polyculture agricultural buffers replacing vulnerable single crops.' },
        { src: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=600&h=450&q=80', alt: 'Evergreen forest matrix', caption: 'Closed forest ceiling: mature Holm Oak (Quercus ilex) matrices absorbing intense radiation.' }
      ],
      hotspots: [
        {
          id: 1,
          x: 18,
          y: 25,
          title: 'Karst Quarry Sunken Woodlands',
          description: "Sunken limestone quarries reclaimed as microclimatic sinks where dense vegetation and steep stone walls trap cooler, moist morning air.",
          associatedPhoto: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=600&h=450&q=80',
          metric: 'Thermal Sink',
          metricLabel: 'Microclimate Basin'
        },
        {
          id: 2,
          x: 52,
          y: 62,
          title: 'Polyculture Agroforestry Screen',
          description: "Multi-layered agroforestry shields combining carob, almond, and resistant olive cultivars to provide continuous ground shade and moisture.",
          associatedPhoto: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&h=450&q=80',
          metric: 'Soil Strategy',
          metricLabel: 'Mulched Canopy Buffer'
        },
        {
          id: 3,
          x: 82,
          y: 40,
          title: 'Evergreen Closed Forest Matrix',
          description: "High-density Holm Oak woodland units establishing a high leaf-area-index (LAI) ceiling that isolates the limestone substrate from solar baking.",
          associatedPhoto: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=600&h=450&q=80',
          metric: 'Foliage Metric',
          metricLabel: 'High Leaf-Area Index'
        }
      ]
    },
    master: {
      id: 'master',
      actNumber: 'SYNTHESIS',
      title: 'Integrated Transect Master Plan',
      subtitle: 'Synthesis of multi-scalar intervention layers',
      kicker: 'OVERALL PLAN',
      themeColor: '#2C3E50', // deep slate
      textColor: 'text-[#2C3E50]',
      borderColor: 'border-[#2C3E50]/30',
      badgeBg: 'bg-[#2C3E50]/10',
      mainImage: '/Transect_Master_Plan-FINAL.png',
      description: 'The definitive territorial-scale synthesis bringing together all localized thermal hubs, continuous linear mobility corridors, and agricultural forest canopy screens into a single coordinated microclimatic blueprint.',
      thermodynamicGoal: 'Establish an unbroken microclimatic buffering zone along the entire 4,050m suburban-to-rural transect, designed to optimize the regional landscape structure.',
      metrics: [
        { label: 'Total Length', value: '4.05 km', icon: <Compass size={14} /> },
        { label: 'Active Zones', value: '3 Major Layers', icon: <Layers size={14} /> },
        { label: 'System Type', value: 'Coupled Thermodynamic', icon: <CheckCircle size={14} /> }
      ],
      references: [
        { src: '/Transect_Master_Plan-FINAL.png', alt: 'Masterplan detail', caption: 'Definitive final design blueprint for the 4km Southeast Transect.' }
      ],
      hotspots: [
        {
          id: 1,
          x: 20,
          y: 50,
          title: 'Suburban Gateway Zone',
          description: 'Densely built peri-urban margin featuring high-albedo gravel paving paired with intensive point pergola cells to break the heat-dome.',
          metric: 'Margin Profile',
          metricLabel: 'Gateway Canopy Buffer'
        },
        {
          id: 2,
          x: 55,
          y: 45,
          title: 'Active Mobility Corridor',
          description: 'Linear dual-track cycle paths shaded by native pine and evergreen oak canopies, channeling dominant north-northwest cooling winds.',
          metric: 'Physical Buffer',
          metricLabel: 'Wind Corridor'
        },
        {
          id: 3,
          x: 85,
          y: 55,
          title: 'Rural Agricultural Fringe',
          description: 'Expansive agroforestry zones combining olive grove recovery with deep dry-stone cooling beds to form a continuous cooling surface.',
          metric: 'Structure Matrix',
          metricLabel: 'Territorial Woodland'
        }
      ]
    }
  };

  // Implement IntersectionObserver to detect scroll-driven active act
  useEffect(() => {
    const observerOptions = {
      root: scrollContainerRef.current,
      rootMargin: '-30% 0px -40% 0px', // Target the viewport sweet-spot
      threshold: 0.15
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const tabId = entry.target.getAttribute('data-scale') as 'point' | 'line' | 'surface' | 'master';
          if (tabId && tabId !== activeTab) {
            setActiveTab(tabId);
            setActiveHotspot(null);
          }
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    (Object.keys(sectionRefs) as ('point' | 'line' | 'surface' | 'master')[]).forEach((tab) => {
      const el = sectionRefs[tab].current;
      if (el) {
        observer.observe(el);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, [activeTab]);

  const scrollToSection = (tab: 'point' | 'line' | 'surface' | 'master') => {
    const el = sectionRefs[tab].current;
    if (el && scrollContainerRef.current) {
      const containerRect = scrollContainerRef.current.getBoundingClientRect();
      const elRect = el.getBoundingClientRect();
      const scrollOffset = elRect.top - containerRect.top + scrollContainerRef.current.scrollTop - 16;
      
      scrollContainerRef.current.scrollTo({
        top: scrollOffset,
        behavior: 'smooth'
      });
      setActiveTab(tab);
      setActiveHotspot(null);
    }
  };

  const activeData = scales[activeTab];

  return (
    <div className="w-full flex flex-col justify-start space-y-6 font-sans text-[#2C3E50]">
      
      {/* SCROLLYTELLING COMPONENT CONTAINER */}
      <div className="w-full grid grid-cols-1 xl:grid-cols-12 gap-6 items-stretch">
        
        {/* LEFT COLUMN: SCROLL-DRIVEN SEQUENTIAL ACTS PANEL */}
        <div className="xl:col-span-5 flex flex-col h-[640px] relative">
          
          {/* Subtle Scrolly Navigation Indicator dots */}
          <div className="absolute left-0 top-1/2 -translate-y-1/2 flex flex-col space-y-3 z-10 p-2 bg-white/65 backdrop-blur-sm rounded-r-lg border-y border-r border-[#2C3E50]/10 shadow-sm">
            {(Object.keys(scales) as ('point' | 'line' | 'surface' | 'master')[]).map((tab) => {
              const isSelected = activeTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => scrollToSection(tab)}
                  className="group flex items-center space-x-2 text-left cursor-pointer focus:outline-none"
                  title={`Jump to ${scales[tab].kicker}`}
                >
                  <span 
                    className={`w-2.5 h-2.5 rounded-full transition-all ${
                      isSelected 
                        ? 'scale-125' 
                        : 'bg-gray-300 group-hover:bg-[#2C3E50]/60'
                    }`}
                    style={{ backgroundColor: isSelected ? scales[tab].themeColor : undefined }}
                  />
                  <span className={`text-[0.52rem] font-mono uppercase tracking-widest hidden group-hover:block bg-[#2C3E50] text-[#F5F5F0] px-1.5 py-0.5 rounded font-bold`}>
                    {scales[tab].kicker}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Scroll Container */}
          <div 
            ref={scrollContainerRef}
            className="w-full h-full overflow-y-auto pl-8 pr-3 space-y-8 scroll-smooth scrollbar-thin"
            style={{ scrollSnapType: 'y proximity' }}
          >
            {(Object.keys(scales) as ('point' | 'line' | 'surface' | 'master')[]).map((tab) => {
              const item = scales[tab];
              const isFocused = activeTab === tab;
              
              return (
                <div
                  key={tab}
                  ref={sectionRefs[tab]}
                  data-scale={tab}
                  className={`scroll-snap-align-start transition-all duration-500 ease-out p-6 rounded-lg border bg-white ${
                    isFocused 
                      ? `shadow-md border-l-4 ${item.borderColor}` 
                      : 'opacity-50 border-[#2C3E50]/5 bg-white/40 scale-[0.98]'
                  }`}
                  style={{ 
                    scrollSnapAlign: 'start',
                    borderLeftColor: isFocused ? item.themeColor : undefined
                  }}
                >
                  {/* Act Tag */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[0.55rem] font-mono tracking-widest font-bold text-gray-400">
                      {item.actNumber} // SCALE INTERVENTION
                    </span>
                    {isFocused && (
                      <span 
                        className={`text-[0.55rem] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded ${item.badgeBg} ${item.textColor}`}
                      >
                        {item.kicker}
                      </span>
                    )}
                  </div>

                  {/* Title & Line */}
                  <h3 className="text-lg md:text-xl font-serif font-medium tracking-tight text-[#2C3E50] mb-1">
                    {item.title}
                  </h3>
                  <p className="text-xs italic font-serif text-[#B0A99F] mb-3">
                    "{item.subtitle}"
                  </p>
                  <div 
                    className="h-[2px] w-14 mb-4 transition-all duration-300" 
                    style={{ backgroundColor: item.themeColor }}
                  />

                  {/* Description */}
                  <p className="text-xs md:text-sm font-light leading-relaxed text-[#2C3E50]/80 mb-5">
                    {item.description}
                  </p>

                  {/* Core Goal Box */}
                  <div className="bg-gray-50/70 p-4 rounded border border-gray-100 space-y-1.5 mb-5">
                    <span className="text-[0.6rem] font-mono uppercase text-[#2C3E50]/50 tracking-wider flex items-center gap-1">
                      <Flame size={10} className="text-[#D35400]" />
                      Thermodynamic Core Objective
                    </span>
                    <p className="text-xs leading-relaxed font-sans text-[#2C3E50]/90">
                      {item.thermodynamicGoal}
                    </p>
                  </div>

                  {/* Metrics Row */}
                  <div className="grid grid-cols-3 gap-2">
                    {item.metrics.map((m, index) => (
                      <div key={index} className="bg-white p-2.5 rounded border border-gray-100 shadow-xs flex flex-col items-center text-center justify-between">
                        <div className="p-1 rounded bg-gray-50 text-gray-500 mb-1">
                          {m.icon}
                        </div>
                        <span className="text-[0.68rem] font-bold tracking-tight text-[#2C3E50] leading-none mb-1">
                          {m.value}
                        </span>
                        <span className="text-[0.48rem] font-mono uppercase tracking-wider text-[#2C3E50]/40 leading-none">
                          {m.label}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Interactive Prompting */}
                  {isFocused && (
                    <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-[0.65rem] font-mono text-gray-400">
                      <span>↓ SCROLL FOR NEXT INTERVENTION</span>
                      <ChevronRight size={10} className="animate-pulse" />
                    </div>
                  )}

                </div>
              );
            })}
          </div>

          {/* Fade overlays to hint scrollable list */}
          <div className="absolute top-0 left-8 right-3 h-6 bg-gradient-to-b from-gray-50/80 to-transparent pointer-events-none z-10" />
          <div className="absolute bottom-0 left-8 right-3 h-6 bg-gradient-to-t from-gray-50/80 to-transparent pointer-events-none z-10" />

        </div>

        {/* RIGHT COLUMN: STICKY ANALYTICAL GRAPHIC CANVAS */}
        <div className="xl:col-span-7 flex flex-col justify-between space-y-4 self-start sticky top-4">
          
          {/* Main Diagram Container - Aspect ratio locked at 1.414 */}
          <div className="relative bg-white/70 rounded-lg border border-[#2C3E50]/10 p-3 shadow-sm overflow-hidden flex flex-col justify-center items-center w-full">
            
            {/* Aspect 1.414 Wrapper */}
            <div className="relative w-full aspect-[1.414] bg-[#2C3E50]/5 rounded overflow-hidden shadow-inner group">
              
              {/* Dynamic Image with Layer Transitions */}
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeTab}
                  src={activeData.mainImage}
                  alt={`${activeData.title} isometric blueprint`}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.02 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  className="absolute inset-0 w-full h-full object-cover select-none"
                  referrerPolicy="no-referrer"
                />
              </AnimatePresence>

              {/* HOTSPOT OVERLAYS - Sequentially blooming on mount/activeTab update */}
              <AnimatePresence mode="popLayout">
                {activeData.hotspots.map((hs, idx) => {
                  const isActive = activeHotspot?.id === hs.id;
                  return (
                    <motion.button
                      key={`${activeTab}-hotspot-${hs.id}`}
                      id={`hotspot-${activeTab}-${hs.id}`}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ 
                        delay: idx * 0.25 + 0.15, // Sequential cascade effect
                        type: "spring", 
                        stiffness: 180, 
                        damping: 15 
                      }}
                      onClick={() => setActiveHotspot(isActive ? null : hs)}
                      className="absolute cursor-pointer z-20 group/btn"
                      style={{ left: `${hs.x}%`, top: `${hs.y}%` }}
                    >
                      {/* Pulsing ring indicator */}
                      <div className="relative flex items-center justify-center">
                        <div 
                          className="absolute rounded-full w-8 h-8 opacity-40 animate-ping transition-all"
                          style={{ 
                            backgroundColor: activeData.themeColor,
                            animationDuration: isActive ? '1.5s' : '3s'
                          }}
                        />
                        <div 
                          className="rounded-full w-5.5 h-5.5 border-2 border-white flex items-center justify-center shadow-lg transition-transform duration-300 group-hover/btn:scale-110"
                          style={{ backgroundColor: activeData.themeColor }}
                        >
                          <span className="text-[0.55rem] font-bold text-white font-mono">
                            {hs.id}
                          </span>
                        </div>
                      </div>

                      {/* Tooltip hover cue */}
                      <div className="absolute top-7 left-1/2 -translate-x-1/2 scale-0 group-hover/btn:scale-100 transition-transform duration-200 bg-[#2C3E50] text-white text-[0.62rem] font-sans font-medium px-2 py-1 rounded shadow-lg whitespace-nowrap z-30">
                        {hs.title}
                      </div>
                    </motion.button>
                  );
                })}
              </AnimatePresence>

              {/* Compass Indicator Overlay */}
              <div className="absolute bottom-4 right-4 bg-[#F5F5F0]/95 backdrop-blur-sm border border-[#2C3E50]/15 px-2.5 py-1 rounded shadow flex items-center space-x-1.5 pointer-events-none z-10">
                <Compass size={12} className="text-[#D35400] animate-spin" style={{ animationDuration: '40s' }} />
                <span className="text-[0.55rem] font-mono uppercase tracking-widest text-[#2C3E50]/60 font-bold">Lecce SE Vector</span>
              </div>

              {/* Title Overlay in artboard */}
              <div className="absolute top-4 left-4 bg-[#2C3E50]/80 backdrop-blur-sm border border-white/10 px-3 py-1.5 rounded shadow z-10 max-w-[240px]">
                <span className="text-[0.5rem] font-mono uppercase tracking-widest text-white/50 block leading-none mb-0.5">METRIC DRAWING</span>
                <span className="text-xs font-serif italic text-[#E5D5C5] block leading-tight font-medium">
                  {activeData.kicker} INTERVENTION MAP
                </span>
              </div>

            </div>

            {/* Dynamic Highlight Card (Only visible when hotspot selected or shows scroll tutorial) */}
            <div className="w-full mt-3 overflow-hidden bg-[#2C3E50]/5 rounded border border-[#2C3E50]/10 p-4 min-h-[96px] flex flex-col justify-center">
              <AnimatePresence mode="wait">
                {activeHotspot ? (
                  <motion.div
                    key={`${activeTab}-hotspot-desc-${activeHotspot.id}`}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="space-y-2 text-left"
                  >
                    <div className="flex items-center justify-between border-b border-[#2C3E50]/10 pb-1.5">
                      <div className="flex items-center space-x-2">
                        <MapPin size={12} style={{ color: activeData.themeColor }} />
                        <span className="text-xs font-bold tracking-tight uppercase">
                          {activeHotspot.title}
                        </span>
                      </div>
                      {activeHotspot.metric && (
                        <span className="text-[0.55rem] font-mono bg-white text-[#2C3E50] border border-[#2C3E50]/10 px-2 py-0.5 rounded font-bold">
                          {activeHotspot.metric}: {activeHotspot.metricLabel}
                        </span>
                      )}
                    </div>
                    <p className="text-xs leading-relaxed text-[#2C3E50]/80">
                      {activeHotspot.description}
                    </p>
                    {activeHotspot.associatedPhoto && (
                      <button
                        onClick={() => setSelectedPhoto(activeHotspot.associatedPhoto || null)}
                        className="text-[0.6rem] font-mono tracking-wider font-bold text-[#D35400] uppercase hover:underline flex items-center space-x-1 cursor-pointer mt-1"
                      >
                        <ImageIcon size={10} />
                        <span>View Real-World Reference Image</span>
                      </button>
                    )}
                  </motion.div>
                ) : (
                  <motion.div
                    key="no-selection"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center text-center space-y-1.5 text-[#2C3E50]/60 py-1"
                  >
                    <div className="flex items-center space-x-1 text-xs font-bold tracking-wider uppercase">
                      <Sparkles size={12} style={{ color: activeData.themeColor }} className="animate-pulse" />
                      <span>{activeData.kicker} INTERACTION</span>
                    </div>
                    <p className="text-[0.7rem] max-w-sm leading-normal">
                      Click the circular pulsing hotspots on the drawing to expand site plans and read scientific microclimatic targets.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>

          {/* DOCUMENTATION SITE PHOTOS BAR */}
          <div className="bg-white/60 p-4 rounded-lg border border-[#2C3E50]/10 flex flex-col space-y-3 shadow-sm text-left">
            
            <div className="flex items-center justify-between">
              <span className="text-[0.62rem] font-mono tracking-widest text-[#2C3E50]/50 uppercase flex items-center gap-1.5 font-bold">
                <ImageIcon size={11} className="text-[#2C3E50]/60" />
                Field Documentation & Real-World Site Photos
              </span>
              <span className="text-[0.55rem] font-mono text-[#2C3E50]/40 italic">
                {activeData.references.length} reference{activeData.references.length > 1 ? 's' : ''} for this scale
              </span>
            </div>

            {/* Photos Flex Grid */}
            <div className="grid grid-cols-3 gap-3">
              {activeData.references.map((ref, index) => (
                <div 
                  key={index}
                  onClick={() => setSelectedPhoto(ref.src)}
                  className="group relative h-20 rounded border border-[#2C3E50]/10 overflow-hidden cursor-pointer bg-[#2C3E50]/5 hover:border-[#D35400] transition-colors shadow-sm"
                >
                  <img
                    src={ref.src}
                    alt={ref.alt}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  
                  {/* Photo Label/Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent p-1.5 flex flex-col justify-end opacity-90 transition-opacity">
                    <span className="text-[0.52rem] font-sans text-white/90 font-medium truncate leading-tight group-hover:text-[#E5D5C5]">
                      {ref.alt}
                    </span>
                    <span className="text-[0.45rem] font-mono text-white/50 truncate leading-none">
                      Reference {index + 1}
                    </span>
                  </div>

                  {/* Zoom indicator on hover */}
                  <div className="absolute top-1.5 right-1.5 bg-[#2C3E50]/70 text-white p-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                    <Maximize2 size={8} />
                  </div>
                </div>
              ))}
            </div>

          </div>

        </div>

      </div>

      {/* LIGHTBOX MODAL OVERLAY */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedPhoto(null)}
            className="fixed inset-0 bg-black/90 z-50 flex flex-col items-center justify-center p-4 cursor-zoom-out"
          >
            {/* Close Button */}
            <button 
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-4 right-4 text-white hover:text-[#E5D5C5] text-xs font-mono uppercase tracking-widest cursor-pointer border border-white/20 hover:border-white/40 px-3 py-1.5 rounded bg-black/40"
            >
              Close Overlay [ESC]
            </button>

            {/* Lightbox Image Container */}
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="max-w-4xl max-h-[80vh] bg-[#F5F5F0] rounded-lg overflow-hidden border border-white/10 shadow-2xl flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative aspect-video bg-[#2C3E50]/5">
                <img
                  src={selectedPhoto}
                  alt="Expanded site reference"
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Lightbox Caption */}
              <div className="p-4 bg-[#2C3E50] text-[#F5F5F0] flex flex-col space-y-1 text-left">
                <span className="text-[0.62rem] font-mono tracking-widest text-[#E5D5C5] uppercase font-bold">
                  FIELD DOCUMENTATION PHOTO DETAILED RECORD
                </span>
                <p className="text-xs md:text-sm text-white/90">
                  {
                    scales.point.references.concat(scales.line.references).concat(scales.surface.references).concat(scales.master.references)
                      .find(r => r.src === selectedPhoto)?.caption || "Saman Farhadi MSc Thesis Defense Research site photo."
                  }
                </p>
                <span className="text-[0.55rem] font-mono text-white/50">
                  Path: {selectedPhoto.length > 50 ? selectedPhoto.substring(0, 50) + "..." : selectedPhoto}
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
