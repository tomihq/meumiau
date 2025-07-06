import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Calculator, Code, Brain, Lightbulb } from "lucide-react"
import Link from "next/link"
export const dynamic = "force-static";
const sampleNotes = [
  {
    id: 1,
    slug: "c-plus-plus-basics",
    title: "C++ Basics",
    category: "technology",
   tags: ["cpp", "programming-basics", "compilers", "types", "control-flow"],
    date: "2024-07-22",
  }
  
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

export default function NotesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">

      <section className="container mx-auto px-6 py-20">
        <div className="text-center mb-12 mt-16">
          <h1 className="text-4xl font-bold mb-4 pb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            My Notes 
          </h1>
          
          <p className="text-gray-400 font-mono">{"// Math, code & random thoughts"}</p>
        </div>

        <div className="max-w-4xl mx-auto grid gap-6">
          {sampleNotes.map((note) => {
            const IconComponent = categoryIcons[note.category as keyof typeof categoryIcons]
            const colorClass = categoryColors[note.category as keyof typeof categoryColors]

            return (
              <Link key={note.id} href={`/notes/${note.slug}`}>
                <Card className="bg-black/20 backdrop-blur-md border-purple-500/30 hover:border-purple-400/50 transition-all cursor-pointer hover:scale-[1.02]">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${colorClass}`}>
                          <IconComponent className="w-5 h-5" />
                        </div>
                        <div>
                          <h2 className="text-xl font-bold text-white hover:text-purple-300 transition-colors">
                            {note.title}
                          </h2>
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

                    <p className="text-gray-300 text-sm line-clamp-2">{note.excerpt}</p>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      </section>
    </div>
  )
}
