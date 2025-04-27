import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { useResponsive } from '../../../utils/useResponsive';
import { getResponsiveValues } from '../../../utils/layoutUtils';
import { fetchItemsByShelfId } from '../../../utils/firestoreUtils';
import { db } from '../../../firebase/clientApp';
import { doc, getDoc } from 'firebase/firestore';
import { BookCard } from '../../../components/BookCard';
import { ShelfHeader } from '../../../components/ShelfHeader';
import QRCodeComponent from '../../../components/QRCode';
import { useRouter } from 'next/router';
import SidePanel from '../../../components/SidePanel';
import { useUser } from '../../../hooks/useUser';
import { Book, BaseBook, BookMetadata, BookExtras } from '../../../types/book';
import { Shelf } from '../../../types/shelf';

interface _Column {
  width: number;
  margin: number;
  books: Book[];
}

const splitIntoColumns = (data: Book[], numColumns: number): Book[][] => {
  const columns: Book[][] = Array.from({ length: numColumns }, () => []);

  data.forEach((item: Book, index: number) => {
    columns[index % numColumns].push(item);
  });

  return columns;
};

const fetchBooksWithPrimaryColor = async (shelfId: string): Promise<Book[]> => {
  try {
    const shelfDoc = await getDoc(doc(db, 'shelves', shelfId));
    if (!shelfDoc.exists()) {
      throw new Error('Shelf not found');
    }

    const booksData = await fetchItemsByShelfId(shelfId);
    return booksData.map((book: Book) => {
      const baseBook: BaseBook = {
        id: book.id,
        title: book.title,
        author: book.author,
      };

      const metadata: BookMetadata = {
        coverImage: book.coverImage,
        description: book.description,
        isbn: book.isbn,
        pageCount: book.pageCount,
        publishedDate: book.publishedDate,
        publisher: book.publisher,
      };

      const extras: BookExtras = {
        primaryColor: book.primaryColor || null,
        canonicalURL: book.canonicalURL,
        userRating: book.userRating || null,
        userReview: book.userReview || null,
        sourceId: book.sourceId,
        sourceDisplayName: book.sourceDisplayName,
        updatedAt: book.updatedAt,
        createdAt: book.createdAt,
      };

      return {
        ...baseBook,
        ...metadata,
        ...extras,
      } as Book;
    });
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('An unknown error occurred');
  }
};

interface BookGridProps {
  columns: Book[][];
  cardWidth: number;
  margin: number;
}

const BookGrid: React.FC<BookGridProps> = ({ columns, cardWidth, margin }) => (
  <View style={styles.grid}>
    {columns.map((column: Book[], index: number) => (
      <View key={index} style={[styles.column, { width: cardWidth, marginHorizontal: margin }]}>
        {column.map((book: Book) => (
          <BookCard key={book.id} book={book} width={cardWidth} />
        ))}
      </View>
    ))}
  </View>
);

const ShelfPage: React.FC = () => {
  const router = useRouter();
  const { shelfId } = router.query as { shelfId: string };
  const [books, setBooks] = useState<Book[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { user, loading: userLoading, error: userError } = useUser();
  const userId = user?.userId;
  const [isPlaying, setIsPlaying] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isPanelVisible, setIsPanelVisible] = useState(false);
  const { width, isLoading } = useResponsive();
  const [shelf, setShelf] = useState<Shelf | null>(null);
  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

  const animationFrameIdRef = useRef<number | null>(null);

  const handleScroll = useCallback(() => {
    if (animationFrameIdRef.current) {
      cancelAnimationFrame(animationFrameIdRef.current);
    }
    animationFrameIdRef.current = requestAnimationFrame(() => {
      setScrollPosition(window.scrollY);
    });
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
    };
  }, [handleScroll]);

  useEffect(() => {
    if (!shelfId || userLoading) return;

    const fetchShelfDetails = async () => {
      try {
        const shelfDoc = await getDoc(doc(db, 'shelves', shelfId));
        if (shelfDoc.exists()) {
          const shelfData = shelfDoc.data() as Shelf;
          setShelf(shelfData);
        } else {
          throw new Error('Shelf not found.');
        }

        const booksWithColors = await fetchBooksWithPrimaryColor(shelfId);
        setBooks(booksWithColors);
      } catch (error) {
        if (error instanceof Error) {
          if (error.message === 'permission-denied') {
            setError('You do not have permission to view this shelf.');
          } else {
            setError(error.message || 'Failed to fetch shelf details or books.');
          }
        } else {
          setError('An unknown error occurred.');
        }
        console.error('Error fetching shelf details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchShelfDetails();
  }, [shelfId, userLoading]);

  const _handleRefresh = async () => {
    if (!userId) {
      setError('You must be logged in to refresh the shelf.');
      return;
    }

    setLoading(true);
    try {
      const booksWithColors = await fetchBooksWithPrimaryColor(shelfId);
      setBooks(booksWithColors);
    } catch (error) {
      setError('Failed to refresh shelf.');
    } finally {
      setLoading(false);
    }
  };

  if (userLoading || isLoading || loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (userError) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{userError.message || 'Authentication error'}</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (books.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.emptyText}>No books available.</Text>
      </View>
    );
  }

  const {
    columns: numColumns,
    cardWidth,
    margin,
  } = getResponsiveValues(isPanelVisible ? width - 350 : width);

  const columns = splitIntoColumns(books, numColumns);

  return (
    <View style={styles.container}>
      {shelf && (
        <ShelfHeader
          title={shelf.displayName || 'Untitled Shelf'}
          subtitle={shelf.sourceDisplayName || 'Unknown Source'}
          isPlaying={isPlaying}
          onPlayPausePress={() => setIsPlaying(!isPlaying)}
          scrollPosition={scrollPosition}
          onMenuToggle={() => setIsPanelVisible(!isPanelVisible)}
          isPanelVisible={isPanelVisible}
        />
      )}
      {books && <BookGrid columns={columns} cardWidth={cardWidth} margin={margin} />}
      {shelf && userId && (
        <SidePanel
          isVisible={isPanelVisible}
          onClose={() => setIsPanelVisible(false)}
          title={shelf.displayName || 'Untitled Shelf'}
          subtitle={shelf.sourceDisplayName || 'Unknown Source'}
          userId={userId}
          shelfId={shelfId}
        />
      )}
      {shelf && <QRCodeComponent url={currentUrl} size={100} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  grid: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  column: {
    flexDirection: 'column',
  },
  loadingText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  emptyText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
});

export default ShelfPage;
