import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Calendar, Code } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import type { JSX } from "react"
export const dynamic = "force-static";
const blogPosts = [
  {
    id: 1,
    slug: "autenticacion-dos-aplicaciones",
    title: "Autenticación entre dos aplicaciones",
    date: "2024-01-20",
    content: `# Autenticación entre múltiples aplicaciones

La autenticación entre múltiples aplicaciones es un desafío común en arquitecturas modernas. En este artículo exploraremos diferentes estrategias para implementar un sistema seguro y escalable.

## JWT (JSON Web Tokens)

Los JWT son una excelente opción para la autenticación stateless entre servicios:

\`\`\`javascript
const jwt = require('jsonwebtoken');

// Generar token
const token = jwt.sign(
  { userId: user.id, email: user.email },
  process.env.JWT_SECRET,
  { expiresIn: '1h' }
);

// Verificar token
const decoded = jwt.verify(token, process.env.JWT_SECRET);
\`\`\`

## OAuth 2.0

Para casos más complejos, OAuth 2.0 proporciona un framework robusto:

1. **Authorization Code Flow**: Ideal para aplicaciones web
2. **Client Credentials Flow**: Perfecto para comunicación server-to-server
3. **Resource Owner Password Credentials**: Para aplicaciones de confianza

## Mejores Prácticas

- Usar HTTPS siempre
- Implementar refresh tokens
- Validar tokens en cada request
- Configurar CORS correctamente
- Implementar rate limiting

¡La seguridad es fundamental! 🔒`,
  },
  {
    id: 2,
    slug: "sistemas-diseno",
    title: "Sistemas de Diseño (Design Systems)",
    date: "2024-01-18",
    content: `# Sistemas de Diseño (Design Systems)

Un sistema de diseño es mucho más que una librería de componentes. Es la base que garantiza consistencia y escalabilidad en productos digitales.

## ¿Qué incluye un Design System?

### Tokens de Diseño
- Colores
- Tipografía
- Espaciado
- Sombras
- Bordes

### Componentes
- Botones
- Formularios
- Navegación
- Modales
- Cards

### Patrones
- Layouts
- Flujos de usuario
- Estados de carga
- Manejo de errores

## Implementación Técnica

\`\`\`css
/* Design Tokens */
:root {
  --color-primary: #6366f1;
  --color-secondary: #8b5cf6;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
}

/* Componente Button */
.btn {
  padding: var(--spacing-sm) var(--spacing-md);
  background: var(--color-primary);
  border-radius: 0.375rem;
  font-weight: 500;
}
\`\`\`

## Herramientas Recomendadas

- **Figma**: Para diseño y prototipado
- **Storybook**: Para documentar componentes
- **Chromatic**: Para testing visual
- **Design Tokens**: Para sincronizar diseño y código

Un buen sistema de diseño ahorra tiempo y reduce inconsistencias. ¡Invierte en él! 🎨`,
  },
]

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = blogPosts.find((p) => p.slug === params.slug)

  if (!post) {
    notFound()
  }

  const renderContent = (content: string) => {
    const lines = content.split("\n")
    const elements: JSX.Element[] = []
    let currentParagraph: string[] = []
    let inCodeBlock = false
    let codeBlockContent: string[] = []

    const flushParagraph = () => {
      if (currentParagraph.length > 0) {
        const paragraphText = currentParagraph.join("\n")
        elements.push(
          <p key={elements.length} className="text-gray-300 leading-relaxed mb-4">
            <span dangerouslySetInnerHTML={{ __html: processMarkdownText(paragraphText) }} />
          </p>,
        )
        currentParagraph = []
      }
    }

    const processMarkdownText = (text: string) => {
      return text
        .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>')
        .replace(/\*(.*?)\*/g, '<em class="text-purple-200 italic">$1</em>')
        .replace(/`(.*?)`/g, '<code class="bg-slate-800 px-2 py-1 rounded text-green-400 font-mono text-sm">$1</code>')
    }

    lines.forEach((line) => {
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
    return elements
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
     

      <section className="container mx-auto px-6 py-20">
        <div className="max-w-4xl mx-auto">
          <Link href="/blog">
            <Button variant="outline" className="mb-6 mt-16 border-purple-500/50 hover:bg-purple-500/20 bg-transparent">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blog
            </Button>
          </Link>

          <Card className="bg-black/20 backdrop-blur-md border-purple-500/30">
            <CardContent className="p-8">
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-4">{post.title}</h1>
                <div className="flex items-center gap-1 text-sm text-gray-400">
                  <Calendar className="w-4 h-4" />
                  {post.date}
                </div>
              </div>

              <div className="prose prose-invert max-w-none">{renderContent(post.content)}</div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
