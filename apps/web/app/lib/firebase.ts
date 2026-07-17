import { initializeApp, type FirebaseApp } from "firebase/app";
import {
  EmailAuthProvider,
  GoogleAuthProvider,
  applyActionCode,
  confirmPasswordReset,
  createUserWithEmailAndPassword,
  getAuth,
  linkWithCredential,
  onAuthStateChanged,
  reauthenticateWithCredential,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updatePassword,
  updateProfile,
  verifyPasswordResetCode,
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

export function getUserProviders(user: User | null): string[] {
  if (!user) return [];
  return user.providerData.map((provider) => provider.providerId);
}

export function userHasPassword(user: User | null): boolean {
  return getUserProviders(user).includes("password");
}

export function userUsesGoogle(user: User | null): boolean {
  return getUserProviders(user).includes("google.com");
}

export function onFirebaseUserChanged(callback: (user: User | null) => void): () => void {
  const currentAuth = getFirebaseAuth();
  if (!currentAuth) {
    callback(null);
    return () => undefined;
  }
  return onAuthStateChanged(currentAuth, callback);
}

export async function getCurrentUser(): Promise<User | null> {
  const currentAuth = getFirebaseAuth();
  return currentAuth?.currentUser ?? null;
}

export async function getCurrentUserToken(): Promise<string | null> {
  const currentAuth = getFirebaseAuth();
  if (!currentAuth?.currentUser) {
    return null;
  }
  return currentAuth.currentUser.getIdToken();
}

export type ClientRole = "user" | "host" | "admin";

/** Reads role custom claims from the user's verified Firebase ID token. */
export async function getUserRole(user: User | null): Promise<ClientRole> {
  if (!user) return "user";
  const { claims } = await user.getIdTokenResult();
  if (claims.admin === true || claims.role === "admin") return "admin";
  if (claims.host === true || claims.role === "host") return "host";

  const roles = Array.isArray(claims.roles) ? claims.roles : [];
  if (roles.includes("admin")) return "admin";
  if (roles.includes("host")) return "host";
  return "user";
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

export async function signInWithEmail(email: string, password: string): Promise<User> {
  const currentAuth = getFirebaseAuth();
  if (!currentAuth) {
    throw new Error("Sign-in isn't available right now.");
  }
  const credential = await signInWithEmailAndPassword(currentAuth, email.trim(), password);
  return credential.user;
}

export async function signUpWithEmail(
  email: string,
  password: string,
  displayName?: string
): Promise<User> {
  const currentAuth = getFirebaseAuth();
  if (!currentAuth) {
    throw new Error("Sign-up isn't available right now.");
  }
  const credential = await createUserWithEmailAndPassword(
    currentAuth,
    email.trim(),
    password
  );
  if (displayName?.trim()) {
    await updateProfile(credential.user, { displayName: displayName.trim() });
  }
  return credential.user;
}

export async function sendPasswordReset(email: string): Promise<void> {
  const currentAuth = getFirebaseAuth();
  if (!currentAuth) {
    throw new Error("Password reset isn't available right now.");
  }
  await sendPasswordResetEmail(currentAuth, email.trim());
}

/** Checks a password-reset link's code and returns the account email. */
export async function verifyResetCode(oobCode: string): Promise<string> {
  const currentAuth = getFirebaseAuth();
  if (!currentAuth) {
    throw new Error("Password reset isn't available right now.");
  }
  return verifyPasswordResetCode(currentAuth, oobCode);
}

/** Completes a password reset started from an emailed link. */
export async function completePasswordReset(oobCode: string, newPassword: string): Promise<void> {
  const currentAuth = getFirebaseAuth();
  if (!currentAuth) {
    throw new Error("Password reset isn't available right now.");
  }
  await confirmPasswordReset(currentAuth, oobCode, newPassword);
}

/** Applies an emailed action code (email verification, email recovery). */
export async function applyAuthActionCode(oobCode: string): Promise<void> {
  const currentAuth = getFirebaseAuth();
  if (!currentAuth) {
    throw new Error("This action isn't available right now.");
  }
  await applyActionCode(currentAuth, oobCode);
}

/** Lets a Google-only account add email/password sign-in. */
export async function linkPasswordToAccount(email: string, password: string): Promise<void> {
  const currentAuth = getFirebaseAuth();
  const user = currentAuth?.currentUser;
  if (!currentAuth || !user) {
    throw new Error("Sign in first to add a password.");
  }
  const credential = EmailAuthProvider.credential(email.trim(), password);
  await linkWithCredential(user, credential);
}

export async function changeAccountPassword(
  currentPassword: string,
  newPassword: string
): Promise<void> {
  const currentAuth = getFirebaseAuth();
  const user = currentAuth?.currentUser;
  if (!currentAuth || !user?.email) {
    throw new Error("Sign in first to change your password.");
  }
  const credential = EmailAuthProvider.credential(user.email, currentPassword);
  await reauthenticateWithCredential(user, credential);
  await updatePassword(user, newPassword);
}

export async function signOutCurrentUser(): Promise<void> {
  const currentAuth = getFirebaseAuth();
  if (currentAuth) {
    await signOut(currentAuth);
  }
}
