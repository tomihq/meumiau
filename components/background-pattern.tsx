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

  const particles = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      symbol: symbols[Math.floor(Math.random() * symbols.length)],
      delay: Math.random() * 8,
      duration: 4 + Math.random() * 4,
      size: 0.8 + Math.random() * 1,
    }))

const BackgroundPattern = () => {
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
    </div>
  )
}

export default BackgroundPattern