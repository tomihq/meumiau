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
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="space-y-4">
            {blogPosts.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`}>
                <div className="flex items-start gap-3 p-6   cursor-pointer rounded-none border-y border-gray-800">
                  <div className="w-2 h-2 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                  <div className="flex-1">
                    <h2 className="text-3xl text-gray-100 leading-10 font-bold hover:text-gray-400 transition-colors ">
                      {post.metadata.title}
                    </h2>
                    <p className="text-sm text-gray-500 mb-2">{new Date(post.metadata.publishedAt).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    }).toUpperCase()}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
