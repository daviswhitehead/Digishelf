import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { db } from '../../../utils/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useUser } from '../../../utils/useUser';
import Sidebar from '../../../components/Sidebar';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

export default function Shelves() {
  const router = useRouter();
  const user = useUser();
  const [shelves, setShelves] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) return;

    const fetchShelves = async () => {
      try {
        const shelvesRef = collection(db, 'shelves');
        const q = query(shelvesRef, where('userId', '==', user.uid));
        const querySnapshot = await getDocs(q);

        const shelvesList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setShelves(shelvesList);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchShelves();
  }, [user]);

  const handleShelfClick = shelfId => {
    router.push(`/${user.uid}/shelves/${shelfId}`);
  };

  return (
    <View style={styles.container}>
      <Sidebar />
      <View style={styles.contentWrapper}>
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.title}>Your Shelves</Text>
          {error && <Text style={styles.errorText}>{error}</Text>}
          <View style={styles.cardContainer}>
            {shelves.map(shelf => (
              <TouchableOpacity
                key={shelf.id}
                style={styles.card}
                onPress={() => handleShelfClick(shelf.id)}
              >
                <Text style={styles.cardTitle}>{shelf.displayName}</Text>
                <Text style={styles.cardSubtitle}>{shelf.sourceDisplayName}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row', // Align sidebar and content side by side
    backgroundColor: '#000',
  },
  contentWrapper: {
    flex: 1, // Allow the content to take up the remaining space
    marginLeft: 250, // Match the width of the sidebar
  },
  content: {
    padding: 20,
  },
  title: {
    color: '#fff',
    fontSize: 24,
    marginBottom: 20,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    marginBottom: 20,
  },
  cardContainer: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 20,
  },
  card: {
    backgroundColor: '#1a1a1a',
    color: '#fff',
    padding: 15,
    borderRadius: 8,
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
    width: 250,
    cursor: 'pointer',
  },
  cardTitle: {
    marginBottom: 5,
    fontSize: 18,
    color: '#fff',
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#aaa',
  },
});
