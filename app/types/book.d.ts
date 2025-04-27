export interface Book {
  id: string;
  title: string;
  author: string;
  coverImage: string;
  canonicalURL: string;
  userRating: number | null;
  userReview: string | null;
  primaryColor: string | null;
  dateAdded?: string;
  dateRead?: string;
  readCount?: number;
}

export interface BookCardProps {
  book: Book;
  cardWidth: number;
  margin: number;
}
