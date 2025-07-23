"use client"
import React, { useEffect, useState } from 'react'

const BackgroundPattern = () => {
  const symbols = [
    "✦",
    "◆",
    "○",
    "✕",
    "⟡",
    "◇",
    "✧",
    "⬟",
    "◈",
    "⬢",
    "∫",
    "∂",
    "∑",
    "∏",
    "√",
    "∞",
    "π",
    "α",
    "β",
    "γ",
    "δ",
    "λ",
    "μ",
    "σ",
    "Ω",
    "∇",
    "≈",
    "≠",
    "≤",
    "≥",
    "∈",
    "∉",
    "⊂",
    "⊃",
    "∪",
    "∩",
    "∀",
    "∃",
    "∴",
    "∵",
    "⟨",
    "⟩",
    "⌊",
    "⌋",
    "⌈",
    "⌉",
  ]

  const [particles, setParticles] = useState<
    Array<{
      id: number
      x: number
      y: number
      symbol: string
      delay: number
      duration: number
      size: number
    }>
  >([])

  useEffect(() => {
    const newParticles = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      symbol: symbols[Math.floor(Math.random() * symbols.length)],
      delay: Math.random() * 8,
      duration: 4 + Math.random() * 4,
      size: 0.8 + Math.random() * 1,
    }))
    setParticles(newParticles)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute text-purple-300/15 animate-float"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            animationDelay: `${particle.delay}s`,
            animationDuration: `${particle.duration}s`,
            fontSize: `${1.5 * particle.size}rem`,
            transform: `scale(${particle.size})`,
          }}
        >
          {particle.symbol}
        </div>
      ))}

      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
            opacity: 0.1;
          }
          25% {
            transform: translateY(-20px) rotate(5deg);
            opacity: 0.3;
          }
          50% {
            transform: translateY(-10px) rotate(-3deg);
            opacity: 0.2;
          }
          75% {
            transform: translateY(-30px) rotate(8deg);
            opacity: 0.25;
          }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}

export default BackgroundPattern