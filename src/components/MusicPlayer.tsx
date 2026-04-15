import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Music2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Slider } from '@/components/ui/slider';

interface Track {
  id: number;
  title: string;
  artist: string;
  url: string;
  cover: string;
  color: string;
}

const TRACKS: Track[] = [
  {
    id: 1,
    title: "Neon Dreams",
    artist: "AI Synthwave",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    cover: "https://picsum.photos/seed/neon1/400/400",
    color: "cyan"
  },
  {
    id: 2,
    title: "Cyber Pulse",
    artist: "AI Techno",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    cover: "https://picsum.photos/seed/cyber2/400/400",
    color: "fuchsia"
  },
  {
    id: 3,
    title: "Midnight Drive",
    artist: "AI Lo-fi",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    cover: "https://picsum.photos/seed/drive3/400/400",
    color: "indigo"
  }
];

export const MusicPlayer: React.FC = () => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const [duration, setDuration] = useState(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    if (isPlaying) {
      audioRef.current?.play().catch(() => setIsPlaying(false));
    } else {
      audioRef.current?.pause();
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const skipForward = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setProgress(0);
  };

  const skipBack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setProgress(0);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const total = audioRef.current.duration;
      if (total) {
        setProgress((current / total) * 100);
        setDuration(total);
      }
    }
  };

  const handleSeek = (value: number[]) => {
    if (audioRef.current && duration) {
      const newTime = (value[0] / 100) * duration;
      audioRef.current.currentTime = newTime;
      setProgress(value[0]);
    }
  };

  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full flex flex-col gap-4">
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={skipForward}
      />

      <div className="relative aspect-square w-full rounded-[4px] overflow-hidden border border-[#1a1a1a]">
        <AnimatePresence mode="wait">
          <motion.img
            key={currentTrack.id}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.5 }}
            src={currentTrack.cover}
            alt={currentTrack.title}
            className="w-full h-full object-cover grayscale opacity-80"
            referrerPolicy="no-referrer"
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d] via-transparent to-transparent opacity-90" />
        
        {/* Visualizer Mockup */}
        <div className="absolute bottom-4 left-4 right-4 flex items-end justify-center gap-1 h-12">
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              animate={{ 
                height: isPlaying ? [10, Math.random() * 40 + 10, 10] : 4 
              }}
              transition={{ 
                repeat: Infinity, 
                duration: 0.5 + Math.random() * 0.5,
                ease: "easeInOut"
              }}
              className="w-1 rounded-[1px] bg-[#00f2ff] shadow-[0_0_10px_#00f2ff]"
            />
          ))}
        </div>
      </div>

      {/* Info */}
      <div className="flex flex-col gap-1">
        <motion.h3 
          key={currentTrack.title}
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-[14px] font-medium text-[#e0e0e0]"
        >
          {currentTrack.title}
        </motion.h3>
        <motion.p 
          key={currentTrack.artist}
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-[12px] text-[#666666]"
        >
          {currentTrack.artist}
        </motion.p>
      </div>

      {/* Progress */}
      <div className="space-y-2">
        <div className="relative w-full h-1 bg-[#222] rounded-[2px]">
          <div 
            className="absolute top-0 left-0 h-full bg-[#00f2ff] shadow-[0_0_10px_#00f2ff] rounded-[2px]"
            style={{ width: `${progress}%` }}
          />
          <Slider
            value={[progress]}
            max={100}
            step={0.1}
            onValueChange={handleSeek}
            className="absolute inset-0 opacity-0 cursor-pointer"
          />
        </div>
        <div className="flex justify-between text-[10px] font-mono text-[#666666] uppercase">
          <span>{formatTime(audioRef.current?.currentTime || 0)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between mt-2">
        <button 
          onClick={skipBack}
          className="text-[#666666] hover:text-[#00f2ff] transition-colors cursor-pointer"
        >
          <SkipBack size={20} />
        </button>

        <button
          onClick={togglePlay}
          className="text-[#e0e0e0] hover:text-[#00f2ff] transition-colors cursor-pointer"
        >
          {isPlaying ? <Pause size={28} /> : <Play size={28} />}
        </button>

        <button 
          onClick={skipForward}
          className="text-[#666666] hover:text-[#00f2ff] transition-colors cursor-pointer"
        >
          <SkipForward size={20} />
        </button>
      </div>

      {/* Volume */}
      <div className="flex items-center gap-3 mt-2 text-[#666666]">
        <Volume2 size={14} />
        <div className="relative w-full h-1 bg-[#222] rounded-[2px]">
          <div 
            className="absolute top-0 left-0 h-full bg-[#666666] rounded-[2px]"
            style={{ width: `${volume * 100}%` }}
          />
          <Slider
            value={[volume * 100]}
            max={100}
            step={1}
            onValueChange={(v) => setVolume(v[0] / 100)}
            className="absolute inset-0 opacity-0 cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
};
