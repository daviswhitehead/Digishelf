import React, { useState } from 'react';
import { signInWithPopup, GoogleAuthProvider, Auth } from 'firebase/auth';
import { auth } from '../firebase/clientApp';

const Login = () => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    if (!auth) {
      setError('Authentication is not initialized');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const provider = new GoogleAuthProvider();

      // In development, we want to use a test account
      if (process.env.NODE_ENV === 'development') {
        // This helps with emulator debugging
        console.log('🔑 Attempting Google sign-in with emulator');
        provider.setCustomParameters({
          prompt: 'select_account',
        });
      }

      const result = await signInWithPopup(auth as Auth, provider);
      const user = result.user;
      console.log('✅ Successfully logged in:', user.email);
    } catch (err) {
      console.error('❌ Login error:', err);

      // More descriptive error messages
      let errorMessage = 'An error occurred during login';
      if (err instanceof Error) {
        if (err.message.includes('auth/popup-closed-by-user')) {
          errorMessage = 'Login was cancelled';
        } else if (err.message.includes('auth/network-request-failed')) {
          errorMessage = 'Network error - please check your connection';
        } else if (err.message.includes('auth/popup-blocked')) {
          errorMessage = 'Login popup was blocked - please allow popups for this site';
        } else {
          errorMessage = err.message;
        }
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px',
      }}
    >
      <button
        onClick={handleGoogleLogin}
        disabled={loading}
        style={{
          backgroundColor: loading ? '#cccccc' : '#4285f4',
          padding: '15px',
          borderRadius: '5px',
          border: 'none',
          cursor: loading ? 'not-allowed' : 'pointer',
          color: '#ffffff',
          fontSize: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minWidth: '200px',
        }}
      >
        {loading ? 'Signing in...' : 'Sign in with Google'}
      </button>
      {error && (
        <p
          style={{
            color: '#dc3545',
            marginTop: '10px',
            padding: '10px',
            backgroundColor: '#f8d7da',
            borderRadius: '4px',
            textAlign: 'center',
          }}
        >
          {error}
        </p>
      )}
    </div>
  );
};

export default Login;
