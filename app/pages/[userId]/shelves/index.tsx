import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'next/router';
import { db } from '../../../firebase/clientApp';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useUser } from '../../../hooks/useUser';
import Sidebar from '../../../components/Sidebar';
import { Shelf } from '../../../types/shelf';

export default function Shelves() {
  const router = useRouter();
  const { user, loading: userLoading, error: userError } = useUser();
  const userId = user?.userId;
  const [shelves, setShelves] = useState<Shelf[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId || userLoading) return;

    const fetchShelves = async () => {
      try {
        const shelvesRef = collection(db, 'shelves');
        const q = query(shelvesRef, where('userId', '==', userId));
        const querySnapshot = await getDocs(q);

        const shelvesList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as Shelf[];
        setShelves(shelvesList);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchShelves();
  }, [userId, userLoading]);

  const handleShelfPress = (shelfId: string) => {
    if (!userId) return;
    router.push(`/${userId}/shelves/${shelfId}`);
  };

  if (userLoading || loading) {
    return (
      <View style={styles.container}>
        <Sidebar />
        <View style={styles.contentWrapper}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </View>
    );
  }

  if (userError) {
    return (
      <View style={styles.container}>
        <Sidebar />
        <View style={styles.contentWrapper}>
          <Text style={styles.errorText}>
            {userError instanceof Error ? userError.message : 'Authentication error'}
          </Text>
        </View>
      </View>
    );
  }

  if (!userId) {
    return (
      <View style={styles.container}>
        <Sidebar />
        <View style={styles.contentWrapper}>
          <Text style={styles.errorText}>Please sign in to view your shelves</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Sidebar />
      <View style={styles.contentWrapper}>
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.title}>Your Shelves</Text>
          {error && <Text style={styles.errorText}>{error}</Text>}
          {shelves.length === 0 ? (
            <Text style={styles.emptyText}>No shelves found</Text>
          ) : (
            <View style={styles.cardContainer}>
              {shelves.map(shelf => (
                <TouchableOpacity
                  key={shelf.id}
                  style={styles.card}
                  onPress={() => handleShelfPress(shelf.id)}
                >
                  <Text style={styles.cardTitle}>{shelf.displayName}</Text>
                  <Text style={styles.cardSubtitle}>{shelf.sourceDisplayName}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#000',
  },
  contentWrapper: {
    flex: 1,
    marginLeft: 250,
  },
  content: {
    padding: 20,
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  loadingText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  errorText: {
    color: '#ff4444',
    fontSize: 16,
    marginBottom: 20,
  },
  emptyText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  cardContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 20,
  },
  card: {
    backgroundColor: '#1a1a1a',
    padding: 15,
    borderRadius: 8,
    width: 250,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 5,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#aaa',
  },
});
