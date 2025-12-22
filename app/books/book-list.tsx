import { BookCard } from "./book-card"

export interface Book {
  title: string
  author: string
  year: string
  summary: string
  url: string; 
}

const books: Book[] = [
  {
    title: "Enquiridión", 
    author: "Epicteto",
    year: "108 d.C",
    url: "https://www.amazon.com/-/es/MANUAL-VIDA-Consejos-estoicos-Spanish/dp/8419538299",
    summary: "There are things you can control and others you can't. Stop worrying about what you can't control, and take action on what you can"
  },
  {
    title: "Metamorphosis",
    author: "Franz Kafka",
    year: "1915",
    summary:
      "It portrays the loss of identity and the rejection he faces after his transformation incredibly well. It touches on social pressure, loneliness, misunderstanding, and the guilt for something he never chose. It leaves a strong impression about how we treat those who no longer fit in.",
    url: 'https://www.amazon.com/-/es/Metamorphosis-Franz-Kafka/dp/1557427666'
  },
   {
    title: "Believe It to Achieve It",
    author: "Brian Tracy",
    year: "2017",
    summary:
      "Argues that personal outcomes stem from internal belief systems shaped by what Tracy calls mental laws—principles linking thoughts, emotions, and actions. By reframing attention toward possibility rather than constraint, individuals can shift their behavior and expand what they consider achievable.",
    url: 'https://www.amazon.com/-/es/Believe-Achieve-BRIAN-TRACY/dp/052554142X'
  },
  

 
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
