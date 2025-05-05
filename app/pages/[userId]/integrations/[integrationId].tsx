import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'next/router';
import { doc, getDoc, Firestore } from 'firebase/firestore';
import { db } from '../../../firebase/clientApp';
import type { Integration } from '../../../types/models';
import Sidebar from '../../../components/Sidebar';

const IntegrationDetails = () => {
  const router = useRouter();
  const { integrationId } = router.query;
  const [integration, setIntegration] = useState<Integration | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!integrationId || typeof integrationId !== 'string') {
      setError('Invalid integration ID');
      setLoading(false);
      return;
    }

    const fetchIntegrationData = async () => {
      if (!db) {
        setError('Database is not initialized');
        setLoading(false);
        return;
      }

      try {
        const integrationDocRef = doc(db as Firestore, 'integrations', integrationId);
        const integrationDoc = await getDoc(integrationDocRef);

        if (integrationDoc.exists()) {
          const data = integrationDoc.data();
          setIntegration({
            id: integrationDoc.id,
            ...data,
          } as Integration);
        } else {
          setError('Integration not found');
        }
      } catch (err) {
        console.error('Error fetching integration:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch integration');
      } finally {
        setLoading(false);
      }
    };

    fetchIntegrationData();
  }, [integrationId]);

  if (loading) {
    return (
      <View style={styles.container}>
        <Sidebar />
        <View style={styles.contentWrapper}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Sidebar />
        <View style={styles.contentWrapper}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      </View>
    );
  }

  if (!integration) {
    return (
      <View style={styles.container}>
        <Sidebar />
        <View style={styles.contentWrapper}>
          <Text style={styles.emptyText}>No integration found</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Sidebar />
      <View style={styles.contentWrapper}>
        <View style={styles.content}>
          <Text style={styles.title}>Integration Details</Text>
          <Text style={styles.text}>ID: {integration.id}</Text>
          <Text style={styles.text}>Account ID: {integration.accountId}</Text>
          <Text style={styles.text}>Account Slug: {integration.accountSlug}</Text>
          <Text style={styles.text}>Status: {integration.status}</Text>
          <Text style={styles.text}>
            Last Synced: {integration.lastSyncedAt?.toDate().toLocaleString()}
          </Text>
          {integration.error && (
            <Text style={[styles.text, styles.errorText]}>Error: {integration.error}</Text>
          )}
        </View>
      </View>
    </View>
  );
};

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
  text: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 10,
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
  },
  emptyText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
});

export default IntegrationDetails;
