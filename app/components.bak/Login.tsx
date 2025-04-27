import React, { useState } from 'react';
import { signInWithPopup, GoogleAuthProvider, Auth } from 'firebase/auth';
import { auth } from '../firebase/clientApp';

const Login = () => {
  const [error, setError] = useState<string | null>(null);

  const handleGoogleLogin = async () => {
    if (!auth) {
      setError('Authentication is not initialized');
      return;
    }

    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth as Auth, provider);
      const user = result.user;
      // Handle successful login
      console.log('Successfully logged in:', user);
    } catch (err) {
      console.error('Login error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred during login');
    }
  };

  return (
    <div
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <button
        onClick={handleGoogleLogin}
        style={{
          backgroundColor: '#4285f4',
          padding: '15px',
          borderRadius: '5px',
          border: 'none',
          cursor: 'pointer',
          color: '#ffffff',
          fontSize: '16px',
        }}
      >
        Sign in with Google
      </button>
      {error && (
        <p
          style={{
            color: 'red',
            marginTop: '10px',
          }}
        >
          {error}
        </p>
      )}
    </div>
  );
};

export default Login;
