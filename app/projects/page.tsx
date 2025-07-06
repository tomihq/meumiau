import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Code, Database, Star, Github } from "lucide-react"
export const dynamic = "force-static";
export default function ProjectsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
    
      <section className="container mx-auto px-6 py-20">
        <div className="text-center mb-12 mt-16">
          <h1 className="text-4xl font-bold mb-4 pb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Currently Working On
          </h1>
          <p className="text-gray-400 font-mono">{"// Featured projects"}</p>
        </div>

        <div className="max-w-2xl mx-auto">
          <Card className="bg-black/20 backdrop-blur-md border-purple-500/30 hover:border-purple-400/50 transition-colors">
            <CardContent className="p-8 text-center">
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center text-3xl text-white">
                <Database className="w-12 h-12" />
              </div>
              <h2 className="text-2xl font-bold text-purple-300 mb-2">Custom ORM Project</h2>
              <p className="text-gray-300 mb-6 leading-relaxed">
                Developing a robust and type-safe Object-Relational Mapper from scratch, focusing on performance,
                developer experience, and seamless database interactions for modern applications.
              </p>
              <div className="flex items-center justify-center gap-4">
                <Badge
                  variant="secondary"
                  className="bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 transition-colors cursor-pointer"
                >
                  <Star className="w-3 h-3 mr-1" />
                  Documentation
                </Badge>
                <Badge
                  variant="secondary"
                  className="bg-pink-500/20 text-pink-300 hover:bg-pink-500/30 transition-colors cursor-pointer"
                >
                  <Github className="w-3 h-3 mr-1" />
                  Source Code
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
