import type { Book } from "./book-list"

interface BookCardProps {
  book: Book
}

export function BookCard({ book }: BookCardProps) {
  return (
    <article className="pb-2 last:border-0 border-gray-600">
      <div className="mb-2 flex items-baseline justify-between gap-4">
        <p className="text-lg font-sans text-gray-100 font-bold border-b-2 border-b-gray-700 ">
          <a href={book.url + '?ref=tomihq.com'}>{book.title}</a>
        </p>
      </div>
      <p className="mb-2 text-sm text-gray-100">
        {book.author} · {book.year}
      </p>
      <p className="text-sm leading-relaxed text-gray-300">{book.summary}</p>
    </article>
  )
}