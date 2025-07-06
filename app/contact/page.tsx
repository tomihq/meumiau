import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Mail, Github, Twitter, Code } from "lucide-react"
export const dynamic = "force-static";
export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
     
      <section className="container mx-auto px-6 py-20">
        <div className="text-center mb-12 mt-16">
          <h1 className="text-4xl font-bold mb-4 pb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            {"Let's Connect!"}
          </h1>
          <p className="text-gray-400 font-mono">{"// Get in touch"}</p>
        </div>

        <div className="max-w-md mx-auto">
          <Card className="bg-black/20 backdrop-blur-md border-purple-500/30">
            <CardContent className="p-8 text-center">
              <div className="text-6xl mb-6">📧</div>
              <p className="text-gray-300 mb-6">¿Tienes un proyecto en mente? ¡Hablemos!</p>
              <div className="space-y-4">
                <Button className="w-full bg-purple-600 hover:bg-purple-700 hover:text-white text-white">
                  <Mail className="w-4 h-4 mr-2" />
                  Send Email
                </Button>
                <div className="flex gap-4">
                  <Button
                    variant="outline"
                    className="flex-1 border-purple-500/50 hover:bg-purple-500/20 bg-transparent hover:text-white text-white "
                  >
                    <Github className="w-4 h-4 mr-2" />
                    GitHub
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 border-purple-500/50 hover:bg-purple-500/20 bg-transparent hover:text-white text-white"
                  >
                    <Twitter className="w-4 h-4 mr-2" />
                    Twitter
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
