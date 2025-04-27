import { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { Timestamp } from 'firebase/firestore';
import type { UserData } from '../types/auth';

interface AuthState {
  user: User | null;
  userData: UserData | null;
  loading: boolean;
}

export const useAuth = () => {
  const [state, setState] = useState<AuthState>({
    user: null,
    userData: null,
    loading: true,
  });

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, user => {
      if (user) {
        // Convert Firebase User to UserData
        const userData: UserData = {
          userId: user.uid,
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          firstName: null,
          lastName: null,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
        };
        setState({ user, userData, loading: false });
      } else {
        setState({ user: null, userData: null, loading: false });
      }
    });

    return () => unsubscribe();
  }, []);

  return state;
};
