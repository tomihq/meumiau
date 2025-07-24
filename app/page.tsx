import { Card, CardContent } from "@/components/ui/card"
import {
  Sparkles,
} from "lucide-react"
import Image from "next/image";
import ArgentinaClock from "@/components/argentina-clock";
import SocialButtons from "@/components/social-buttons";
import { CVDownloadModal } from "@/components/cv-download-modal";

export const dynamic = "force-static";
export default function HomePage() {
  return (
    <div className="min-h-screen">
      <div className="relative z-10">
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
                  "I'm a software engineer passionate about crafting exceptional digital experiences. I specialize in modern web technologies such as React, Next.js, and Node.js. Outside of coding, I'm often reading or exploring new areas of learning to continually grow both personally and professionally."
                }
              </p>
            
            </CardContent>
          </Card>

          <div className="flex flex-col items-center justify-center">
           <div className="flex flex-row items-center justify-center w-full gap-6 my-6">
           <SocialButtons/>
           </div>
           <CVDownloadModal/>

          </div>

          

        </section>
      </div>

      
    </div>
  )
}
