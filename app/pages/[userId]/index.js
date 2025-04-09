import React from "react";
import { useRouter } from "next/router";
import { auth } from "../../utils/firebase";
import { signOut } from "firebase/auth";
import { useUser } from "../../utils/useUser";

export default function Profile() {
  const router = useRouter();
  const user = useUser(); // Access user data from the custom hook

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/login"); // Redirect to the sign-in page after logout
    } catch (err) {
      console.error(err.message);
    }
  };

  if (!user) {
    return (
      <div
        style={{ padding: "20px", backgroundColor: "#000", minHeight: "100vh" }}
      >
        <h1 style={{ color: "#fff" }}>Loading...</h1>
      </div>
    );
  }

  return (
    <div
      style={{ padding: "20px", backgroundColor: "#000", minHeight: "100vh" }}
    >
      <h1 style={{ color: "#fff" }}>Your Profile</h1>
      <pre
        style={{
          backgroundColor: "#f4f4f4",
          padding: "10px",
          borderRadius: "5px",
          overflowX: "auto",
          color: "#000",
        }}
      >
        {JSON.stringify(user, null, 2)}
      </pre>
      <button
        onClick={handleLogout}
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          backgroundColor: "#ff4d4d",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Logout
      </button>
    </div>
  );
}
