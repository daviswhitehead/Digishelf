import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { db } from "../../../utils/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useUser } from "../../../utils/useUser";

export default function Shelves() {
  const router = useRouter();
  const user = useUser();
  const [shelves, setShelves] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) return;

    const fetchShelves = async () => {
      try {
        const shelvesRef = collection(db, "shelves");
        const q = query(shelvesRef, where("userId", "==", user.uid));
        const querySnapshot = await getDocs(q);

        const shelvesList = querySnapshot.docs.map((doc) => ({
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

  const handleShelfClick = (shelfId) => {
    router.push(`/${user.uid}/shelves/${shelfId}`);
  };

  return (
    <div
      style={{ padding: "20px", backgroundColor: "#000", minHeight: "100vh" }}
    >
      <h1 style={{ color: "#fff" }}>Your Shelves</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
        {shelves.map((shelf) => (
          <div
            key={shelf.id}
            style={{
              backgroundColor: "#1a1a1a",
              color: "#fff",
              padding: "15px",
              borderRadius: "8px",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
              cursor: "pointer",
              width: "250px",
            }}
            onClick={() => handleShelfClick(shelf.id)}
          >
            <h3 style={{ margin: "0 0 5px 0", fontSize: "18px" }}>
              {shelf.displayName}
            </h3>
            <p style={{ margin: 0, fontSize: "14px", color: "#aaa" }}>
              {shelf.sourceDisplayName}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
