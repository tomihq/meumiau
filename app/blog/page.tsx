import { Card, CardContent } from "@/components/ui/card"
import { Code } from "lucide-react"
import Link from "next/link"
export const dynamic = "force-static";
const blogPosts = [
  {
    id: 1,
    slug: "autenticacion-dos-aplicaciones",
    title: "Autenticación entre dos aplicaciones",
    date: "2024-01-20",
    excerpt: "Cómo implementar un sistema de autenticación seguro entre múltiples aplicaciones usando JWT y OAuth.",
  },
  {
    id: 2,
    slug: "sistemas-diseno",
    title: "Sistemas de Diseño (Design Systems)",
    date: "2024-01-18",
    excerpt: "La importancia de crear y mantener un sistema de diseño coherente en proyectos grandes.",
  },
  {
    id: 3,
    slug: "dns-domain-name-system",
    title: "Todo acerca de DNS (Domain Name System)",
    date: "2024-01-15",
    excerpt: "Una guía completa sobre cómo funciona el DNS y su importancia en la web moderna.",
  },
  {
    id: 4,
    slug: "docker-principiantes",
    title: "Docker para principiantes",
    date: "2024-01-12",
    excerpt: "Introducción práctica a Docker: contenedores, imágenes y orquestación básica.",
  },
  {
    id: 5,
    slug: "laravel-php-ubuntu",
    title: "Laravel PHP en Ubuntu",
    date: "2024-01-10",
    excerpt: "Guía paso a paso para configurar un entorno de desarrollo Laravel en Ubuntu.",
  },
  {
    id: 6,
    slug: "deployment-nextjs-14",
    title: "Deployment de una app de Next.js 14",
    date: "2024-01-08",
    excerpt: "Mejores prácticas para desplegar aplicaciones Next.js 14 en producción.",
  },
  {
    id: 7,
    slug: "nodejs-ubuntu",
    title: "Node.js en Ubuntu",
    date: "2024-01-05",
    excerpt: "Instalación y configuración de Node.js en Ubuntu para desarrollo backend.",
  },
  {
    id: 8,
    slug: "programacion-orientada-objetos",
    title: "Programación Orientada a Objetos",
    date: "2024-01-03",
    excerpt: "Conceptos fundamentales de POO: encapsulación, herencia, polimorfismo y abstracción.",
  },
  {
    id: 9,
    slug: "patrones-diseno-factory-method",
    title: "Patrones de Diseño - Factory Method",
    date: "2024-01-01",
    excerpt: "Implementación y casos de uso del patrón Factory Method en diferentes lenguajes.",
  },
]

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      

      <section className="container mx-auto px-6 py-20">
        <div className="text-center mb-12 mt-16">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Latest Posts
          </h1>
          <p className="text-gray-400 font-mono">{"// Knowledge sharing"}</p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Card className="bg-black/20 backdrop-blur-md border-purple-500/30">
            <CardContent className="p-6">
              <div className="space-y-4">
                {blogPosts.map((post) => (
                  <Link key={post.id} href={`/blog/${post.slug}`}>
                    <div className="flex items-start gap-3 p-4 rounded-lg hover:bg-purple-500/10 transition-colors cursor-pointer">
                      <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                      <div className="flex-1">
                        <h2 className="text-gray-300 font-bold hover:text-purple-300 transition-colors mb-1">
                          {post.title}
                        </h2>
                        <p className="text-sm text-gray-500 mb-2">{post.date}</p>
                        <p className="text-sm text-gray-400">{post.excerpt}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
