import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'next/router';
import { doc, getDoc, Firestore } from 'firebase/firestore';
import { db } from '../../../firebase/clientApp';
import type { Integration } from '../../../types/models';

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
        <Text>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>{error}</Text>
      </View>
    );
  }

  if (!integration) {
    return (
      <View style={styles.container}>
        <Text>No integration found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Integration Details</Text>
      <Text style={styles.text}>ID: {integration.id}</Text>
      <Text style={styles.text}>Account ID: {integration.accountId}</Text>
      <Text style={styles.text}>Account Slug: {integration.accountSlug}</Text>
      <Text style={styles.text}>Status: {integration.status}</Text>
      <Text style={styles.text}>
        Last Synced: {integration.lastSyncedAt?.toDate().toLocaleString()}
      </Text>
      {integration.error && (
        <Text style={[styles.text, styles.error]}>Error: {integration.error}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  text: {
    fontSize: 16,
    marginBottom: 10,
  },
  error: {
    color: 'red',
    fontSize: 16,
  },
});

export default IntegrationDetails;
