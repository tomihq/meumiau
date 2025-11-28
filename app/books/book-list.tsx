import { BookCard } from "./book-card"

export interface Book {
  title: string
  author: string
  year: number
  rating: number
  summary: string
}

const books: Book[] = [
  {
    title: "Metamorphosis",
    author: "Franz Kafka",
    year: 1915,
    rating: 4,
    summary:
      "It portrays the loss of identity and the rejection he faces after his transformation incredibly well. It touches on social pressure, loneliness, misunderstanding, and the guilt for something he never chose. It leaves a strong impression about how we treat those who no longer fit in.",
  },
   {
    title: "Believe It to Achieve It",
    author: "Brian Tracy",
    year: 2017,
    rating: 4,
    summary:
      "Argues that personal outcomes stem from internal belief systems shaped by what Tracy calls mental laws—principles linking thoughts, emotions, and actions. By reframing attention toward possibility rather than constraint, individuals can shift their behavior and expand what they consider achievable.",
  }

 
]

export function BookList() {
  return (
    <div className="space-y-6">
      {books.map((book, index) => (
        <BookCard key={index} book={book} />
      ))}
    </div>
  )
}
