"use client"

import { useEffect, useRef } from "react"
import katex from "katex"
import "katex/dist/katex.min.css"

interface KaTeXRendererProps {
  math: string
  block?: boolean
  className?: string
}

export function KaTeXRenderer({ math, block = false, className = "" }: KaTeXRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (containerRef.current) {
      try {
        katex.render(math, containerRef.current, {
          displayMode: block,
          throwOnError: false,
          trust: true,
          strict: false,
          output: "html",
          fleqn: false,
          macros: {
            "\\RR": "\\mathbb{R}",
            "\\NN": "\\mathbb{N}",
            "\\ZZ": "\\mathbb{Z}",
            "\\QQ": "\\mathbb{Q}",
            "\\CC": "\\mathbb{C}",
          },
        })
      } catch (error) {
        console.error("KaTeX rendering error:", error)
        if (containerRef.current) {
          containerRef.current.textContent = math
        }
      }
    }
  }, [math, block])

  return (
    <>
      <div
        ref={containerRef}
        className={`katex-container ${
          block
            ? "block-math text-center my-6 p-4 bg-slate-800/30 rounded-lg border border-slate-700/50"
            : "inline-math"
        } ${className}`}
      />
      <style jsx global>{`
        /* Notion-style KaTeX styling */
        .katex-container {
          font-family: 'KaTeX_Main', 'Times New Roman', serif;
        }
        
        .katex-container .katex {
          font-size: 1.1em;
          color: #e2e8f0;
        }
        
        .inline-math .katex {
          font-size: 1.05em;
          color: #c084fc;
          background: rgba(192, 132, 252, 0.1);
          padding: 2px 4px;
          border-radius: 4px;
          border: 1px solid rgba(192, 132, 252, 0.2);
        }
        
        .block-math .katex {
          font-size: 1.3em;
          color: #f1f5f9;
        }
        
        .block-math .katex-display {
          margin: 0;
          text-align: center;
        }
        
        /* Override KaTeX default colors for better contrast */
        .katex .mord,
        .katex .mop,
        .katex .mbin,
        .katex .mrel,
        .katex .mopen,
        .katex .mclose,
        .katex .mpunct {
          color: inherit;
        }
        
        /* Greek letters and symbols */
        .katex .mord.mathdefault,
        .katex .mord.mathrm {
          font-family: 'KaTeX_Math', 'KaTeX_Main', serif;
        }
        
        /* Fractions */
        .katex .frac-line {
          border-bottom-color: currentColor;
        }
        
        /* Summation and integral symbols */
        .katex .mop.op-symbol {
          color: #a855f7;
        }
        
        /* Subscripts and superscripts */
        .katex .msupsub {
          color: #cbd5e1;
        }
        
        /* Parentheses and brackets */
        .katex .mopen,
        .katex .mclose {
          color: #94a3b8;
        }
        
        /* Variables and functions */
        .katex .mord.mathit {
          color: #e2e8f0;
          font-style: italic;
        }
        
        /* Numbers */
        .katex .mord:not(.mathit):not(.mathrm) {
          color: #f8fafc;
        }
        
        /* Operators */
        .katex .mbin,
        .katex .mrel {
          color: #a855f7;
        }
        
        /* Clean up spacing */
        .katex-container .katex-html {
          line-height: 1.4;
        }
        
        /* Responsive sizing */
        @media (max-width: 768px) {
          .block-math .katex {
            font-size: 1.1em;
          }
          
          .inline-math .katex {
            font-size: 1em;
          }
        }
      `}</style>
    </>
  )
}

// Hook para procesar texto con LaTeX
export function useKaTeXProcessor() {
  const processText = (text: string) => {
    const segments: Array<{ type: "text" | "math" | "block-math"; content: string }> = []

    // Primero procesamos las fórmulas de bloque $$...$$
    const blockMathRegex = /\$\$([\s\S]*?)\$\$/g
    const inlineMathRegex = /\$([^$\n]+?)\$/g

    let lastIndex = 0
    const allMatches: Array<{ type: "math" | "block-math"; content: string; start: number; end: number }> = []

    // Encontrar todas las coincidencias de bloque
    let blockMatch
    while ((blockMatch = blockMathRegex.exec(text)) !== null) {
      allMatches.push({
        type: "block-math",
        content: blockMatch[1].trim(),
        start: blockMatch.index,
        end: blockMatch.index + blockMatch[0].length,
      })
    }

    // Encontrar todas las coincidencias inline (que no estén dentro de bloques)
    let inlineMatch
    while ((inlineMatch = inlineMathRegex.exec(text)) !== null) {
      const isInsideBlock = allMatches.some(
        (blockMatch) =>
          blockMatch.type === "block-math" &&
          inlineMatch.index >= blockMatch.start &&
          inlineMatch.index < blockMatch.end,
      )

      if (!isInsideBlock) {
        allMatches.push({
          type: "math",
          content: inlineMatch[1].trim(),
          start: inlineMatch.index,
          end: inlineMatch.index + inlineMatch[0].length,
        })
      }
    }

    // Ordenar por posición
    allMatches.sort((a, b) => a.start - b.start)

    // Construir segmentos
    allMatches.forEach((match) => {
      // Agregar texto antes de la fórmula
      if (match.start > lastIndex) {
        const textContent = text.slice(lastIndex, match.start)
        if (textContent) {
          segments.push({ type: "text", content: textContent })
        }
      }

      // Agregar la fórmula
      segments.push({ type: match.type, content: match.content })
      lastIndex = match.end
    })

    // Agregar texto restante
    if (lastIndex < text.length) {
      const remainingText = text.slice(lastIndex)
      if (remainingText) {
        segments.push({ type: "text", content: remainingText })
      }
    }

    // Si no hay fórmulas, devolver todo como texto
    if (segments.length === 0) {
      segments.push({ type: "text", content: text })
    }

    return segments
  }

  return { processText }
}
