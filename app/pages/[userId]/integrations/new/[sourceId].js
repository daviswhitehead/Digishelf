import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { db } from "../../../../utils/firebase";
import {
  doc,
  getDoc,
  addDoc,
  collection,
  updateDoc,
  serverTimestamp,
  runTransaction,
} from "firebase/firestore";
import Sidebar from "../../../../components/Sidebar";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";

export default function NewIntegration() {
  const router = useRouter();
  const { userId, sourceId } = router.query;
  const [sourceData, setSourceData] = useState(null);
  const [myBooksURL, setMyBooksURL] = useState("");
  const [accountSlug, setAccountSlug] = useState("");
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (!sourceId) return;

    const fetchSourceData = async () => {
      try {
        const sourceDocRef = doc(db, "sources", sourceId);
        const sourceDoc = await getDoc(sourceDocRef);

        if (sourceDoc.exists()) {
          setSourceData(sourceDoc.data());
        } else {
          setError("Source not found.");
        }
      } catch (err) {
        setError(err.message);
      }
    };

    fetchSourceData();
  }, [sourceId]);

  const deriveAccountSlug = (url) => {
    try {
      const urlParts = new URL(url).pathname.split("/");
      return urlParts[urlParts.length - 1] || "";
    } catch {
      return "";
    }
  };

  const handleSave = async () => {
    try {
      if (!sourceData) {
        setError("Source data is not loaded.");
        return;
      }

      const integrationsRef = collection(db, "integrations");

      await runTransaction(db, async (transaction) => {
        // Generate a new document reference with a unique ID
        const newIntegrationRef = doc(integrationsRef);

        // Create the new integration document with the generated ID
        transaction.set(newIntegrationRef, {
          ...sourceData, // Inherit all fields from the source document
          accountSlug, // Override with form input
          myBooksURL, // Override with form input
          integrationId: newIntegrationRef.id, // Include the generated ID
          userId, // Add userId
          createdAt: serverTimestamp(), // New createdAt field
          updatedAt: serverTimestamp(), // New updatedAt field
        });
      });

      setSuccessMessage("Integration created successfully!");
      setTimeout(() => {
        router.push(`/${userId}/integrations`);
      }, 1000); // Reduced delay to 1 second
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

  if (!sourceData) {
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
          <Text style={styles.title}>
            Create a new {sourceData.displayName} Integration
          </Text>
          <View style={styles.formGroup}>
            <Text style={styles.label}>My Books URL:</Text>
            <Text style={styles.helperText}>
              <a
                href="https://www.goodreads.com/review/list/"
                target="_blank"
                rel="noopener noreferrer"
                style={styles.link}
              >
                Click here
              </a>
              , login, then copy and paste the URL here.
            </Text>
            <TextInput
              value={myBooksURL}
              onChangeText={(text) => {
                setMyBooksURL(text);
                setAccountSlug(deriveAccountSlug(text));
              }}
              style={styles.input}
            />
          </View>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Account Slug:</Text>
            <TextInput
              value={accountSlug}
              editable={false}
              style={styles.inputDisabled}
            />
          </View>
          <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
          {successMessage && (
            <Text style={styles.successText}>{successMessage}</Text>
          )}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row", // Align sidebar and content side by side
    backgroundColor: "#000",
  },
  contentWrapper: {
    flex: 1, // Allow the content to take up the remaining space
    marginLeft: 250, // Match the width of the sidebar
  },
  content: {
    padding: 20,
  },
  title: {
    color: "#fff",
    fontSize: 24,
    marginBottom: 20,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    color: "#fff",
    marginBottom: 5,
  },
  input: {
    backgroundColor: "#1a1a1a",
    color: "#fff",
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  inputDisabled: {
    backgroundColor: "#333",
    color: "#aaa",
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  saveButton: {
    backgroundColor: "#4caf50",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
  },
  errorText: {
    color: "red",
    fontSize: 16,
  },
  loadingText: {
    color: "#fff",
    fontSize: 16,
  },
  successText: {
    color: "green",
    fontSize: 16,
    marginTop: 10,
  },
  helperText: {
    color: "#aaa",
    fontSize: 14,
    marginBottom: 5,
  },
  link: {
    color: "#4caf50",
    textDecorationLine: "underline",
  },
});
