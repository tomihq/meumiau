import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Github,
  Twitter,
  Mail,
  Sparkles,
  Heart,
  Zap,
  Coffee,
} from "lucide-react"
import Image from "next/image";
import ArgentinaClock from "@/components/argentina-clock";

export const dynamic = "force-static";
export default function HomePage() {
  return (
    <div className="min-h-screen">
      <div className="relative z-10">
        {/* Hero Section */}
        <section className="container mx-auto px-6 py-20 text-center">
          <div className="mb-8 mt-7">
            <div className="w-32 h-32 mx-auto mb-6 relative">
              <div className="w-full h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full p-1">
                <div className="w-full h-full bg-slate-800 rounded-full flex items-center justify-center text-4xl">
                  <Image src={"/tom2.png"} alt={"tom"} layout="fill" className={"rounded-full"}/>
                </div>
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-transparent rounded-full flex items-center justify-center animate-bounce">
                ✨
              </div>
            </div>
          </div>

          <h1 className="text-6xl font-bold mb-4 pb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent inline-block">
            {"Hi! I'm Tomás"}
          </h1>
          <span className="text-yellow-400 text-6xl ml-2 inline-block">✨</span>

          <p className="text-2xl text-purple-300 mb-6 font-mono">Computer Scientist</p>
          <ArgentinaClock />
          <Card className="max-w-2xl mx-auto bg-black/20 backdrop-blur-md border-purple-500/30">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-purple-400" />
                <span className="font-mono text-purple-300">About me</span>
              </div>
              <p className="text-gray-300 leading-relaxed">
                {
                  "I'm a software engineer passionate about building exceptional digital experiences. I specialize in modern technologies like React, Next.js, and Node.js. When I'm not coding, you'll probably find me watching anime or playing video games 🎮"
                }
              </p>
              <div className="flex items-center justify-center gap-4 mt-6">
                <Badge variant="secondary" className="bg-purple-500/20 text-purple-300">
                  <Heart className="w-3 h-3 mr-1" />
                  Anime Lover
                </Badge>
                <Badge variant="secondary" className="bg-pink-500/20 text-pink-300">
                  <Coffee className="w-3 h-3 mr-1" />
                  Coffee Addict
                </Badge>
                <Badge variant="secondary" className="bg-blue-500/20 text-blue-300">
                  <Zap className="w-3 h-3 mr-1" />
                  Tech Enthusiast
                </Badge>
              </div>
            </CardContent>
          </Card>

          <div className="flex items-center justify-center gap-4 mt-8">
            <Button variant="outline" size="sm" className="border-purple-500/50 hover:bg-purple-500/20 bg-transparent hover:text-white">
              <Github className="w-4 h-4 mr-2" />
              GitHub
            </Button>
            <Button variant="outline" size="sm" className="border-purple-500/50 hover:bg-purple-500/20 bg-transparent hover:text-white">
              <Twitter className="w-4 h-4 mr-2" />
              Twitter
            </Button>
            <Button variant="outline" size="sm" className="border-purple-500/50 hover:bg-purple-500/20 bg-transparent hover:text-white">
              <Mail className="w-4 h-4 mr-2" />
              Contact
            </Button>
          </div>
        </section>
      </div>

      
    </div>
  )
}
