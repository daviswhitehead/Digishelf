import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { db } from "../../../utils/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";

export default function Integration() {
  const router = useRouter();
  const { userId, integrationId } = router.query; // Get userId and integrationId from the route
  const [integrationData, setIntegrationData] = useState(null);
  const [myBooksURL, setMyBooksURL] = useState("");
  const [accountSlug, setAccountSlug] = useState("");
  const [shelves, setShelves] = useState([]);
  const [selectedShelves, setSelectedShelves] = useState([]);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (!userId || !integrationId) return;

    const fetchIntegrationData = async () => {
      try {
        const integrationDocRef = doc(db, "integrations", integrationId);
        const integrationDoc = await getDoc(integrationDocRef);

        if (integrationDoc.exists()) {
          const data = integrationDoc.data();
          setIntegrationData(data);
          setMyBooksURL(data.myBooksURL || "");
          setAccountSlug(
            data.myBooksURL ? deriveAccountSlug(data.myBooksURL) : ""
          );
          setShelves(data.possibleShelves || []);
          setSelectedShelves(data.shelves || []);
        } else {
          setError("Integration not found.");
        }
      } catch (err) {
        setError(err.message);
      }
    };

    fetchIntegrationData();
  }, [userId, integrationId]);

  const deriveAccountSlug = (url) => {
    try {
      const urlParts = new URL(url).pathname.split("/");
      return urlParts[urlParts.length - 1] || "";
    } catch {
      return "";
    }
  };

  const handleShelfToggle = (shelf) => {
    setSelectedShelves((prev) =>
      prev.includes(shelf)
        ? prev.filter((item) => item !== shelf)
        : [...prev, shelf]
    );
  };

  const handleSave = async () => {
    try {
      const integrationDocRef = doc(db, "integrations", integrationId);
      await updateDoc(integrationDocRef, {
        myBooksURL,
        shelves: selectedShelves,
      });
      setSuccessMessage("Changes saved successfully!");
      setTimeout(() => setSuccessMessage(""), 3000); // Clear success message after 3 seconds
    } catch (err) {
      setError(err.message);
    }
  };

  if (error) {
    return (
      <div style={{ padding: "20px", color: "red", backgroundColor: "#000" }}>
        <h1>Error</h1>
        <p>{error}</p>
      </div>
    );
  }

  if (!integrationData) {
    return (
      <div style={{ padding: "20px", color: "#fff", backgroundColor: "#000" }}>
        <h1>Loading...</h1>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px", backgroundColor: "#000", color: "#fff" }}>
      <h1>Your {integrationData.displayName} Integration</h1>
      <form
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "15px",
          maxWidth: "400px",
        }}
        onSubmit={(e) => {
          e.preventDefault();
          handleSave();
        }}
      >
        <label>
          <span style={{ display: "block", marginBottom: "5px" }}>
            My Books URL:
          </span>
          <input
            type="text"
            value={myBooksURL}
            onChange={(e) => {
              setMyBooksURL(e.target.value);
              setAccountSlug(deriveAccountSlug(e.target.value));
            }}
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "5px",
              border: "1px solid #ccc",
              backgroundColor: "#1a1a1a",
              color: "#fff",
            }}
          />
        </label>
        <label>
          <span style={{ display: "block", marginBottom: "5px" }}>
            Account Slug:
          </span>
          <input
            type="text"
            value={accountSlug}
            readOnly
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "5px",
              border: "1px solid #ccc",
              backgroundColor: "#333",
              color: "#aaa",
            }}
          />
        </label>
        <fieldset style={{ border: "none", padding: 0 }}>
          <legend style={{ marginBottom: "10px", fontWeight: "bold" }}>
            Shelves:
          </legend>
          {shelves.map((shelf) => (
            <label
              key={shelf}
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "10px",
              }}
            >
              <input
                type="checkbox"
                checked={selectedShelves.includes(shelf)}
                onChange={() => handleShelfToggle(shelf)}
                style={{ marginRight: "10px" }}
              />
              {shelf}
            </label>
          ))}
        </fieldset>
        <button
          type="submit"
          style={{
            padding: "10px 20px",
            backgroundColor: "#4caf50",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Save
        </button>
        {successMessage && (
          <p style={{ color: "green", marginTop: "10px" }}>{successMessage}</p>
        )}
      </form>
    </div>
  );
}
