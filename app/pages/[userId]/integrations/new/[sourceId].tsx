import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'next/router';
import { db } from '../../../../firebase/clientApp';
import { doc, getDoc, collection, serverTimestamp, runTransaction } from 'firebase/firestore';
import Sidebar from '../../../../components/Sidebar';

interface SourceData {
  displayName: string;
  sourceId: string;
  sourceDisplayName: string;
  createdAt: Date;
  updatedAt: Date;
}

export default function NewIntegration() {
  const router = useRouter();
  const { userId, sourceId } = router.query;
  const [sourceData, setSourceData] = useState<SourceData | null>(null);
  const [myBooksURL, setMyBooksURL] = useState('');
  const [accountSlug, setAccountSlug] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (!sourceId || typeof sourceId !== 'string') return;

    const fetchSourceData = async () => {
      try {
        const sourceDocRef = doc(db, 'sources', sourceId);
        const sourceDoc = await getDoc(sourceDocRef);

        if (sourceDoc.exists()) {
          setSourceData(sourceDoc.data() as SourceData);
        } else {
          setError('Source not found.');
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'An error occurred while fetching source data'
        );
      }
    };

    fetchSourceData();
  }, [sourceId]);

  const deriveAccountSlug = (url: string): string => {
    try {
      const urlParts = new URL(url).pathname.split('/');
      return urlParts[urlParts.length - 1] || '';
    } catch {
      return '';
    }
  };

  const handleSave = async () => {
    try {
      if (!sourceData) {
        setError('Source data is not loaded.');
        return;
      }

      if (!userId || typeof userId !== 'string') {
        setError('User ID is required.');
        return;
      }

      const integrationsRef = collection(db, 'integrations');

      await runTransaction(db, async transaction => {
        const newIntegrationRef = doc(integrationsRef);

        transaction.set(newIntegrationRef, {
          displayName: sourceData.displayName,
          accountSlug,
          myBooksURL,
          integrationId: newIntegrationRef.id,
          userId,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      });

      setSuccessMessage('Integration created successfully!');
      setTimeout(() => {
        router.push(`/${userId}/integrations`);
      }, 1000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while saving';
      setError(errorMessage);
    }
  };

  const handleOpenURL = (url: string) => {
    window.open(url, '_blank');
  };

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

  if (!sourceData) {
    return (
      <View style={styles.container}>
        <Sidebar />
        <View style={styles.contentWrapper}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Sidebar />
      <View style={styles.contentWrapper}>
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.title}>Create a new {sourceData.displayName} Integration</Text>
          <View style={styles.formGroup}>
            <Text style={styles.label}>My Books URL:</Text>
            <View style={styles.helperTextContainer}>
              <Text style={styles.helperText}>
                <Text
                  style={styles.link}
                  onPress={() => handleOpenURL('https://www.goodreads.com/review/list/')}
                >
                  Click here
                </Text>
                , login, then copy and paste the URL here.
              </Text>
            </View>
            <TextInput
              value={myBooksURL}
              onChangeText={(text: string) => {
                setMyBooksURL(text);
                setAccountSlug(deriveAccountSlug(text));
              }}
              style={styles.input}
              placeholderTextColor='#666'
            />
          </View>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Account Slug:</Text>
            <TextInput value={accountSlug} editable={false} style={styles.inputDisabled} />
          </View>
          <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
          {successMessage && <Text style={styles.successText}>{successMessage}</Text>}
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
  formGroup: {
    marginBottom: 20,
  },
  label: {
    color: '#fff',
    marginBottom: 5,
  },
  helperTextContainer: {
    marginBottom: 10,
  },
  helperText: {
    color: '#ccc',
    fontSize: 14,
  },
  input: {
    backgroundColor: '#1a1a1a',
    color: '#fff',
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    width: '100%',
    maxWidth: 500,
  },
  inputDisabled: {
    backgroundColor: '#1a1a1a',
    color: '#999',
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#666',
    width: '100%',
    maxWidth: 500,
  },
  saveButton: {
    backgroundColor: '#4A90E2',
    padding: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 20,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  errorText: {
    color: '#ff4444',
    fontSize: 16,
  },
  loadingText: {
    color: '#fff',
    fontSize: 16,
  },
  successText: {
    color: '#4CAF50',
    fontSize: 16,
    marginTop: 10,
  },
  link: {
    color: '#4A90E2',
    textDecorationLine: 'underline',
  },
});
