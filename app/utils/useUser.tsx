import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot, Timestamp, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/clientApp';
import { UseUserReturn, UserData } from '../types/models';
import { FirebaseError } from 'firebase/app';

const UserContext = createContext<UseUserReturn>({
  user: null,
  loading: true,
  error: null,
});

interface UserProviderProps {
  children: React.ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<FirebaseError | Error | null>(null);

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, async firebaseUser => {
      try {
        if (firebaseUser) {
          const userDocRef = doc(db, 'users', firebaseUser.uid);
          const unsubDoc = onSnapshot(
            userDocRef,
            async doc => {
              if (doc.exists()) {
                const firestoreData = doc.data();
                const userData: UserData = {
                  userId: firebaseUser.uid,
                  email: firebaseUser.email,
                  displayName: firebaseUser.displayName,
                  photoURL: firebaseUser.photoURL,
                  firstName: firestoreData.firstName ?? null,
                  lastName: firestoreData.lastName ?? null,
                  createdAt: firestoreData.createdAt ?? Timestamp.now(),
                  updatedAt: firestoreData.updatedAt ?? Timestamp.now(),
                };
                setUser(userData);
              } else {
                // Create a new user document if it doesn't exist
                const userData: UserData = {
                  userId: firebaseUser.uid,
                  email: firebaseUser.email,
                  displayName: firebaseUser.displayName,
                  photoURL: firebaseUser.photoURL,
                  firstName: null,
                  lastName: null,
                  createdAt: Timestamp.now(),
                  updatedAt: Timestamp.now(),
                };

                // Create the user document in Firestore
                try {
                  await setDoc(userDocRef, userData);
                  setUser(userData);
                } catch (err) {
                  console.error('Error creating user document:', err);
                  setError(
                    err instanceof Error ? err : new Error('Failed to create user document')
                  );
                }
              }
              setLoading(false);
            },
            error => {
              console.error('Error fetching user data:', error);
              setError(error);
              setLoading(false);
            }
          );

          return () => unsubDoc();
        } else {
          setUser(null);
          setLoading(false);
        }
      } catch (err) {
        console.error('Error in auth state change:', err);
        setError(err instanceof Error ? err : new Error('Unknown error occurred'));
        setLoading(false);
      }
    });

    return () => unsubAuth();
  }, []);

  return <UserContext.Provider value={{ user, loading, error }}>{children}</UserContext.Provider>;
};

export const useUser = (): UseUserReturn => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
