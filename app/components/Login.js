import React, { useState } from "react";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../utils/firebase";

const AuthPage = () => {
  const [error, setError] = useState(null);

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      alert("Google login successful!");
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
