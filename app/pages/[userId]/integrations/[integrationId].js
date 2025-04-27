import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { db } from '../../../utils/firebase';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import Sidebar from '../../../components/Sidebar';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

export default function Integration() {
  const router = useRouter();
  const { userId, integrationId } = router.query;
  const [integrationData, setIntegrationData] = useState(null);
  const [myBooksURL, setMyBooksURL] = useState('');
  const [accountSlug, setAccountSlug] = useState('');
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (!userId || !integrationId) return;

    const fetchIntegrationData = async () => {
      try {
        const integrationDocRef = doc(db, 'integrations', integrationId);
        const integrationDoc = await getDoc(integrationDocRef);

        if (integrationDoc.exists()) {
          const data = integrationDoc.data();
          setIntegrationData(data);
          setMyBooksURL(data.myBooksURL || '');
          setAccountSlug(data.myBooksURL ? deriveAccountSlug(data.myBooksURL) : '');
        } else {
          setError('Integration not found.');
        }
      } catch (err) {
        setError(err.message);
      }
    };

    fetchIntegrationData();
  }, [userId, integrationId]);

  const deriveAccountSlug = url => {
    try {
      const urlParts = new URL(url).pathname.split('/');
      return urlParts[urlParts.length - 1] || '';
    } catch {
      return '';
    }
  };

  const handleSave = async () => {
    try {
      const integrationDocRef = doc(db, 'integrations', integrationId);
      await updateDoc(integrationDocRef, {
        myBooksURL,
      });
      setSuccessMessage('Changes saved successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async () => {
    try {
      const integrationDocRef = doc(db, 'integrations', integrationId);
      await deleteDoc(integrationDocRef);
      router.push(`/${userId}/integrations`);
    } catch (err) {
      setError(err.message);
    }
  };

  if (error) {
    return (
      <View style={styles.container}>
        <Sidebar />
        <View style={styles.content}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      </View>
    );
  }

  if (!integrationData) {
    return (
      <View style={styles.container}>
        <Sidebar />
        <View style={styles.content}>
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
          <Text style={styles.title}>Your {integrationData.displayName} Integration</Text>
          <View style={styles.formGroup}>
            <Text style={styles.label}>My Books URL:</Text>
            <Text style={styles.helperText}>
              <a
                href='https://www.goodreads.com/review/list/'
                target='_blank'
                rel='noopener noreferrer'
                style={styles.link}
              >
                Click here
              </a>
              , login, then copy and paste the URL here.
            </Text>
            <TextInput
              value={myBooksURL}
              onChangeText={text => {
                setMyBooksURL(text);
                setAccountSlug(deriveAccountSlug(text));
              }}
              style={styles.input}
            />
          </View>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Account Slug:</Text>
            <TextInput value={accountSlug} editable={false} style={styles.inputDisabled} />
          </View>
          <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleDelete} style={styles.deleteButton}>
            <Text style={styles.deleteButtonText}>Delete</Text>
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
  formGroup: {
    marginBottom: 20,
  },
  label: {
    color: '#fff',
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#1a1a1a',
    color: '#fff',
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  inputDisabled: {
    backgroundColor: '#333',
    color: '#aaa',
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  saveButton: {
    backgroundColor: '#4caf50',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 10,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  deleteButton: {
    backgroundColor: '#ff4d4d',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
  loadingText: {
    color: '#fff',
    fontSize: 16,
  },
  successText: {
    color: 'green',
    fontSize: 16,
    marginTop: 10,
  },
  helperText: {
    color: '#aaa',
    fontSize: 14,
    marginBottom: 5,
  },
  link: {
    color: '#4caf50',
    textDecorationLine: 'underline',
  },
});
