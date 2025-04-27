import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../firebase/clientApp';
import { UseUserReturn, UserData } from '../types/models';

const UserContext = createContext<UseUserReturn | null>(null);

interface UserProviderProps {
  children: React.ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, user => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubAuth();
  }, []);

  useEffect(() => {
    let unsubDoc: (() => void) | undefined;

    if (user) {
      const userDocRef = doc(db, 'users', user.uid);
      unsubDoc = onSnapshot(
        userDocRef,
        doc => {
          if (doc.exists()) {
            setUserData(doc.data() as UserData);
          } else {
            setUserData(null);
          }
        },
        error => {
          console.error('Error fetching user data:', error);
          setError(error as Error);
        }
      );
    } else {
      setUserData(null);
    }

    return () => {
      if (unsubDoc) unsubDoc();
    };
  }, [user]);

  return (
    <UserContext.Provider value={{ user, userData, loading, error }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UseUserReturn => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
