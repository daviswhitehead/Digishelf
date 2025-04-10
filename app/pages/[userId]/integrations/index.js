import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { db } from "../../../utils/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  setDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { useUser } from "../../../utils/useUser";
import Sidebar from "../../../components/Sidebar";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";

export default function Integrations() {
  const router = useRouter();
  const user = useUser();
  const [enabledIntegrations, setEnabledIntegrations] = useState([]);
  const [availableIntegrations, setAvailableIntegrations] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) return;

    const fetchIntegrations = async () => {
      try {
        // Fetch enabled integrations
        const integrationsRef = collection(db, "integrations");
        const integrationsQuery = query(
          integrationsRef,
          where("userId", "==", user.uid)
        );
        const integrationsSnapshot = await getDocs(integrationsQuery);
        const enabled = integrationsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Fetch available integrations (sources)
        const sourcesRef = collection(db, "sources");
        const sourcesSnapshot = await getDocs(sourcesRef);
        const available = sourcesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Filter out duplicates by displayName
        const enabledDisplayNames = new Set(
          enabled.map((integration) => integration.displayName)
        );
        const filteredAvailable = available.filter(
          (source) => !enabledDisplayNames.has(source.displayName)
        );

        setEnabledIntegrations(enabled);
        setAvailableIntegrations(filteredAvailable);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchIntegrations();
  }, [user]);

  const handleIntegrationClick = (integrationId) => {
    router.push(`/${user.uid}/integrations/${integrationId}`);
  };

  const handleEnableIntegration = async (source) => {
    try {
      if (source.displayName === "Goodreads") {
        router.push(`/${user.uid}/integrations/new/${source.id}`);
        return;
      }
      // Logic to enable an integration (e.g., create a new document in the integrations collection)
      const integrationsRef = collection(db, "integrations");
      await setDoc(doc(integrationsRef), {
        userId: user.uid,
        displayName: source.displayName,
        sourceId: source.id,
        createdAt: serverTimestamp(),
      });

      // Refresh the integrations
      setEnabledIntegrations((prev) => [
        ...prev,
        { displayName: source.displayName, sourceId: source.id },
      ]);
      setAvailableIntegrations((prev) =>
        prev.filter((item) => item.displayName !== source.displayName)
      );
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <View style={styles.container}>
      <Sidebar />
      <View style={styles.contentWrapper}>
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.title}>Enabled Integrations</Text>
          {error && <Text style={styles.errorText}>{error}</Text>}
          <View style={styles.cardContainer}>
            {enabledIntegrations.map((integration) => (
              <TouchableOpacity
                key={integration.id}
                style={styles.card}
                onPress={() => handleIntegrationClick(integration.id)}
              >
                <Text style={styles.cardTitle}>{integration.displayName}</Text>
                <Text style={styles.cardSubtitle}>
                  {integration.shelves?.join(" · ")}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={[styles.title, { marginTop: 40 }]}>
            Available Integrations
          </Text>
          <View style={styles.cardContainer}>
            {availableIntegrations.map((source) => (
              <TouchableOpacity
                key={source.id}
                style={styles.card}
                onPress={() => handleEnableIntegration(source)}
              >
                <Text style={styles.cardTitle}>{source.displayName}</Text>
                <Text style={styles.cardSubtitle}>
                  {source.shelves?.join(" · ") || "No shelves available"}
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
  errorText: {
    color: "red",
    fontSize: 16,
    marginBottom: 20,
  },
  cardContainer: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 20,
  },
  card: {
    backgroundColor: "#1a1a1a",
    color: "#fff",
    padding: 15,
    borderRadius: 8,
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
    width: 250,
    cursor: "pointer",
  },
  cardTitle: {
    marginBottom: 5,
    fontSize: 18,
    color: "#fff",
  },
  cardSubtitle: {
    fontSize: 14,
    color: "#aaa",
  },
});
