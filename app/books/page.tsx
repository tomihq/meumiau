import { Metadata } from "next";
import { NEXT_PUBLIC_URL } from "@/config";
import { BookList } from "./book-list";

export const dynamic = 'force-static';
export const revalidate =  604800;

export async function generateMetadata({
  params,
}): Promise<Metadata | undefined> {

  return {
    title: `Books`,
    description: `Books that I've read lately`,
    alternates: {
      canonical: `${NEXT_PUBLIC_URL}books`
    },
      
  };
}


export default async function BooksPage({params}) {
  return (
    <main className=" max-w-2xl mx-auto gap-4 min-h-screen">
        <div className="container max-w-2xl mx-auto px-6 py-20">
         <div className="text-left mb-12 mt-16">
          <h1 className="text-4xl font-bold mb-4 pb-4 bg-gradient-to-r text-white bg-clip-text text-transparent">
            Books that I recommend
          </h1>
        </div>
        <BookList/>

        </div>
       
       
      </main> 
  )
}