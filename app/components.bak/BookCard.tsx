import React from 'react';
import { View, Text, Image, StyleSheet, Pressable } from 'react-native';
import { Book } from '../types/book';

export interface BookCardProps {
  book: Book;
  width: number;
  onPress?: () => void;
}

export const BookCard: React.FC<BookCardProps> = ({ book, width, onPress }) => {
  const styles = StyleSheet.create({
    container: {
      width: width,
      backgroundColor: '#fff',
      borderRadius: 8,
      overflow: 'hidden',
      marginBottom: 16,
    },
    coverImage: {
      width: '100%',
      aspectRatio: 2 / 3,
      backgroundColor: book.primaryColor || '#f0f0f0',
    },
    info: {
      padding: 12,
    },
    title: {
      fontSize: 16,
      fontWeight: '600',
      marginBottom: 4,
    },
    author: {
      fontSize: 14,
      color: '#666',
    },
  });

  return (
    <Pressable onPress={onPress}>
      <View style={styles.container}>
        {book.coverImage ? (
          <Image
            source={{ uri: book.coverImage }}
            style={styles.coverImage}
            resizeMode='cover'
            alt={`Cover of ${book.title} by ${book.author}`}
          />
        ) : (
          <View style={styles.coverImage} />
        )}
        <View style={styles.info}>
          <Text style={styles.title} numberOfLines={2}>
            {book.title}
          </Text>
          <Text style={styles.author} numberOfLines={1}>
            {book.author}
          </Text>
        </View>
      </View>
    </Pressable>
  );
};
