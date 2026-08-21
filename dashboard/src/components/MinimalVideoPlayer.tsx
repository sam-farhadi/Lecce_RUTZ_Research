import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Repeat } from 'lucide-react';
import { motion } from 'motion/react';

interface MinimalVideoPlayerProps {
  src: string;
}

export default function MinimalVideoPlayer({ src }: MinimalVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isRateMenuOpen, setIsRateMenuOpen] = useState(false);

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
    }
  };

  const handlePlaybackRateChange = (rate: number) => {
    setPlaybackRate(rate);
    if (videoRef.current) {
      videoRef.current.playbackRate = rate;
    }
    setIsRateMenuOpen(false);
  };

  const formatTime = (timeInSeconds: number) => {
    if (isNaN(timeInSeconds)) return '00:00';
    const mins = Math.floor(timeInSeconds / 60);
    const secs = Math.floor(timeInSeconds % 60);
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);

    video.addEventListener('play', onPlay);
    video.addEventListener('pause', onPause);

    return () => {
      video.removeEventListener('play', onPlay);
      video.removeEventListener('pause', onPause);
    };
  }, []);

  useEffect(() => {
    if (!isRateMenuOpen) return;
    const handleOutsideClick = () => {
      setIsRateMenuOpen(false);
    };
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, [isRateMenuOpen]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
      className="relative w-full rounded-md overflow-hidden flex flex-col items-center justify-center group bg-[#2C3E50]/5 transition-all duration-500 hover:shadow-[0_0_25px_rgba(211,84,0,0.2)]"
    >
      {/* Video element */}
      <video
        ref={videoRef}
        src={src}
        onClick={togglePlay}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        loop={isLooping}
        className="w-full h-auto rounded-md shadow-md bg-transparent cursor-pointer"
        preload="metadata"
        playsInline
      />

      {/* Floating minimalist control bar */}
      <div className="absolute bottom-3 left-4 right-4 bg-[#F5F5F0]/95 backdrop-blur-md border border-[#2C3E50]/15 rounded-md px-4 py-2.5 flex items-center space-x-4 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
        {/* Play/Pause Button */}
        <button
          onClick={togglePlay}
          className="text-[#2C3E50] hover:text-[#D35400] transition-colors p-1 rounded hover:bg-[#2C3E50]/5 flex items-center justify-center"
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" className="transition-transform active:scale-95">
            <motion.path
              animate={{
                d: isPlaying 
                  ? "M 3 2 L 6 2 L 6 12 L 3 12 Z" 
                  : "M 3 2 L 8 4.77 L 8 9.23 L 3 12 Z"
              }}
              transition={{ duration: 0.3, ease: [0.25, 1, 0.5, 1] }}
            />
            <motion.path
              animate={{
                d: isPlaying 
                  ? "M 8 2 L 11 2 L 11 12 L 8 12 Z" 
                  : "M 8 4.77 L 12 7 L 12 7 L 8 9.23 Z"
              }}
              transition={{ duration: 0.3, ease: [0.25, 1, 0.5, 1] }}
            />
          </svg>
        </button>

        {/* Time code */}
        <span className="font-mono text-[0.65rem] text-[#2C3E50]/80 min-w-[70px] select-none">
          {formatTime(currentTime)} / {formatTime(duration)}
        </span>

        {/* Scrub progress bar */}
        <input
          type="range"
          min={0}
          max={duration || 100}
          value={currentTime}
          onChange={handleSeek}
          className="flex-1 accent-[#D35400] h-1 rounded bg-[#2C3E50]/10 hover:bg-[#2C3E50]/20 cursor-pointer outline-none transition-colors"
        />

        {/* Mute Button */}
        <button
          onClick={toggleMute}
          className="text-[#2C3E50] hover:text-[#D35400] transition-colors p-1 rounded hover:bg-[#2C3E50]/5 flex items-center justify-center"
        >
          {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
        </button>

        {/* Loop Toggle Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsLooping(!isLooping);
          }}
          className={`p-1 rounded hover:bg-[#2C3E50]/5 flex items-center justify-center transition-all ${
            isLooping 
              ? 'text-[#D35400] bg-[#D35400]/5 border border-[#D35400]/20' 
              : 'text-[#2C3E50]/60 hover:text-[#2C3E50] border border-transparent'
          }`}
          title={isLooping ? "Disable Loop" : "Enable Loop"}
        >
          <Repeat size={13} className={isLooping ? "stroke-[2.5px]" : "stroke-[2px]"} />
        </button>

        {/* Playback Speed dropdown */}
        <div className="relative flex items-center">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsRateMenuOpen(!isRateMenuOpen);
            }}
            className="text-[#2C3E50] hover:text-[#D35400] transition-colors px-1.5 py-0.5 rounded hover:bg-[#2C3E50]/5 font-mono text-[0.62rem] font-bold min-w-[32px] text-center border border-[#2C3E50]/10"
            title="Playback Speed"
          >
            {playbackRate}x
          </button>
          {isRateMenuOpen && (
            <div className="absolute bottom-full mb-2 right-0 bg-[#F5F5F0]/95 backdrop-blur-md border border-[#2C3E50]/15 rounded shadow-lg flex flex-col overflow-hidden z-30 min-w-[55px]">
              {[0.5, 1, 1.5].map((rate) => (
                <button
                  key={rate}
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePlaybackRateChange(rate);
                  }}
                  className={`px-2.5 py-1.5 text-left font-mono text-[0.62rem] transition-colors ${
                    playbackRate === rate
                      ? 'bg-[#D35400] text-[#F5F5F0]'
                      : 'text-[#2C3E50] hover:bg-[#2C3E50]/5'
                  }`}
                >
                  {rate}x
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
