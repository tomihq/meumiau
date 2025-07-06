"use client"
import { Music, Pause, Play, Volume2, VolumeX } from 'lucide-react'
import React, { useRef, useState } from 'react'
import { Button } from './ui/button'

const MusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  return (
    <div className="fixed top-4 right-4 z-40 flex items-center gap-2 bg-black/20 backdrop-blur-md rounded-full px-4 py-2 border border-purple-500/30">
      <Music className="w-4 h-4 text-purple-400" />
      <span className="text-sm text-purple-300 font-mono">Lo-Fi Vibes</span>
      <Button variant="ghost" size="sm" onClick={togglePlay} className="w-8 h-8 p-0 hover:bg-purple-500/20">
        {isPlaying ? <Pause className="w-4 h-4 text-purple-400" /> : <Play className="w-4 h-4 text-purple-400" />}
      </Button>
      <Button variant="ghost" size="sm" onClick={toggleMute} className="w-8 h-8 p-0 hover:bg-purple-500/20">
        {isMuted ? <VolumeX className="w-4 h-4 text-purple-400" /> : <Volume2 className="w-4 h-4 text-purple-400" />}
      </Button>
      <audio ref={audioRef} loop preload="auto">
        <source src="/audio/lofi-background.mp3" type="audio/mpeg" />
      </audio>
    </div>
  )
}

export default MusicPlayer