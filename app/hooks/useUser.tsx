import React, { useEffect, useState, createContext, useContext, ReactNode } from 'react';
import { doc, onSnapshot, Firestore, DocumentData } from 'firebase/firestore';
import { User, Auth } from 'firebase/auth';
import { FirebaseError } from 'firebase/app';
import { auth, db } from '../firebase/clientApp';
import { UserData } from '../types/models';

export interface UseUserReturn {
  user: UserData | null;
  loading: boolean;
  error: FirebaseError | Error | null;
}

interface UserContextType {
  user: UserData | null;
  loading: boolean;
  error: FirebaseError | Error | null;
}

const UserContext = createContext<UserContextType>({
  user: null,
  loading: true,
  error: null,
});

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<FirebaseError | Error | null>(null);
  const [isClient, setIsClient] = useState(false);

  // Set isClient to true on mount
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect((): (() => void) => {
    // Only run auth listener on client side
    if (!isClient) return () => {};

    let unsubscribeFirestore: (() => void) | undefined;

    try {
      const unsubscribeAuth = (auth as Auth)?.onAuthStateChanged(async (authUser: User | null) => {
        try {
          if (authUser) {
            // Set up real-time listener for user data in Firestore
            unsubscribeFirestore = onSnapshot(
              doc(db as Firestore, 'users', authUser.uid),
              doc => {
                if (doc.exists()) {
                  const data = doc.data() as DocumentData & Partial<UserData>;
                  if (!data.createdAt || !data.updatedAt) {
                    throw new Error('Invalid user data: missing timestamps');
                  }
                  const userData: UserData = {
                    userId: authUser.uid,
                    email: authUser.email ?? null,
                    displayName: authUser.displayName ?? null,
                    photoURL: authUser.photoURL ?? null,
                    firstName: data.firstName ?? null,
                    lastName: data.lastName ?? null,
                    createdAt: data.createdAt,
                    updatedAt: data.updatedAt,
                    ...data,
                  };
                  setUser(userData);
                } else {
                  setUser(null);
                }
                setLoading(false);
              },
              (error: FirebaseError) => {
                console.error('Firestore listener error:', error);
                setError(error);
                setLoading(false);
              }
            );
          } else {
            setUser(null);
            setLoading(false);
          }
        } catch (err) {
          console.error('Auth state change error:', err);
          setError(err instanceof Error ? err : new Error('Unknown error occurred'));
          setLoading(false);
        }
      });

      // Cleanup subscriptions
      return () => {
        if (unsubscribeAuth) unsubscribeAuth();
        if (unsubscribeFirestore) unsubscribeFirestore();
      };
    } catch (err) {
      console.error('Auth initialization error:', err);
      setError(err instanceof Error ? err : new Error('Failed to initialize auth'));
      setLoading(false);
      return () => {};
    }
  }, [isClient]);

  // Show loading state during SSR
  if (!isClient) {
    return (
      <UserContext.Provider value={{ user: null, loading: true, error: null }}>
        {children}
      </UserContext.Provider>
    );
  }

  return <UserContext.Provider value={{ user, loading, error }}>{children}</UserContext.Provider>;
};

export const useUser = (): UseUserReturn => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
