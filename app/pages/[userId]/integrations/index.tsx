import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { db } from '../../../firebase/clientApp';
import {
  collection,
  query,
  where,
  getDocs,
  setDoc,
  doc,
  serverTimestamp,
  DocumentData,
  QueryDocumentSnapshot,
} from 'firebase/firestore';
import { useUser } from '../../../hooks/useUser';
import Sidebar from '../../../components/Sidebar';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import type { Integration, Source } from '../../../types/integration';

export default function Integrations(): JSX.Element {
  const router = useRouter();
  const { userId, loading, error: userError } = useUser();
  const [enabledIntegrations, setEnabledIntegrations] = useState<Integration[]>([]);
  const [availableIntegrations, setAvailableIntegrations] = useState<Source[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId || loading) return;

    const fetchIntegrations = async () => {
      try {
        // Fetch enabled integrations
        const integrationsRef = collection(db, 'integrations');
        const integrationsQuery = query(integrationsRef, where('userId', '==', userId));
        const integrationsSnapshot = await getDocs(integrationsQuery);
        const enabled = integrationsSnapshot.docs.map(
          (doc: QueryDocumentSnapshot<DocumentData>) => ({
            id: doc.id,
            ...doc.data(),
          })
        ) as Integration[];

        // Fetch available integrations (sources)
        const sourcesRef = collection(db, 'sources');
        const sourcesSnapshot = await getDocs(sourcesRef);
        const available = sourcesSnapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => ({
          id: doc.id,
          ...doc.data(),
        })) as Source[];

        // Filter out duplicates by displayName
        const enabledDisplayNames = new Set(enabled.map(integration => integration.displayName));
        const filteredAvailable = available.filter(
          source => !enabledDisplayNames.has(source.displayName)
        );

        setEnabledIntegrations(enabled);
        setAvailableIntegrations(filteredAvailable);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      }
    };

    fetchIntegrations();
  }, [userId, loading]);

  const handleIntegrationClick = (integrationId: string) => {
    if (!userId) return;
    router.push(`/${userId}/integrations/${integrationId}`);
  };

  const handleEnableIntegration = async (source: Source) => {
    if (!userId) return;

    try {
      if (source.displayName === 'Goodreads') {
        router.push(`/${userId}/integrations/new/${source.id}`);
        return;
      }

      // Logic to enable an integration (e.g., create a new document in the integrations collection)
      const integrationsRef = collection(db, 'integrations');
      await setDoc(doc(integrationsRef), {
        userId,
        displayName: source.displayName,
        type: source.displayName.toLowerCase() as 'goodreads' | 'boardgamegeek',
        myBooksURL: '', // This will be set later in the integration flow
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      // Refresh the integrations
      setEnabledIntegrations(prev => [
        ...prev,
        {
          id: '',
          userId,
          displayName: source.displayName,
          type: source.displayName.toLowerCase() as 'goodreads' | 'boardgamegeek',
          myBooksURL: '', // This will be set later in the integration flow
        },
      ]);
      setAvailableIntegrations(prev =>
        prev.filter(item => item.displayName !== source.displayName)
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Sidebar />
        <View style={styles.contentWrapper}>
          <Text style={styles.title}>Loading...</Text>
        </View>
      </View>
    );
  }

  if (userError || !userId) {
    return (
      <View style={styles.container}>
        <Sidebar />
        <View style={styles.contentWrapper}>
          <Text style={styles.errorText}>
            {userError?.message || 'Please sign in to view integrations'}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Sidebar />
      <View style={styles.contentWrapper}>
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.title}>Enabled Integrations</Text>
          {error && <Text style={styles.errorText}>{error}</Text>}
          <View style={styles.cardContainer}>
            {enabledIntegrations.map(integration => (
              <TouchableOpacity
                key={integration.id}
                style={styles.card}
                onPress={() => integration.id && handleIntegrationClick(integration.id)}
              >
                <Text style={styles.cardTitle}>{integration.displayName}</Text>
                <Text style={styles.cardSubtitle}>Connected</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={[styles.title, { marginTop: 40 }]}>Available Integrations</Text>
          <View style={styles.cardContainer}>
            {availableIntegrations.map(source => (
              <TouchableOpacity
                key={source.id}
                style={styles.card}
                onPress={() => handleEnableIntegration(source)}
              >
                <Text style={styles.cardTitle}>{source.displayName}</Text>
                <Text style={styles.cardSubtitle}>
                  {source.shelves?.join(' · ') || 'No shelves available'}
                </Text>
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
