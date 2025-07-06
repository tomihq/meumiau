import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Calendar, Tag, Code } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import type { JSX } from "react"
import { KaTeXRenderer } from "@/components/katex-renderer"
export const dynamic = "force-static";
const sampleNotes = [
  {
    id: 1,
    slug: "gradiente-descendente-ml",
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
    slug: "big-o-notation",
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
    slug: "distribuciones-probabilidad",
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

// Componente para renderizar contenido con KaTeX
function MarkdownWithKaTeX({ content }: { content: string }) {
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

export default function NotePage({ params }: { params: { slug: string } }) {
  const note = sampleNotes.find((n) => n.slug === params.slug)

  if (!note) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">

      <section className="container mx-auto px-6 py-20">
        <div className="max-w-4xl mx-auto">
          <Link href="/notes">
            <Button variant="outline" className="mb-6 mt-16 border-purple-500/50 hover:bg-purple-500/20 bg-transparent">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Notes
            </Button>
          </Link>

          <Card className="bg-black/20 backdrop-blur-md border-purple-500/30">
            <CardContent className="p-8">
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-4">{note.title}</h1>
                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {note.date}
                  </div>
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4" />
                    {note.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="bg-purple-500/20 text-purple-300 text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <MarkdownWithKaTeX content={note.content} />
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
