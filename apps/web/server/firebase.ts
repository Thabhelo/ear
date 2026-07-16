import { cert, getApps, initializeApp, type App } from "firebase-admin/app";
import { getAuth, type Auth } from "firebase-admin/auth";
import { getFirestore, type Firestore } from "firebase-admin/firestore";
import { settings } from "./settings";

// Lazy so that importing route modules (e.g. during `next build`) never
// requires Google credentials to be present.
function firebaseApp(): App {
  const existing = getApps();
  if (existing.length > 0) return existing[0];

  const projectId = settings.firebaseProjectId || settings.googleCloudProject;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (clientEmail && privateKey && projectId) {
    return initializeApp({
      credential: cert({ projectId, clientEmail, privateKey })
    });
  }
  // Fall back to Application Default Credentials (Cloud Run, gcloud auth).
  return initializeApp(projectId ? { projectId } : undefined);
}

export function adminAuth(): Auth {
  return getAuth(firebaseApp());
}

export function adminFirestore(): Firestore {
  return getFirestore(firebaseApp());
}
