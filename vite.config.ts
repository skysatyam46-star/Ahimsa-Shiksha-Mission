import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  const getEnv = (key: string) =>
    process.env[key] ||
    process.env[`VITE_${key}`] ||
    process.env[`NEXT_PUBLIC_${key}`] ||
    env[key] ||
    env[`VITE_${key}`] ||
    env[`NEXT_PUBLIC_${key}`] ||
    '';

  const apiKey = getEnv('FIREBASE_API_KEY');
  const projectId = getEnv('FIREBASE_PROJECT_ID');
  const appId = getEnv('FIREBASE_APP_ID');
  const authDomain = getEnv('FIREBASE_AUTH_DOMAIN') || (projectId ? `${projectId}.firebaseapp.com` : '');
  const storageBucket = getEnv('FIREBASE_STORAGE_BUCKET') || (projectId ? `${projectId}.firebasestorage.app` : '');
  const messagingSenderId = getEnv('FIREBASE_MESSAGING_SENDER_ID');
  const measurementId = getEnv('FIREBASE_MEASUREMENT_ID');
  const firestoreDatabaseId = getEnv('FIREBASE_FIRESTORE_DATABASE_ID') || '(default)';

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    define: {
      'process.env.FIREBASE_API_KEY': JSON.stringify(apiKey),
      'process.env.VITE_FIREBASE_API_KEY': JSON.stringify(apiKey),
      'process.env.FIREBASE_PROJECT_ID': JSON.stringify(projectId),
      'process.env.VITE_FIREBASE_PROJECT_ID': JSON.stringify(projectId),
      'process.env.FIREBASE_APP_ID': JSON.stringify(appId),
      'process.env.VITE_FIREBASE_APP_ID': JSON.stringify(appId),
      'process.env.FIREBASE_AUTH_DOMAIN': JSON.stringify(authDomain),
      'process.env.VITE_FIREBASE_AUTH_DOMAIN': JSON.stringify(authDomain),
      'process.env.FIREBASE_STORAGE_BUCKET': JSON.stringify(storageBucket),
      'process.env.VITE_FIREBASE_STORAGE_BUCKET': JSON.stringify(storageBucket),
      'process.env.FIREBASE_MESSAGING_SENDER_ID': JSON.stringify(messagingSenderId),
      'process.env.VITE_FIREBASE_MESSAGING_SENDER_ID': JSON.stringify(messagingSenderId),
      'process.env.FIREBASE_MEASUREMENT_ID': JSON.stringify(measurementId),
      'process.env.VITE_FIREBASE_MEASUREMENT_ID': JSON.stringify(measurementId),
      'process.env.FIREBASE_FIRESTORE_DATABASE_ID': JSON.stringify(firestoreDatabaseId),
      'process.env.VITE_FIREBASE_FIRESTORE_DATABASE_ID': JSON.stringify(firestoreDatabaseId),
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
