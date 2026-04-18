import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, VolumeX, Music, Zap } from 'lucide-react';
import { DUMMY_TRACKS } from '../constants';
import { motion, AnimatePresence } from 'motion/react';

const MusicPlayer: React.FC = () => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = DUMMY_TRACKS[currentTrackIndex];

  useEffect(() => {
    if (isPlaying) {
      audioRef.current?.play().catch(err => console.error("Audio execution failed:", err));
    } else {
      audioRef.current?.pause();
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const handleSkipForward = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % DUMMY_TRACKS.length);
  };

  const handleSkipBack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + DUMMY_TRACKS.length) % DUMMY_TRACKS.length);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const dur = audioRef.current.duration;
      setProgress((current / dur) * 100);
      setDuration(dur);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (audioRef.current) {
      const newTime = (parseFloat(e.target.value) / 100) * duration;
      audioRef.current.currentTime = newTime;
      setProgress(parseFloat(e.target.value));
    }
  };

  return (
    <div className="w-full bg-cyber-black pixel-border p-6 relative">
      <div className="absolute top-2 right-2 flex items-center gap-1 text-[8px] font-pixel text-neon-magenta">
        <Zap size={8} />
        <span>AUDIO_CORE::ACTIVE</span>
      </div>

      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleSkipForward}
      />

      <div className="flex flex-col md:flex-row items-center gap-8">
        {/* Album Art / Glyph */}
        <div className="relative">
          <motion.div
            key={currentTrack.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-24 h-24 md:w-32 md:h-32 border-4 border-neon-magenta bg-cyber-gray flex items-center justify-center overflow-hidden"
          >
            <img
              src={currentTrack.cover}
              alt={currentTrack.title}
              className="w-full h-full object-cover filter grayscale sepia(100%) hue-rotate(250deg) brightness(1.2)"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-neon-cyan/10 mix-blend-overlay" />
          </motion.div>
        </div>

        {/* Binary Stream & Controls */}
        <div className="flex-1 space-y-4 w-full">
          <div className="text-center md:text-left border-b-2 border-neon-cyan/20 pb-2">
            <h3 className="text-2xl font-pixel text-neon-cyan leading-none mb-2 glitch-text" data-text={currentTrack.title.toUpperCase()}>
              {currentTrack.title.toUpperCase()}
            </h3>
            <p className="text-xs font-mono text-neon-magenta uppercase tracking-[4px]">
              SOURCE::{currentTrack.artist.toUpperCase()}
            </p>
          </div>

          {/* Scrubber */}
          <div className="space-y-1">
            <input
              type="range"
              min="0"
              max="100"
              value={isNaN(progress) ? 0 : progress}
              onChange={handleSeek}
              className="w-full h-4 bg-cyber-gray appearance-none cursor-pointer accent-neon-magenta border-2 border-neon-cyan"
            />
            <div className="flex justify-between text-[10px] font-mono text-neon-cyan">
              <span>TIME::{Math.floor((audioRef.current?.currentTime || 0) / 60)}:{(Math.floor((audioRef.current?.currentTime || 0) % 60)).toString().padStart(2, '0')}</span>
              <span>DUR::{Math.floor(duration / 60 || 0)}:{(Math.floor(duration % 60 || 0)).toString().padStart(2, '0')}</span>
            </div>
          </div>

          {/* Operation Controls */}
          <div className="flex items-center justify-center md:justify-start gap-4">
            <button
              onClick={handleSkipBack}
              className="p-2 border-2 border-neon-cyan text-neon-cyan hover:bg-neon-cyan hover:text-black transition-all"
            >
              <SkipBack size={18} />
            </button>

            <button
              onClick={togglePlay}
              className="flex-1 md:flex-none px-6 py-2 border-4 border-neon-magenta font-pixel text-sm text-neon-magenta hover:bg-neon-magenta hover:text-black transition-all"
            >
              {isPlaying ? "HALT_SIGNAL" : "EXECUTE_STREAM"}
            </button>

            <button
              onClick={handleSkipForward}
              className="p-2 border-2 border-neon-cyan text-neon-cyan hover:bg-neon-cyan hover:text-black transition-all"
            >
              <SkipForward size={18} />
            </button>

            <div className="hidden md:flex items-center gap-2 ml-auto text-neon-cyan">
              <VolumeX size={14} />
              <span className="text-[10px] font-mono">VOL::STD</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;
