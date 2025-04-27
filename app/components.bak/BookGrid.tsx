import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Book } from '../types/book';
import { BookCard } from './BookCard';

interface BookGridProps {
  columns: Book[][];
  cardWidth: number;
  margin: number;
}

export const BookGrid: React.FC<BookGridProps> = ({ columns, cardWidth, margin }) => {
  return (
    <View style={styles.container}>
      {columns.map((column, columnIndex) => (
        <View
          key={columnIndex}
          style={[styles.column, { marginRight: columnIndex < columns.length - 1 ? margin : 0 }]}
        >
          {column.map((book, _bookIndex) => (
            <View key={book.id} style={[styles.card, { marginBottom: margin }]}>
              <BookCard book={book} width={cardWidth} />
            </View>
          ))}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  column: {
    flexDirection: 'column',
  },
  card: {
    // Additional card styling if needed
  },
});
