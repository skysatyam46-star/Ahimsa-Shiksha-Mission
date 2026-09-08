import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import {
  type User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import {
  auth,
  db,
  isFirebaseConfigured,
  getMissingFirebaseConfigKeys,
  OperationType,
  handleFirestoreError,
} from '../lib/firebase';

export interface AdminUserProfile {
  role: 'admin' | 'editor' | 'user';
  active: boolean;
  email?: string;
  name?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface AuthContextType {
  user: User | null;
  adminProfile: AdminUserProfile | null;
  isAdmin: boolean;
  loading: boolean;
  isConfigured: boolean;
  missingConfigKeys: string[];
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshAdminStatus: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [adminProfile, setAdminProfile] = useState<AdminUserProfile | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  const configured = isFirebaseConfigured();
  const missingKeys = getMissingFirebaseConfigKeys();

  // Helper to verify user admin privileges in Firestore `users/{uid}`
  const checkAdminPrivileges = useCallback(async (firebaseUser: User): Promise<boolean> => {
    if (!db) {
      console.warn('Firestore database instance is not available.');
      return false;
    }

    try {
      const userDocRef = doc(db, 'users', firebaseUser.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const data = userDocSnap.data() as AdminUserProfile;
        if (data.role === 'admin' && data.active === true) {
          setAdminProfile(data);
          setIsAdmin(true);
          return true;
        } else {
          console.warn(`User ${firebaseUser.email} is not an active admin:`, data);
          setAdminProfile(data);
          setIsAdmin(false);
          return false;
        }
      } else {
        // Document does not exist in `users/{uid}`
        console.warn(`No authorization profile found in users/${firebaseUser.uid}. Admin access restricted.`);
        setAdminProfile(null);
        setIsAdmin(false);
        return false;
      }
    } catch (err) {
      console.error('Error verifying admin authorization in Firestore:', err);
      try {
        handleFirestoreError(err, OperationType.GET, `users/${firebaseUser.uid}`);
      } catch {
        // Ignored after logging
      }
      setAdminProfile(null);
      setIsAdmin(false);
      return false;
    }
  }, []);

  // Listen to Firebase Auth state
  useEffect(() => {
    if (!configured || !auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        await checkAdminPrivileges(currentUser);
      } else {
        setAdminProfile(null);
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [configured, checkAdminPrivileges]);

  const refreshAdminStatus = useCallback(async (): Promise<boolean> => {
    if (!user) return false;
    return await checkAdminPrivileges(user);
  }, [user, checkAdminPrivileges]);

  const login = useCallback(
    async (email: string, password: string): Promise<void> => {
      if (!configured || !auth) {
        throw new Error(
          `Firebase is not configured. Please set the following environment variables: ${missingKeys.join(', ')}`
        );
      }

      const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
      const hasAdmin = await checkAdminPrivileges(userCredential.user);
      
      if (!hasAdmin) {
        // User authenticated but not authorized in users/{uid}
        // Sign out to prevent dangling unauthorized session
        await signOut(auth);
        setUser(null);
        setIsAdmin(false);
        setAdminProfile(null);
        throw new Error('unauthorized-role');
      }
    },
    [configured, missingKeys, checkAdminPrivileges]
  );

  const logout = useCallback(async (): Promise<void> => {
    if (auth) {
      await signOut(auth);
    }
    setUser(null);
    setAdminProfile(null);
    setIsAdmin(false);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        adminProfile,
        isAdmin,
        loading,
        isConfigured: configured,
        missingConfigKeys: missingKeys,
        login,
        logout,
        refreshAdminStatus,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
