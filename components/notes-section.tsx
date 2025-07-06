"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Calculator, Code, Brain, Lightbulb, ArrowLeft, Calendar, Tag } from "lucide-react"
import { KaTeXRenderer, useKaTeXProcessor } from "./katex-renderer"
import type { JSX } from "react"

const sampleNotes = [
  {
    id: 1,
    title: "Gradiente Descendente en ML",
    category: "mathematics",
    tags: ["calculus", "ml", "optimization"],
    date: "2024-01-15",
    content: `# Gradiente Descendente en Machine Learning

El **gradiente descendente** es el algoritmo fundamental para optimizar funciones de costo en machine learning.

## La Fórmula Principal

La actualización de parámetros sigue esta regla simple:

$$\\theta_{t+1} = \\theta_t - \\alpha \\nabla J(\\theta_t)$$

Donde $\\alpha$ es la tasa de aprendizaje y $\\nabla J(\\theta_t)$ es el gradiente.

## Función de Costo Cuadrática

Para regresión lineal, minimizamos:

$$J(\\theta) = \\frac{1}{2m} \\sum_{i=1}^{m} (h_\\theta(x^{(i)}) - y^{(i)})^2$$

Su gradiente es:

$$\\frac{\\partial J}{\\partial \\theta_j} = \\frac{1}{m} \\sum_{i=1}^{m} (h_\\theta(x^{(i)}) - y^{(i)}) x_j^{(i)}$$

## Tipos de Gradiente Descendente

### Batch Gradient Descent
Usa todo el dataset: $\\theta = \\theta - \\alpha \\nabla J(\\theta)$

### Stochastic Gradient Descent  
Una muestra a la vez: $\\theta = \\theta - \\alpha \\nabla J_i(\\theta)$

### Mini-batch
Combina ambos enfoques con lotes de tamaño $b$.

¡Simple pero poderoso! 🚀`,
  },
  {
    id: 2,
    title: "Big O Notation Explicada",
    category: "technology",
    tags: ["algorithms", "complexity"],
    date: "2024-01-10",
    content: `# Análisis de Complejidad con Big O

La notación Big O describe cómo crece el tiempo de ejecución de un algoritmo.

## Definición Matemática

Decimos que $f(n) = O(g(n))$ si:

$$\\exists c > 0, n_0 > 0 : 0 \\leq f(n) \\leq c \\cdot g(n) \\text{ para } n \\geq n_0$$

## Complejidades Comunes

| Algoritmo | Complejidad | Ejemplo |
|-----------|-------------|---------|
| Búsqueda lineal | $O(n)$ | Array scan |
| Búsqueda binaria | $O(\\log n)$ | Sorted array |
| Merge sort | $O(n \\log n)$ | Divide & conquer |
| Bubble sort | $O(n^2)$ | Nested loops |

## Análisis de Loops

### Loop simple
\`\`\`python
for i in range(n):
    print(i)  # O(n)
\`\`\`

### Loops anidados
\`\`\`python
for i in range(n):
    for j in range(n):
        print(i, j)  # O(n²)
\`\`\`

## Recurrencias

Para Merge Sort:
$$T(n) = 2T(n/2) + O(n)$$

Por el Teorema Maestro: $T(n) = O(n \\log n)$

## Sumas Útiles

$$\\sum_{i=1}^{n} i = \\frac{n(n+1)}{2} = O(n^2)$$

$$\\sum_{i=0}^{\\log n} 2^i = 2^{\\log n + 1} - 1 = O(n)$$

¡Optimizar es matemática pura! 📊`,
  },
  {
    id: 3,
    title: "Distribuciones de Probabilidad",
    category: "mathematics",
    tags: ["probability", "statistics"],
    date: "2024-01-05",
    content: `# Distribuciones de Probabilidad Esenciales

Las distribuciones modelan la incertidumbre en datos y predicciones.

## Distribución Normal

La más importante en estadística:

$$f(x) = \\frac{1}{\\sigma\\sqrt{2\\pi}} e^{-\\frac{(x-\\mu)^2}{2\\sigma^2}}$$

Con $\\mu$ = media y $\\sigma$ = desviación estándar.

## Propiedades Clave

- **Esperanza**: $E[X] = \\mu$
- **Varianza**: $\\text{Var}(X) = \\sigma^2$
- **Regla 68-95-99.7**: $P(\\mu - \\sigma \\leq X \\leq \\mu + \\sigma) \\approx 0.68$

## Teorema del Límite Central

Para muestras grandes:

$$\\bar{X} \\sim N\\left(\\mu, \\frac{\\sigma^2}{n}\\right)$$

## Distribución Binomial

Para $n$ ensayos con probabilidad $p$:

$$P(X = k) = \\binom{n}{k} p^k (1-p)^{n-k}$$

**Aproximación normal**: Si $np > 5$ y $n(1-p) > 5$:
$$X \\sim N(np, np(1-p))$$

## Regla de Bayes

$$P(A|B) = \\frac{P(B|A) \\cdot P(A)}{P(B)}$$

Fundamental para machine learning bayesiano.

## Distribución Exponencial

Para tiempos de espera:

$$f(x) = \\lambda e^{-\\lambda x}, \\quad x \\geq 0$$

Con $E[X] = \\frac{1}{\\lambda}$ y $\\text{Var}(X) = \\frac{1}{\\lambda^2}$.

¡La probabilidad está en todas partes! 🎲`,
  },
]

const categoryIcons = {
  mathematics: Calculator,
  technology: Code,
  thoughts: Brain,
  tips: Lightbulb,
}

const categoryColors = {
  mathematics: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  technology: "bg-green-500/20 text-green-300 border-green-500/30",
  thoughts: "bg-purple-500/20 text-purple-300 border-purple-500/30",
  tips: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
}

// Componente para renderizar contenido con KaTeX
function MarkdownWithKaTeX({ content }: { content: string }) {
  const { processText } = useKaTeXProcessor()

  const renderContent = () => {
    const lines = content.split("\n")
    const elements: JSX.Element[] = []
    let currentParagraph: string[] = []
    let inCodeBlock = false
    let codeBlockContent: string[] = []
    let inTable = false
    let tableRows: string[] = []

    const flushParagraph = () => {
      if (currentParagraph.length > 0) {
        const paragraphText = currentParagraph.join("\n")
        const segments = processText(paragraphText)

        elements.push(
          <p key={elements.length} className="text-gray-300 leading-relaxed mb-4">
            {segments.map((segment, index) => {
              if (segment.type === "text") {
                return <span key={index} dangerouslySetInnerHTML={{ __html: processMarkdownText(segment.content) }} />
              } else if (segment.type === "math") {
                return <KaTeXRenderer key={index} math={segment.content} />
              } else if (segment.type === "block-math") {
                return <KaTeXRenderer key={index} math={segment.content} block />
              }
              return null
            })}
          </p>,
        )
        currentParagraph = []
      }
    }

    const flushTable = () => {
      if (tableRows.length > 0) {
        const [header, separator, ...rows] = tableRows
        elements.push(
          <div key={elements.length} className="overflow-x-auto my-4">
            <table className="min-w-full border border-slate-700 rounded-lg">
              <thead className="bg-slate-800/50">
                <tr>
                  {header
                    .split("|")
                    .slice(1, -1)
                    .map((cell, index) => (
                      <th
                        key={index}
                        className="px-4 py-2 text-left text-purple-300 font-semibold border-b border-slate-700"
                      >
                        {cell.trim()}
                      </th>
                    ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, rowIndex) => (
                  <tr key={rowIndex} className="border-b border-slate-700/50">
                    {row
                      .split("|")
                      .slice(1, -1)
                      .map((cell, cellIndex) => {
                        const segments = processText(cell.trim())
                        return (
                          <td key={cellIndex} className="px-4 py-2 text-gray-300">
                            {segments.map((segment, segIndex) => {
                              if (segment.type === "text") {
                                return (
                                  <span
                                    key={segIndex}
                                    dangerouslySetInnerHTML={{ __html: processMarkdownText(segment.content) }}
                                  />
                                )
                              } else if (segment.type === "math") {
                                return <KaTeXRenderer key={segIndex} math={segment.content} />
                              }
                              return null
                            })}
                          </td>
                        )
                      })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>,
        )
        tableRows = []
        inTable = false
      }
    }

    const processMarkdownText = (text: string) => {
      return text
        .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>')
        .replace(/\*(.*?)\*/g, '<em class="text-purple-200 italic">$1</em>')
        .replace(/`(.*?)`/g, '<code class="bg-slate-800 px-2 py-1 rounded text-green-400 font-mono text-sm">$1</code>')
    }

    lines.forEach((line) => {
      // Detectar tablas
      if (line.includes("|") && !inCodeBlock) {
        if (!inTable) {
          flushParagraph()
          inTable = true
        }
        tableRows.push(line)
        return
      } else if (inTable) {
        flushTable()
      }

      if (line.startsWith("```")) {
        if (inCodeBlock) {
          // Fin del bloque de código
          elements.push(
            <pre
              key={elements.length}
              className="bg-slate-800/50 p-4 rounded-lg text-green-400 font-mono text-sm overflow-x-auto my-4 border border-slate-700/50"
            >
              {codeBlockContent.join("\n")}
            </pre>,
          )
          codeBlockContent = []
          inCodeBlock = false
        } else {
          // Inicio del bloque de código
          flushParagraph()
          inCodeBlock = true
        }
        return
      }

      if (inCodeBlock) {
        codeBlockContent.push(line)
        return
      }

      if (line.startsWith("# ")) {
        flushParagraph()
        elements.push(
          <h1 key={elements.length} className="text-3xl font-bold text-white mb-6 mt-8">
            {line.substring(2)}
          </h1>,
        )
      } else if (line.startsWith("## ")) {
        flushParagraph()
        elements.push(
          <h2 key={elements.length} className="text-2xl font-bold text-purple-300 mt-8 mb-4">
            {line.substring(3)}
          </h2>,
        )
      } else if (line.startsWith("### ")) {
        flushParagraph()
        elements.push(
          <h3 key={elements.length} className="text-xl font-semibold text-purple-300 mt-6 mb-3">
            {line.substring(4)}
          </h3>,
        )
      } else if (line.trim() === "") {
        flushParagraph()
      } else {
        currentParagraph.push(line)
      }
    })

    flushParagraph()
    flushTable()
    return elements
  }

  return <div className="prose prose-invert max-w-none">{renderContent()}</div>
}

export default function NotesSection() {
  const [selectedNote, setSelectedNote] = useState<(typeof sampleNotes)[0] | null>(null)

  if (selectedNote) {
    return (
      <section className="container mx-auto px-6 py-20">
        <div className="max-w-4xl mx-auto">
          <Button
            onClick={() => setSelectedNote(null)}
            variant="outline"
            className="mb-6 border-purple-500/50 hover:bg-purple-500/20 bg-transparent"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Notes
          </Button>

          <Card className="bg-black/20 backdrop-blur-md border-purple-500/30">
            <CardContent className="p-8">
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-4">{selectedNote.title}</h1>
                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {selectedNote.date}
                  </div>
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4" />
                    {selectedNote.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="bg-purple-500/20 text-purple-300 text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <MarkdownWithKaTeX content={selectedNote.content} />
            </CardContent>
          </Card>
        </div>
      </section>
    )
  }

  return (
    <section className="container mx-auto px-6 py-20">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          My Notes 📝
        </h2>
        <p className="text-gray-400 font-mono">{"// Math, code & random thoughts"}</p>
      </div>

      <div className="max-w-4xl mx-auto grid gap-6">
        {sampleNotes.map((note) => {
          const IconComponent = categoryIcons[note.category as keyof typeof categoryIcons]
          const colorClass = categoryColors[note.category as keyof typeof categoryColors]

          return (
            <Card
              key={note.id}
              className="bg-black/20 backdrop-blur-md border-purple-500/30 hover:border-purple-400/50 transition-all cursor-pointer hover:scale-[1.02]"
              onClick={() => setSelectedNote(note)}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${colorClass}`}>
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white hover:text-purple-300 transition-colors">
                        {note.title}
                      </h3>
                      <p className="text-sm text-gray-400">{note.date}</p>
                    </div>
                  </div>
                  <BookOpen className="w-5 h-5 text-purple-400" />
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {note.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="bg-purple-500/20 text-purple-300 text-xs">
                      #{tag}
                    </Badge>
                  ))}
                </div>

                <p className="text-gray-300 text-sm line-clamp-2">
                  {note.content
                    .split("\n")
                    .find((line) => line.trim() && !line.startsWith("#"))
                    ?.substring(0, 120)}
                  ...
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </section>
  )
}
