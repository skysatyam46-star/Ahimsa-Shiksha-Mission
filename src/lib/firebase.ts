import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';

// Helper to safely read env variables in Vite/browser environment
const getEnvVar = (key: string): string => {
  // Check import.meta.env (Vite standard)
  try {
    const metaEnv = (import.meta as unknown as { env?: Record<string, string> })?.env;
    if (metaEnv) {
      const val = metaEnv[key] || metaEnv[`VITE_${key}`];
      if (typeof val === 'string' && val.trim().length > 0) return val.trim();
    }
  } catch {
    // Ignore if not supported in environment
  }

  // Check process.env fallback
  try {
    if (typeof process !== 'undefined' && process.env) {
      const val = process.env[key] || process.env[`VITE_${key}`];
      if (typeof val === 'string' && val.trim().length > 0) return val.trim();
    }
  } catch {
    // Ignore if process is undefined
  }

  return '';
};

export const firebaseConfig = {
  apiKey: getEnvVar('FIREBASE_API_KEY') || getEnvVar('VITE_FIREBASE_API_KEY'),
  authDomain: getEnvVar('FIREBASE_AUTH_DOMAIN') || getEnvVar('VITE_FIREBASE_AUTH_DOMAIN'),
  projectId: getEnvVar('FIREBASE_PROJECT_ID') || getEnvVar('VITE_FIREBASE_PROJECT_ID'),
  storageBucket: getEnvVar('FIREBASE_STORAGE_BUCKET') || getEnvVar('VITE_FIREBASE_STORAGE_BUCKET'),
  messagingSenderId: getEnvVar('FIREBASE_MESSAGING_SENDER_ID') || getEnvVar('VITE_FIREBASE_MESSAGING_SENDER_ID'),
  appId: getEnvVar('FIREBASE_APP_ID') || getEnvVar('VITE_FIREBASE_APP_ID'),
  measurementId: getEnvVar('FIREBASE_MEASUREMENT_ID') || getEnvVar('VITE_FIREBASE_MEASUREMENT_ID'),
};

export const firestoreDatabaseId = getEnvVar('FIREBASE_FIRESTORE_DATABASE_ID') || getEnvVar('VITE_FIREBASE_FIRESTORE_DATABASE_ID') || '(default)';

// Verify if required credentials are present
export const getMissingFirebaseConfigKeys = (): string[] => {
  const missing: string[] = [];
  if (!firebaseConfig.apiKey) missing.push('VITE_FIREBASE_API_KEY');
  if (!firebaseConfig.authDomain) missing.push('VITE_FIREBASE_AUTH_DOMAIN');
  if (!firebaseConfig.projectId) missing.push('VITE_FIREBASE_PROJECT_ID');
  if (!firebaseConfig.appId) missing.push('VITE_FIREBASE_APP_ID');
  return missing;
};

export const isFirebaseConfigured = (): boolean => {
  return getMissingFirebaseConfigKeys().length === 0;
};

// Lazy / Safe initialization
let appInstance: FirebaseApp | null = null;
let authInstance: Auth | null = null;
let dbInstance: Firestore | null = null;

if (isFirebaseConfigured()) {
  try {
    appInstance = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    authInstance = getAuth(appInstance);
    dbInstance = getFirestore(appInstance, firestoreDatabaseId === '(default)' ? undefined : firestoreDatabaseId);
  } catch (err) {
    console.error('Firebase initialization error:', err);
  }
}

export const app = appInstance;
export const auth = authInstance;
export const db = dbInstance;

// =========================================================================
// Hardened Firestore Error Reporting & Diagnostics
// =========================================================================

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const currentUser = auth?.currentUser;
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: currentUser?.uid || null,
      email: currentUser?.email || null,
      emailVerified: currentUser?.emailVerified || null,
      isAnonymous: currentUser?.isAnonymous || null,
      tenantId: currentUser?.tenantId || null,
      providerInfo:
        currentUser?.providerData?.map((p) => ({
          providerId: p.providerId,
          email: p.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error:', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}
