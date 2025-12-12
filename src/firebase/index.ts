'use client';

import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore'

export function initializeFirebase() {
  if (!getApps().length) {
    // Check if we're in production and have Firebase App Hosting environment variables
    const isAppHosting = process.env.FIREBASE_CONFIG && process.env.FIREBASE_APP_CHECK_SECRET_KEY;
    
    if (isAppHosting) {
      try {
        // Attempt to initialize via Firebase App Hosting environment variables
        const firebaseApp = initializeApp();
        return getSdks(firebaseApp);
      } catch (e) {
        console.warn('Firebase App Hosting initialization failed. Falling back to config object.', e);
      }
    }
    
    // Always use firebaseConfig for development or if App Hosting fails
    const firebaseApp = initializeApp(firebaseConfig);
    return getSdks(firebaseApp);
  }

  // If already initialized, return the SDKs with the already initialized App
  return getSdks(getApp());
}

export function getSdks(firebaseApp: FirebaseApp) {
  return {
    firebaseApp,
    auth: getAuth(firebaseApp),
    firestore: getFirestore(firebaseApp)
  };
}

export * from './provider';
export * from './client-provider';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
export * from './non-blocking-updates';
export * from './non-blocking-login';
export * from './errors';
export * from './error-emitter';
