// src/components/MusicPlayer.tsx
"use client"
import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
  Music,
  Pause,
  Play,
  Volume2,
  VolumeX,
  SkipBack,
  SkipForward,
} from 'lucide-react';
import { Button } from './ui/button';
import { Slider } from './ui/slider'; 

// Define your playlist
interface Song {
  id: number;
  title: string;
  artist: string;
  src: string; 
}

const PLAYLIST: Song[] = [
  { id: 1, title: 'Lo-Fi Chill Groove', artist: 'Zen Beats', src: '/audio/lofi.mp3' },
];

const MusicPlayer: React.FC = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.5); 
  const [currentSongIndex, setCurrentSongIndex] = useState(0);

  const currentSong = PLAYLIST[currentSongIndex];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      audioRef.current.muted = isMuted; 

      const handleSongEnd = () => {
        playNextSong();
      };
      audioRef.current.addEventListener('ended', handleSongEnd);

      return () => {
        audioRef.current?.removeEventListener('ended', handleSongEnd);
      };
    }
  }, [volume, isMuted, currentSongIndex]);

  // Autoplay and pause logic
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.error("Autoplay failed:", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [currentSongIndex, isPlaying]);


  const togglePlay = useCallback(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(e => console.error("Play failed:", e));
      }
      setIsPlaying(!isPlaying);
    }
  }, [isPlaying]);

  const toggleMute = useCallback(() => {
    if (audioRef.current) {
      const newMuteState = !isMuted;
      audioRef.current.muted = newMuteState;
      setIsMuted(newMuteState);

      if (newMuteState) { 
      } else { 
        if (volume === 0 && audioRef.current.volume === 0) { 
            setVolume(0.5);
            audioRef.current.volume = 0.5;
        }
      }
    }
  }, [isMuted, volume]);


  const handleVolumeChange = useCallback((value: number[]) => {
    const newVolume = value[0] / 100; 
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
      setIsMuted(newVolume === 0);
      audioRef.current.muted = (newVolume === 0);
    }
  }, []);

  const playNextSong = useCallback(() => {
    setCurrentSongIndex((prevIndex) => (prevIndex + 1) % PLAYLIST.length);
    setIsPlaying(true); 
  }, []);

  const playPreviousSong = useCallback(() => {
    setCurrentSongIndex((prevIndex) =>
      prevIndex === 0 ? PLAYLIST.length - 1 : prevIndex - 1
    );
    setIsPlaying(true); 
  }, []);


  return (
    <div className="fixed bottom-20 md:bottom-auto md:top-5  right-1/2 translate-x-1/2 md:translate-x-0 md:right-4 z-40 flex items-center gap-2 bg-black/20 backdrop-blur-md rounded-full px-4 py-2 border border-purple-500/30 shadow-md">
      <Music className="w-4 h-4 text-purple-400" />
      <span className="text-sm text-purple-300 font-mono whitespace-nowrap overflow-hidden text-ellipsis max-w-[100px]">
        {currentSong.title}
      </span>

      <Button variant="ghost" size="sm" onClick={playPreviousSong} className="w-8 h-8 p-0 hover:bg-purple-500/20">
        <SkipBack className="w-4 h-4 text-purple-400" />
      </Button>

      <Button variant="ghost" size="sm" onClick={togglePlay} className="w-8 h-8 p-0 hover:bg-purple-500/20">
        {isPlaying ? <Pause className="w-4 h-4 text-purple-400" /> : <Play className="w-4 h-4 text-purple-400" />}
      </Button>

      <Button variant="ghost" size="sm" onClick={playNextSong} className="w-8 h-8 p-0 hover:bg-purple-500/20">
        <SkipForward className="w-4 h-4 text-purple-400" />
      </Button>

      <div className="flex items-center gap-1 w-20"> 
        <Button variant="ghost" size="sm" onClick={toggleMute} className="w-8 h-8 p-0 hover:bg-purple-500/20">
          {isMuted || volume === 0 ? <VolumeX className="w-4 h-4 text-gray-400" /> : <Volume2 className="w-4 h-4 text-purple-400" />}
        </Button>
        <Slider
          value={[isMuted ? 0 : Math.round(volume * 100)]} 
          max={100}
          step={1}
          onValueChange={handleVolumeChange}
          className="w-full [&>span:first-child]:h-1 [&>span:first-child]:bg-purple-500/30 [&>span:last-child]:bg-purple-400 [&>span:last-child]:w-3 [&>span:last-child]:h-3 [&>span:last-child]:rounded-full [&>span:last-child]:shadow-none"
        />
      </div>


      {/* Audio Element */}
      <audio ref={audioRef} src={currentSong.src} loop={false} preload="auto" />
    </div>
  );
};

export default MusicPlayer;