import { Metadata } from "next";
import { getBlogPosts } from "@/app/db/blog";
import { notFound } from "next/navigation";
import { formatDate } from "@/helpers/dates";
import { CustomMDX } from "@/components/mdx";
import { NEXT_PUBLIC_URL } from "@/config";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export const dynamic = 'force-static';
export const revalidate =  604800;

export async function generateMetadata({
  params,
}): Promise<Metadata | undefined> {
  let post = getBlogPosts().find((post) => post.slug === params.slug);
  if (!post) {
    return;
  }

  let {
    title,
    publishedAt: publishedTime,
    summary: description,
    image,
  } = post.metadata;


  return {
    title: `${title}`,
    description,
    alternates: {
      canonical: `${NEXT_PUBLIC_URL}blog/${post.slug}`
    },
    openGraph: {
      title,
      description,
      type: 'article',
      publishedTime,
      url: `${NEXT_PUBLIC_URL}blog/${post.slug}`,
      
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}


export default async function PostPage({params}) {
  let post = getBlogPosts().find((post) => post.slug === params.slug);
  if (!post) {
    notFound();
  }

  return (
        <main className=" max-w-4xl mx-auto gap-4 py-20 ">
         <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: post.metadata.title,
            datePublished: post.metadata.publishedAt,
            dateModified: post.metadata.publishedAt,
            description: post.metadata.summary,
            image: post.metadata.image
              ? `${NEXT_PUBLIC_URL}${post.metadata.image}`
              : `${NEXT_PUBLIC_URL}/og?title=${post.metadata.title}`,
            url: `${NEXT_PUBLIC_URL}/blog/${post.slug}`,
            author: {
              '@type': 'Person',
              name: "Tomás Hernández",
            },
          }),
        }}
      />
       <Link href="/blog">
          <Button variant="outline" className="ml-2  md:ml-0 mb-6 mt-16 border-purple-500/50 hover:bg-purple-500/20 bg-transparent hover:text-white">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blog
          </Button>
        </Link>
        <article className="prose prose-gray min-h-screen border-0 md:border bg-black/20 md:rounded-lg backdrop-blur-md border-purple-500/30 p-8">
          
          <div className="space-y-2 not-prose">
            <h1 className="text-4xl">
              {post.metadata.title.toString()}
            </h1>
            <p className="text-gray-500 dark:text-gray-400">By Tomás Hernández, Posted on {formatDate(post.metadata.publishedAt)} </p>
          </div>
        
         <CustomMDX source={post.content} />
        </article>
       
      </main> 
  )
}