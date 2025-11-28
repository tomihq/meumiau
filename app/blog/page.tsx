import { Card, CardContent } from "@/components/ui/card"
import { Code } from "lucide-react"
import Link from "next/link"
import { getBlogPosts } from "../db/blog";
export const dynamic = "force-static";
export default function BlogPage() {
const blogPosts = getBlogPosts()
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 text-white">
      

      <section className="container mx-auto px-6 py-20">
        <div className="text-center mb-12 mt-16">
          <h1 className="text-4xl font-bold mb-4 text-white bg-clip-text text-transparent">
            Latest Posts
          </h1>
          <p className="text-gray-400 font-mono">{"// Knowledge sharing"}</p>
        </div>

        <div className="max-w-2xl mx-auto">
          <Card className="bg-black/20 backdrop-blur-md border-gray-500/30">
            <CardContent className="p-6">
              <div className="space-y-4">
                {blogPosts.map((post) => (
                  <Link key={post.slug} href={`/blog/${post.slug}`}>
                    <div className="flex items-start gap-3 p-4 rounded-lg hover:bg-gray-500/10 transition-colors cursor-pointer">
                      <div className="w-2 h-2 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                      <div className="flex-1">
                        <h2 className="text-2xl text-gray-100 leading-10 font-bold hover:text-gray-300 transition-colors ">
                          {post.metadata.title}
                        </h2>
                        <p className="text-sm text-gray-500 mb-2">{post.metadata.publishedAt}</p>
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
