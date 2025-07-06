import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
export const dynamic = "force-static";
export default function SkillsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
    

      <section className="container mx-auto px-6 py-20">
        <div className="text-center mb-12 mt-16">
          <h1 className="text-4xl font-bold mb-4 pb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Skills & Technologies
          </h1>
          <p className="text-gray-400 font-mono">{"// My tech arsenal"}</p>
        </div>

        <div className="grid gap-8 max-w-4xl mx-auto">
          {/* About Me */}
          <Card className="bg-black/20 backdrop-blur-md border-purple-500/30">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="text-2xl">👨‍💻</div>
                <h2 className="text-xl font-semibold text-purple-300">About My Expertise</h2>
              </div>
              <p className="text-gray-300 leading-relaxed mb-4">
                Software Engineer with over 4 years of experience developing diverse applications for users worldwide. I
                am a curious learner, constantly seeking to refine my skills and knowledge in every domain I engage
                with.
              </p>
              <p className="text-gray-300 leading-relaxed">
                When building products, I am my first user, and I am only satisfied when the individuals for whom I
                designed the solution are equally content. Solving complex problems and enabling more with less is what
                truly excites me.
              </p>
            </CardContent>
          </Card>

          {/* Backend Technologies */}
          <Card className="bg-black/20 backdrop-blur-md border-purple-500/30">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="text-2xl">⚙️</div>
                <h2 className="text-xl font-semibold text-purple-300">Backend Development</h2>
              </div>
              <p className="text-gray-300 mb-3">Primarily with OOP principles</p>
              <div className="flex flex-wrap gap-3">
                <Badge
                  variant="secondary"
                  className="bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 transition-colors"
                >
                  <span className="mr-2">🔷</span>
                  TypeScript (Node.js, Express, Nest)
                </Badge>
                <Badge
                  variant="secondary"
                  className="bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30 transition-colors"
                >
                  <span className="mr-2">🐘</span>
                  PHP (Vanilla)
                </Badge>
                <Badge
                  variant="secondary"
                  className="bg-green-500/20 text-green-300 hover:bg-green-500/30 transition-colors"
                >
                  <span className="mr-2">🐍</span>
                  Python (Django)
                </Badge>
                <Badge
                  variant="secondary"
                  className="bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 transition-colors"
                >
                  <span className="mr-2">⚡</span>
                  C++, Rust, Java
                </Badge>
                <Badge
                  variant="secondary"
                  className="bg-pink-500/20 text-pink-300 hover:bg-pink-500/30 transition-colors"
                >
                  <span className="mr-2">λ</span>
                  Haskell (Lambda Calculus)
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Frontend Technologies */}
          <Card className="bg-black/20 backdrop-blur-md border-purple-500/30">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="text-2xl">🎨</div>
                <h2 className="text-xl font-semibold text-purple-300">Frontend Development</h2>
              </div>
              <p className="text-gray-300 mb-3">Languages, Libraries & Frameworks</p>
              <div className="flex flex-wrap gap-3">
                <Badge
                  variant="secondary"
                  className="bg-yellow-500/20 text-yellow-300 hover:bg-yellow-500/30 transition-colors"
                >
                  <span className="mr-2">🟨</span>
                  JavaScript, HTML, CSS
                </Badge>
                <Badge
                  variant="secondary"
                  className="bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 transition-colors"
                >
                  <span className="mr-2">⚛️</span>
                  React (SPA)
                </Badge>
                <Badge
                  variant="secondary"
                  className="bg-gray-500/20 text-gray-300 hover:bg-gray-500/30 transition-colors"
                >
                  <span className="mr-2">▲</span>
                  Next.js (from v11)
                </Badge>
                <Badge
                  variant="secondary"
                  className="bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 transition-colors"
                >
                  <span className="mr-2">🎨</span>
                  Tailwind, Bootstrap, Material-UI
                </Badge>
                <Badge
                  variant="secondary"
                  className="bg-orange-500/20 text-orange-300 hover:bg-orange-500/30 transition-colors"
                >
                  <span className="mr-2">📚</span>
                  Storybook
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Cloud & DevOps */}
          <Card className="bg-black/20 backdrop-blur-md border-purple-500/30">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="text-2xl">☁️</div>
                <h2 className="text-xl font-semibold text-purple-300">Cloud & DevOps</h2>
              </div>
              <div className="flex flex-wrap gap-3">
                <Badge
                  variant="secondary"
                  className="bg-orange-500/20 text-orange-300 hover:bg-orange-500/30 transition-colors"
                >
                  <span className="mr-2">☁️</span>
                  AWS
                </Badge>
                <Badge
                  variant="secondary"
                  className="bg-blue-600/20 text-blue-300 hover:bg-blue-600/30 transition-colors"
                >
                  <span className="mr-2">🌊</span>
                  DigitalOcean
                </Badge>
                <Badge
                  variant="secondary"
                  className="bg-gray-800/20 text-gray-300 hover:bg-gray-800/30 transition-colors"
                >
                  <span className="mr-2">▲</span>
                  Vercel
                </Badge>
                <Badge
                  variant="secondary"
                  className="bg-orange-400/20 text-orange-300 hover:bg-orange-400/30 transition-colors"
                >
                  <span className="mr-2">🔶</span>
                  Cloudflare
                </Badge>
                <Badge
                  variant="secondary"
                  className="bg-blue-600/20 text-blue-300 hover:bg-blue-600/30 transition-colors"
                >
                  <span className="mr-2">🐳</span>
                  Docker
                </Badge>
                <Badge
                  variant="secondary"
                  className="bg-green-600/20 text-green-300 hover:bg-green-600/30 transition-colors"
                >
                  <span className="mr-2">🔧</span>
                  NGINX, PM2
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Databases & Tools */}
          <Card className="bg-black/20 backdrop-blur-md border-purple-500/30">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="text-2xl">🗄️</div>
                <h2 className="text-xl font-semibold text-purple-300">Databases & Tools</h2>
              </div>
              <div className="flex flex-wrap gap-3">
                <Badge
                  variant="secondary"
                  className="bg-green-600/20 text-green-300 hover:bg-green-600/30 transition-colors"
                >
                  <span className="mr-2">🍃</span>
                  MongoDB
                </Badge>
                <Badge
                  variant="secondary"
                  className="bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 transition-colors"
                >
                  <span className="mr-2">🐘</span>
                  PostgreSQL
                </Badge>
                <Badge
                  variant="secondary"
                  className="bg-orange-500/20 text-orange-300 hover:bg-orange-500/30 transition-colors"
                >
                  <span className="mr-2">🐬</span>
                  MySQL
                </Badge>
                <Badge variant="secondary" className="bg-red-500/20 text-red-300 hover:bg-red-500/30 transition-colors">
                  <span className="mr-2">⚡</span>
                  Redis
                </Badge>
                <Badge
                  variant="secondary"
                  className="bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 transition-colors"
                >
                  <span className="mr-2">🔗</span>
                  Prisma, TypeORM
                </Badge>
                <Badge
                  variant="secondary"
                  className="bg-pink-500/20 text-pink-300 hover:bg-pink-500/30 transition-colors"
                >
                  <span className="mr-2">🧪</span>
                  Jest, Selenium
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Problem-Solving Methodology */}
          <Card className="bg-black/20 backdrop-blur-md border-purple-500/30">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="text-2xl">🧠</div>
                <h2 className="text-xl font-semibold text-purple-300">Problem-Solving Methodology</h2>
              </div>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <span className="text-purple-400 font-bold">1.</span>
                  <p className="text-gray-300">
                    <strong className="text-white">Problem Definition & Solution Design:</strong> Analyze the problem
                    and conceptualize the solution considering design, scope, and accessibility.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-purple-400 font-bold">2.</span>
                  <p className="text-gray-300">
                    <strong className="text-white">Efficient Implementation:</strong> Dedicate focused time to implement
                    the solution.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-purple-400 font-bold">3.</span>
                  <p className="text-gray-300">
                    <strong className="text-white">Functionality & Refinement:</strong> Ensure it works, then iterate to
                    enhance performance.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-purple-400 font-bold">4.</span>
                  <p className="text-gray-300">
                    <strong className="text-white">Client Satisfaction:</strong> Continuously iterate until client
                    satisfaction is achieved.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
