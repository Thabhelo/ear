import { initializeApp, type FirebaseApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  type Auth,
  type User
} from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

export const firebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
    firebaseConfig.authDomain &&
    firebaseConfig.projectId &&
    firebaseConfig.appId
);

let app: FirebaseApp | null = null;
let auth: Auth | null = null;

export function getFirebaseAuth(): Auth | null {
  if (!firebaseConfigured) {
    return null;
  }
  app ??= initializeApp(firebaseConfig);
  auth ??= getAuth(app);
  return auth;
}

export function onFirebaseUserChanged(callback: (user: User | null) => void): () => void {
  const currentAuth = getFirebaseAuth();
  if (!currentAuth) {
    callback(null);
    return () => undefined;
  }
  return onAuthStateChanged(currentAuth, callback);
}

export async function getCurrentUserToken(): Promise<string | null> {
  const currentAuth = getFirebaseAuth();
  if (!currentAuth?.currentUser) {
    return null;
  }
  return currentAuth.currentUser.getIdToken();
}

export async function signInWithGoogle(): Promise<User | null> {
  const currentAuth = getFirebaseAuth();
  if (!currentAuth) {
    return null;
  }
  const provider = new GoogleAuthProvider();
  const credential = await signInWithPopup(currentAuth, provider);
  return credential.user;
}

export async function signOutCurrentUser(): Promise<void> {
  const currentAuth = getFirebaseAuth();
  if (currentAuth) {
    await signOut(currentAuth);
  }
}
