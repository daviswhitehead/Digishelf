import React, { useState } from "react";
import { useRouter } from "next/router"; // Import useRouter
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider, db } from "../utils/firebase";
import { doc, setDoc, serverTimestamp, getDoc } from "firebase/firestore";

const AuthPage = () => {
  const [error, setError] = useState(null);
  const router = useRouter(); // Initialize useRouter

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Extract first and last name from displayName
      const [firstName, ...lastNameParts] = user.displayName.split(" ");
      const lastName = lastNameParts.join(" ");

      // Create or update the user document in Firestore
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

      await setDoc(
        userDocRef,
        {
          userId: user.uid,
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          firstName,
          lastName,
          updatedAt: serverTimestamp(),
          ...(userDoc.exists() ? {} : { createdAt: serverTimestamp() }), // Add createdAt only if the document doesn't exist
        },
        { merge: true } // Merge with existing data if the document already exists
      );

      // Redirect to the user's profile page
      router.push(`/${user.uid}`);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        padding: "20px",
      }}
    >
      <h1>Log in or sign up</h1>
      <p>Create an account or log in to book and manage your appointments.</p>
      <button
        onClick={handleGoogleLogin}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "10px 20px",
          border: "1px solid #ccc",
          borderRadius: "5px",
          backgroundColor: "#fff",
          cursor: "pointer",
          marginTop: "20px",
        }}
      >
        <span style={{ marginRight: "10px" }}>🏫</span> Continue with Google
      </button>
      {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
    </div>
  );
};

export default AuthPage;
