import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, initializeFirestore, type Firestore } from 'firebase/firestore';

// Helper to safely read env variables across Vite, Next.js, and standard environments
const getMetaEnv = (): Record<string, string> | undefined => {
  try {
    return (import.meta as unknown as { env?: Record<string, string> })?.env;
  } catch {
    return undefined;
  }
};

const getProcessEnv = (): Record<string, string | undefined> | undefined => {
  try {
    if (typeof process !== 'undefined' && process.env) {
      return process.env;
    }
  } catch {
    // ignore
  }
  return undefined;
};

const readEnvKey = (key: string): string => {
  const env = getMetaEnv();
  if (env && typeof env[key] === 'string' && env[key]!.trim().length > 0) {
    return env[key]!.trim();
  }
  const proc = getProcessEnv();
  if (proc && typeof proc[key] === 'string' && proc[key]!.trim().length > 0) {
    return proc[key]!.trim();
  }
  return '';
};

const getApiKey = (): string =>
  readEnvKey('VITE_FIREBASE_API_KEY') ||
  readEnvKey('NEXT_PUBLIC_FIREBASE_API_KEY') ||
  readEnvKey('FIREBASE_API_KEY');

const getProjectId = (): string =>
  readEnvKey('VITE_FIREBASE_PROJECT_ID') ||
  readEnvKey('NEXT_PUBLIC_FIREBASE_PROJECT_ID') ||
  readEnvKey('FIREBASE_PROJECT_ID');

const getAuthDomain = (projectId: string): string => {
  const custom =
    readEnvKey('VITE_FIREBASE_AUTH_DOMAIN') ||
    readEnvKey('NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN') ||
    readEnvKey('FIREBASE_AUTH_DOMAIN');
  if (custom) return custom;
  if (projectId) return `${projectId}.firebaseapp.com`;
  return '';
};

const getStorageBucket = (projectId: string): string => {
  const custom =
    readEnvKey('VITE_FIREBASE_STORAGE_BUCKET') ||
    readEnvKey('NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET') ||
    readEnvKey('FIREBASE_STORAGE_BUCKET');
  if (custom) return custom;
  if (projectId) return `${projectId}.firebasestorage.app`;
  return '';
};

const getMessagingSenderId = (): string =>
  readEnvKey('VITE_FIREBASE_MESSAGING_SENDER_ID') ||
  readEnvKey('NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID') ||
  readEnvKey('FIREBASE_MESSAGING_SENDER_ID');

const getAppId = (): string =>
  readEnvKey('VITE_FIREBASE_APP_ID') ||
  readEnvKey('NEXT_PUBLIC_FIREBASE_APP_ID') ||
  readEnvKey('FIREBASE_APP_ID');

const getMeasurementId = (): string =>
  readEnvKey('VITE_FIREBASE_MEASUREMENT_ID') ||
  readEnvKey('NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID') ||
  readEnvKey('FIREBASE_MEASUREMENT_ID');

const derivedProjectId = getProjectId();

export const firebaseConfig = {
  apiKey: getApiKey(),
  authDomain: getAuthDomain(derivedProjectId),
  projectId: derivedProjectId,
  storageBucket: getStorageBucket(derivedProjectId),
  messagingSenderId: getMessagingSenderId(),
  appId: getAppId(),
  measurementId: getMeasurementId(),
};

export const firestoreDatabaseId =
  readEnvKey('VITE_FIREBASE_FIRESTORE_DATABASE_ID') ||
  readEnvKey('NEXT_PUBLIC_FIREBASE_FIRESTORE_DATABASE_ID') ||
  readEnvKey('FIREBASE_FIRESTORE_DATABASE_ID') ||
  '(default)';

// Verify if required credentials are present
export const getMissingFirebaseConfigKeys = (): string[] => {
  const missing: string[] = [];
  if (!firebaseConfig.apiKey) missing.push('FIREBASE_API_KEY');
  if (!firebaseConfig.projectId) missing.push('FIREBASE_PROJECT_ID');
  return missing;
};

export const isFirebaseConfigured = (): boolean => {
  return Boolean(firebaseConfig.apiKey);
};

// Lazy / Safe initialization
let appInstance: FirebaseApp | null = null;
let authInstance: Auth | null = null;
let dbInstance: Firestore | null = null;

if (firebaseConfig.apiKey) {
  try {
    appInstance = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    authInstance = getAuth(appInstance);
    
    const customDbId =
      firestoreDatabaseId && firestoreDatabaseId !== '(default)'
        ? firestoreDatabaseId
        : undefined;

    try {
      dbInstance = customDbId
        ? getFirestore(appInstance, customDbId)
        : getFirestore(appInstance);
    } catch (dbErr) {
      console.error('Firestore initialization error:', dbErr);
    }
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
