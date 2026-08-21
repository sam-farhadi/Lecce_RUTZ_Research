/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  ArrowRight, 
  Maximize, 
  Minimize, 
  FileText, 
  HelpCircle, 
  Sun, 
  Trees, 
  Layers, 
  CheckCircle, 
  MoveRight, 
  Volume2, 
  Compass, 
  Info,
  ChevronRight,
  Sparkles,
  Play,
  Video
} from 'lucide-react';
import { slidesData } from './data';
import { SlideLayout } from './types';
import OneGridTwoReadings from './components/OneGridTwoReadings';
import StoneFireTrade from './components/StoneFireTrade';
import WhoCarriesHeat from './components/WhoCarriesHeat';
import OneGridOneLine from './components/OneGridOneLine';
import { SixReadingsOneTransect } from './components/SixReadingsOneTransect';
import FourKilometresTenYears from './components/FourKilometresTenYears';
import PointLineSurfaceSynthesis from './components/PointLineSurfaceSynthesis';
import MinimalVideoPlayer from './components/MinimalVideoPlayer';
import GridWideDashboard from './components/GridWideDashboard';

export default function App() {
  const defaultSlideIndex = Math.max(0, slidesData.findIndex(s => s.layout === 'four-kilometres'));
  const [currentIndex, setCurrentIndex] = useState(defaultSlideIndex);
  const [showNotes, setShowNotes] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [isMenuHovered, setIsMenuHovered] = useState(false);
  const presentationRef = useRef<HTMLDivElement>(null);

  // Slide-specific interactive state variables
  const [activeRutzHeight, setActiveRutzHeight] = useState<number>(1.5); // 0.5, 1.5, or 3.0
  const [activeEcology, setActiveEcology] = useState<'shadow' | 'transition' | 'stone'>('shadow');
  const [findingView, setFindingView] = useState<'satellite' | 'rutz'>('rutz');
  const [selectedPlazaRegion, setSelectedPlazaRegion] = useState<'canopy' | 'pavement' | 'pergola'>('canopy');
  const [canopyDensity, setCanopyDensity] = useState<number>(65); // percentage for slide 10 comfort simulation
  const [copiedNote, setCopiedNote] = useState(false);
  const [hoveredGridCell, setHoveredGridCell] = useState<{ r: number; c: number } | null>(null);
  const [slide7View, setSlide7View] = useState<'ecology' | 'peri-urban'>('ecology');
  const [validationBaseline, setValidationBaseline] = useState<'orchard' | 'lithic-core' | 'forest-ceiling'>('lithic-core');

  const currentSlide = slidesData[currentIndex];
  const totalSlides = slidesData.length;

  // Keyboard navigation logic
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        setCurrentIndex((prev) => Math.min(prev + 1, totalSlides - 1));
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setCurrentIndex((prev) => Math.max(prev - 1, 0));
      } else if (e.key === 'n' || e.key === 'N') {
        e.preventDefault();
        setShowNotes((prev) => !prev);
      } else if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        toggleFullscreen();
      } else if (e.key === 'h' || e.key === 'H' || e.key === '?') {
        e.preventDefault();
        setShowHelp((prev) => !prev);
      } else if (e.key === 'Escape') {
        setIsFullscreen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [totalSlides]);

  // Track actual fullscreen changes to maintain accurate state
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      presentationRef.current?.requestFullscreen()
        .then(() => setIsFullscreen(true))
        .catch((err) => {
          console.warn(`Fullscreen request failed: ${err.message}`);
          // Fallback UI or advice
        });
    } else {
      document.exitFullscreen()
        .then(() => setIsFullscreen(false))
        .catch((err) => console.warn(err));
    }
  };

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, totalSlides - 1));
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  const handleJumpToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  // Helper to copy presenter notes to clipboard
  const handleCopyNotes = () => {
    navigator.clipboard.writeText(currentSlide.notes);
    setCopiedNote(true);
    setTimeout(() => setCopiedNote(false), 2000);
  };

  // Custom animation variants matching the editorial spec
  const slideVariants = {
    initial: { opacity: 0, y: 16 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.25, 1, 0.5, 1], // cinematic smooth ease
        staggerChildren: 0.08
      }
    },
    exit: { 
      opacity: 0, 
      y: -16, 
      transition: { duration: 0.3, ease: 'easeIn' } 
    }
  };

  const childVariants = {
    initial: { opacity: 0, y: 12 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4, ease: 'easeOut' }
    }
  };

  // Pre-calculated data points for Slide 7 Validation Custom SVG Chart
  // Represents a stable ~1.7 °C inversion across 14 diurnal cycles under stable sky
  const chartData = [
    { day: 1, stoneTemp: 31.2, canopyTemp: 29.5 },
    { day: 2, stoneTemp: 31.8, canopyTemp: 30.1 },
    { day: 3, stoneTemp: 32.1, canopyTemp: 30.4 },
    { day: 4, stoneTemp: 30.9, canopyTemp: 29.2 },
    { day: 5, stoneTemp: 31.5, canopyTemp: 29.8 },
    { day: 6, stoneTemp: 32.4, canopyTemp: 30.7 },
    { day: 7, stoneTemp: 31.9, canopyTemp: 30.2 },
    { day: 8, stoneTemp: 31.1, canopyTemp: 29.4 },
    { day: 9, stoneTemp: 31.4, canopyTemp: 29.7 },
    { day: 10, stoneTemp: 32.0, canopyTemp: 30.3 },
    { day: 11, stoneTemp: 32.3, canopyTemp: 30.6 },
    { day: 12, stoneTemp: 31.7, canopyTemp: 30.0 },
    { day: 13, stoneTemp: 31.3, canopyTemp: 29.6 },
    { day: 14, stoneTemp: 31.6, canopyTemp: 29.9 }
  ];

  const minVal = 28;
  const maxVal = 34;
  const mapY = (val: number, height: number) => {
    return height - ((val - minVal) / (maxVal - minVal)) * height;
  };
  const mapX = (day: number, width: number) => {
    return ((day - 1) / 13) * width;
  };

  return (
    <div 
      ref={presentationRef}
      className="relative w-screen h-screen bg-[#F5F5F0] text-[#2C3E50] flex flex-col md:flex-row overflow-hidden"
      id="presentation-container"
    >
      {/* LEFT GLASSY MENU */}
      <aside 
        onMouseEnter={() => setIsMenuHovered(true)}
        onMouseLeave={() => setIsMenuHovered(false)}
        className={`w-full md:shrink-0 bg-[#F5F5F0]/65 backdrop-blur-xl border-b md:border-b-0 md:border-r border-[#2C3E50]/15 flex flex-col p-4 md:p-5 z-20 select-none justify-start h-auto md:h-full transition-all duration-500 ease-in-out shadow-[4px_0_24px_rgba(44,62,80,0.03)] overflow-y-auto no-scrollbar ${
          isMenuHovered ? 'md:w-80' : 'md:w-20'
        }`}
      >
        <div className="flex flex-col space-y-6 h-full">
          {/* Menu Title / Branding */}
          <div className="flex flex-col items-center md:items-start h-16 justify-center overflow-hidden shrink-0">
            {isMenuHovered ? (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-0.5"
              >
                <span className="font-mono text-[0.62rem] tracking-[0.25em] text-[#D35400] uppercase block font-bold">
                  RESEARCH PRESENTATION
                </span>
                <h1 className="font-sans font-extrabold text-base text-[#2C3E50] tracking-tight leading-tight uppercase">
                  CLIMATE BUFFERS
                </h1>
                <p className="font-display italic text-[0.72rem] text-[#2C3E50]/60 leading-snug">
                  Saman Farhadi · Thesis Defense
                </p>
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="relative"
              >
                <motion.div
                  animate={{
                    scale: [1, 1.04, 1],
                    boxShadow: [
                      "0 0 0 0 rgba(211, 84, 0, 0.0)",
                      "0 0 0 4px rgba(211, 84, 0, 0.08)",
                      "0 0 0 0 rgba(211, 84, 0, 0.0)"
                    ]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="w-10 h-10 rounded-full border border-[#D35400]/30 bg-[#D35400]/5 flex items-center justify-center shadow-inner"
                >
                  <span className="font-mono text-xs font-black text-[#D35400]">CB</span>
                </motion.div>
              </motion.div>
            )}
          </div>

          <div className="h-[1px] w-full bg-[#2C3E50]/10 shrink-0" />

          {/* Navigation Links */}
          <nav className="flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-y-auto md:overflow-x-hidden no-scrollbar pb-2 md:pb-0 flex-1">
            {slidesData.map((slide, idx) => {
              const isActive = idx === currentIndex;
              
              // Map each layout to a specific premium menu icon
              let SlideIcon = Compass;
              if (slide.layout === 'one-grid-two-readings') {
                SlideIcon = Layers;
              } else if (slide.layout === 'stone-fire-trade') {
                SlideIcon = Sun;
              } else if (slide.layout === 'four-kilometres') {
                SlideIcon = Compass;
              }

              return (
                <button
                  key={slide.id}
                  onClick={() => handleJumpToSlide(idx)}
                  className={`w-full text-left p-3 rounded-lg transition-all duration-300 flex flex-col items-start relative overflow-hidden shrink-0 md:shrink ${
                    isActive 
                      ? 'bg-[#D35400]/10 border border-[#D35400]/25 shadow-[0_0_15px_rgba(211,84,0,0.06)]' 
                      : 'border border-transparent hover:bg-[#2C3E50]/5'
                  }`}
                >
                  {/* Left active indicator strip */}
                  {isActive && (
                    <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-[#D35400]" />
                  )}
                  
                  <div className="flex items-center w-full">
                    {/* Icon Container with subtle active pulse animation */}
                    <div className={`flex items-center justify-center shrink-0 transition-all duration-300 ${isMenuHovered ? 'w-8 h-8 mr-3' : 'w-full h-10'}`}>
                      {isActive ? (
                        <motion.div
                          animate={{
                            scale: [1, 1.08, 1],
                            opacity: [0.85, 1, 0.85],
                          }}
                          transition={{
                            duration: 2.5,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                          className="w-8 h-8 rounded-full bg-[#D35400]/15 border border-[#D35400]/30 flex items-center justify-center text-[#D35400] shadow-[0_0_12px_rgba(211,84,0,0.12)]"
                        >
                          <SlideIcon size={14} className="stroke-[2.2]" />
                        </motion.div>
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-transparent border border-[#2C3E50]/10 hover:border-[#2C3E50]/25 flex items-center justify-center text-[#2C3E50]/45 transition-all duration-300">
                          <SlideIcon size={14} className="stroke-[1.8]" />
                        </div>
                      )}
                    </div>

                    {/* Extended layout descriptions */}
                    <div className={`flex flex-col transition-all duration-500 overflow-hidden ${isMenuHovered ? 'opacity-100 max-w-xs' : 'opacity-0 max-w-0 pointer-events-none'}`}>
                      <span className="font-mono text-[0.55rem] tracking-widest text-[#2C3E50]/40 uppercase block leading-none">
                        0{idx + 1} · {slide.kicker}
                      </span>
                      <span className={`font-sans font-bold text-[0.82rem] tracking-tight leading-tight mt-1 ${isActive ? 'text-[#D35400]' : 'text-[#2C3E50]'}`}>
                        {slide.title}
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* RIGHT MAIN CONTENT STAGE */}
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#F5F5F0]">
        {/* Top bar / header for right content */}
        <header className="px-8 py-4 flex justify-between items-center border-b border-[#2C3E50]/5 bg-[#F5F5F0]/40 backdrop-blur-sm shrink-0">
          <div className="flex items-center space-x-3">
            <span className="font-mono text-[0.62rem] tracking-widest text-[#2C3E50]/40 uppercase">
              STUDY REGION: LECCE, ITALY
            </span>
          </div>
        </header>

        {/* MAIN ACTIVE STAGE */}
        <main className="flex-1 w-full px-8 md:px-12 py-6 overflow-y-auto no-scrollbar relative flex flex-col justify-start">
          <div className="w-full my-auto flex flex-col">
            <AnimatePresence mode="wait">
            {currentSlide.id === 1 ? (
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="w-full flex flex-col justify-center text-left relative min-h-[480px] lg:min-h-[550px] select-none"
              id={`slide-${currentSlide.id}`}
            >
              {/* Logo - top right, small and institutional */}
              <div className="absolute top-0 right-0 w-[140px] h-[65px] flex items-center justify-end">
                <img 
                  src={`${import.meta.env.BASE_URL}Polito.png`} 
                  alt="Politecnico di Torino Logo" 
                  className="max-w-full max-h-full object-contain"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    // Fallback visual style if image fails to render or is empty
                    e.currentTarget.style.display = 'none';
                    const placeholder = document.getElementById('polito-fallback-placeholder');
                    if (placeholder) {
                      placeholder.style.display = 'flex';
                    }
                  }}
                />
                <div 
                  id="polito-fallback-placeholder"
                  style={{ 
                    display: 'none',
                    backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 5px, rgba(176, 169, 159, 0.08) 5px, rgba(176, 169, 159, 0.08) 10px)'
                  }}
                  className="w-[120px] h-[60px] border-[1.5px] border-dashed border-[#B0A99F] flex flex-col items-center justify-center rounded"
                >
                  <span className="font-mono text-[0.58rem] font-bold tracking-wider text-[#B0A99F] uppercase leading-none">POLITO LOGO</span>
                </div>
              </div>

              {/* Kicker - Helvetica Neue Bold, uppercase, letter-spacing ~0.28em, ~0.7rem, color --heat */}
              <motion.span 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="text-[0.7rem] font-sans font-bold tracking-[0.28em] text-[#D35400] uppercase mb-10 block"
              >
                {currentSlide.kicker}
              </motion.span>

              {/* Headline - Helvetica Neue Bold, huge, left-aligned, tight line-height ~1.0 */}
              <h1 
                className="font-sans font-bold leading-[1.0] text-[#2C3E50] tracking-tight mb-8 max-w-[950px] flex flex-col"
                style={{ fontSize: 'clamp(2.4rem, 5.8vw, 5.2rem)' }}
              >
                <span className="block overflow-hidden pb-1">
                  <motion.span 
                    initial={{ y: "105%", opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1], delay: 0.0 }}
                    className="block"
                  >
                    REFRAMING RURAL–URBAN
                  </motion.span>
                </span>
                <span className="block overflow-hidden pb-1">
                  <motion.span 
                    initial={{ y: "105%", opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1], delay: 0.08 }}
                    className="block"
                  >
                    TRANSITION ZONES AS
                  </motion.span>
                </span>
                <span className="block overflow-hidden pb-1">
                  <motion.span 
                    initial={{ y: "105%", opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1], delay: 0.16 }}
                    className="block text-[#2C3E50]"
                  >
                    CLIMATE <span className="text-[#D35400]">BUFFERS</span>
                  </motion.span>
                </span>
              </h1>

              {/* Subhead - Cormorant Garamond italic - small, quiet, color var(--muted) / var(--stone), max-width ~46ch */}
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.25 }}
                className="text-lg md:text-xl font-display font-normal italic text-[#B0A99F] tracking-wide mb-14 max-w-[46ch] leading-relaxed"
              >
                "{currentSlide.subtitle}"
              </motion.p>

              {/* Footline - Helvetica Neue Light, small, letter-spacing .05em */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.35 }}
                className="font-sans font-light text-xs tracking-wider text-[#2C3E50]/70 flex flex-wrap gap-x-2 gap-y-1 items-center mt-6"
              >
                <span>Saman Farhadi</span>
                <span className="opacity-40">·</span>
                <span>Supervisor: Prof. Antonio Di Campli</span>
                <span className="opacity-40">·</span>
                <span>Politecnico di Torino, DIST</span>
                <span className="opacity-40">·</span>
                <span>2026</span>
              </motion.div>

              {/* Action Button - Begin Defense Presentation */}
              <motion.button 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.45 }}
                onClick={handleNext}
                className="self-start flex items-center space-x-2 text-xs font-mono tracking-widest text-[#D35400] uppercase border-b border-[#D35400]/40 pb-1 hover:border-[#D35400] transition-colors mt-12"
              >
                <span>Begin Defense Presentation</span>
                <MoveRight size={13} />
              </motion.button>
            </motion.div>
          ) : currentSlide.layout === 'peri-urban' ? (
            <motion.div
              key={currentIndex}
              variants={slideVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center"
              id={`slide-${currentSlide.id}`}
            >
              {/* LEFT / CORE TEXT COLUMN (Width adjustments based on slide structure: text left ~45%, image right ~55%) */}
              <div className="col-span-1 lg:col-span-5 flex flex-col justify-center text-left">
                {/* Slide Kicker */}
                <motion.span 
                  variants={childVariants}
                  className="text-[0.7rem] font-sans font-bold tracking-[0.28em] text-[#D35400] uppercase mb-8 block animate-pulse"
                >
                  {currentSlide.kicker}
                </motion.span>

                {/* Title / Headline (Helvetica Neue Bold, large, --shadow) */}
                <motion.h1 
                  initial={{ y: 25, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="text-3xl md:text-4xl lg:text-[2.75rem] leading-[1.05] font-sans font-bold text-[#2C3E50] tracking-tight mb-4 max-w-[800px]"
                >
                  {currentSlide.title}
                </motion.h1>

                {/* Single --heat rule underneath as the accent */}
                <motion.div 
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
                  className="h-[2px] w-24 bg-[#D35400] mb-5 origin-left" 
                />

                {/* Lede (Cormorant italic, small, --muted) */}
                {currentSlide.subtitle && (
                  <motion.h2 
                    variants={childVariants}
                    className="text-sm md:text-base font-display font-normal italic text-[#B0A99F] tracking-wide mb-8 leading-relaxed"
                  >
                    "{currentSlide.subtitle}"
                  </motion.h2>
                )}

                {/* Bulleted Content Lines / Body Text (short lines, balanced, insightful) */}
                <div className="space-y-6 mb-8 max-w-[480px]">
                  <motion.p 
                    variants={childVariants}
                    className="text-base md:text-[1.05rem] text-[#2C3E50]/95 leading-relaxed font-sans font-light opacity-90"
                  >
                    The peri-urban is not a boundary line but a living gradient — a metabolic zone where city and countryside interpenetrate and neither fully governs.
                  </motion.p>

                  {/* Three scholar lines stagger in */}
                  <div className="space-y-3.5 my-6">
                    <motion.div 
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, ease: "easeOut", delay: 0.35 }}
                      className="flex items-start space-x-2.5 text-sm text-[#2C3E50]/90 font-sans font-light"
                    >
                      <span className="text-[#D35400] mt-1.5 text-[7px] select-none">■</span>
                      <span>
                        <strong className="font-semibold text-[#2C3E50]">Clement's Third Landscape</strong> — the abandoned in-between as an ecological reservoir.
                      </span>
                    </motion.div>
                    
                    <motion.div 
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, ease: "easeOut", delay: 0.45 }}
                      className="flex items-start space-x-2.5 text-sm text-[#2C3E50]/90 font-sans font-light"
                    >
                      <span className="text-[#D35400] mt-1.5 text-[7px] select-none">■</span>
                      <span>
                        <strong className="font-semibold text-[#2C3E50]">Donadieu's <span className="font-display italic text-[1.05em]">campagne urbane</span></strong> — countryside already urbanised, productive, not residual.
                      </span>
                    </motion.div>

                    <motion.div 
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, ease: "easeOut", delay: 0.55 }}
                      className="flex items-start space-x-2.5 text-sm text-[#2C3E50]/90 font-sans font-light"
                    >
                      <span className="text-[#D35400] mt-1.5 text-[7px] select-none">■</span>
                      <span>
                        <strong className="font-semibold text-[#2C3E50]">Allen's peri-urban interface</strong> — read as a PROCESS, not a place.
                      </span>
                    </motion.div>
                  </div>

                  {/* Final Lecce specific fringe line */}
                  <motion.p 
                    variants={childVariants}
                    className="text-sm md:text-base text-[#2C3E50]/95 leading-relaxed font-sans font-light mt-6 italic opacity-90"
                  >
                    For Lecce, this ground is the Salento fringe: karst, olive groves, dry-stone <span className="font-display italic">muretti a secco</span>.
                  </motion.p>
                </div>


              </div>

              {/* RIGHT COLUMN: RICH VISUALIZATION / EMBEDDED DIAGRAMS (image right ~55%) */}
              <div className="col-span-1 lg:col-span-7 flex flex-col items-center justify-center min-h-[420px] w-full p-0 relative h-[450px]">
                {/* Main Landscape Image fades in behind */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, ease: "easeOut", delay: 0.15 }}
                  className="w-full h-full flex items-center justify-center"
                >
                  <img
                    src="/Final_Image_of_Mediterranean_context_copy.png"
                    alt="Mediterranean context"
                    className="max-w-full max-h-full object-contain opacity-95 transition-all duration-700 hover:scale-[1.01]"
                    referrerPolicy="no-referrer"
                  />
                </motion.div>


              </div>
            </motion.div>
          ) : currentSlide.layout === 'three-grounds' ? (
            <motion.div
              key={currentIndex}
              variants={slideVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="w-full flex flex-col justify-start text-left"
              id={`slide-${currentSlide.id}`}
            >
              {/* Header section (Kicker, Title, Lede, Heat rule) */}
              <div className="mb-8">
                {/* Slide Kicker */}
                <motion.span 
                  variants={childVariants}
                  className="text-[0.7rem] font-sans font-bold tracking-[0.28em] text-[#D35400] uppercase mb-3 block"
                >
                  {currentSlide.kicker}
                </motion.span>

                {/* Title / Headline (Helvetica Neue Bold, large, --shadow) */}
                <motion.h1 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="text-3xl md:text-4xl lg:text-[2.6rem] leading-[1.1] font-sans font-bold text-[#2C3E50] tracking-tight mb-3 drop-shadow-sm"
                >
                  {currentSlide.title}
                </motion.h1>

                {/* Single --heat rule underneath as the accent */}
                <motion.div 
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
                  className="h-[2px] w-24 bg-[#D35400] mb-4 origin-left" 
                />

                {/* Lede (Cormorant italic, small, --muted) */}
                {currentSlide.subtitle && (
                  <motion.h2 
                    variants={childVariants}
                    className="text-sm md:text-base font-display font-normal italic text-[#B0A99F] tracking-wide mb-6 leading-relaxed"
                  >
                    "{currentSlide.subtitle}"
                  </motion.h2>
                )}
              </div>

              {/* Three-column triptych, photo-led */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 w-full">
                
                {/* COLUMN 1 — "The open mass" */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: "easeOut", delay: 0.15 }}
                  className="flex flex-col group"
                >
                  {/* Photo container */}
                  <div className="relative aspect-[3/2] w-full overflow-hidden rounded bg-stone-200 border border-[#2C3E50]/10">
                    <img 
                      src="https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?q=80&w=600&auto=format&fit=crop" 
                      alt="The open mass - bare karst and olive terraces" 
                      className="w-full h-full object-cover grayscale contrast-[1.08] brightness-[0.98] transition-all duration-700 group-hover:grayscale-0 group-hover:scale-[1.02]"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm text-[#F5F5F0] text-[0.62rem] px-2.5 py-1 rounded font-mono tracking-wider">
                      COLUMN 1: THE OPEN MASS
                    </div>
                  </div>
                  {/* Caption underneath in Helvetica Light */}
                  <span className="font-sans font-bold text-xs uppercase tracking-wider text-[#2C3E50]/80 mt-4 block mb-1">
                    The open mass
                  </span>
                  <p className="font-sans font-light text-sm text-[#2C3E50]/80 leading-relaxed">
                    Bare karst and olive terraces. Exposed limestone, thin soil, sparse structures —quiet in winter, thermally volatile in summer.
                  </p>
                </motion.div>

                {/* COLUMN 2 — "The fraying margin" */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 }}
                  className="flex flex-col group relative"
                >
                  {/* Photo container */}
                  <div className="relative aspect-[3/2] w-full overflow-hidden rounded bg-stone-200 border border-[#2C3E50]/10">
                    <img 
                      src="https://images.unsplash.com/photo-1508849789987-4e5333c12b78?q=80&w=600&auto=format&fit=crop" 
                      alt="The fraying margin - agricultural abandon, crumbling walls" 
                      className="w-full h-full object-cover grayscale contrast-[1.08] brightness-[0.98] transition-all duration-700 group-hover:grayscale-0 group-hover:scale-[1.02]"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm text-[#F5F5F0] text-[0.62rem] px-2.5 py-1 rounded font-mono tracking-wider">
                      COLUMN 2: THE FRAYING MARGIN
                    </div>

                    {/* Overlay annotation - appears last, on this column only, small pulse-in */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: [0.95, 1.02, 1] }}
                      transition={{ 
                        delay: 0.9, 
                        duration: 0.5, 
                        ease: "easeOut",
                        scale: {
                          repeat: Infinity,
                          repeatType: "reverse",
                          duration: 2,
                          delay: 1.5
                        }
                      }}
                      className="absolute bottom-3 left-3 right-3 bg-[#D35400]/95 backdrop-blur-md text-[#F5F5F0] p-2.5 rounded border border-[#D35400] shadow-md"
                    >
                      <div className="flex items-center space-x-1.5 mb-0.5">
                        <span className="w-1.5 h-1.5 bg-[#F5F5F0] rounded-full animate-ping" />
                        <span className="text-[0.55rem] font-mono tracking-widest font-bold uppercase text-[#F5F5F0]/80">Spatial Classification Anomaly</span>
                      </div>
                      <p className="text-[0.65rem] font-mono leading-tight">
                        83.4% invisible to standard classification — 94 ha registered vs. 780.64 ha actually there.
                      </p>
                    </motion.div>
                  </div>
                  {/* Caption underneath in Helvetica Light */}
                  <span className="font-sans font-bold text-xs uppercase tracking-wider text-[#2C3E50]/80 mt-4 block mb-1">
                    The fraying margin
                  </span>
                  <p className="font-sans font-light text-sm text-[#2C3E50]/80 leading-relaxed">
                    Agriculture stalls. Buildings creep in unplanned. Walls crumble, groves die back untended. Conflict is visible on the ground, invisible on the map.
                  </p>
                </motion.div>

                {/* COLUMN 3 — "The vegetated buffer" */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: "easeOut", delay: 0.45 }}
                  className="flex flex-col group"
                >
                  {/* Photo container */}
                  <div className="relative aspect-[3/2] w-full overflow-hidden rounded bg-stone-200 border border-[#2C3E50]/10">
                    <img 
                      src="https://images.unsplash.com/photo-1502082553048-f009c37129b9?q=80&w=600&auto=format&fit=crop" 
                      alt="The vegetated buffer - cooling canopy green" 
                      className="w-full h-full object-cover grayscale contrast-[1.08] brightness-[0.98] transition-all duration-700 group-hover:grayscale-0 group-hover:scale-[1.02]"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm text-[#F5F5F0] text-[0.62rem] px-2.5 py-1 rounded font-mono tracking-wider">
                      COLUMN 3: THE VEGETATED BUFFER
                    </div>
                  </div>
                  {/* Caption underneath in Helvetica Light */}
                  <span className="font-sans font-bold text-xs uppercase tracking-wider text-[#2C3E50]/80 mt-4 block mb-1">
                    The vegetated buffer
                  </span>
                  <p className="font-sans font-light text-sm text-[#2C3E50]/80 leading-relaxed">
                    Canopy and irrigated green — the fragments still doing the work of cooling.
                  </p>
                </motion.div>

              </div>

              {/* Closing line (appears last, full-width beneath the triptych, small, --muted, Helvetica Light italic-free) */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut", delay: 1.1 }}
                className="mt-10 border-t border-[#2C3E50]/5 pt-6 flex justify-center w-full"
              >
                <span className="text-[0.72rem] font-sans font-light tracking-[0.3em] text-[#B0A99F] uppercase">
                  So we gave them names.
                </span>
              </motion.div>
            </motion.div>
          ) : currentSlide.layout === 'we-gave-them-names' ? (
            <motion.div
              key={currentIndex}
              variants={slideVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="w-full flex flex-col justify-start text-left"
              id={`slide-${currentSlide.id}`}
            >
              {/* Header section (Kicker, Title, Lede, Heat rule) */}
              <div className="mb-8">
                {/* Slide Kicker */}
                <motion.span 
                  variants={childVariants}
                  className="text-[0.7rem] font-sans font-bold tracking-[0.28em] text-[#D35400] uppercase mb-3 block"
                >
                  {currentSlide.kicker}
                </motion.span>

                {/* Title / Headline (Helvetica Neue Bold, large, --shadow) */}
                <motion.h1 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="text-3xl md:text-4xl lg:text-[2.6rem] leading-[1.1] font-sans font-bold text-[#2C3E50] tracking-tight mb-3 drop-shadow-sm"
                >
                  {currentSlide.title}
                </motion.h1>

                {/* Single --heat rule underneath as the accent */}
                <motion.div 
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
                  className="h-[2px] w-24 bg-[#D35400] mb-4 origin-left" 
                />

                {/* Lede (Cormorant italic, small, --muted) */}
                {currentSlide.subtitle && (
                  <motion.h2 
                    variants={childVariants}
                    className="text-sm md:text-base font-display font-normal italic text-[#B0A99F] tracking-wide mb-6 leading-relaxed"
                  >
                    "{currentSlide.subtitle}"
                  </motion.h2>
                )}
              </div>

              {/* Brief framing before the reveal, Helvetica Light, short lines not a block */}
              <motion.div
                variants={childVariants}
                className="max-w-[70ch] mb-10"
              >
                <p className="font-sans font-light text-base md:text-[1.05rem] text-[#2C3E50]/90 leading-relaxed">
                  A name that describes behavior lets us measure what a land-use label cannot. Following Banham's reading of a territory through its ecologies, and grounded in the Salento's own vocabulary, three names now carry the three grounds from the last slide:
                </p>
              </motion.div>

              {/* Three color-coded chips */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 w-full">
                
                {/* CHIP 1 — STONE */}
                <div className="flex flex-col group">
                  {/* Color chip container */}
                  <motion.div
                    initial={{ backgroundColor: "rgb(150, 150, 150)", scale: 0.98, opacity: 0, y: 15 }}
                    animate={{ backgroundColor: "rgb(176, 169, 159)", scale: 1, opacity: 1, y: 0 }}
                    transition={{ duration: 1.0, ease: "easeOut", delay: 0.15 }}
                    className="relative aspect-[3/2] w-full overflow-hidden rounded flex flex-col items-center justify-center text-center p-6 border border-[#2C3E50]/5 shadow-sm"
                  >
                    <span className="text-[#F5F5F0] text-3xl md:text-4xl font-sans font-bold tracking-widest drop-shadow-sm">
                      STONE
                    </span>
                    <span className="text-[#F5F5F0]/85 text-[0.75rem] font-mono tracking-widest uppercase mt-3 block">
                      La Pietra
                    </span>
                  </motion.div>
                  {/* Description */}
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.65 }}
                    className="font-sans font-light text-sm text-[#2C3E50]/80 leading-relaxed mt-4"
                  >
                    the open mass, named for what it is.
                  </motion.p>
                </div>

                {/* CHIP 2 — FIRE */}
                <div className="flex flex-col group">
                  {/* Color chip container */}
                  <motion.div
                    initial={{ backgroundColor: "rgb(120, 120, 120)", scale: 0.98, opacity: 0, y: 15 }}
                    animate={{ backgroundColor: "rgb(211, 84, 0)", scale: 1, opacity: 1, y: 0 }}
                    transition={{ duration: 1.0, ease: "easeOut", delay: 0.3 }}
                    className="relative aspect-[3/2] w-full overflow-hidden rounded flex flex-col items-center justify-center text-center p-6 border border-[#2C3E50]/5 shadow-sm"
                  >
                    <span className="text-[#F5F5F0] text-3xl md:text-4xl font-sans font-bold tracking-widest drop-shadow-sm">
                      FIRE
                    </span>
                    <span className="text-[#F5F5F0]/85 text-[0.75rem] font-mono tracking-widest uppercase mt-3 block">
                      La Frangia
                    </span>
                  </motion.div>
                  {/* Description */}
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.8 }}
                    className="font-sans font-light text-sm text-[#2C3E50]/80 leading-relaxed mt-4"
                  >
                    the fraying margin, named for how it behaves — friction, conflict, heat.
                  </motion.p>
                </div>

                {/* CHIP 3 — SHADOW */}
                <div className="flex flex-col group">
                  {/* Color chip container */}
                  <motion.div
                    initial={{ backgroundColor: "rgb(110, 110, 110)", scale: 0.98, opacity: 0, y: 15 }}
                    animate={{ backgroundColor: "rgb(74, 93, 35)", scale: 1, opacity: 1, y: 0 }}
                    transition={{ duration: 1.0, ease: "easeOut", delay: 0.45 }}
                    className="relative aspect-[3/2] w-full overflow-hidden rounded flex flex-col items-center justify-center text-center p-6 border border-[#2C3E50]/5 shadow-sm"
                  >
                    <span className="text-[#F5F5F0] text-3xl md:text-4xl font-sans font-bold tracking-widest drop-shadow-sm">
                      SHADOW
                    </span>
                    <span className="text-[#F5F5F0]/85 text-[0.75rem] font-mono tracking-widest uppercase mt-3 block">
                      Il Giardino
                    </span>
                  </motion.div>
                  {/* Description */}
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.95 }}
                    className="font-sans font-light text-sm text-[#2C3E50]/80 leading-relaxed mt-4"
                  >
                    the vegetated buffer, named for what it still does.
                  </motion.p>
                </div>

              </div>

              {/* Closing line */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut", delay: 1.2 }}
                className="mt-10 border-t border-[#2C3E50]/5 pt-6 flex justify-center w-full"
              >
                <span className="text-[0.72rem] font-sans font-light tracking-[0.3em] text-[#B0A99F] uppercase text-center">
                  Three ecologies. One method for reading the whole fringe.
                </span>
              </motion.div>
            </motion.div>
          ) : currentSlide.layout === 'one-grid' ? (
            <motion.div
              key={currentIndex}
              variants={slideVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="w-full flex flex-col justify-start text-left font-sans"
              id={`slide-${currentSlide.id}`}
            >
              {/* Header section (Kicker, Title, Lede, Heat rule) */}
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-6">
                <div className="max-w-2xl">
                  {/* Slide Kicker */}
                  <motion.span 
                    variants={childVariants}
                    className="text-[0.7rem] font-sans font-bold tracking-[0.28em] text-[#D35400] uppercase mb-3 block"
                  >
                    {currentSlide.kicker}
                  </motion.span>

                  {/* Title / Headline */}
                  <motion.h1 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="text-3xl md:text-4xl lg:text-[2.6rem] leading-[1.1] font-sans font-bold text-[#2C3E50] tracking-tight mb-3 drop-shadow-sm"
                  >
                    {currentSlide.title}
                  </motion.h1>

                  {/* Single --heat rule underneath as the accent */}
                  <motion.div 
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
                    className="h-[2px] w-24 bg-[#D35400] mb-4 origin-left" 
                  />

                  {/* Lede (Cormorant italic, small, --muted) */}
                  {currentSlide.subtitle && (
                    <motion.h2 
                      variants={childVariants}
                      className="text-sm md:text-base font-display font-normal italic text-[#B0A99F] tracking-wide mb-1 leading-relaxed"
                    >
                      "{currentSlide.subtitle}"
                    </motion.h2>
                  )}
                </div>

                {/* Compact Body Text block to the side/top */}
                <motion.div
                  variants={childVariants}
                  className="max-w-md lg:text-right lg:self-end"
                >
                  <p className="font-sans font-light text-sm md:text-[0.95rem] text-[#2C3E50]/80 leading-relaxed">
                    To measure a gradient, you first need to grid it. A 100-metre fishnet — <strong className="text-[#D35400] font-normal">8,625 cells</strong> — laid across the Lecce fringe, from the historic core to the open countryside. Every cell becomes a single unit of analysis: one hectare, one set of measurements, one place in the gradient.
                  </p>
                </motion.div>
              </div>

              {/* MAP VISUAL - DOMINANT ELEMENT OF THE SLIDE */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.35 }}
                className="w-full bg-white/60 backdrop-blur-sm rounded border border-[#2C3E50]/10 overflow-hidden flex flex-col p-4 relative shadow-sm h-[380px] md:h-[420px]"
              >
                {/* HUD Top bar */}
                <div className="flex justify-between items-center pb-2 border-b border-[#2C3E50]/5 mb-3">
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-[#B0A99F] animate-pulse" />
                    <span className="text-[0.6rem] font-mono tracking-widest text-[#2C3E50]/60 uppercase">TERRITORIAL STUDY LIMITS: RADIAL OVERLAY</span>
                  </div>
                  <div className="text-[0.58rem] font-mono text-[#2C3E50]/50 uppercase flex space-x-3">
                    <span>GRID: 100M × 100M (1 HA)</span>
                    <span>·</span>
                    <span>PROJECTION: UTM-34N</span>
                  </div>
                </div>

                {/* Map graphics canvas */}
                <div className="flex-1 w-full relative overflow-hidden bg-[#F5F5F0]/30 rounded border border-[#2C3E50]/5">
                  <svg 
                    viewBox="0 0 800 320" 
                    className="w-full h-full select-none"
                    onMouseMove={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const x = e.clientX - rect.left;
                      const y = e.clientY - rect.top;
                      const cols = 60;
                      const rows = 24;
                      const col = Math.floor((x / rect.width) * cols);
                      const row = Math.floor((y / rect.height) * rows);
                      if (col >= 0 && col < cols && row >= 0 && row < rows) {
                        setHoveredGridCell({ r: row, c: col });
                      }
                    }}
                    onMouseLeave={() => setHoveredGridCell(null)}
                  >
                    {/* Definitions for patterns */}
                    <defs>
                      {/* Fishnet grid pattern covering the area */}
                      <pattern id="fishnet-grid" width="13.33" height="13.33" patternUnits="userSpaceOnUse">
                        <rect width="13.33" height="13.33" fill="none" stroke="#2C3E50" strokeWidth="0.18" strokeOpacity="0.12" />
                      </pattern>
                    </defs>

                    {/* 1. TERRAIN BASEMAP OUTLINES (Muted greyscale) */}
                    {/* Coastline (Adriatic Sea is upper right) */}
                    <path 
                      d="M 580,-20 Q 640,110 710,180 T 840,290 L 840,-20 Z" 
                      fill="#2C3E50" 
                      fillOpacity="0.03" 
                      stroke="#2C3E50" 
                      strokeWidth="0.5" 
                      strokeOpacity="0.15"
                      strokeDasharray="2,3"
                    />
                    <text x="730" y="50" className="font-mono text-[6px] fill-[#2C3E50]/30 tracking-widest uppercase rotate-45">Adriatic Coast</text>

                    {/* Regional topography contours - faint lines */}
                    <path d="M -10,180 Q 200,160 400,240 T 810,120" fill="none" stroke="#2C3E50" strokeWidth="0.25" strokeOpacity="0.08" />
                    <path d="M -10,240 Q 250,210 450,290 T 810,210" fill="none" stroke="#2C3E50" strokeWidth="0.25" strokeOpacity="0.08" />
                    <path d="M -10,110 Q 180,90 350,150 T 810,50" fill="none" stroke="#2C3E50" strokeWidth="0.25" strokeOpacity="0.08" />

                    {/* Lecce Historical Core (Center-Left) */}
                    <circle cx="210" cy="160" r="42" fill="none" stroke="#2C3E50" strokeWidth="0.6" strokeOpacity="0.25" strokeDasharray="3 2" />
                    <circle cx="210" cy="160" r="30" fill="#2C3E50" fillOpacity="0.04" stroke="#2C3E50" strokeWidth="0.5" strokeOpacity="0.2" />
                    <circle cx="210" cy="160" r="12" fill="#2C3E50" fillOpacity="0.06" stroke="#2C3E50" strokeWidth="0.4" strokeOpacity="0.15" />
                    <text x="210" y="163" className="font-sans font-bold text-[6px] fill-[#2C3E50]/40 tracking-wider text-center" textAnchor="middle">HISTORIC CORE</text>

                    {/* Radial Expansion Roads / Transects */}
                    <line x1="210" y1="160" x2="35" y2="60" stroke="#2C3E50" strokeWidth="0.4" strokeOpacity="0.15" />
                    <line x1="210" y1="160" x2="420" y2="60" stroke="#2C3E50" strokeWidth="0.4" strokeOpacity="0.15" />
                    <line x1="210" y1="160" x2="390" y2="280" stroke="#2C3E50" strokeWidth="0.4" strokeOpacity="0.15" />
                    <line x1="210" y1="160" x2="60" y2="250" stroke="#2C3E50" strokeWidth="0.4" strokeOpacity="0.15" />

                    {/* Urban Expansion Rings (faint) */}
                    <circle cx="210" cy="160" r="85" fill="none" stroke="#2C3E50" strokeWidth="0.3" strokeOpacity="0.12" strokeDasharray="5,5" />
                    <circle cx="210" cy="160" r="145" fill="none" stroke="#2C3E50" strokeWidth="0.3" strokeOpacity="0.08" strokeDasharray="5,5" />
                    <circle cx="210" cy="160" r="220" fill="none" stroke="#2C3E50" strokeWidth="0.3" strokeOpacity="0.05" strokeDasharray="5,5" />

                    {/* 2. THE DENSE FISHNET GRID OVERLAY */}
                    {/* Bounding Study area polygon (irregular shape laying across the fringe) */}
                    <polygon 
                      points="120,60 480,40 560,180 440,280 180,290 90,180" 
                      fill="url(#fishnet-grid)" 
                      stroke="#2C3E50" 
                      strokeWidth="1.2" 
                      strokeOpacity="0.4"
                    />

                    {/* Study Area Outline Glow/Boundary */}
                    <polygon 
                      points="120,60 480,40 560,180 440,280 180,290 90,180" 
                      fill="none" 
                      stroke="#2C3E50" 
                      strokeWidth="0.5" 
                      strokeOpacity="0.25"
                      strokeDasharray="4 4"
                    />

                    {/* Text Labels over areas */}
                    <text x="360" y="80" className="font-mono text-[5px] fill-[#2C3E50]/30 tracking-widest uppercase">Fractured Peri-Urban Fringe</text>
                    <text x="490" y="240" className="font-mono text-[5px] fill-[#2C3E50]/35 tracking-widest uppercase">Open Countryside</text>
                    <text x="130" y="240" className="font-mono text-[5px] fill-[#2C3E50]/30 tracking-widest uppercase">Karst Agricultural Terraces</text>

                    {/* 3. DYNAMIC HOVER CELL HIGHLIGHT */}
                    {hoveredGridCell && (
                      <g>
                        {/* Calculate exact coordinates for the 60x24 grid cell */}
                        <rect 
                          x={hoveredGridCell.c * 13.33} 
                          y={hoveredGridCell.r * 13.33} 
                          width="13.33" 
                          height="13.33" 
                          fill="#D35400" 
                          fillOpacity="0.25" 
                          stroke="#D35400" 
                          strokeWidth="1"
                        />
                        {/* Interactive crosshairs */}
                        <line 
                          x1={hoveredGridCell.c * 13.33 + 6.66} 
                          y1="0" 
                          x2={hoveredGridCell.c * 13.33 + 6.66} 
                          y2="320" 
                          stroke="#D35400" 
                          strokeWidth="0.3" 
                          strokeOpacity="0.4" 
                          strokeDasharray="1 3"
                        />
                        <line 
                          x1="0" 
                          y1={hoveredGridCell.r * 13.33 + 6.66} 
                          x2="800" 
                          y2={hoveredGridCell.r * 13.33 + 6.66} 
                          stroke="#D35400" 
                          strokeWidth="0.3" 
                          strokeOpacity="0.4" 
                          strokeDasharray="1 3"
                        />
                      </g>
                    )}

                    {/* Calibration Marks on Border */}
                    <rect x="0.5" y="0.5" width="799" height="319" fill="none" stroke="#2C3E50" strokeOpacity="0.15" strokeWidth="1" />
                    
                    {/* Corner Coordinate labels */}
                    <text x="6" y="12" className="font-mono text-[5.2px] fill-[#2C3E50]/45">40°22'45"N</text>
                    <text x="6" y="20" className="font-mono text-[5.2px] fill-[#2C3E50]/45">18°08'12"E</text>

                    <text x="752" y="12" className="font-mono text-[5.2px] fill-[#2C3E50]/45 text-right" textAnchor="end">40°22'45"N</text>
                    <text x="752" y="20" className="font-mono text-[5.2px] fill-[#2C3E50]/45 text-right" textAnchor="end">18°14'50"E</text>

                    <text x="6" y="302" className="font-mono text-[5.2px] fill-[#2C3E50]/45">40°18'10"N</text>
                    <text x="6" y="310" className="font-mono text-[5.2px] fill-[#2C3E50]/45">18°08'12"E</text>

                    <text x="752" y="302" className="font-mono text-[5.2px] fill-[#2C3E50]/45 text-right" textAnchor="end">40°18'10"N</text>
                    <text x="752" y="310" className="font-mono text-[5.2px] fill-[#2C3E50]/45 text-right" textAnchor="end">18°14'50"E</text>
                  </svg>

                  {/* HUD Hover Card overlay on the map */}
                  <div className="absolute bottom-3 left-3 bg-[#F5F5F0]/95 backdrop-blur-md px-3 py-2.5 rounded border border-[#2C3E50]/15 shadow-md flex flex-col space-y-1 z-10 min-w-[160px] max-w-[200px]">
                    <span className="text-[0.52rem] font-mono tracking-wider text-[#D35400] uppercase font-bold">CELL TELEMETRY</span>
                    {hoveredGridCell ? (
                      <div className="space-y-0.5">
                        <div className="flex justify-between space-x-4">
                          <span className="text-[0.58rem] font-sans text-[#2C3E50]/60">Cell ID:</span>
                          <span className="text-[0.58rem] font-mono font-bold text-[#2C3E50]">c-{(hoveredGridCell.r * 60 + hoveredGridCell.c + 1205)}</span>
                        </div>
                        <div className="flex justify-between space-x-4">
                          <span className="text-[0.58rem] font-sans text-[#2C3E50]/60">UTM Coord:</span>
                          <span className="text-[0.58rem] font-mono text-[#2C3E50]">{274 + hoveredGridCell.c}E, {4470 + hoveredGridCell.r}N</span>
                        </div>
                        <div className="flex justify-between space-x-4">
                          <span className="text-[0.58rem] font-sans text-[#2C3E50]/60">Extents:</span>
                          <span className="text-[0.58rem] font-mono text-[#2C3E50]">100m × 100m</span>
                        </div>
                        <div className="flex justify-between space-x-4">
                          <span className="text-[0.58rem] font-sans text-[#2C3E50]/60">Area:</span>
                          <span className="text-[0.58rem] font-mono text-[#2C3E50]">1.00 Hectare</span>
                        </div>
                        <div className="pt-1 border-t border-[#2C3E50]/10 flex justify-between space-x-4 mt-1">
                          <span className="text-[0.52rem] font-mono text-emerald-700 font-bold tracking-wider">CELL BOUNDS VALID</span>
                        </div>
                      </div>
                    ) : (
                      <div className="py-2">
                        <span className="text-[0.58rem] font-sans text-[#2C3E50]/60 italic">Hover grid cells to read spatial parameters.</span>
                      </div>
                    )}
                  </div>

                  {/* Compass / Scale / Legend Box overlay */}
                  <div className="absolute top-3 right-3 bg-[#F5F5F0]/90 backdrop-blur-md px-3 py-2 rounded border border-[#2C3E50]/15 shadow-sm z-10 flex flex-col space-y-1.5 min-w-[140px]">
                    <div className="flex items-center space-x-2 border-b border-[#2C3E50]/10 pb-1">
                      <Compass size={11} className="text-[#2C3E50]/70 animate-spin" style={{ animationDuration: '60s' }} />
                      <span className="text-[0.55rem] font-mono tracking-widest text-[#2C3E50] uppercase font-bold">LEGEND</span>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <div className="w-3.5 h-2 bg-[#2C3E50]/5 border border-dashed border-[#2C3E50]/30 rounded-sm" />
                        <span className="text-[0.58rem] font-sans text-[#2C3E50]/75">8,625 cells extent</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3.5 h-2.5 bg-white/60 border border-[#2C3E50]/10 rounded-sm overflow-hidden">
                          <div className="w-full h-full" style={{ backgroundImage: 'linear-gradient(to right, rgba(44,62,80,0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(44,62,80,0.1) 1px, transparent 1px)', backgroundSize: '3px 3px' }} />
                        </div>
                        <span className="text-[0.58rem] font-sans text-[#2C3E50]/75">100m fishnet grid</span>
                      </div>
                      <div className="flex items-center space-x-2 pt-1 border-t border-[#2C3E50]/5">
                        <span className="text-[0.55rem] font-mono text-[#D35400] font-bold">METRIC VALUE:</span>
                        <span className="text-[0.58rem] font-sans font-bold text-[#2C3E50]">1.00 Ha / cell</span>
                      </div>
                    </div>
                  </div>

                  {/* Fine grain GIS detail block (bottom right) */}
                  <div className="absolute bottom-3 right-3 flex items-center space-x-3 text-[0.55rem] font-mono text-[#2C3E50]/60 z-10">
                    <div className="flex items-center space-x-1 bg-[#F5F5F0]/80 backdrop-blur-sm px-2 py-1 rounded border border-[#2C3E50]/10">
                      <span className="h-1 w-1 bg-emerald-500 rounded-full" />
                      <span>GIS LINK: OK</span>
                    </div>
                    <div className="flex items-center space-x-1.5 bg-[#F5F5F0]/80 backdrop-blur-sm px-2 py-1 rounded border border-[#2C3E50]/10">
                      <div className="w-5 h-0.5 bg-[#2C3E50] relative">
                        <div className="absolute right-0 top-[-2.5px] w-[1px] h-[6px] bg-[#2C3E50]" />
                        <div className="absolute left-0 top-[-2.5px] w-[1px] h-[6px] bg-[#2C3E50]" />
                      </div>
                      <span>500 m</span>
                    </div>
                  </div>
                </div>

                {/* Legend footer */}
                <div className="flex justify-between items-center mt-2 pt-2 border-t border-[#2C3E50]/5 text-[0.62rem] font-mono text-[#B0A99F]">
                  <span>REPRESENTATION: MUTED BASICAL STUDY LIMITS</span>
                  <span>[ACT II OPENS: EMPIRICAL CALIBRATION]</span>
                </div>
              </motion.div>
            </motion.div>
          ) : currentSlide.layout === 'one-grid-one-line' ? (
            <motion.div
              key={currentIndex}
              variants={slideVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="w-full flex flex-col justify-start text-left font-sans animate-fade-in"
              id={`slide-${currentSlide.id}`}
            >
              {/* Header section (Kicker, Title, Lede, Heat rule) */}
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-4">
                <div className="max-w-2xl">
                  {/* Slide Kicker */}
                  <motion.span 
                    variants={childVariants}
                    className="text-[0.7rem] font-sans font-bold tracking-[0.28em] text-[#D35400] uppercase mb-2 block"
                  >
                    {currentSlide.kicker}
                  </motion.span>

                  {/* Title / Headline */}
                  <motion.h1 
                    initial={{ y: 15, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="text-2xl md:text-3xl lg:text-4xl leading-[1.1] font-sans font-bold text-[#2C3E50] tracking-tight mb-2 drop-shadow-sm"
                  >
                    {currentSlide.title}
                  </motion.h1>

                  {/* Single --heat rule underneath as the accent */}
                  <motion.div 
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
                    className="h-[2px] w-20 bg-[#D35400] mb-2 origin-left" 
                  />
                </div>
              </div>

              {/* LIVE INTERACTIVE COMPONENT - ONE GRID, ONE LINE */}
              <OneGridOneLine />

            </motion.div>
          ) : currentSlide.layout === 'one-grid-two-readings' ? (
            <motion.div
              key={currentIndex}
              variants={slideVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="w-full flex flex-col justify-start text-left font-sans"
              id={`slide-${currentSlide.id}`}
            >
              {/* Header section (Kicker, Title, Lede, Heat rule) */}
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-6">
                <div className="max-w-2xl">
                  {/* Slide Kicker */}
                  <motion.span 
                    variants={childVariants}
                    className="text-[0.7rem] font-sans font-bold tracking-[0.28em] text-[#D35400] uppercase mb-3 block"
                  >
                    {currentSlide.kicker}
                  </motion.span>

                  {/* Title / Headline */}
                  <motion.h1 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="text-3xl md:text-4xl lg:text-[2.6rem] leading-[1.1] font-sans font-bold text-[#2C3E50] tracking-tight mb-3 drop-shadow-sm"
                  >
                    {currentSlide.title}
                  </motion.h1>

                  {/* Single --heat rule underneath as the accent */}
                  <motion.div 
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
                    className="h-[2px] w-24 bg-[#D35400] mb-4 origin-left" 
                  />

                  {/* Lede (Cormorant italic, small, --muted) */}
                  {currentSlide.subtitle && (
                    <motion.h2 
                      variants={childVariants}
                      className="text-sm md:text-base font-display font-normal italic text-[#B0A99F] tracking-wide mb-1 leading-relaxed"
                    >
                      "{currentSlide.subtitle}"
                    </motion.h2>
                  )}
                </div>

                {/* Compact Body Text block to the side/top */}
                <motion.div
                  variants={childVariants}
                  className="max-w-md lg:text-right lg:self-end"
                >
                  <p className="font-sans font-light text-sm md:text-[0.95rem] text-[#2C3E50]/80 leading-relaxed">
                    {currentSlide.bodyText[0]}
                  </p>
                </motion.div>
              </div>

              {/* INTERACTIVE ENGINE */}
              <OneGridTwoReadings />

            </motion.div>
          ) : currentSlide.layout === 'stone-fire-trade' ? (
            <motion.div
              key={currentIndex}
              variants={slideVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="w-full flex flex-col justify-start text-left font-sans"
              id={`slide-${currentSlide.id}`}
            >
              {/* Header section (Kicker, Title, Lede, Heat rule) */}
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-4">
                <div className="max-w-2xl">
                  {/* Slide Kicker */}
                  <motion.span 
                    variants={childVariants}
                    className="text-[0.7rem] font-sans font-bold tracking-[0.28em] text-[#D35400] uppercase mb-2 block"
                  >
                    {currentSlide.kicker}
                  </motion.span>

                  {/* Title / Headline */}
                  <motion.h1 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="text-3xl md:text-4xl lg:text-[2.4rem] leading-[1.1] font-sans font-bold text-[#2C3E50] tracking-tight mb-2 drop-shadow-sm"
                  >
                    {currentSlide.title}
                  </motion.h1>

                  {/* Single --heat rule underneath as the accent */}
                  <motion.div 
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
                    className="h-[2px] w-24 bg-[#D35400] mb-3 origin-left" 
                  />
                </div>

                {/* Compact Body Text block to the side/top */}
                <motion.div
                  variants={childVariants}
                  className="max-w-md lg:text-right lg:self-end"
                >
                  <p className="font-sans font-light text-xs md:text-[0.88rem] text-[#2C3E50]/80 leading-relaxed">
                    {currentSlide.bodyText[0]}
                  </p>
                </motion.div>
              </div>

              {/* LIVE INTERACTIVE COMPONENT */}
              <StoneFireTrade />

            </motion.div>
          ) : currentSlide.layout === 'ecology-map' ? (
            <motion.div
              key={currentIndex}
              variants={slideVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="w-full flex flex-col justify-start text-left font-sans animate-fade-in"
              id={`slide-${currentSlide.id}`}
            >
              {/* Header section (Kicker, Title, Lede, Heat rule) */}
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-5">
                <div className="max-w-2xl">
                  {/* Slide Kicker */}
                  <motion.span 
                    variants={childVariants}
                    className="text-[0.7rem] font-sans font-bold tracking-[0.28em] text-[#D35400] uppercase mb-3 block"
                  >
                    {currentSlide.kicker}
                  </motion.span>

                  {/* Title / Headline */}
                  <motion.h1 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="text-3xl md:text-4xl lg:text-[2.6rem] leading-[1.1] font-sans font-bold text-[#2C3E50] tracking-tight mb-3 drop-shadow-sm"
                  >
                    {currentSlide.title}
                  </motion.h1>

                  {/* Single --heat rule underneath as the accent */}
                  <motion.div 
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
                    className="h-[2px] w-24 bg-[#D35400] mb-4 origin-left" 
                  />

                  {/* Lede (Cormorant italic, small, --muted) */}
                  {currentSlide.subtitle && (
                    <motion.h2 
                      variants={childVariants}
                      className="text-sm md:text-base font-display font-normal italic text-[#B0A99F] tracking-wide mb-1 leading-relaxed"
                    >
                      "{currentSlide.subtitle}"
                    </motion.h2>
                  )}
                </div>

                {/* Compact Body Text block to the side/top */}
                <motion.div
                  variants={childVariants}
                  className="max-w-md lg:text-right lg:self-end"
                >
                  <p className="font-sans font-light text-sm md:text-[0.95rem] text-[#2C3E50]/80 leading-relaxed">
                    Every cell in the 8,625-cell grid now carries a Dominant Ecology. What Urban Atlas rendered as 94 hectares of noise resolves into structure: <strong className="text-[#B0A99F] font-normal">Stone</strong> the dominant open matrix, <strong className="text-[#D35400] font-normal">Fire</strong> the rare but consequential fringe, <strong className="text-[#4A5D23] font-normal">Shadow</strong> the surviving canopy.
                  </p>
                </motion.div>
              </div>

              {/* VIEW TOGGLE BUTTONS */}
              <div className="flex space-x-2 mb-4 self-start">
                <button
                  id="btn-view-ecology"
                  onClick={() => setSlide7View('ecology')}
                  className={`px-4 py-1.5 text-[0.62rem] md:text-[0.68rem] font-sans font-bold tracking-widest uppercase transition-all duration-200 border rounded cursor-pointer ${
                    slide7View === 'ecology'
                      ? 'bg-[#2C3E50] text-[#F5F5F0] border-[#2C3E50]'
                      : 'bg-white/60 text-[#2C3E50]/70 border-[#2C3E50]/15 hover:bg-white'
                  }`}
                >
                  ECOLOGY
                </button>
                <button
                  id="btn-view-peri-urban"
                  onClick={() => setSlide7View('peri-urban')}
                  className={`px-4 py-1.5 text-[0.62rem] md:text-[0.68rem] font-sans font-bold tracking-widest uppercase transition-all duration-200 border rounded cursor-pointer ${
                    slide7View === 'peri-urban'
                      ? 'bg-[#2C3E50] text-[#F5F5F0] border-[#2C3E50]'
                      : 'bg-white/60 text-[#2C3E50]/70 border-[#2C3E50]/15 hover:bg-white'
                  }`}
                >
                  PERI-URBAN CLASS
                </button>
              </div>

              {/* MAP VISUAL - DOMINANT ELEMENT OF THE SLIDE */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.35 }}
                className="w-full bg-white/60 backdrop-blur-sm rounded border border-[#2C3E50]/10 overflow-hidden flex flex-col p-4 relative shadow-sm h-[360px] md:h-[400px]"
              >
                {/* HUD Top bar */}
                <div className="flex justify-between items-center pb-2 border-b border-[#2C3E50]/5 mb-3">
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-[#D35400] animate-pulse" />
                    <span className="text-[0.6rem] font-mono tracking-widest text-[#2C3E50]/60 uppercase">
                      {slide7View === 'ecology' ? 'CLASSIFIED ECOLOGICAL FISHNET MAP' : 'PERI-URBAN SCORE CLASSIFICATION FISHNET'}
                    </span>
                  </div>
                  <div className="text-[0.58rem] font-mono text-[#2C3E50]/50 uppercase flex space-x-3">
                    <span>GRID: 100M × 100M (1 HA)</span>
                    <span>·</span>
                    <span>
                      {slide7View === 'ecology' ? 'ECOLOGY MAP (DRAFT FIG 5.4 / 6.7)' : 'PERI-URBAN gradient (DRAFT FIG 5.5 / 6.8)'}
                    </span>
                  </div>
                </div>

                {/* Map graphics canvas */}
                <div className="flex-1 w-full relative overflow-hidden bg-[#F5F5F0]/30 rounded border border-[#2C3E50]/5">
                  {/* Layer 1: Ecology Interactive Grid */}
                  <motion.div
                    animate={{ opacity: slide7View === 'ecology' ? 1 : 0 }}
                    transition={{ duration: 0.4, ease: 'easeInOut' }}
                    style={{ pointerEvents: slide7View === 'ecology' ? 'auto' : 'none' }}
                    className="absolute inset-0 w-full h-full flex flex-col"
                  >
                    <svg 
                      viewBox="0 0 800 320" 
                      className="w-full h-full select-none"
                      onMouseMove={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        const x = e.clientX - rect.left;
                        const y = e.clientY - rect.top;
                        const cols = 60;
                        const rows = 24;
                        const col = Math.floor((x / rect.width) * cols);
                        const row = Math.floor((y / rect.height) * rows);
                        
                        if (col >= 0 && col < cols && row >= 0 && row < rows) {
                          // Check if center of cell is within the polygon study bounds
                          const pX = col * 13.33 + 6.66;
                          const pY = row * 13.33 + 6.66;
                          const poly = [
                            [120, 60],
                            [480, 40],
                            [560, 180],
                            [440, 280],
                            [180, 290],
                            [90, 180]
                          ];
                          let inside = false;
                          for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
                            const xi = poly[i][0], yi = poly[i][1];
                            const xj = poly[j][0], yj = poly[j][1];
                            const intersect = ((yi > pY) !== (yj > pY))
                                && (pX < (xj - xi) * (pY - yi) / (yj - yi) + xi);
                            if (intersect) inside = !inside;
                          }
                          
                          if (inside) {
                            setHoveredGridCell({ r: row, c: col });
                          } else {
                            setHoveredGridCell(null);
                          }
                        }
                      }}
                      onMouseLeave={() => setHoveredGridCell(null)}
                    >
                      {/* Definitions */}
                      <defs>
                        <clipPath id="study-area-poly-clip">
                          <polygon points="120,60 480,40 560,180 440,280 180,290 90,180" />
                        </clipPath>
                      </defs>

                      {/* 1. TERRAIN BASEMAP OUTLINES (Same as Slide 5 for continuity) */}
                      {/* Coastline (Adriatic Sea is upper right) */}
                      <path 
                        d="M 580,-20 Q 640,110 710,180 T 840,290 L 840,-20 Z" 
                        fill="#2C3E50" 
                        fillOpacity="0.03" 
                        stroke="#2C3E50" 
                        strokeWidth="0.5" 
                        strokeOpacity="0.15"
                        strokeDasharray="2,3"
                      />
                      <text x="730" y="50" className="font-mono text-[6px] fill-[#2C3E50]/30 tracking-widest uppercase rotate-45">Adriatic Coast</text>

                      {/* Contours */}
                      <path d="M -10,180 Q 200,160 400,240 T 810,120" fill="none" stroke="#2C3E50" strokeWidth="0.25" strokeOpacity="0.08" />
                      <path d="M -10,240 Q 250,210 450,290 T 810,210" fill="none" stroke="#2C3E50" strokeWidth="0.25" strokeOpacity="0.08" />
                      <path d="M -10,110 Q 180,90 350,150 T 810,50" fill="none" stroke="#2C3E50" strokeWidth="0.25" strokeOpacity="0.08" />

                      {/* Historic Core */}
                      <circle cx="210" cy="160" r="42" fill="none" stroke="#2C3E50" strokeWidth="0.6" strokeOpacity="0.25" strokeDasharray="3 2" />
                      <circle cx="210" cy="160" r="30" fill="#2C3E50" fillOpacity="0.04" stroke="#2C3E50" strokeWidth="0.5" strokeOpacity="0.2" />
                      <circle cx="210" cy="160" r="12" fill="#2C3E50" fillOpacity="0.06" stroke="#2C3E50" strokeWidth="0.4" strokeOpacity="0.15" />
                      <text x="210" y="163" className="font-sans font-bold text-[6px] fill-[#2C3E50]/40 tracking-wider text-center" textAnchor="middle">HISTORIC CORE</text>

                      {/* Radial Roads */}
                      <line x1="210" y1="160" x2="35" y2="60" stroke="#2C3E50" strokeWidth="0.4" strokeOpacity="0.15" />
                      <line x1="210" y1="160" x2="420" y2="60" stroke="#2C3E50" strokeWidth="0.4" strokeOpacity="0.15" />
                      <line x1="210" y1="160" x2="390" y2="280" stroke="#2C3E50" strokeWidth="0.4" strokeOpacity="0.15" />
                      <line x1="210" y1="160" x2="60" y2="250" stroke="#2C3E50" strokeWidth="0.4" strokeOpacity="0.15" />

                      {/* Urban Expansion Rings */}
                      <circle cx="210" cy="160" r="85" fill="none" stroke="#2C3E50" strokeWidth="0.3" strokeOpacity="0.12" strokeDasharray="5,5" />
                      <circle cx="210" cy="160" r="145" fill="none" stroke="#2C3E50" strokeWidth="0.3" strokeOpacity="0.08" strokeDasharray="5,5" />

                      {/* 2. THE DENSE CLASSIFIED GRID (Clipped to study area) */}
                      <g clipPath="url(#study-area-poly-clip)">
                        {Array.from({ length: 24 }).map((_, r) => (
                          Array.from({ length: 60 }).map((_, c) => {
                            const pX = c * 13.33 + 6.66;
                            const pY = r * 13.33 + 6.66;
                            // Standard ray casting check for the polygon
                            const poly = [
                              [120, 60],
                              [480, 40],
                              [560, 180],
                              [440, 280],
                              [180, 290],
                              [90, 180]
                            ];
                            let inside = false;
                            for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
                              const xi = poly[i][0], yi = poly[i][1];
                              const xj = poly[j][0], yj = poly[j][1];
                              const intersect = ((yi > pY) !== (yj > pY))
                                  && (pX < (xj - xi) * (pY - yi) / (yj - yi) + xi);
                              if (intersect) inside = !inside;
                            }

                            if (!inside) return null;

                            // Ecology assignment
                            const hash = Math.abs(Math.sin(c * 12.9898 + r * 78.233) * 43758.5453) % 1;
                            
                            // Canopy centers
                            const canopyCenters = [
                              { r: 4, c: 32 }, { r: 8, c: 45 }, { r: 12, c: 24 }, 
                              { r: 16, c: 38 }, { r: 20, c: 44 }, { r: 15, c: 15 }
                            ];
                            let minDistToCanopy = 999;
                            canopyCenters.forEach(center => {
                              const dist = Math.sqrt(Math.pow(r - center.r, 2) + Math.pow(c - center.c, 2));
                              if (dist < minDistToCanopy) minDistToCanopy = dist;
                            });

                            // Fire centers
                            const fireCenters = [
                              { r: 9, c: 22 }, { r: 5, c: 28 }, { r: 15, c: 19 }, { r: 13, c: 31 }
                            ];
                            let minDistToFire = 999;
                            fireCenters.forEach(center => {
                              const dist = Math.sqrt(Math.pow(r - center.r, 2) + Math.pow(c - center.c, 2));
                              if (dist < minDistToFire) minDistToFire = dist;
                            });

                            let ecology = 0; // Stone
                            if (minDistToCanopy < 1.8 + hash * 1.5) {
                              ecology = 2; // Shadow / Canopy
                            } else if (minDistToFire < 1.0 + hash * 0.8) {
                              ecology = 1; // Fire
                            } else {
                              // Stone vs Transitional probability
                              const stoneProb = 0.40 + (c / 60) * 0.25 + (r / 24) * 0.1;
                              ecology = hash < stoneProb ? 0 : 3;
                            }

                            const colorMap = {
                              0: '#B0A99F', // Stone
                              1: '#D35400', // Fire
                              2: '#4A5D23', // Shadow
                              3: '#4A7C9E', // Transitional
                            };

                            return (
                              <motion.rect
                                key={`eco-cell-${r}-${c}`}
                                x={c * 13.33}
                                y={r * 13.33}
                                width="13.33"
                                height="13.33"
                                initial={{ fill: "#D1CFC9", fillOpacity: 0.12 }}
                                animate={{ 
                                  fill: colorMap[ecology as 0 | 1 | 2 | 3],
                                  fillOpacity: 0.85 
                                }}
                                transition={{ 
                                  duration: 1.0, 
                                  ease: "easeOut",
                                  delay: 0.25 + (r * 60 + c) * 0.0006 
                                }}
                                stroke="#2C3E50"
                                strokeWidth="0.15"
                                strokeOpacity="0.08"
                              />
                            );
                          })
                        ))}
                      </g>

                      {/* Bounding Study area polygon (border on top) */}
                      <polygon 
                        points="120,60 480,40 560,180 440,280 180,290 90,180" 
                        fill="none" 
                        stroke="#2C3E50" 
                        strokeWidth="1.2" 
                        strokeOpacity="0.4"
                      />

                      {/* Labels */}
                      <text x="360" y="80" className="font-mono text-[5px] fill-[#2C3E50]/40 tracking-widest uppercase">Fractured Peri-Urban Fringe</text>
                      <text x="490" y="240" className="font-mono text-[5px] fill-[#2C3E50]/45 tracking-widest uppercase">Open Countryside</text>
                      <text x="130" y="240" className="font-mono text-[5px] fill-[#2C3E50]/40 tracking-widest uppercase">Karst Agricultural Terraces</text>

                      {/* Dynamic Hover Highlight */}
                      {hoveredGridCell && (
                        <g>
                          <rect 
                            x={hoveredGridCell.c * 13.33} 
                            y={hoveredGridCell.r * 13.33} 
                            width="13.33" 
                            height="13.33" 
                            fill="none" 
                            stroke="#2C3E50" 
                            strokeWidth="1.5"
                            className="animate-pulse"
                          />
                          <line 
                            x1={hoveredGridCell.c * 13.33 + 6.66} 
                            y1="0" 
                            x2={hoveredGridCell.c * 13.33 + 6.66} 
                            y2="320" 
                            stroke="#2C3E50" 
                            strokeWidth="0.3" 
                            strokeOpacity="0.35" 
                            strokeDasharray="1 3"
                          />
                          <line 
                            x1="0" 
                            y1={hoveredGridCell.r * 13.33 + 6.66} 
                            x2="800" 
                            y2={hoveredGridCell.r * 13.33 + 6.66} 
                            stroke="#2C3E50" 
                            strokeWidth="0.3" 
                            strokeOpacity="0.35" 
                            strokeDasharray="1 3"
                          />
                        </g>
                      )}

                      {/* Calibration Marks */}
                      <rect x="0.5" y="0.5" width="799" height="319" fill="none" stroke="#2C3E50" strokeOpacity="0.15" strokeWidth="1" />
                      
                      {/* Corner Coordinates */}
                      <text x="6" y="12" className="font-mono text-[5.2px] fill-[#2C3E50]/45">40°22'45"N</text>
                      <text x="6" y="20" className="font-mono text-[5.2px] fill-[#2C3E50]/45">18°08'12"E</text>
                      <text x="752" y="12" className="font-mono text-[5.2px] fill-[#2C3E50]/45 text-right" textAnchor="end">40°22'45"N</text>
                      <text x="752" y="20" className="font-mono text-[5.2px] fill-[#2C3E50]/45 text-right" textAnchor="end">18°14'50"E</text>
                    </svg>

                    {/* HUD Hover Card overlay on the map */}
                    <div className="absolute bottom-3 left-3 bg-[#F5F5F0]/95 backdrop-blur-md px-3 py-2.5 rounded border border-[#2C3E50]/15 shadow-md flex flex-col space-y-1 z-10 min-w-[180px] max-w-[220px]">
                      <span className="text-[0.52rem] font-mono tracking-wider text-[#D35400] uppercase font-bold">CLASSIFIED CELL TELEMETRY</span>
                      {hoveredGridCell ? (
                        <div className="space-y-0.5">
                          <div className="flex justify-between space-x-4">
                            <span className="text-[0.58rem] font-sans text-[#2C3E50]/60">Cell ID:</span>
                            <span className="text-[0.58rem] font-mono font-bold text-[#2C3E50]">c-{(hoveredGridCell.r * 60 + hoveredGridCell.c + 1205)}</span>
                          </div>
                          <div className="flex justify-between space-x-4">
                            <span className="text-[0.58rem] font-sans text-[#2C3E50]/60">UTM Coord:</span>
                            <span className="text-[0.58rem] font-mono text-[#2C3E50]">{274 + hoveredGridCell.c}E, {4470 + hoveredGridCell.r}N</span>
                          </div>
                          {(() => {
                            const r = hoveredGridCell.r;
                            const c = hoveredGridCell.c;
                            const hash = Math.abs(Math.sin(c * 12.9898 + r * 78.233) * 43758.5453) % 1;
                            const canopyCenters = [
                              { r: 4, c: 32 }, { r: 8, c: 45 }, { r: 12, c: 24 }, 
                              { r: 16, c: 38 }, { r: 20, c: 44 }, { r: 15, c: 15 }
                            ];
                            let minDistToCanopy = 999;
                            canopyCenters.forEach(center => {
                              const dist = Math.sqrt(Math.pow(r - center.r, 2) + Math.pow(c - center.c, 2));
                              if (dist < minDistToCanopy) minDistToCanopy = dist;
                            });

                            const fireCenters = [
                              { r: 9, c: 22 }, { r: 5, c: 28 }, { r: 15, c: 19 }, { r: 13, c: 31 }
                            ];
                            let minDistToFire = 999;
                            fireCenters.forEach(center => {
                              const dist = Math.sqrt(Math.pow(r - center.r, 2) + Math.pow(c - center.c, 2));
                              if (dist < minDistToFire) minDistToFire = dist;
                            });

                            let ecology = 0;
                            let ecoName = "Stone";
                            let ecoLocal = "La Pietra";
                            let ecoColor = "text-[#B0A99F]";
                            if (minDistToCanopy < 1.8 + hash * 1.5) {
                              ecology = 2;
                              ecoName = "Shadow / Canopy";
                              ecoLocal = "Il Giardino";
                              ecoColor = "text-[#4A5D23]";
                            } else if (minDistToFire < 1.0 + hash * 0.8) {
                              ecology = 1;
                              ecoName = "Fire";
                              ecoLocal = "La Frangia";
                              ecoColor = "text-[#D35400]";
                            } else {
                              const stoneProb = 0.40 + (c / 60) * 0.25 + (r / 24) * 0.1;
                              ecology = hash < stoneProb ? 0 : 3;
                              if (ecology === 3) {
                                ecoName = "Transitional";
                                ecoLocal = "Edge";
                                ecoColor = "text-[#4A7C9E]";
                              }
                            }

                            return (
                              <>
                                <div className="flex justify-between space-x-4 pt-0.5 border-t border-[#2C3E50]/5 mt-0.5">
                                  <span className="text-[0.58rem] font-sans text-[#2C3E50]/60">Dominant Ecology:</span>
                                  <span className={`text-[0.58rem] font-sans font-bold ${ecoColor}`}>{ecoName}</span>
                                </div>
                                <div className="flex justify-between space-x-4">
                                  <span className="text-[0.58rem] font-sans text-[#2C3E50]/60">Local Term:</span>
                                  <span className={`text-[0.58rem] font-mono italic ${ecoColor}`}>{ecoLocal}</span>
                                </div>
                              </>
                            );
                          })()}
                        </div>
                      ) : (
                        <div className="py-2">
                          <span className="text-[0.58rem] font-sans text-[#2C3E50]/60 italic">Hover cells to read classified ecological attributes.</span>
                        </div>
                      )}
                    </div>

                    {/* Compass / Scale overlay */}
                    <div className="absolute top-3 right-3 bg-[#F5F5F0]/90 backdrop-blur-md px-3 py-2 rounded border border-[#2C3E50]/15 shadow-sm z-10 flex flex-col space-y-1.5 min-w-[130px]">
                      <div className="flex items-center space-x-2 border-b border-[#2C3E50]/10 pb-1">
                        <Compass size={11} className="text-[#2C3E50]/70 animate-spin" style={{ animationDuration: '60s' }} />
                        <span className="text-[0.55rem] font-mono tracking-widest text-[#2C3E50] uppercase font-bold">GIS CALIBRATION</span>
                      </div>
                      <div className="space-y-1 text-[0.58rem] font-sans text-[#2C3E50]/75">
                        <div className="flex justify-between">
                          <span>Fishnet Dim:</span>
                          <span className="font-mono font-medium">100m × 100m</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Ecology Layers:</span>
                          <span className="font-mono font-medium">4 Classified</span>
                        </div>
                      </div>
                    </div>

                    {/* Scale indicator (bottom right) */}
                    <div className="absolute bottom-3 right-3 flex items-center space-x-3 text-[0.55rem] font-mono text-[#2C3E50]/60 z-10">
                      <div className="flex items-center space-x-1.5 bg-[#F5F5F0]/80 backdrop-blur-sm px-2 py-1 rounded border border-[#2C3E50]/10">
                        <div className="w-5 h-0.5 bg-[#2C3E50] relative">
                          <div className="absolute right-0 top-[-2.5px] w-[1px] h-[6px] bg-[#2C3E50]" />
                          <div className="absolute left-0 top-[-2.5px] w-[1px] h-[6px] bg-[#2C3E50]" />
                        </div>
                        <span>500 m</span>
                      </div>
                    </div>
                  </motion.div>

                  {/* Layer 2: Peri-Urban Class Static Placeholder Frame */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: slide7View === 'peri-urban' ? 1 : 0 }}
                    transition={{ duration: 0.4, ease: 'easeInOut' }}
                    style={{ pointerEvents: slide7View === 'peri-urban' ? 'auto' : 'none' }}
                    className="absolute inset-0 w-full h-full flex flex-col p-4 bg-[#F5F5F0]/60"
                  >
                    <div className="flex-1 w-full border border-dashed border-[#2C3E50]/20 rounded bg-white/50 flex flex-col items-center justify-center p-6 relative">
                      {/* Grid background mesh */}
                      <div className="absolute inset-0 opacity-[0.03] pointer-events-none overflow-hidden bg-[radial-gradient(#2C3E50_1.5px,transparent_1.5px)] [background-size:20px_20px]" />
                      
                      <div className="max-w-md text-center space-y-4 z-10">
                        <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded bg-[#D35400]/5 border border-[#D35400]/20 text-[0.58rem] font-mono tracking-widest text-[#D35400] uppercase font-bold">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#D35400] animate-pulse" />
                          <span>PENDING GIS LAYER EXPORT</span>
                        </div>
                        
                        <div className="space-y-1">
                          <h4 className="text-[0.6rem] font-mono tracking-wider text-[#2C3E50]/40 uppercase">placeholder</h4>
                          <h3 className="text-base font-sans font-bold text-[#2C3E50] tracking-tight uppercase">
                            your artwork
                          </h3>
                        </div>
                        
                        <p className="text-[0.72rem] font-sans text-[#2C3E50]/70 leading-relaxed font-light italic">
                          "[IMAGE: Peri-Urban Class choropleth — the same 8,625-cell fishnet, same extent as the Ecology map, but coloured by the 5-class Peri-Urban Score classification]"
                        </p>
                        
                        <div className="pt-3 border-t border-[#2C3E50]/10 flex justify-center space-x-4 text-[0.55rem] font-mono text-[#2C3E50]/40 uppercase tracking-wider">
                          <span>SCALE: 1:10,000</span>
                          <span>·</span>
                          <span>GRID CELLS: 8,625</span>
                          <span>·</span>
                          <span>BOUNDS: Lecce South-East</span>
                        </div>
                      </div>

                      {/* Map aesthetics */}
                      <div className="absolute top-3 left-3 flex items-center space-x-1.5 font-mono text-[0.52rem] text-[#2C3E50]/45">
                        <Compass size={10} className="text-[#2C3E50]/50" />
                        <span>NORTH CALIBRATION</span>
                      </div>
                      <div className="absolute bottom-3 right-3 flex items-center space-x-2 font-mono text-[0.52rem] text-[#2C3E50]/45 bg-[#F5F5F0]/60 px-1.5 py-0.5 rounded border border-[#2C3E50]/5">
                        <div className="w-4 h-0.5 bg-[#2C3E50] relative">
                          <div className="absolute right-0 top-[-2px] w-[1px] h-[5px] bg-[#2C3E50]" />
                          <div className="absolute left-0 top-[-2px] w-[1px] h-[5px] bg-[#2C3E50]" />
                        </div>
                        <span>500 m</span>
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Legend container beneath the map */}
                {slide7View === 'ecology' ? (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3 pt-3 border-t border-[#2C3E50]/10 text-left">
                    {/* STONE */}
                    <div className="flex items-center space-x-2.5">
                      <div className="w-3.5 h-3.5 rounded bg-[#B0A99F]" />
                      <div className="flex flex-col">
                        <span className="text-[0.58rem] font-sans font-bold text-[#2C3E50]/60 uppercase tracking-wider">Stone</span>
                        <span className="text-[0.7rem] font-mono text-[#2C3E50] font-bold">4,306 cells <span className="font-light opacity-60 ml-1.5">49.9%</span></span>
                      </div>
                    </div>
                    {/* TRANSITIONAL */}
                    <div className="flex items-center space-x-2.5">
                      <div className="w-3.5 h-3.5 rounded bg-[#4A7C9E]" />
                      <div className="flex flex-col">
                        <span className="text-[0.58rem] font-sans font-bold text-[#2C3E50]/60 uppercase tracking-wider">Transitional</span>
                        <span className="text-[0.7rem] font-mono text-[#2C3E50] font-bold">3,635 cells <span className="font-light opacity-60 ml-1.5">42.1%</span></span>
                      </div>
                    </div>
                    {/* CANOPY */}
                    <div className="flex items-center space-x-2.5">
                      <div className="w-3.5 h-3.5 rounded bg-[#4A5D23]" />
                      <div className="flex flex-col">
                        <span className="text-[0.58rem] font-sans font-bold text-[#2C3E50]/60 uppercase tracking-wider">Shadow / Canopy</span>
                        <span className="text-[0.7rem] font-mono text-[#2C3E50] font-bold">465 cells <span className="font-light opacity-60 ml-1.5">5.4%</span></span>
                      </div>
                    </div>
                    {/* FIRE */}
                    <div className="flex items-center space-x-2.5">
                      <div className="w-3.5 h-3.5 rounded bg-[#D35400]" />
                      <div className="flex flex-col">
                        <span className="text-[0.58rem] font-sans font-bold text-[#D35400]/80 uppercase tracking-wider">Fire</span>
                        <span className="text-[0.7rem] font-mono text-[#D35400] font-bold">219 cells <span className="font-light opacity-60 ml-1.5">2.5%</span></span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col md:flex-row md:items-stretch gap-4 mt-3 pt-3 border-t border-[#2C3E50]/10 text-left">
                    <div className="grid grid-cols-2 md:flex md:flex-1 gap-4 items-center">
                      {/* Class 1 */}
                      <div className="flex items-center space-x-2.5 md:flex-1">
                        <div className="w-3.5 h-3.5 rounded bg-[#4A5D23]" />
                        <div className="flex flex-col">
                          <span className="text-[0.58rem] font-sans font-bold text-[#2C3E50]/60 uppercase tracking-wider">Class 1: Rural Matrix</span>
                          <span className="text-[0.7rem] font-mono text-[#2C3E50] font-bold">1,535 cells <span className="font-light opacity-60 ml-1">17.8%</span></span>
                        </div>
                      </div>
                      {/* Class 2 */}
                      <div className="flex items-center space-x-2.5 md:flex-1">
                        <div className="w-3.5 h-3.5 rounded bg-[#82997C]" />
                        <div className="flex flex-col">
                          <span className="text-[0.58rem] font-sans font-bold text-[#2C3E50]/60 uppercase tracking-wider">Class 2: Margin Approach</span>
                          <span className="text-[0.7rem] font-mono text-[#2C3E50] font-bold">2,107 cells <span className="font-light opacity-60 ml-1">24.4%</span></span>
                        </div>
                      </div>
                      {/* Class 3 */}
                      <div className="flex items-center space-x-2.5 md:flex-1">
                        <div className="w-3.5 h-3.5 rounded bg-[#B0A99F]" />
                        <div className="flex flex-col">
                          <span className="text-[0.58rem] font-sans font-bold text-[#2C3E50]/60 uppercase tracking-wider">Class 3: Transition Mosaic</span>
                          <span className="text-[0.7rem] font-mono text-[#2C3E50] font-bold">2,514 cells <span className="font-light opacity-60 ml-1">29.1%</span></span>
                        </div>
                      </div>
                    </div>

                    {/* Classes 4 & 5 (Operational Peri-Urban Band) */}
                    <div className="relative flex-1 bg-[#D35400]/5 border border-[#D35400]/20 rounded-md p-2.5 flex flex-col md:flex-row md:items-center gap-4">
                      {/* Badge label indicating operational band */}
                      <div className="absolute -top-2 left-3 bg-[#D35400] text-white text-[0.48rem] font-mono font-bold uppercase tracking-wider px-1.5 py-0.5 rounded shadow-sm">
                        Operational Peri-Urban Band (Classes 4+5: 2,469 cells / 28.6%)
                      </div>
                      
                      {/* Class 4 */}
                      <div className="flex items-center space-x-2.5 md:flex-1 pt-1 md:pt-0">
                        <div className="w-3.5 h-3.5 rounded bg-[#D5B895]" />
                        <div className="flex flex-col">
                          <span className="text-[0.58rem] font-sans font-bold text-[#2C3E50]/70 uppercase tracking-wider">Class 4: Active Margin</span>
                          <span className="text-[0.7rem] font-mono text-[#2C3E50] font-bold">1,763 cells <span className="font-light opacity-60 ml-1">20.4%</span></span>
                        </div>
                      </div>
                      {/* Class 5 */}
                      <div className="flex items-center space-x-2.5 md:flex-1 pt-1 md:pt-0">
                        <div className="w-3.5 h-3.5 rounded bg-[#D35400]" />
                        <div className="flex flex-col">
                          <span className="text-[0.58rem] font-sans font-bold text-[#D35400]/80 uppercase tracking-wider">Class 5: Critical Fringe</span>
                          <span className="text-[0.7rem] font-mono text-[#D35400] font-bold">706 cells <span className="font-light opacity-60 ml-1">8.2%</span></span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

              </motion.div>
            </motion.div>
          ) : currentSlide.layout === 'the-engine' ? (
            <motion.div
              key={currentIndex}
              variants={slideVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center"
              id={`slide-${currentSlide.id}`}
            >
              {/* LEFT COLUMN: Text compact (4 cols) */}
              <div className="col-span-1 lg:col-span-4 flex flex-col justify-center text-left">
                {/* Slide Kicker */}
                <motion.span 
                  variants={childVariants}
                  className="text-[0.7rem] font-sans font-bold tracking-[0.28em] text-[#D35400] uppercase mb-5 block"
                >
                  {currentSlide.kicker}
                </motion.span>

                {/* Title */}
                <motion.h1 
                  variants={childVariants}
                  className="text-3xl md:text-4xl lg:text-[2.8rem] leading-[1.1] font-sans font-bold text-[#2C3E50] tracking-tight mb-4"
                >
                  {currentSlide.title}
                </motion.h1>

                {/* Subtitle / Lede (Cormorant italic, --muted, small) */}
                {currentSlide.subtitle && (
                  <motion.h2 
                    variants={childVariants}
                    className="text-base font-display font-normal italic text-[#B0A99F] tracking-wide mb-6 border-l border-[#2C3E50]/20 pl-4 py-0.5"
                  >
                    "{currentSlide.subtitle}"
                  </motion.h2>
                )}

                {/* Body Text (Helvetica Light, short) */}
                <motion.div variants={childVariants} className="space-y-4 mb-6">
                  {currentSlide.bodyText.map((p, pIndex) => (
                    <p 
                      key={pIndex} 
                      className="text-[0.88rem] text-[#2C3E50]/80 leading-relaxed font-sans font-light"
                      dangerouslySetInnerHTML={{
                        __html: p
                      }}
                    />
                  ))}
                </motion.div>

                {/* Academic Vertical Rule detail */}
                <motion.div 
                  variants={childVariants}
                  className="pt-4 flex items-center space-x-4 border-t border-[#2C3E50]/10"
                >
                  <div className="w-[1px] h-[40px] bg-[#2C3E50]/20" />
                  <div className="flex flex-col">
                    <span className="text-[0.58rem] uppercase tracking-widest text-[#2C3E50]/40 font-sans font-bold">Automation Pipeline</span>
                    <span className="text-[0.7rem] font-sans font-bold text-[#2C3E50]">Batch Processing (Phase 4)</span>
                  </div>
                </motion.div>
              </div>

              {/* RIGHT COLUMN: VIDEO, dominant element (8 cols) */}
              <div className="col-span-1 lg:col-span-8 flex flex-col items-center justify-center w-full">
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                  className="w-full flex flex-col space-y-4"
                >
                  {/* VIDEO Player container */}
                  <MinimalVideoPlayer src="/Media/God_model.mp4" />

                  {/* Caption underneath */}
                  <p className="text-[0.72rem] font-sans font-light text-[#2C3E50]/70 leading-relaxed text-center italic">
                    "Model Builder automation pipeline — spectral index extraction, zonal statistics batching, fishnet integration (Phase 4)."
                  </p>
                </motion.div>
              </div>
            </motion.div>
          ) : currentSlide.layout === 'thermal-margin' ? (
            <motion.div
              key={currentIndex}
              variants={slideVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="w-full flex flex-col justify-start items-start text-left py-12 md:py-20 min-h-[450px]"
              id={`slide-${currentSlide.id}`}
            >
              {/* Slide Kicker */}
              <motion.span 
                variants={childVariants}
                className="text-[0.7rem] font-sans font-bold tracking-[0.28em] text-[#D35400] uppercase mb-4 block"
              >
                {currentSlide.kicker}
              </motion.span>

              {/* Title / Headline (Helvetica Neue Bold, large) */}
              <motion.h1 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="text-4xl md:text-5xl lg:text-[3.2rem] leading-[1.1] font-sans font-bold text-[#2C3E50] tracking-tight mb-4 drop-shadow-sm"
              >
                {currentSlide.title}
              </motion.h1>

              {/* Single --heat rule underneath as the accent */}
              <motion.div 
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
                className="h-[2px] w-24 bg-[#D35400] mb-6 origin-left" 
              />

              {/* Lede (Cormorant italic, small, --muted) */}
              {currentSlide.subtitle && (
                <motion.h2 
                  variants={childVariants}
                  className="text-base md:text-lg font-display font-normal italic text-[#B0A99F] tracking-wide mb-10 max-w-2xl leading-relaxed"
                >
                  "{currentSlide.subtitle}"
                </motion.h2>
              )}

              {/* Body text (Helvetica Light, short, with generous whitespace) */}
              <motion.div 
                variants={childVariants}
                className="max-w-2xl space-y-6 mb-12"
              >
                {currentSlide.bodyText.map((p, pIndex) => (
                  <p 
                    key={pIndex} 
                    className="text-base md:text-[1.15rem] text-[#2C3E50]/90 leading-relaxed font-sans font-light"
                    dangerouslySetInnerHTML={{
                      __html: p
                        .replace(/Thermal Margin/g, '<strong class="text-[#D35400] font-normal">Thermal Margin</strong>')
                    }}
                  />
                ))}
              </motion.div>

              {/* Academic Vertical Rule detail */}
              <motion.div 
                variants={childVariants}
                className="pt-8 flex items-center space-x-6 border-t border-[#2C3E50]/10 w-full"
              >
                <div className="w-[1px] h-[50px] bg-[#2C3E50]/20" />
                <div className="flex flex-col">
                  <span className="text-[0.6rem] uppercase tracking-widest text-[#2C3E50]/40 font-sans font-bold">Theoretical Integration</span>
                  <span className="text-[0.75rem] font-sans font-bold text-[#2C3E50]">The Thermal Margin Framing</span>
                </div>
              </motion.div>
            </motion.div>
          ) : currentSlide.layout === 'who-carries-heat' ? (
            <motion.div
              key={currentIndex}
              variants={slideVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="w-full flex flex-col justify-start text-left font-sans animate-fade-in"
              id={`slide-${currentSlide.id}`}
            >
              {/* Header section (Kicker, Title, Lede, Heat rule) */}
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-5">
                <div className="max-w-2xl">
                  {/* Slide Kicker */}
                  <motion.span 
                    variants={childVariants}
                    className="text-[0.7rem] font-sans font-bold tracking-[0.28em] text-[#D35400] uppercase mb-3 block"
                  >
                    {currentSlide.kicker}
                  </motion.span>

                  {/* Title / Headline */}
                  <motion.h1 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="text-3xl md:text-4xl lg:text-[2.6rem] leading-[1.1] font-sans font-bold text-[#2C3E50] tracking-tight mb-3 drop-shadow-sm"
                  >
                    {currentSlide.title}
                  </motion.h1>

                  {/* Single --heat rule underneath as the accent */}
                  <motion.div 
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
                    className="h-[2px] w-24 bg-[#D35400] mb-4 origin-left" 
                  />

                  {/* Lede (Cormorant italic, small, --muted) */}
                  {currentSlide.subtitle && (
                    <motion.h2 
                      variants={childVariants}
                      className="text-sm md:text-base font-display font-normal italic text-[#B0A99F] tracking-wide mb-1 leading-relaxed"
                    >
                      "{currentSlide.subtitle}"
                    </motion.h2>
                  )}
                </div>

                {/* Compact Body Text block to the side/top */}
                <motion.div
                  variants={childVariants}
                  className="max-w-md lg:text-right lg:self-end"
                >
                  <p className="font-sans font-light text-sm md:text-[0.95rem] text-[#2C3E50]/80 leading-relaxed">
                    {currentSlide.bodyText[0]}
                  </p>
                </motion.div>
              </div>

              {/* LIVE INTERACTIVE COMPONENT */}
              <WhoCarriesHeat />

            </motion.div>
          ) : currentSlide.layout === 'six-readings' ? (
            <motion.div
              key={currentIndex}
              variants={slideVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="w-full flex flex-col justify-start text-left font-sans animate-fade-in"
              id={`slide-${currentSlide.id}`}
            >
              {/* Header section (Kicker, Title, Lede, Heat rule) */}
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-4">
                <div className="max-w-2xl">
                  {/* Slide Kicker */}
                  <motion.span 
                    variants={childVariants}
                    className="text-[0.7rem] font-sans font-bold tracking-[0.28em] text-[#D35400] uppercase mb-2 block"
                  >
                    {currentSlide.kicker}
                  </motion.span>

                  {/* Title / Headline */}
                  <motion.h1 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="text-2xl md:text-3xl lg:text-4xl leading-[1.1] font-sans font-bold text-[#2C3E50] tracking-tight mb-2 drop-shadow-sm"
                  >
                    {currentSlide.title}
                  </motion.h1>

                  {/* Single --heat rule underneath as the accent */}
                  <motion.div 
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
                    className="h-[2px] w-24 bg-[#D35400] mb-3 origin-left" 
                  />

                  {/* Lede (Cormorant italic, small, --muted) */}
                  {currentSlide.subtitle && (
                    <motion.h2 
                      variants={childVariants}
                      className="text-sm md:text-base font-display font-normal italic text-[#B0A99F] tracking-wide mb-1 leading-relaxed"
                    >
                      "{currentSlide.subtitle}"
                    </motion.h2>
                  )}
                </div>
              </div>

              {/* LIVE INTERACTIVE COMPONENT - SIX READINGS */}
              <SixReadingsOneTransect />

            </motion.div>
          ) : currentSlide.layout === 'four-kilometres' ? (
            <motion.div
              key={currentIndex}
              variants={slideVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="w-full flex flex-col justify-start text-left font-sans animate-fade-in"
              id={`slide-${currentSlide.id}`}
            >
              {/* Header section (Kicker, Title, Lede, Heat rule) */}
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-4">
                <div className="max-w-2xl">
                  {/* Slide Kicker */}
                  <motion.span 
                    variants={childVariants}
                    className="text-[0.7rem] font-sans font-bold tracking-[0.28em] text-[#D35400] uppercase mb-2 block"
                  >
                    {currentSlide.kicker}
                  </motion.span>

                  {/* Title / Headline */}
                  <motion.h1 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="text-2xl md:text-3xl lg:text-4xl leading-[1.1] font-sans font-bold text-[#2C3E50] tracking-tight mb-2 drop-shadow-sm"
                  >
                    {currentSlide.title}
                  </motion.h1>

                  {/* Single --heat rule underneath as the accent */}
                  <motion.div 
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
                    className="h-[2px] w-24 bg-[#D35400] mb-3 origin-left" 
                  />

                  {/* Lede (Cormorant italic, small, --muted) */}
                  {currentSlide.subtitle && (
                    <motion.h2 
                      variants={childVariants}
                      className="text-sm md:text-base font-display font-normal italic text-[#B0A99F] tracking-wide mb-1 leading-relaxed"
                    >
                      "{currentSlide.subtitle}"
                    </motion.h2>
                  )}
                </div>
              </div>

              {/* LIVE INTERACTIVE COMPONENT - FOUR KILOMETRES */}
              <FourKilometresTenYears />

            </motion.div>
          ) : currentSlide.layout === 'grid-wide-dashboard' ? (
            <motion.div
              key={currentIndex}
              variants={slideVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="w-full flex flex-col justify-start text-left font-sans animate-fade-in"
              id={`slide-${currentSlide.id}`}
            >
              {/* Header section (Kicker, Title, Lede, Heat rule) */}
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-4">
                <div className="max-w-2xl">
                  {/* Slide Kicker */}
                  <motion.span 
                    variants={childVariants}
                    className="text-[0.7rem] font-sans font-bold tracking-[0.28em] text-[#D35400] uppercase mb-2 block"
                  >
                    {currentSlide.kicker}
                  </motion.span>

                  {/* Title / Headline */}
                  <motion.h1 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="text-2xl md:text-3xl lg:text-4xl leading-[1.1] font-sans font-bold text-[#2C3E50] tracking-tight mb-2 drop-shadow-sm"
                  >
                    {currentSlide.title}
                  </motion.h1>

                  {/* Single --heat rule underneath as the accent */}
                  <motion.div 
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
                    className="h-[2px] w-24 bg-[#D35400] mb-3 origin-left" 
                  />

                  {/* Lede (Cormorant italic, small, --muted) */}
                  {currentSlide.subtitle && (
                    <motion.h2 
                      variants={childVariants}
                      className="text-sm md:text-base font-display font-normal italic text-[#B0A99F] tracking-wide mb-1 leading-relaxed"
                    >
                      "{currentSlide.subtitle}"
                    </motion.h2>
                  )}
                </div>
              </div>

              {/* LIVE INTERACTIVE COMPONENT - GRID-WIDE DASHBOARD */}
              <GridWideDashboard />

            </motion.div>
          ) : currentSlide.layout === 'synthesis' ? (
            <motion.div
              key={currentIndex}
              variants={slideVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="w-full flex flex-col justify-start text-left font-sans animate-fade-in"
              id={`slide-${currentSlide.id}`}
            >
              {/* Header section (Kicker, Title, Lede, Heat rule) */}
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-4">
                <div className="max-w-2xl">
                  {/* Slide Kicker */}
                  <motion.span 
                    variants={childVariants}
                    className="text-[0.7rem] font-sans font-bold tracking-[0.28em] text-[#D35400] uppercase mb-2 block"
                  >
                    {currentSlide.kicker}
                  </motion.span>

                  {/* Title / Headline */}
                  <motion.h1 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="text-2xl md:text-3xl lg:text-4xl leading-[1.1] font-sans font-bold text-[#2C3E50] tracking-tight mb-2 drop-shadow-sm"
                  >
                    {currentSlide.title}
                  </motion.h1>

                  {/* Single --heat rule underneath as the accent */}
                  <motion.div 
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
                    className="h-[2px] w-24 bg-[#D35400] mb-3 origin-left" 
                  />

                  {/* Lede (Cormorant italic, small, --muted) */}
                  {currentSlide.subtitle && (
                    <motion.h2 
                      variants={childVariants}
                      className="text-sm md:text-base font-display font-normal italic text-[#B0A99F] tracking-wide mb-1 leading-relaxed"
                    >
                      "{currentSlide.subtitle}"
                    </motion.h2>
                  )}
                </div>
              </div>

              {/* LIVE INTERACTIVE COMPONENT - SYNTHESIS */}
              <PointLineSurfaceSynthesis />

            </motion.div>
          ) : (

            <motion.div
              key={currentIndex}
              variants={slideVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center"
              id={`slide-${currentSlide.id}`}
            >
              {/* LEFT / CORE TEXT COLUMN (Width adjustments based on slide structure) */}
              <div className={`col-span-1 lg:col-span-6 flex flex-col justify-center text-left`}>
                {/* Slide Kicker */}
                <motion.span 
                  variants={childVariants}
                  className="text-[0.7rem] font-sans font-bold tracking-[0.28em] text-[#D35400] uppercase mb-8 block"
                >
                  {currentSlide.kicker}
                </motion.span>

                {/* Title */}
                <motion.h1 
                  variants={childVariants}
                  className="text-3xl md:text-4xl lg:text-[3.5rem] xl:text-[4.2rem] leading-[1.05] font-sans font-bold text-[#2C3E50] tracking-tight mb-8 max-w-[800px]"
                >
                  {currentSlide.title}
                </motion.h1>

                {/* Optional Subtitle */}
                {currentSlide.subtitle && (
                  <motion.h2 
                    variants={childVariants}
                    className="text-lg md:text-xl font-display font-normal italic text-[#2C3E50]/70 tracking-wide mb-8 border-l border-[#2C3E50]/20 pl-4 py-1"
                  >
                    {currentSlide.subtitle}
                  </motion.h2>
                )}

                {/* Bulleted Content Lines */}
                <motion.div variants={childVariants} className="space-y-6 mb-8 max-w-[480px]">
                  {currentSlide.bodyText.map((p, pIndex) => (
                    <p 
                      key={pIndex} 
                      className="text-base md:text-[1.1rem] text-[#2C3E50] leading-relaxed font-sans font-light opacity-80"
                      dangerouslySetInnerHTML={{
                        __html: p
                          .replace(/~1\.7 °C/g, '<strong class="text-[#D35400] font-normal">~1.7 °C</strong>')
                          .replace(/1\.7 °C/g, '<strong class="text-[#D35400] font-normal">1.7 °C</strong>')
                          .replace(/Shadow Ecology/g, '<strong class="text-[#4A5D23] font-normal">Shadow Ecology</strong>')
                          .replace(/Transitional Ecology/g, '<strong class="text-[#4A7C9E] font-normal">Transitional Ecology</strong>')
                          .replace(/Stone Ecology/g, '<strong class="text-[#B0A99F] font-normal">Stone Ecology</strong>')
                          .replace(/4\.2 °C/g, '<strong class="text-[#D35400] font-normal">4.2 °C</strong>')
                      }}
                    />
                  ))}
                </motion.div>

                {/* Academic Vertical Rule detail matching design spec */}
                {currentSlide.id > 1 ? (
                  <motion.div 
                    variants={childVariants}
                    className="pt-8 flex items-center space-x-6"
                  >
                    <div className="w-[1px] h-[60px] bg-[#2C3E50] opacity-20" />
                    <div className="flex flex-col">
                      <span className="text-[0.65rem] uppercase tracking-widest opacity-50 mb-1 font-sans font-bold">RUTZ Analysis Unit</span>
                      <span className="text-[0.8rem] font-sans font-bold text-[#2C3E50]">Sector 04 // Limestone Grid</span>
                    </div>
                  </motion.div>
                ) : (
                  <motion.button 
                    variants={childVariants}
                    onClick={handleNext}
                    className="self-start flex items-center space-x-2 text-xs font-mono tracking-widest text-[#D35400] uppercase border-b border-[#D35400]/40 pb-1 hover:border-[#D35400] transition-colors mt-2"
                  >
                    <span>Begin Defense Presentation</span>
                    <MoveRight size={13} />
                  </motion.button>
                )}
              </div>

              {/* RIGHT COLUMN: RICH VISUALIZATION / EMBEDDED DIAGRAMS */}
              <div className="col-span-1 lg:col-span-6 flex flex-col items-center justify-center min-h-[320px] lg:min-h-[450px] w-full p-6 md:p-8 bg-white/40 backdrop-blur-sm rounded-lg border border-[#2C3E50]/10 relative overflow-hidden shadow-sm">
              <AnimatePresence mode="wait">
                {/* Visualizer router depending on slide layout */}
                {currentSlide.layout === 'title' && (
                  <motion.div 
                    key="viz-title"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center text-center space-y-6"
                  >
                    <div className="relative w-48 h-48 flex items-center justify-center">
                      {/* Geometric lines reflecting shadow and stone */}
                      <div className="absolute inset-0 rounded-full border-2 border-[#2C3E50]/10 animate-spin" style={{ animationDuration: '40s' }} />
                      <div className="absolute inset-4 rounded-full border border-dashed border-[#4A7C9E]/30" />
                      <div className="absolute inset-10 rounded-full border border-[#D35400]/20" />
                      <div className="absolute w-28 h-28 bg-[#2C3E50]/5 rounded-xl rotate-45 flex items-center justify-center">
                        <Compass className="text-[#2C3E50]/40 w-12 h-12" />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[0.62rem] font-mono tracking-widest text-[#2C3E50]/40 uppercase block">Spatial Geometry Analysis</span>
                      <span className="text-xl font-display font-light text-[#2C3E50]/70 italic block">Adriatic Coast, Croatia</span>
                    </div>
                  </motion.div>
                )}

                {currentSlide.layout === 'problem' && (
                  <motion.div 
                    key="viz-problem"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="w-full space-y-6"
                  >
                    <div className="flex justify-between items-center px-2">
                      <span className="text-[0.68rem] font-mono tracking-wider text-[#2C3E50]/60 uppercase">The 30m Satellite Myth vs Human Scale</span>
                      <span className="px-2 py-0.5 text-[0.58rem] font-mono tracking-widest text-[#D35400] bg-[#D35400]/10 rounded uppercase">Macro vs Micro</span>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      {/* Coarse Satellite Landsat Model */}
                      <div className="bg-[#2C3E50]/5 rounded p-4 border border-[#2C3E50]/10 flex flex-col justify-between h-48">
                        <div>
                          <span className="text-[0.6rem] font-mono tracking-widest text-[#2C3E50]/50 uppercase block mb-2">Landsat LST Model</span>
                          <span className="text-2xl font-sans font-bold text-[#2C3E50] block">33.5 °C</span>
                          <span className="text-[0.65rem] text-[#2C3E50]/60 block mt-1">Coarse uniform average over 30m × 30m area</span>
                        </div>
                        {/* Simulated Landsat thermal pixels */}
                        <div className="grid grid-cols-4 gap-1 h-12 mt-4 bg-[#D35400]/10 p-1 rounded">
                          {[...Array(16)].map((_, i) => (
                            <div key={i} className="bg-[#D35400]/40 rounded-sm" />
                          ))}
                        </div>
                      </div>

                      {/* True Human-scale Microclimate */}
                      <div className="bg-[#2C3E50] rounded p-4 border border-[#2C3E50]/20 flex flex-col justify-between h-48 text-[#F5F5F0]">
                        <div>
                          <span className="text-[0.6rem] font-mono tracking-widest text-[#F5F5F0]/60 uppercase block mb-2">Empirical Microclimate</span>
                          <div className="flex items-baseline space-x-1.5">
                            <span className="text-2xl font-sans font-bold text-[#F5F5F0] block">31.2°</span>
                            <span className="text-xs text-[#F5F5F0]/60">to</span>
                            <span className="text-2xl font-sans font-bold text-[#D35400] block">32.9°</span>
                          </div>
                          <span className="text-[0.65rem] text-[#F5F5F0]/60 block mt-1">Fine-grained pockets and thermal variations</span>
                        </div>
                        {/* Real dynamic gradient */}
                        <div className="h-12 mt-4 bg-gradient-to-r from-[#4A5D23] via-[#4A7C9E] to-[#D35400] rounded p-1 flex items-center justify-between">
                          <span className="text-[0.58rem] font-mono text-white/80 px-1">Cool Shade</span>
                          <span className="text-[0.58rem] font-mono text-white/80 px-1">Hot Stone</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-[0.68rem] text-[#2C3E50]/60 font-sans text-center italic">
                      "Coarse satellite models smooth out vital pedestrian cool islands, leading to flawed urban interventions."
                    </p>
                  </motion.div>
                )}

                {currentSlide.layout === 'literature' && (
                  <motion.div 
                    key="viz-literature"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    className="w-full space-y-6"
                  >
                    <span className="text-[0.68rem] font-mono tracking-widest text-[#2C3E50]/60 uppercase block border-b border-[#2C3E50]/10 pb-2">The Scholars' Citation Interface</span>

                    <div className="space-y-4">
                      <div className="p-4 bg-white/50 rounded border border-[#2C3E50]/5 hover:border-[#2C3E50]/10 transition-all">
                        <span className="text-[0.6rem] font-mono tracking-wider text-[#D35400] uppercase block">T.R. Oke (1987)</span>
                        <p className="text-sm font-display italic text-[#2C3E50]/80 mt-1">
                          "The geometry of the urban canopy layer is the primary dial governing microscale thermal behaviors."
                        </p>
                      </div>

                      <div className="p-4 bg-white/50 rounded border border-[#2C3E50]/5 hover:border-[#2C3E50]/10 transition-all">
                        <span className="text-[0.6rem] font-mono tracking-wider text-[#4A7C9E] uppercase block">B. Givoni (1998)</span>
                        <p className="text-sm font-display italic text-[#2C3E50]/80 mt-1">
                          "Passive cooling in hot-dry climates relies entirely on orchestrating mass materials and localized wind blocks."
                        </p>
                      </div>
                    </div>

                    <div className="p-3 bg-[#4A5D23]/5 rounded border border-[#4A5D23]/20 flex items-start space-x-2.5">
                      <Info size={14} className="text-[#4A5D23] mt-0.5 flex-shrink-0" />
                      <span className="text-[0.68rem] font-sans text-[#4A5D23]/95">
                        Our research addresses the unstudied interface where high-mass stone and canopy cover directly intersect to produce real physical micro-convections.
                      </span>
                    </div>
                  </motion.div>
                )}

                {currentSlide.layout === 'method' && (
                  <motion.div 
                    key="viz-method"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="w-full flex flex-col justify-between h-full space-y-4"
                  >
                    <div className="flex justify-between items-center px-1">
                      <span className="text-[0.68rem] font-mono tracking-wider text-[#2C3E50]/60 uppercase">The RUTZ Instrument Array</span>
                      <span className="text-[0.6rem] font-mono text-[#D35400] tracking-widest uppercase">Click heights to profile</span>
                    </div>

                    {/* Interactive RUTZ Pole Diagram */}
                    <div className="flex-1 grid grid-cols-12 gap-4 items-center">
                      <div className="col-span-4 flex justify-center">
                        <svg width="80" height="280" viewBox="0 0 80 280" className="overflow-visible">
                          {/* Pole axis */}
                          <line x1="40" y1="10" x2="40" y2="260" stroke="#2C3E50" strokeWidth="3" />
                          <rect x="30" y="260" width="20" height="10" fill="#2C3E50" rx="2" />
                          
                          {/* Sensor Nodes */}
                          {/* Node 3.0m */}
                          <circle 
                            cx="40" cy="50" r={activeRutzHeight === 3.0 ? "10" : "7"} 
                            fill={activeRutzHeight === 3.0 ? "#D35400" : "#2C3E50"} 
                            className="cursor-pointer transition-all hover:fill-[#D35400]"
                            onClick={() => setActiveRutzHeight(3.0)}
                          />
                          <line x1="40" y1="50" x2="55" y2="50" stroke="#2C3E50" strokeWidth="1" strokeDasharray="2,2" />
                          <text x="62" y="54" className="font-mono text-[0.62rem] fill-[#2C3E50]/70">3.0m</text>

                          {/* Node 1.5m */}
                          <circle 
                            cx="40" cy="130" r={activeRutzHeight === 1.5 ? "10" : "7"} 
                            fill={activeRutzHeight === 1.5 ? "#D35400" : "#2C3E50"} 
                            className="cursor-pointer transition-all hover:fill-[#D35400]"
                            onClick={() => setActiveRutzHeight(1.5)}
                          />
                          <line x1="40" y1="130" x2="55" y2="130" stroke="#2C3E50" strokeWidth="1" strokeDasharray="2,2" />
                          <text x="62" y="134" className="font-mono text-[0.62rem] fill-[#2C3E50]/70">1.5m</text>

                          {/* Node 0.5m */}
                          <circle 
                            cx="40" cy="210" r={activeRutzHeight === 0.5 ? "10" : "7"} 
                            fill={activeRutzHeight === 0.5 ? "#D35400" : "#2C3E50"} 
                            className="cursor-pointer transition-all hover:fill-[#D35400]"
                            onClick={() => setActiveRutzHeight(0.5)}
                          />
                          <line x1="40" y1="210" x2="55" y2="210" stroke="#2C3E50" strokeWidth="1" strokeDasharray="2,2" />
                          <text x="62" y="214" className="font-mono text-[0.62rem] fill-[#2C3E50]/70">0.5m</text>
                        </svg>
                      </div>

                      {/* Interactive metadata display column */}
                      <div className="col-span-8 space-y-4">
                        <div className="bg-white p-4 rounded border border-[#2C3E50]/10 shadow-sm min-h-[160px] flex flex-col justify-between">
                          <div>
                            <span className="text-[0.58rem] font-mono tracking-widest text-[#D35400] uppercase block">Datum Layer Profile</span>
                            <h3 className="text-lg font-sans font-bold text-[#2C3E50] mt-0.5">
                              {activeRutzHeight === 3.0 ? "3.0 Meter Datum (Canopy Boundary)" :
                               activeRutzHeight === 1.5 ? "1.5 Meter Datum (Pedestrian Layer)" :
                               "0.5 Meter Datum (Boundary Micro-Ventilation)"}
                            </h3>
                            <p className="text-[0.72rem] text-[#2C3E50]/85 mt-2 leading-relaxed">
                              {activeRutzHeight === 3.0 ? "Measures turbulent air transitions just below the foliage canopy. Registers the baseline microclimatic inputs entering from sea breezes." :
                               activeRutzHeight === 1.5 ? "Human breathing zone. Key standard indicator for thermal discomfort, radiation shielding efficiency, and convective flow velocity." :
                               "Captures surface-level thermal emissions from paved limestone. Essential for calculating local sensible heat fluxes and evaporation boundaries."}
                            </p>
                          </div>
                          <div className="border-t border-[#2C3E50]/5 pt-2 mt-2 flex justify-between items-center text-[0.62rem] font-mono text-[#2C3E50]/50">
                            <span>Sensing Parameter: Temp + RH + Solar Globe</span>
                            <span className="text-[#D35400] font-bold">Active</span>
                          </div>
                        </div>

                        {/* Interactive toggle indicators */}
                        <div className="flex space-x-1.5 justify-center">
                          {[0.5, 1.5, 3.0].map((h) => (
                            <button
                              key={h}
                              onClick={() => setActiveRutzHeight(h)}
                              className={`px-3 py-1 text-[0.62rem] font-mono rounded border transition-colors ${activeRutzHeight === h ? 'bg-[#D35400] text-white border-[#D35400]' : 'bg-white text-[#2C3E50]/70 border-[#2C3E50]/15 hover:bg-[#2C3E50]/5'}`}
                            >
                              {h}m Datum
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {currentSlide.layout === 'ecology' && (
                  <motion.div 
                    key="viz-ecology"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="w-full space-y-4"
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-[0.68rem] font-mono tracking-wider text-[#2C3E50]/60 uppercase">Threefold Material-Thermal Taxonomy</span>
                      <span className="text-[0.6rem] font-mono text-[#D35400] tracking-widest uppercase">Click Cards to explore</span>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      {/* Shadow Ecology */}
                      <button 
                        onClick={() => setActiveEcology('shadow')}
                        className={`text-left p-3.5 rounded border transition-all h-36 flex flex-col justify-between ${activeEcology === 'shadow' ? 'bg-[#4A5D23] text-[#F5F5F0] border-[#4A5D23] shadow-md scale-[1.02]' : 'bg-white text-[#2C3E50] border-[#2C3E50]/10 hover:border-[#4A5D23]/30 hover:bg-[#4A5D23]/5'}`}
                      >
                        <span className={`text-[0.58rem] font-mono tracking-widest uppercase ${activeEcology === 'shadow' ? 'text-[#F5F5F0]/80' : 'text-[#4A5D23]'}`}>Canopy Layer</span>
                        <div>
                          <h4 className="font-sans font-bold text-sm leading-tight">Shadow Ecology</h4>
                          <span className="text-[0.62rem] font-mono opacity-80 mt-1 block">Cool / Evaporative</span>
                        </div>
                      </button>

                      {/* Transitional Ecology */}
                      <button 
                        onClick={() => setActiveEcology('transition')}
                        className={`text-left p-3.5 rounded border transition-all h-36 flex flex-col justify-between ${activeEcology === 'transition' ? 'bg-[#4A7C9E] text-[#F5F5F0] border-[#4A7C9E] shadow-md scale-[1.02]' : 'bg-white text-[#2C3E50] border-[#2C3E50]/10 hover:border-[#4A7C9E]/30 hover:bg-[#4A7C9E]/5'}`}
                      >
                        <span className={`text-[0.58rem] font-mono tracking-widest uppercase ${activeEcology === 'transition' ? 'text-[#F5F5F0]/80' : 'text-[#4A7C9E]'}`}>Edge Interface</span>
                        <div>
                          <h4 className="font-sans font-bold text-sm leading-tight">Transitional Ecology</h4>
                          <span className="text-[0.62rem] font-mono opacity-80 mt-1 block">Dappled / Convective</span>
                        </div>
                      </button>

                      {/* Stone Ecology */}
                      <button 
                        onClick={() => setActiveEcology('stone')}
                        className={`text-left p-3.5 rounded border transition-all h-36 flex flex-col justify-between ${activeEcology === 'stone' ? 'bg-[#B0A99F] text-[#F5F5F0] border-[#B0A99F] shadow-md scale-[1.02]' : 'bg-white text-[#2C3E50] border-[#2C3E50]/10 hover:border-[#B0A99F]/30 hover:bg-[#B0A99F]/5'}`}
                      >
                        <span className={`text-[0.58rem] font-mono tracking-widest uppercase ${activeEcology === 'stone' ? 'text-[#F5F5F0]/80' : 'text-[#B0A99F]'}`}>Pavement Mass</span>
                        <div>
                          <h4 className="font-sans font-bold text-sm leading-tight">Stone Ecology</h4>
                          <span className="text-[0.62rem] font-mono opacity-80 mt-1 block">Exposed / High Mass</span>
                        </div>
                      </button>
                    </div>

                    {/* Ecology detailed profile text */}
                    <div className="bg-white p-4 rounded border border-[#2C3E50]/10 shadow-sm min-h-[140px] transition-all">
                      {activeEcology === 'shadow' && (
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <span className="h-2 w-2 rounded-full bg-[#4A5D23]" />
                            <h5 className="font-sans font-bold text-[#4A5D23] text-sm">Shadow Ecology Configuration</h5>
                          </div>
                          <p className="text-[0.72rem] text-[#2C3E50]/90 leading-relaxed">
                            Formed beneath high, dense pine canopies like the maritime pine. Highly effective at blocking direct solar radiation, shielding the limestone below from heat loading. High humidity retention creates a stable micro-climate reservoir.
                          </p>
                          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#2C3E50]/5 text-center font-mono text-[0.62rem]">
                            <div><span className="text-slate-400 block">Albedo</span> <strong className="text-[#4A5D23]">0.12 - 0.15</strong></div>
                            <div><span className="text-slate-400 block">Transmissivity</span> <strong className="text-[#4A5D23]">15% - 20%</strong></div>
                            <div><span className="text-slate-400 block">Humidity</span> <strong className="text-[#4A5D23]">High (68%)</strong></div>
                          </div>
                        </div>
                      )}

                      {activeEcology === 'transition' && (
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <span className="h-2 w-2 rounded-full bg-[#4A7C9E]" />
                            <h5 className="font-sans font-bold text-[#4A7C9E] text-sm">Transitional Ecology Configuration</h5>
                          </div>
                          <p className="text-[0.72rem] text-[#2C3E50]/90 leading-relaxed">
                            Includes light stone structures, metal gazebos, or sparse vegetation. Governed by a rapid shift in temperature and dynamic breezes. Actively directs micro-convective flows between the warm open stone and shaded forest floor.
                          </p>
                          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#2C3E50]/5 text-center font-mono text-[0.62rem]">
                            <div><span className="text-slate-400 block">Albedo</span> <strong className="text-[#4A7C9E]">0.32 - 0.40</strong></div>
                            <div><span className="text-slate-400 block">Transmissivity</span> <strong className="text-[#4A7C9E]">45% - 60%</strong></div>
                            <div><span className="text-slate-400 block">Humidity</span> <strong className="text-[#4A7C9E]">Dynamic (54%)</strong></div>
                          </div>
                        </div>
                      )}

                      {activeEcology === 'stone' && (
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <span className="h-2 w-2 rounded-full bg-[#B0A99F]" />
                            <h5 className="font-sans font-bold text-[#B0A99F] text-sm">Stone Ecology Configuration</h5>
                          </div>
                          <p className="text-[0.72rem] text-[#2C3E50]/90 leading-relaxed">
                            Formed of local heavy limestone pavements. Retains solar heat during mid-day and releases it slowly, creating a hot surface boundary cell. In a coupled setup, this high temperature drives local air movement due to buoyant forces.
                          </p>
                          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#2C3E50]/5 text-center font-mono text-[0.62rem]">
                            <div><span className="text-slate-400 block">Albedo</span> <strong className="text-[#B0A99F]">0.45 - 0.55</strong></div>
                            <div><span className="text-slate-400 block">Thermal Inertia</span> <strong className="text-[#B0A99F]">High</strong></div>
                            <div><span className="text-slate-400 block">Surface Temp</span> <strong className="text-[#B0A99F]">33.5 °C (Peak)</strong></div>
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}

                {currentSlide.layout === 'finding' && (
                  <motion.div 
                    key="viz-finding"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="w-full space-y-4 text-[#2C3E50]"
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-[0.68rem] font-mono tracking-wider text-[#2C3E50]/60 uppercase">The 1.7 °C Microclimatic Inversion</span>
                      <div className="flex space-x-1">
                        <button 
                          onClick={() => setFindingView('satellite')}
                          className={`px-2 py-0.5 text-[0.58rem] font-mono rounded transition-colors ${findingView === 'satellite' ? 'bg-[#2C3E50] text-white' : 'bg-white text-[#2C3E50] border border-[#2C3E50]/15 hover:bg-[#2C3E50]/5'}`}
                        >
                          Coarse Satellite LST
                        </button>
                        <button 
                          onClick={() => setFindingView('rutz')}
                          className={`px-2 py-0.5 text-[0.58rem] font-mono rounded transition-colors ${findingView === 'rutz' ? 'bg-[#D35400] text-white' : 'bg-white text-[#2C3E50] border border-[#2C3E50]/15 hover:bg-[#2C3E50]/5'}`}
                        >
                          RUTZ On-Site Inversion
                        </button>
                      </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg border border-[#2C3E50]/10 shadow-sm relative min-h-[220px] flex flex-col justify-between overflow-hidden">
                      {findingView === 'satellite' ? (
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <span className="text-[0.58rem] font-mono tracking-widest text-[#2C3E50]/50 uppercase block">Satellite Observation</span>
                            <span className="font-mono text-[0.62rem] text-red-500 font-bold">Uniform / No Delta</span>
                          </div>
                          <div className="h-28 bg-[#D35400]/5 border border-dashed border-[#D35400]/20 rounded flex items-center justify-center flex-col text-center p-4">
                            <span className="text-3xl font-sans font-bold text-[#D35400]">33.5 °C</span>
                            <span className="text-[0.65rem] text-[#2C3E50]/70 mt-1">Satellite resolution of 30 meters averages canopy and pavement. No local thermal cell detected.</span>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <span className="text-[0.58rem] font-mono tracking-widest text-[#4A5D23] uppercase block">Microclimatic Reality</span>
                            <span className="font-mono text-[0.62rem] text-[#D35400] font-bold">1.7 °C Inversion Proven</span>
                          </div>

                          {/* Dynamic Diagram of Inversion Cell */}
                          <div className="grid grid-cols-2 gap-4 h-28 relative">
                            {/* Stone Ecology Column */}
                            <div className="bg-[#B0A99F]/10 rounded border border-[#B0A99F]/20 p-2 text-center flex flex-col justify-between">
                              <span className="text-[0.58rem] font-mono text-[#2C3E50]/60 uppercase">Stone Ecology Air</span>
                              <span className="text-xl font-sans font-bold text-[#2C3E50]">31.2 °C</span>
                              <div className="h-1.5 w-full bg-[#B0A99F] rounded-full" />
                            </div>

                            {/* Shadow Ecology Column */}
                            <div className="bg-[#4A5D23]/10 rounded border border-[#4A5D23]/20 p-2 text-center flex flex-col justify-between relative">
                              <span className="text-[0.58rem] font-mono text-[#4A5D23] uppercase">Shadow Ecology Air</span>
                              <div className="flex flex-col items-center">
                                <span className="text-xl font-sans font-bold text-[#4A5D23]">29.5 °C</span>
                                <span className="text-[0.58rem] font-mono text-[#D35400] font-bold">-1.7 °C Inversion</span>
                              </div>
                              <div className="h-1.5 w-full bg-[#4A5D23] rounded-full" />
                            </div>

                            {/* Visual Connecting Arrow indicating cooling micro-ventilation */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                              <svg width="40" height="15" viewBox="0 0 40 15" className="fill-[#4A7C9E] animate-pulse">
                                <path d="M40 7.5L30 2v11zM0 7.5h32" stroke="#4A7C9E" strokeWidth="2" />
                              </svg>
                              <span className="text-[0.52rem] font-mono text-[#4A7C9E] tracking-widest uppercase mt-1">Convection Flow</span>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="border-t border-[#2C3E50]/5 pt-3 mt-4 flex justify-between items-center">
                        <div className="flex items-center space-x-1.5">
                          <Trees size={14} className="text-[#4A5D23]" />
                          <span className="text-[0.62rem] font-mono text-[#2C3E50]/60">Aleppo Pine Canopy Shield</span>
                        </div>
                        <div className="flex items-center space-x-1.5">
                          <Sun size={14} className="text-[#D35400]" />
                          <span className="text-[0.62rem] font-mono text-[#2C3E50]/60">Paved Limestone Radiator</span>
                        </div>
                      </div>
                    </div>

                    {/* Numeric Callout */}
                    <div className="p-3.5 bg-[#D35400]/5 rounded border border-[#D35400]/15 text-center">
                      <span className="text-[0.65rem] font-mono uppercase tracking-widest text-[#D35400] block mb-0.5">Empirical delta value</span>
                      <p className="text-sm font-sans text-[#2C3E50]">
                        The actual measured cooling is exactly <strong className="text-[#D35400] font-bold">~1.7 °C</strong>, refuting exaggerated thermal drops from raw surface estimations.
                      </p>
                    </div>
                  </motion.div>
                )}

                {currentSlide.layout === 'validation' && (() => {
                  const data = {
                    'lithic-core': {
                      name: 'LITHIC CORE',
                      code: 'SUHI_C',
                      description: 'Dense Historic-Core Baseline',
                      spring: '-1.61°C',
                      summer: '+2.58°C',
                      swing: '4.19°C swing',
                      interpretation: 'Cooler than the historic core in spring. Hotter than it in summer. The albedo paradox, in one number.',
                      springLabel: 'Cooling Buffering',
                      summerLabel: 'Thermal Accumulation'
                    },
                    'orchard': {
                      name: 'ORCHARD',
                      code: 'SUHI_B',
                      description: 'Orchard Cooling-Deficit Baseline',
                      spring: '+0.18°C',
                      summer: '+1.31°C',
                      swing: '1.13°C increase',
                      interpretation: 'Barely above a working buffer in spring — the biggest deviation from one by summer.',
                      springLabel: 'Equilibrium State',
                      summerLabel: 'Moderate Deficit'
                    },
                    'forest-ceiling': {
                      name: 'FOREST CEILING',
                      code: 'SUHI_D',
                      description: 'Maximum-Cooling Reference',
                      spring: '+1.00°C',
                      summer: '+1.98°C',
                      swing: '0.98°C increase',
                      interpretation: 'The gap from maximum possible cooling nearly doubles by summer.',
                      springLabel: 'Base Deficit',
                      summerLabel: 'Extreme Deficit'
                    }
                  }[validationBaseline];

                  return (
                    <motion.div 
                      key="viz-validation"
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      className="w-full h-full flex flex-col justify-between space-y-4 text-[#2C3E50]"
                    >
                      {/* Sub-Header / Metadata */}
                      <div className="flex justify-between items-center border-b border-[#2C3E50]/10 pb-2">
                        <span className="text-[0.62rem] font-mono tracking-wider text-[#2C3E50]/50 uppercase">
                          STONE LST DELTA SYSTEM (SUHI_B // C // D)
                        </span>
                        <div className="flex items-center space-x-1 border border-[#D35400]/20 bg-[#D35400]/5 px-1.5 py-0.5 rounded">
                          <span className="h-1.5 w-1.5 rounded-full bg-[#D35400] animate-pulse" />
                          <span className="font-mono text-[0.55rem] text-[#D35400] font-bold">4-Year Mean Record</span>
                        </div>
                      </div>

                      {/* TACTILE BASELINE SELECTOR */}
                      <div className="grid grid-cols-3 gap-1 bg-[#2C3E50]/5 p-1 rounded-md border border-[#2C3E50]/5">
                        {(['lithic-core', 'orchard', 'forest-ceiling'] as const).map((key) => {
                          const labels = {
                            'lithic-core': 'LITHIC CORE',
                            'orchard': 'ORCHARD',
                            'forest-ceiling': 'FOREST CEILING'
                          };
                          const codes = {
                            'lithic-core': 'SUHI_C',
                            'orchard': 'SUHI_B',
                            'forest-ceiling': 'SUHI_D'
                          };
                          const isActive = validationBaseline === key;
                          return (
                            <button
                              key={key}
                              onClick={() => setValidationBaseline(key)}
                              className={`py-1.5 px-2 rounded text-[0.62rem] font-sans font-bold tracking-wider transition-all flex flex-col items-center justify-center ${
                                isActive 
                                  ? 'bg-[#2C3E50] text-white shadow-sm' 
                                  : 'text-[#2C3E50]/60 hover:bg-[#2C3E50]/10 hover:text-[#2C3E50]'
                              }`}
                            >
                              <span>{labels[key]}</span>
                              <span className={`text-[0.5rem] font-mono opacity-80 mt-0.5 ${isActive ? 'text-[#D35400]' : 'text-[#2C3E50]/40'}`}>
                                {codes[key]}
                              </span>
                            </button>
                          );
                        })}
                      </div>

                      {/* METRICS & GRAPHICS SPLIT GRID */}
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-stretch flex-1">
                        
                        {/* Dynamic Numbers & Shift Block (7 Cols) */}
                        <div className="col-span-1 md:col-span-7 flex flex-col justify-between bg-white p-4 rounded-lg border border-[#2C3E50]/10 shadow-sm relative min-h-[160px]">
                          <div className="text-[0.55rem] font-mono tracking-widest text-[#2C3E50]/40 uppercase mb-2">
                            Thermal Divergence Swing (La Pietra)
                          </div>

                          <div className="flex items-center justify-between relative py-2">
                            {/* Spring Delta */}
                            <div className="flex flex-col items-center text-center space-y-1 z-10 w-[42%]">
                              <span className="text-[0.52rem] font-mono tracking-widest text-[#2C3E50]/40 uppercase">
                                Spring Delta
                              </span>
                              <motion.div 
                                key={`spring-${validationBaseline}`}
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                                className="text-2xl md:text-3xl font-sans font-bold text-[#4A7C9E] tracking-tight bg-[#4A7C9E]/5 px-3 py-1.5 rounded border border-[#4A7C9E]/15"
                              >
                                {data.spring}
                              </motion.div>
                              <span className="text-[0.5rem] font-mono text-[#2C3E50]/60 italic">
                                {data.springLabel}
                              </span>
                            </div>

                            {/* Connecting Swing Arrow */}
                            <div className="flex-1 flex flex-col items-center justify-center relative px-1">
                              <motion.div 
                                key={`swing-${validationBaseline}`}
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ duration: 0.4 }}
                                className="bg-[#D35400]/10 border border-[#D35400]/20 text-[#D35400] text-[0.55rem] font-mono font-bold px-1.5 py-0.5 rounded shadow-sm z-10 mb-1 flex items-center space-x-0.5 whitespace-nowrap"
                              >
                                <Sparkles size={8} className="text-[#D35400] shrink-0" />
                                <span>{data.swing}</span>
                              </motion.div>
                              
                              <div className="w-full flex items-center">
                                <div className="h-[1.5px] bg-gradient-to-r from-[#4A7C9E]/60 to-[#D35400]/60 flex-1" />
                                <ChevronRight size={14} className="text-[#D35400]/80 -ml-1.5 shrink-0" />
                              </div>
                            </div>

                            {/* Summer Delta */}
                            <div className="flex flex-col items-center text-center space-y-1 z-10 w-[42%]">
                              <span className="text-[0.52rem] font-mono tracking-widest text-[#2C3E50]/40 uppercase">
                                Summer Delta
                              </span>
                              <motion.div 
                                key={`summer-${validationBaseline}`}
                                initial={{ opacity: 0, y: -5 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                                className="text-2xl md:text-3xl font-sans font-bold text-[#D35400] tracking-tight bg-[#D35400]/5 px-3 py-1.5 rounded border border-[#D35400]/15"
                              >
                                {data.summer}
                              </motion.div>
                              <span className="text-[0.5rem] font-mono text-[#2C3E50]/60 italic">
                                {data.summerLabel}
                              </span>
                            </div>
                          </div>

                          {/* Mini Details */}
                          <div className="border-t border-[#2C3E50]/5 pt-2 mt-2 flex justify-between items-center text-[0.5rem] font-mono text-[#2C3E50]/50">
                            <span>SURFACE DELTA: (CELL MEAN - REFERENCE LST)</span>
                            <span>4-YEAR OBSERVED RECORD</span>
                          </div>
                        </div>

                        {/* Optional Map Placeholder Frame (5 Cols) */}
                        <div className="col-span-1 md:col-span-5 bg-white p-3.5 rounded-lg border border-[#2C3E50]/10 shadow-sm flex flex-col justify-between relative min-h-[160px]">
                          <div className="text-[0.55rem] font-mono tracking-widest text-[#2C3E50]/40 uppercase mb-2">
                            Spatial Reference Mapping
                          </div>

                          {/* Placeholder Box */}
                          <div className="relative w-full aspect-[4/3] md:flex-1 rounded border-2 border-dashed border-[#2C3E50]/15 bg-[#2C3E50]/5 overflow-hidden flex flex-col items-center justify-center p-2 group transition-colors hover:border-[#D35400]/30 hover:bg-[#D35400]/5 cursor-pointer">
                            {/* Faint diagonal hatch pattern */}
                            <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(45deg,#2C3E50_25%,transparent_25%,transparent_75%,#2C3E50_75%,#2C3E50),linear-gradient(45deg,#2C3E50_25%,transparent_25%,transparent_75%,#2C3E50_75%,#2C3E50)] bg-[size:15px_15px] bg-[position:0_0,7.5px_7.5px]" />
                            
                            <div className="z-10 flex flex-col items-center text-center space-y-1">
                              <Compass size={18} className="text-[#2C3E50]/30 group-hover:text-[#D35400]/50 transition-colors" />
                              <span className="text-[0.55rem] font-mono font-bold tracking-widest text-[#2C3E50]/50 group-hover:text-[#D35400]/70 transition-colors uppercase">
                                YOUR ARTWORK
                              </span>
                              <span className="text-[0.45rem] font-mono text-[#2C3E50]/40 uppercase tracking-tight">
                                {data.code} Baseline Map
                              </span>
                            </div>

                            {/* Corner coordinate decorations */}
                            <div className="absolute top-1 left-1.5 font-mono text-[0.4rem] text-[#2C3E50]/30">
                              40°21'N
                            </div>
                            <div className="absolute bottom-1 right-1.5 font-mono text-[0.4rem] text-[#2C3E50]/30">
                              18°10'E
                            </div>
                          </div>

                          <div className="text-[0.5rem] font-sans font-light text-[#2C3E50]/60 italic text-center mt-1.5">
                            Reference geography: Lecce, IT
                          </div>
                        </div>

                      </div>

                      {/* TEXT INTERPRETATION (Dominant bottom-anchor) */}
                      <motion.div 
                        key={`interp-${validationBaseline}`}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="bg-[#D35400]/5 p-3.5 rounded border border-[#D35400]/15 relative text-left"
                      >
                        <div className="flex items-center space-x-1.5 mb-1">
                          <Info size={11} className="text-[#D35400] shrink-0" />
                          <span className="text-[0.55rem] font-mono uppercase tracking-widest text-[#D35400] font-bold">
                            Ecological Interpretation
                          </span>
                        </div>
                        <p className="text-[0.8rem] text-[#2C3E50] leading-relaxed font-display font-medium italic">
                          "{data.interpretation}"
                        </p>
                      </motion.div>
                    </motion.div>
                  );
                })()}

                {currentSlide.layout === 'design' && (
                  <motion.div 
                    key="viz-design"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="w-full space-y-4"
                  >
                    <span className="text-[0.68rem] font-mono tracking-wider text-[#2C3E50]/60 uppercase block">The Thermodynamic Carving Protocol</span>
                    
                    <div className="border border-[#2C3E50]/15 rounded-lg p-5 bg-white relative overflow-hidden flex flex-col justify-between h-56">
                      <div className="space-y-3">
                        <span className="text-[0.58rem] font-mono tracking-widest text-[#D35400] uppercase block">Spatial Rule #1</span>
                        <h4 className="text-lg font-sans font-bold text-[#2C3E50] leading-tight">Carving Localized Pressure Gradients</h4>
                        <p className="text-[0.72rem] text-[#2C3E50]/80 leading-relaxed">
                          By carving recesses in limestone walls and aligning them with dense Aleppo pine groupings, design acts as a thermodynamic siphon. The hot surface boundary layer of the Stone Ecology pulls the ~1.7 °C cooled air of the Shadow Ecology outward, creating comfortable convective currents across pedestrian paths.
                        </p>
                      </div>
                      
                      {/* Abstract geometric graphic showing siphoning effect */}
                      <div className="h-8 flex items-center justify-between border-t border-[#2C3E50]/5 pt-2">
                        <span className="text-[0.62rem] font-mono text-[#4A5D23] font-bold">Cold Air Sink</span>
                        <div className="flex-1 px-4 flex items-center justify-center space-x-1">
                          <span className="h-1 w-1 bg-[#4A7C9E] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                          <span className="h-1 w-1.5 bg-[#4A7C9E] rounded-full animate-bounce" style={{ animationDelay: '200ms' }} />
                          <span className="h-1 w-2 bg-[#D35400] rounded-full animate-bounce" style={{ animationDelay: '400ms' }} />
                        </div>
                        <span className="text-[0.62rem] font-mono text-[#D35400] font-bold">Hot Surface Pull</span>
                      </div>
                    </div>
                  </motion.div>
                )}

                {currentSlide.layout === 'case-study' && (
                  <motion.div 
                    key="viz-case-study"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="w-full space-y-4"
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-[0.68rem] font-mono tracking-wider text-[#2C3E50]/60 uppercase">Adriatic Square: Spatial Zoning Map</span>
                      <span className="text-[0.6rem] font-mono text-[#D35400] tracking-widest uppercase">Click zones to isolate</span>
                    </div>

                    <div className="grid grid-cols-12 gap-4 items-center">
                      {/* Interactive Site Grid Map */}
                      <div className="col-span-6 bg-white p-3 rounded border border-[#2C3E50]/10 flex flex-col justify-center items-center">
                        <div className="grid grid-cols-4 gap-2 w-full max-w-[180px] aspect-square p-2 border border-[#2C3E50]/5 bg-[#F5F5F0]">
                          {[...Array(16)].map((_, i) => {
                            // Assign zones:
                            // Row 0-1 left: Canopy (Shadow Ecology)
                            // Row 2-3 left/bottom: Transitional
                            // Rest: Stone Ecology
                            let bgClass = "bg-[#B0A99F]/20 border-[#B0A99F]/40";
                            let zoneId: 'canopy' | 'pavement' | 'pergola' = 'pavement';
                            if (i === 0 || i === 1 || i === 4 || i === 5) {
                              bgClass = "bg-[#4A5D23]/30 border-[#4A5D23]/60";
                              zoneId = 'canopy';
                            } else if (i === 2 || i === 6 || i === 8 || i === 9 || i === 10) {
                              bgClass = "bg-[#4A7C9E]/30 border-[#4A7C9E]/60";
                              zoneId = 'pergola';
                            }
                            
                            const isSelected = selectedPlazaRegion === zoneId;

                            return (
                              <button 
                                key={i}
                                onClick={() => setSelectedPlazaRegion(zoneId)}
                                className={`aspect-square rounded border transition-all ${bgClass} ${isSelected ? 'ring-2 ring-[#D35400] scale-[1.08] shadow-sm z-10' : 'hover:scale-105'}`}
                              />
                            );
                          })}
                        </div>
                        <span className="text-[0.58rem] font-mono text-[#2C3E50]/40 uppercase mt-2 block">Site Plan Grid Analysis</span>
                      </div>

                      {/* Isolated Zone Details */}
                      <div className="col-span-6 space-y-4">
                        <div className="bg-white p-4 rounded border border-[#2C3E50]/10 shadow-sm min-h-[160px] flex flex-col justify-between">
                          <div>
                            <span className="text-[0.58rem] font-mono tracking-widest text-[#D35400] uppercase block">Selected Zone Specifications</span>
                            <h5 className="font-sans font-bold text-base text-[#2C3E50] mt-0.5">
                              {selectedPlazaRegion === 'canopy' ? "Pine Canopy Cluster (Shadow)" :
                               selectedPlazaRegion === 'pavement' ? "Exposed Limestone Plaza (Stone)" :
                               "Porous Pergola System (Transition)"}
                            </h5>
                            <p className="text-[0.7rem] text-[#2C3E50]/80 leading-relaxed mt-2">
                              {selectedPlazaRegion === 'canopy' ? "Groups of Aleppo pine trees. Filters solar radiation. Holds cool air and retains humidity, establishing the primary ~1.7 °C cold air reserve." :
                               selectedPlazaRegion === 'pavement' ? "Finished local limestone surfaces. Radiates dry heat during mid-day to draw cool convective flows from the surrounding canopy clusters." :
                               "Lightweight wooden and limestone structures. Bridges the temperature gap while providing pleasant breeze pathways for pedestrians."}
                            </p>
                          </div>
                          <div className="flex justify-between items-center pt-2 border-t border-[#2C3E50]/5 text-[0.62rem] font-mono">
                            <span className="text-slate-400">Coupled Inversion:</span>
                            <span className="text-[#D35400] font-bold">Stable</span>
                          </div>
                        </div>

                        {/* Text navigation buttons */}
                        <div className="flex space-x-1">
                          {(['canopy', 'pergola', 'pavement'] as const).map((reg) => (
                            <button
                              key={reg}
                              onClick={() => setSelectedPlazaRegion(reg)}
                              className={`px-2 py-1 text-[0.58rem] font-mono rounded border transition-all ${selectedPlazaRegion === reg ? 'bg-[#D35400] text-white border-[#D35400]' : 'bg-white text-[#2C3E50] border-[#2C3E50]/15 hover:bg-[#2C3E50]/5'}`}
                            >
                              {reg === 'canopy' ? 'Canopy' : reg === 'pergola' ? 'Pergola' : 'Plaza'}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {currentSlide.layout === 'performance' && (
                  <motion.div 
                    key="viz-performance"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="w-full space-y-4"
                  >
                    <div className="flex justify-between items-center px-1">
                      <span className="text-[0.68rem] font-mono tracking-wider text-[#2C3E50]/60 uppercase">Interactive Canopy Comfort Simulator</span>
                      <span className="text-[0.62rem] font-mono text-[#D35400] font-bold">{canopyDensity}% Density</span>
                    </div>

                    <div className="bg-white p-5 rounded-lg border border-[#2C3E50]/10 shadow-sm space-y-4">
                      {/* Performance Metric Dial Slider */}
                      <div className="space-y-1">
                        <label className="text-[0.58rem] font-mono text-slate-400 uppercase block">Set Pine Canopy Cover Ratio</label>
                        <input 
                          type="range" 
                          min="20" 
                          max="90" 
                          value={canopyDensity}
                          onChange={(e) => setCanopyDensity(Number(e.target.value))}
                          className="w-full h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-[#D35400]"
                        />
                      </div>

                      {/* Simulator Results */}
                      <div className="grid grid-cols-2 gap-4 pt-2 border-t border-[#2C3E50]/5">
                        <div className="p-3 bg-[#4A5D23]/5 rounded text-center">
                          <span className="text-[0.58rem] font-mono text-[#4A5D23] uppercase block">Inversion Strength</span>
                          <span className="text-2xl font-sans font-bold text-[#4A5D23] block mt-1">
                            {canopyDensity < 40 ? "0.8 °C" : canopyDensity < 70 ? "1.7 °C" : "1.9 °C"}
                          </span>
                          <span className="text-[0.62rem] text-[#2C3E50]/60 block mt-0.5">Air cooling differential</span>
                        </div>

                        <div className="p-3 bg-[#D35400]/5 rounded text-center">
                          <span className="text-[0.58rem] font-mono text-[#D35400] uppercase block">Human Comfort (PET)</span>
                          <span className="text-2xl font-sans font-bold text-[#D35400] block mt-1">
                            {canopyDensity < 40 ? "-1.8 °C" : canopyDensity < 70 ? "-4.2 °C" : "-4.9 °C"}
                          </span>
                          <span className="text-[0.62rem] text-[#2C3E50]/60 block mt-0.5">Perceived heat reduction</span>
                        </div>
                      </div>

                      <p className="text-[0.65rem] text-[#2C3E50]/60 italic font-sans text-center">
                        "At a verified optimal <strong className="text-[#D35400] font-medium">65% canopy cover ratio</strong>, the coupled system matches our actual experimental findings, lowering pedestrian stress by 4.2 °C."
                      </p>
                    </div>
                  </motion.div>
                )}

                {currentSlide.layout === 'discussion' && (
                  <motion.div 
                    key="viz-discussion"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="w-full space-y-4"
                  >
                    <span className="text-[0.68rem] font-mono tracking-wider text-[#2C3E50]/60 uppercase block">The Thermodynamic Philosophy</span>
                    
                    <div className="bg-white p-6 rounded-lg border border-[#2C3E50]/10 shadow-sm relative overflow-hidden h-52 flex flex-col justify-between">
                      <div className="absolute top-0 right-0 p-4 opacity-[0.03]">
                        <Trees size={120} className="text-[#4A5D23]" />
                      </div>
                      
                      <div className="space-y-2">
                        <span className="text-[0.58rem] font-mono text-[#D35400] uppercase block">A Master's Core Thesis</span>
                        <h4 className="text-lg font-display text-[#2C3E50] italic leading-relaxed">
                          "We must transition from visual compositions to thermal instruments. Air is not empty space; it is physical matter to be carved and cooled."
                        </h4>
                      </div>

                      <div className="flex justify-between items-center border-t border-[#2C3E50]/5 pt-2">
                        <span className="text-[0.62rem] font-mono text-slate-400">Vernacular Adaptation Strategy</span>
                        <span className="text-[0.62rem] font-mono text-[#4A7C9E] font-bold">Adriatic Littoral</span>
                      </div>
                    </div>
                  </motion.div>
                )}

                {currentSlide.layout === 'conclusion' && (
                  <motion.div 
                    key="viz-conclusion"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="w-full space-y-4"
                  >
                    <span className="text-[0.68rem] font-mono tracking-wider text-[#2C3E50]/60 uppercase block">The Three Pillars of Validation</span>

                    <div className="space-y-2">
                      <div className="p-3 bg-[#D35400]/5 border border-[#D35400]/15 rounded flex items-center justify-between">
                        <div className="flex items-center space-x-2.5">
                          <span className="h-5 w-5 rounded-full bg-[#D35400]/10 flex items-center justify-center text-xs font-mono text-[#D35400] font-bold">1</span>
                          <span className="text-xs font-sans text-[#2C3E50] font-medium">Radial Urban Thermal Zone (RUTZ) method</span>
                        </div>
                        <span className="text-[0.6rem] font-mono text-emerald-600 font-bold">Verified</span>
                      </div>

                      <div className="p-3 bg-[#4A5D23]/5 border border-[#4A5D23]/15 rounded flex items-center justify-between">
                        <div className="flex items-center space-x-2.5">
                          <span className="h-5 w-5 rounded-full bg-[#4A5D23]/10 flex items-center justify-center text-xs font-mono text-[#4A5D23] font-bold">2</span>
                          <span className="text-xs font-sans text-[#2C3E50] font-medium">Stable ~1.7 °C microscale temperature inversion</span>
                        </div>
                        <span className="text-[0.6rem] font-mono text-emerald-600 font-bold">Proven</span>
                      </div>

                      <div className="p-3 bg-[#4A7C9E]/5 border border-[#4A7C9E]/15 rounded flex items-center justify-between">
                        <div className="flex items-center space-x-2.5">
                          <span className="h-5 w-5 rounded-full bg-[#4A7C9E]/10 flex items-center justify-center text-xs font-mono text-[#4A7C9E] font-bold">3</span>
                          <span className="text-xs font-sans text-[#2C3E50] font-medium">Threefold Ecology taxonomy design framework</span>
                        </div>
                        <span className="text-[0.6rem] font-mono text-emerald-600 font-bold">Formulated</span>
                      </div>
                    </div>
                  </motion.div>
                )}

                {currentSlide.layout === 'close' && (
                  <motion.div 
                    key="viz-close"
                    initial={{ opacity: 0, rotate: -2 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center space-y-4"
                  >
                    <div className="p-8 bg-white rounded-full border border-[#2C3E50]/10 shadow-sm">
                      <Sparkles className="text-[#D35400] w-14 h-14 animate-pulse" />
                    </div>
                    <div className="text-center space-y-1">
                      <h4 className="font-display italic text-lg text-[#2C3E50]">Saman Farhadi</h4>
                      <span className="text-[0.6rem] font-mono tracking-widest text-[#2C3E50]/40 uppercase block">MSc Thesis Defense · Completed</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
          )}
        </AnimatePresence>
        </div>
      </main>
      </div>

      {/* 4. PRESENTERS' NOTES PANEL (slides up from bottom on 'N') */}
      <AnimatePresence>
        {showNotes && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 180 }}
            className="fixed bottom-0 left-0 right-0 bg-[#2C3E50] text-[#F5F5F0] z-30 shadow-2xl border-t border-[#F5F5F0]/10 h-[220px]"
            id="presenter-notes-panel"
          >
            <div className="max-w-[700px] mx-auto px-8 py-6 flex flex-col h-full justify-between">
              <div className="flex justify-between items-center border-b border-[#F5F5F0]/10 pb-2 mb-3">
                <div className="flex items-center space-x-2">
                  <span className="text-[0.6rem] uppercase tracking-widest text-[#D35400] font-bold">Speaker Notes · Slide {currentIndex + 1}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={handleCopyNotes}
                    className="px-2 py-0.5 text-[0.58rem] font-mono rounded bg-white/10 hover:bg-white/15 text-[#F5F5F0] transition-colors"
                  >
                    {copiedNote ? "Copied!" : "Copy"}
                  </button>
                  <button
                    onClick={() => setShowNotes(false)}
                    className="text-white/60 hover:text-white transition-colors text-xs"
                    title="Close notes"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Note body text styled exactly to spec */}
              <p className="font-light opacity-80 leading-relaxed text-sm overflow-y-auto pr-2 flex-1">
                {currentSlide.notes}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 5. INTERACTIVE HELP OVERLAY */}
      <AnimatePresence>
        {showHelp && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#2C3E50]/80 backdrop-blur-md z-40 flex items-center justify-center p-4"
            onClick={() => setShowHelp(false)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-[#F5F5F0] text-[#2C3E50] p-6 rounded-xl border border-[#2C3E50]/10 max-w-md w-full space-y-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center border-b border-[#2C3E50]/10 pb-3">
                <h3 className="font-sans font-bold text-lg">Presentation Controls</h3>
                <button 
                  onClick={() => setShowHelp(false)}
                  className="p-1 text-[#2C3E50]/60 hover:text-[#2C3E50]"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4 text-xs font-mono">
                <div className="flex justify-between items-center py-1 border-b border-[#2C3E50]/5">
                  <span className="text-[#2C3E50]/60">Next Slide</span>
                  <span className="px-2 py-1 bg-[#2C3E50]/5 rounded border border-[#2C3E50]/10">→ / Space</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-[#2C3E50]/5">
                  <span className="text-[#2C3E50]/60">Previous Slide</span>
                  <span className="px-2 py-1 bg-[#2C3E50]/5 rounded border border-[#2C3E50]/10">←</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-[#2C3E50]/5">
                  <span className="text-[#2C3E50]/60">Toggle Notes Panel</span>
                  <span className="px-2 py-1 bg-[#2C3E50]/5 rounded border border-[#2C3E50]/10">N</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-[#2C3E50]/5">
                  <span className="text-[#2C3E50]/60">Toggle Fullscreen</span>
                  <span className="px-2 py-1 bg-[#2C3E50]/5 rounded border border-[#2C3E50]/10">F</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-[#2C3E50]/5">
                  <span className="text-[#2C3E50]/60">Toggle Help Menu</span>
                  <span className="px-2 py-1 bg-[#2C3E50]/5 rounded border border-[#2C3E50]/10">H</span>
                </div>
              </div>

              <p className="text-[0.68rem] font-sans text-slate-500 text-center italic">
                * Note: If fullscreen or keyboard shortcuts are blocked inside the browser iframe, please open the application in a new tab using the top-right button.
              </p>

              <button
                onClick={() => setShowHelp(false)}
                className="w-full py-2 bg-[#2C3E50] hover:bg-[#D35400] text-[#F5F5F0] rounded font-mono text-xs uppercase tracking-widest transition-colors"
              >
                Close Control Menu
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
