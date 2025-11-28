import { Card, CardContent } from "@/components/ui/card"
import {
  Sparkles,
} from "lucide-react"
import dynamicImport from "next/dynamic"
import SocialButtons from "@/components/social-buttons";
import { CVDownloadModal } from "@/components/cv-download-modal";
import Hero from "@/components/hero";

const ArgentinaClock = dynamicImport(() => import("@/components/argentina-clock"));

export const dynamic = "force-static";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <div className="relative z-10">
        <section className="container mx-auto px-6 py-20 text-center">
          <Hero/>
          <ArgentinaClock />
          <Card className="max-w-2xl mx-auto bg-black/20 backdrop-blur-md border-gray-500/30">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-gray-400" />
                <span className="font-mono text-gray-300">About me</span>
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
