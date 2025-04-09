import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { db } from "../../../utils/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useUser } from "../../../utils/useUser";

export default function Integrations() {
  const router = useRouter();
  const user = useUser();
  const [integrations, setIntegrations] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) return;

    const fetchIntegrations = async () => {
      try {
        const integrationsRef = collection(db, "integrations");
        const q = query(integrationsRef, where("userId", "==", user.uid));
        const querySnapshot = await getDocs(q);

        const integrationsList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setIntegrations(integrationsList);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchIntegrations();
  }, [user]);

  const handleIntegrationClick = (integrationId) => {
    router.push(`/${user.uid}/integrations/${integrationId}`);
  };

  return (
    <div
      style={{ padding: "20px", backgroundColor: "#000", minHeight: "100vh" }}
    >
      <h1 style={{ color: "#fff" }}>Your Integrations</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
        {integrations.map((integration) => (
          <div
            key={integration.id}
            style={{
              backgroundColor: "#1a1a1a",
              color: "#fff",
              padding: "15px",
              borderRadius: "8px",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
              cursor: "pointer",
              width: "250px",
            }}
            onClick={() => handleIntegrationClick(integration.id)}
          >
            <h3 style={{ margin: "0 0 5px 0", fontSize: "18px" }}>
              {integration.displayName}
            </h3>
            <p style={{ margin: 0, fontSize: "14px", color: "#aaa" }}>
              {integration.shelves?.join(" · ")}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
