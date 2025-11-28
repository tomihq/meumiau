import type { Book } from "./book-list"

interface BookCardProps {
  book: Book
}

export function BookCard({ book }: BookCardProps) {
  return (
    <article className="border-b border-border pb-6 last:border-0 border-gray-600">
      <div className="mb-2 flex items-baseline justify-between gap-4">
        <h2 className="text-2xl  text-gray-100 font-medium">{book.title}</h2>
        <span className="text-sm text-gray-100">{book.rating}/5</span>
      </div>
      <p className="mb-2 text-sm text-gray-100">
        {book.author} · {book.year}
      </p>
      <p className="text-sm leading-relaxed text-gray-300">{book.summary}</p>
    </article>
  )
}