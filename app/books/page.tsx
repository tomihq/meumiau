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
    <main className=" max-w-4xl mx-auto gap-4 min-h-screen">
        <div className="max-w-lg container mx-auto px-6 py-28 md:py-32">
          <h1 className="text-3xl font-bold mb-6">Books that I recommend</h1>
        <BookList/>

        </div>
       
       
      </main> 
  )
}