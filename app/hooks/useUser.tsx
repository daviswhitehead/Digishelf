import React, { useEffect, useState, createContext, useContext, ReactNode } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { User } from 'firebase/auth';
import { auth, db } from '../firebase/clientApp';
import { UserData } from '../types/models';

export interface UseUserReturn {
  user: UserData | null;
  loading: boolean;
  error: Error | null;
  userId: string | null;
}

interface UserContextType {
  user: UserData | null;
  loading: boolean;
  error: Error | null;
}

const UserContext = createContext<UserContextType>({
  user: null,
  loading: true,
  error: null,
});

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let unsubscribeFirestore: (() => void) | undefined;

    const unsubscribeAuth = auth.onAuthStateChanged(async (authUser: User | null) => {
      try {
        if (authUser) {
          // Set up real-time listener for user data in Firestore
          unsubscribeFirestore = onSnapshot(
            doc(db, 'users', authUser.uid),
            doc => {
              if (doc.exists()) {
                const userData: UserData = {
                  uid: authUser.uid,
                  email: authUser.email ?? '',
                  displayName: authUser.displayName ?? '',
                  photoURL: authUser.photoURL ?? undefined,
                  createdAt: doc.data().createdAt,
                  updatedAt: doc.data().updatedAt,
                  ...doc.data(),
                };
                setUser(userData);
              } else {
                setUser(null);
              }
              setLoading(false);
            },
            error => {
              setError(error);
              setLoading(false);
            }
          );
        } else {
          setUser(null);
          setLoading(false);
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error occurred'));
        setLoading(false);
      }
    });

    // Cleanup subscriptions
    return () => {
      unsubscribeAuth();
      if (unsubscribeFirestore) {
        unsubscribeFirestore();
      }
    };
  }, []);

  return <UserContext.Provider value={{ user, loading, error }}>{children}</UserContext.Provider>;
};

export const useUser = (): UseUserReturn => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return {
    ...context,
    userId: context.user?.uid || null,
  };
};
