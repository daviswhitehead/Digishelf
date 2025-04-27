import { User } from 'firebase/auth';
import { Timestamp } from 'firebase/firestore';

export interface UserData {
  userId: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  firstName: string | null;
  lastName: string | null;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface AuthError {
  message: string;
}

export interface UserState {
  user: User | null;
  userData: UserData | null;
  loading: boolean;
  error: AuthError | null;
}
